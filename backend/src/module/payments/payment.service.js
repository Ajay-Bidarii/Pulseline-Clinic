import { prisma } from "../../config/database.js";

/**
 * Records a payment against a bill, then updates the bill's status to
 * PARTIALLY_PAID or PAID depending on how much of the total has now been
 * covered by completed payments.
 */
export const createPayment = async (paymentData, performedBy) => {
  const { billId, amount, method, transactionId, note } = paymentData;

  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: { payments: true },
  });

  if (!bill) throw new Error("Bill not found");
  if (bill.status === "CANCELLED") throw new Error("Cannot make payment for a cancelled bill");
  if (bill.status === "PAID") throw new Error("Bill is already paid. Cannot make payment.");

  const totalPaid = bill.payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = bill.totalAmount - totalPaid;

  if (amount > remainingAmount) {
    throw new Error(`Payment amount exceeds remaining amount: ${remainingAmount}`);
  }

  const payment = await prisma.payment.create({
    data: { billId, amount, method, transactionId, note, status: "COMPLETED" },
  });

  const newTotalPaid = totalPaid + amount;
  const newStatus = newTotalPaid >= bill.totalAmount ? "PAID" : "PARTIALLY_PAID";

  await prisma.bill.update({
    where: { id: billId },
    data: {
      status: newStatus,
      paymentDate: newStatus === "PAID" ? new Date() : undefined,
      paymentMethod: method,
    },
  });

  await logAudit(performedBy, "CREATE", `Recorded payment of ${amount} on bill ${bill.billNumber}`);

  return payment;
};

/** Paginated payment list with optional status / method / date-range filters. */
export const getPayments = async (page = 1, limit = 10, filter = {}) => {
  const where = {};
  if (filter.status) where.status = filter.status;
  if (filter.method) where.method = filter.method;
  if (filter.fromDate || filter.toDate) {
    where.createdAt = {};
    if (filter.fromDate) where.createdAt.gte = new Date(filter.fromDate);
    if (filter.toDate) where.createdAt.lte = new Date(filter.toDate);
  }

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: { bill: { include: { patient: { include: { user: { select: { fullName: true } } } } } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getPaymentByBillId = async (billId) => {
  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill) throw new Error("Bill not found");

  return prisma.payment.findMany({
    where: { billId },
    orderBy: { createdAt: "desc" },
  });
};

export const getPaymentById = async (id) => {
  return prisma.payment.findUnique({ where: { id }, include: { bill: true } });
};

/** Edits metadata on an existing payment (note, transaction ID, status correction). */
export const updatePayment = async (paymentId, updateData, performedBy) => {
  const existing = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!existing) throw new Error("Payment not found");
  if (existing.status === "REFUNDED") throw new Error("Cannot edit a refunded payment");

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: updateData,
  });

  await logAudit(performedBy, "UPDATE", `Updated payment ${paymentId}`);

  return updatedPayment;
};

/**
 * Refunds a payment (in full or in part) and reflects it on the parent bill:
 * a full refund of the only/last payment marks the bill REFUNDED, otherwise
 * the bill drops back to PARTIALLY_PAID for the remaining covered amount.
 */
export const refundPayment = async (paymentId, { amount, reason }, performedBy) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { bill: true } });
  if (!payment) throw new Error("Payment not found");
  if (payment.status !== "COMPLETED") throw new Error("Only completed payments can be refunded");

  const refundAmount = amount ?? payment.amount;
  if (refundAmount > payment.amount) {
    throw new Error(`Refund amount cannot exceed the original payment amount: ${payment.amount}`);
  }

  const [refunded] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "REFUNDED",
        refundedAmount: refundAmount,
        refundReason: reason,
        refundedAt: new Date(),
      },
    }),
    prisma.bill.update({
      where: { id: payment.billId },
      data: refundAmount >= payment.amount ? { status: "REFUNDED" } : { status: "PARTIALLY_PAID" },
    }),
  ]);

  await logAudit(performedBy, "UPDATE", `Refunded ${refundAmount} on payment ${paymentId}: ${reason}`);

  return refunded;
};

/** Every payment across every bill belonging to one patient, newest first. */
export const getPatientPaymentHistory = async (patientId) => {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new Error("Patient not found");

  return prisma.payment.findMany({
    where: { bill: { patientId } },
    include: { bill: true },
    orderBy: { createdAt: "desc" },
  });
};

async function logAudit(userId, action, description) {
  if (!userId) return; // best-effort — never block a payment on audit logging
  try {
    await prisma.auditLog.create({ data: { userId, action, description } });
  } catch {
    // Swallow audit failures; the payment itself has already succeeded.
  }
}

export const paymentService = {
  createPayment,
  getPayments,
  getPaymentByBillId,
  getPaymentById,
  updatePayment,
  refundPayment,
  getPatientPaymentHistory,
};

import { prisma } from "../../config/database.js";

const LOCKED_STATUSES = ["PAID", "REFUNDED"];

function computeTotals(items, tax, discount) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalAmount = subtotal + tax - discount;
  return { subtotal, totalAmount };
}

/** Creates a new itemized bill for a patient, recalculating totals server-side. */
export const generateBill = async (billData) => {
  const { patientId, appointmentId, items, tax = 0, discount = 0, notes, generatedBy } = billData;

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new Error("Patient not found");

  if (appointmentId) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new Error("Appointment not found");
  }

  const { subtotal, totalAmount } = computeTotals(items, tax, discount);
  if (totalAmount < 0) throw new Error("Total amount cannot be negative");

  const billNumber = `BILL-${Date.now()}`;
  const invoiceNumber = `INV-${Date.now()}`;

  return prisma.bill.create({
    data: {
      patientId,
      appointmentId: appointmentId || undefined,
      billNumber,
      invoiceNumber,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      notes,
      generatedBy,
      status: "UNPAID",
    },
    include: { patient: true, appointment: true },
  });
};

/** Lists bills with optional patientId / status filters. */
export const getAllBills = async ({ patientId, status } = {}) => {
  return prisma.bill.findMany({
    where: {
      ...(patientId ? { patientId } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      patient: { include: { user: { select: { fullName: true, email: true } } } },
      appointment: true,
      payments: true,
    },
    orderBy: { generatedAt: "desc" },
  });
};

export const getBillById = async (id) => {
  return prisma.bill.findUnique({
    where: { id },
    include: {
      patient: { include: { user: { select: { fullName: true, email: true, phone: true } } } },
      appointment: true,
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
};

export const getBillByInvoiceNumber = async (invoiceNumber) => {
  return prisma.bill.findUnique({
    where: { invoiceNumber },
    include: {
      patient: { include: { user: { select: { fullName: true, email: true } } } },
      appointment: true,
      payments: true,
    },
  });
};

/** Recalculates totals from the edited item list. Blocked once a bill is paid or refunded. */
export const updateBill = async (id, updates) => {
  const existing = await prisma.bill.findUnique({ where: { id } });
  if (!existing) throw new Error("Bill not found");
  if (LOCKED_STATUSES.includes(existing.status)) {
    throw new Error(`Cannot edit a bill that is already ${existing.status.toLowerCase()}`);
  }

  const items = updates.items || existing.items;
  const tax = updates.tax ?? existing.tax;
  const discount = updates.discount ?? existing.discount;
  const { subtotal, totalAmount } = computeTotals(items, tax, discount);
  if (totalAmount < 0) throw new Error("Total amount cannot be negative");

  return prisma.bill.update({
    where: { id },
    data: {
      items,
      tax,
      discount,
      subtotal,
      totalAmount,
      notes: updates.notes ?? existing.notes,
    },
  });
};

/** Marks an unpaid bill cancelled. Paid/refunded bills cannot be cancelled this way — use a refund flow instead. */
export const cancelBill = async (id) => {
  const existing = await prisma.bill.findUnique({ where: { id } });
  if (!existing) throw new Error("Bill not found");
  if (existing.status !== "UNPAID") {
    throw new Error(`Only unpaid bills can be cancelled (this bill is ${existing.status.toLowerCase()})`);
  }
  return prisma.bill.update({ where: { id }, data: { status: "CANCELLED" } });
};

export const deleteBill = async (id) => {
  const existing = await prisma.bill.findUnique({ where: { id } });
  if (!existing) throw new Error("Bill not found");
  if (LOCKED_STATUSES.includes(existing.status)) {
    throw new Error(`Cannot delete a bill that is already ${existing.status.toLowerCase()}`);
  }
  return prisma.bill.delete({ where: { id } });
};

/** Admin analytics: revenue collected, outstanding amount, and counts by status. */
export const getBillingSummary = async () => {
  const [totalPaid, totalUnpaid, statusCounts] = await Promise.all([
    prisma.bill.aggregate({ where: { status: "PAID" }, _sum: { totalAmount: true } }),
    prisma.bill.aggregate({ where: { status: "UNPAID" }, _sum: { totalAmount: true } }),
    prisma.bill.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  return {
    totalRevenue: totalPaid._sum.totalAmount || 0,
    totalOutstanding: totalUnpaid._sum.totalAmount || 0,
    countsByStatus: statusCounts.reduce((acc, row) => {
      acc[row.status] = row._count._all;
      return acc;
    }, {}),
  };
};

/** Creates a pending Payment log entry ahead of redirecting to a gateway. */
export const createPendingPayment = async ({ billId, amount, method }) => {
  return prisma.payment.create({ data: { billId, amount, method, status: "PENDING" } });
};

/** Marks a payment (and its parent bill) verified/paid after gateway confirmation. */
export const verifyPayment = async ({ billId, method, transactionId, gatewayReference, rawResponse }) => {
  const [payment, bill] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        billId,
        amount: (await prisma.bill.findUnique({ where: { id: billId } })).totalAmount,
        method,
        status: "COMPLETED",
        transactionId,
        gatewayReference,
        rawResponse,
        verifiedAt: new Date(),
      },
    }),
    prisma.bill.update({
      where: { id: billId },
      data: { status: "PAID", paymentMethod: method, paymentDate: new Date() },
    }),
  ]);

  return { payment, bill };
};

export const billingService = {
  generateBill,
  getAllBills,
  getBillById,
  getBillByInvoiceNumber,
  updateBill,
  cancelBill,
  deleteBill,
  getBillingSummary,
  createPendingPayment,
  verifyPayment,
};

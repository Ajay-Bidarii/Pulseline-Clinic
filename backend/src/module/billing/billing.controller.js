import { billingService } from "./billing.service.js";
import { buildEsewaPayload, verifyEsewaCallback } from "./gateways/esewa.js";
import { initiateKhaltiPayment, verifyKhaltiPayment } from "./gateways/khalti.js";
import { success, fail } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";
import { MESSAGES } from "../../constans/messages.js";
import { generateId } from "../../utils/crypto.js";

async function getSummary(_req, res) {
  const summary = await billingService.getBillingSummary();
  return success(res, StatusCodes.OK, "Billing summary fetched.", { summary });
}

async function getByInvoiceNumber(req, res) {
  const bill = await billingService.getBillByInvoiceNumber(req.params.invoiceNumber);
  if (!bill) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);
  return success(res, StatusCodes.OK, "Bill fetched.", { bill });
}

async function list(req, res) {
  const bills = await billingService.getAllBills({
    patientId: req.query.patientId,
    status: req.query.status,
  });
  return success(res, StatusCodes.OK, "Bills fetched.", { bills });
}

async function create(req, res) {
  try {
    const bill = await billingService.generateBill(req.body);
    return success(res, StatusCodes.CREATED, MESSAGES.BILLING.INVOICE_CREATED, { bill });
  } catch (err) {
    return fail(res, StatusCodes.BAD_REQUEST, err.message);
  }
}

async function getOne(req, res) {
  const bill = await billingService.getBillById(req.params.id);
  if (!bill) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);
  return success(res, StatusCodes.OK, "Bill fetched.", { bill });
}

async function update(req, res) {
  try {
    const bill = await billingService.updateBill(req.params.id, req.body);
    return success(res, StatusCodes.OK, "Bill updated.", { bill });
  } catch (err) {
    return fail(res, StatusCodes.BAD_REQUEST, err.message);
  }
}

async function remove(req, res) {
  try {
    await billingService.deleteBill(req.params.id);
    return success(res, StatusCodes.OK, "Bill deleted.");
  } catch (err) {
    return fail(res, StatusCodes.BAD_REQUEST, err.message);
  }
}

async function cancel(req, res) {
  try {
    const bill = await billingService.cancelBill(req.params.id);
    return success(res, StatusCodes.OK, "Bill cancelled.", { bill });
  } catch (err) {
    return fail(res, StatusCodes.BAD_REQUEST, err.message);
  }
}

/** Kicks off a checkout session with the chosen gateway and logs a pending Payment. */
async function initiatePayment(req, res) {
  const bill = await billingService.getBillById(req.params.id);
  if (!bill) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);

  const { method } = req.body;

  if (method === "CASH") {
    const { bill: paid } = await billingService.verifyPayment({ billId: bill.id, method: "CASH" });
    return success(res, StatusCodes.OK, MESSAGES.BILLING.PAYMENT_VERIFIED, { bill: paid });
  }

  await billingService.createPendingPayment({ billId: bill.id, amount: bill.totalAmount, method });

  if (method === "ESEWA") {
    const transactionUuid = generateId();
    const payload = buildEsewaPayload({ amount: bill.totalAmount, transactionUuid });
    return success(res, StatusCodes.OK, "eSewa checkout payload ready.", {
      gateway: "ESEWA",
      formAction: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      payload,
    });
  }

  if (method === "KHALTI") {
    const session = await initiateKhaltiPayment({
      amount: bill.totalAmount,
      purchaseOrderId: bill.id,
      purchaseOrderName: `Pulseline Clinic bill ${bill.billNumber}`,
      customerInfo: { name: bill.patient?.user?.fullName || "Patient" },
    });
    return success(res, StatusCodes.OK, "Khalti checkout session created.", { gateway: "KHALTI", ...session });
  }

  return fail(res, StatusCodes.BAD_REQUEST, "Unsupported payment method.");
}

/** eSewa redirects the browser back here with a base64 `data` query param. */
async function esewaCallback(req, res) {
  const { isValid, decoded } = verifyEsewaCallback(req.query.data);
  if (!isValid) return fail(res, StatusCodes.BAD_REQUEST, MESSAGES.BILLING.PAYMENT_FAILED);

  const billId = req.query.billId;
  const { bill } = await billingService.verifyPayment({
    billId,
    method: "ESEWA",
    transactionId: decoded.transaction_code,
    gatewayReference: decoded.transaction_uuid,
    rawResponse: decoded,
  });
  return success(res, StatusCodes.OK, MESSAGES.BILLING.PAYMENT_VERIFIED, { bill });
}

/** Called after the frontend gets redirected back from Khalti with a `pidx`. */
async function khaltiCallback(req, res) {
  const { pidx, billId } = req.body;
  const { isValid, data } = await verifyKhaltiPayment(pidx);
  if (!isValid) return fail(res, StatusCodes.BAD_REQUEST, MESSAGES.BILLING.PAYMENT_FAILED);

  const { bill } = await billingService.verifyPayment({
    billId,
    method: "KHALTI",
    transactionId: data.transaction_id,
    gatewayReference: pidx,
    rawResponse: data,
  });
  return success(res, StatusCodes.OK, MESSAGES.BILLING.PAYMENT_VERIFIED, { bill });
}

export const billingController = {
  getSummary,
  getByInvoiceNumber,
  list,
  create,
  getOne,
  update,
  remove,
  cancel,
  initiatePayment,
  esewaCallback,
  khaltiCallback,
};

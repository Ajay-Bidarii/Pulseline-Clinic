import { paymentService } from "./payment.service.js";
import { patientService } from "../patient/patient.service.js";
import { success, fail } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";
import { MESSAGES } from "../../constans/messages.js";
import { ROLES } from "../../constans/roles.js";

async function createPayment(req, res) {
  try {
    const payment = await paymentService.createPayment(req.body, req.user.id);
    return success(res, StatusCodes.CREATED, "Payment recorded.", { payment });
  } catch (err) {
    return fail(res, StatusCodes.BAD_REQUEST, err.message);
  }
}

async function getAllPayments(req, res) {
  const { page, limit, ...filter } = req.query;
  const result = await paymentService.getPayments(page, limit, filter);
  return success(res, StatusCodes.OK, "Payments fetched.", result);
}

async function getPaymentByBillId(req, res) {
  try {
    const payments = await paymentService.getPaymentByBillId(req.params.billId);
    return success(res, StatusCodes.OK, "Payments for bill fetched.", { payments });
  } catch (err) {
    return fail(res, StatusCodes.NOT_FOUND, err.message);
  }
}

async function updatePayment(req, res) {
  try {
    const payment = await paymentService.updatePayment(req.params.id, req.body, req.user.id);
    return success(res, StatusCodes.OK, "Payment updated.", { payment });
  } catch (err) {
    return fail(res, StatusCodes.BAD_REQUEST, err.message);
  }
}

async function refundPayment(req, res) {
  try {
    const payment = await paymentService.refundPayment(req.params.id, req.body, req.user.id);
    return success(res, StatusCodes.OK, "Payment refunded.", { payment });
  } catch (err) {
    return fail(res, StatusCodes.BAD_REQUEST, err.message);
  }
}

async function getPatientPaymentHistory(req, res) {
  // Patients may only ever pull their own history — staff/doctor can pull anyone's.
  if (req.user.role === ROLES.PATIENT) {
    const ownPatient = await patientService.getByUserId(req.user.id);
    if (!ownPatient || ownPatient.id !== req.params.patientId) {
      return fail(res, StatusCodes.FORBIDDEN, MESSAGES.AUTH.FORBIDDEN);
    }
  }

  try {
    const history = await paymentService.getPatientPaymentHistory(req.params.patientId);
    return success(res, StatusCodes.OK, "Payment history fetched.", { history });
  } catch (err) {
    return fail(res, StatusCodes.NOT_FOUND, err.message);
  }
}

export const paymentController = {
  createPayment,
  getAllPayments,
  getPaymentByBillId,
  updatePayment,
  refundPayment,
  getPatientPaymentHistory,
};

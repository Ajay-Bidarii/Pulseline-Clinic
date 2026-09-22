import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { paymentSchema, getPaymentQuerySchema, updatePaymentSchema, refundPaymentSchema } from "./payment.schema.js";
import { ROLES } from "../../constans/roles.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  requireRole(ROLES.ADMIN, ROLES.RECEPTIONIST),
  validate(paymentSchema),
  paymentController.createPayment
);

router.get(
  "/",
  requireRole(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  validate(getPaymentQuerySchema, "query"),
  paymentController.getAllPayments
);

router.get(
  "/bill/:billId",
  requireRole(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  paymentController.getPaymentByBillId
);

router.put(
  "/:id",
  requireRole(ROLES.ADMIN),
  validate(updatePaymentSchema),
  paymentController.updatePayment
);

router.post(
  "/:id/refund",
  requireRole(ROLES.ADMIN),
  validate(refundPaymentSchema),
  paymentController.refundPayment
);

router.get(
  "/history/:patientId",
  requireRole(ROLES.ADMIN, ROLES.PATIENT, ROLES.RECEPTIONIST),
  paymentController.getPatientPaymentHistory
);

export default router;

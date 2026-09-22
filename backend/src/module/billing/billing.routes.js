import { Router } from "express";
import { billingController } from "./billing.controller.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { generateBillSchema, updateBillSchema, initiatePaymentSchema, khaltiCallbackSchema } from "./billing.schema.js";
import { STAFF_ROLES } from "../../constans/roles.js";

const router = Router();

// Public redirect targets — the gateway calls these directly, no session available.
router.get("/callback/esewa", billingController.esewaCallback);

router.use(requireAuth);

// Admin analytics dashboard data.
router.get("/summary", requireRole(...STAFF_ROLES), billingController.getSummary);

// Direct lookup by receipt reference.
router.get("/invoice/:invoiceNumber", billingController.getByInvoiceNumber);

// Fetch all invoices / issue a new invoice bill.
router.get("/", billingController.list);
router.post("/", requireRole(...STAFF_ROLES), validate(generateBillSchema), billingController.create);

// CRUD management on bills.
router.get("/:id", billingController.getOne);
router.put("/:id", requireRole(...STAFF_ROLES), validate(updateBillSchema), billingController.update);
router.delete("/:id", requireRole(...STAFF_ROLES), billingController.remove);

// Safely marks an unpaid bill as cancelled.
router.patch("/:id/cancel", requireRole(...STAFF_ROLES), billingController.cancel);

// Payment initiation + gateway callbacks.
router.post("/:id/pay", validate(initiatePaymentSchema), billingController.initiatePayment);
router.post("/callback/khalti", validate(khaltiCallbackSchema), billingController.khaltiCallback);

export default router;

import { Router } from "express";
import { appointmentController } from "./appointment.controller.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { createAppointmentSchema, updateStatusSchema, addPrescriptionSchema } from "./appointment.schema.js";
import { ROLES, STAFF_ROLES } from "../../constans/roles.js";

const router = Router();

router.use(requireAuth);

router.get("/", appointmentController.list);
router.get("/:id", appointmentController.getOne);
router.post("/", validate(createAppointmentSchema), appointmentController.create);
router.patch("/:id/status", requireRole(...STAFF_ROLES, ROLES.DOCTOR), validate(updateStatusSchema), appointmentController.updateStatus);
router.patch("/:id/prescription", requireRole(ROLES.DOCTOR), validate(addPrescriptionSchema), appointmentController.addPrescription);
router.delete("/:id", appointmentController.remove);

export default router;

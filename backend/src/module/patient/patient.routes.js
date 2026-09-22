import { Router } from "express";
import { patientController } from "./patientController.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { updatePatientSchema } from "./patient.schema.js";
import { ROLES, STAFF_ROLES } from "../../constans/roles.js";

const router = Router();

router.get("/me", requireAuth, requireRole(ROLES.PATIENT), patientController.me);
router.get("/", requireAuth, requireRole(...STAFF_ROLES, ROLES.DOCTOR), patientController.list);
router.get("/:id", requireAuth, requireRole(...STAFF_ROLES, ROLES.DOCTOR), patientController.getOne);
router.patch("/:id", requireAuth, validate(updatePatientSchema), patientController.update);
router.delete("/:id", requireAuth, requireRole(...STAFF_ROLES), patientController.remove);

export default router;

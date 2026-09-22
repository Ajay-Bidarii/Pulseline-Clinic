import { Router } from "express";
import { doctorController } from "./doctor.controller.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { updateDoctorSchema } from "./doctor.schema.js";
import { ROLES, STAFF_ROLES } from "../../constans/roles.js";

const router = Router();

// Public: patients/visitors browse doctors without logging in.
router.get("/", doctorController.list);
router.get("/:id", doctorController.getOne);

router.get("/me/profile", requireAuth, requireRole(ROLES.DOCTOR), doctorController.me);
router.patch("/:id", requireAuth, requireRole(...STAFF_ROLES, ROLES.DOCTOR), validate(updateDoctorSchema), doctorController.update);
router.delete("/:id", requireAuth, requireRole(...STAFF_ROLES), doctorController.remove);

export default router;

import { Router } from "express";
import { departmentController } from "./department.controller.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.schema.js";
import { STAFF_ROLES } from "../../constans/roles.js";

const router = Router();

router.get("/", departmentController.list);
router.get("/:id", departmentController.getOne);
router.post("/", requireAuth, requireRole(...STAFF_ROLES), validate(createDepartmentSchema), departmentController.create);
router.patch("/:id", requireAuth, requireRole(...STAFF_ROLES), validate(updateDepartmentSchema), departmentController.update);
router.delete("/:id", requireAuth, requireRole(...STAFF_ROLES), departmentController.remove);

export default router;

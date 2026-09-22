import { Router } from "express";
import { queueController } from "./queue.controller.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { ROLES, STAFF_ROLES } from "../../constans/roles.js";

const router = Router();

// Public: the waiting-room display screen reads the queue without logging in.
router.get("/", queueController.list);

router.use(requireAuth);
router.post("/check-in", requireRole(...STAFF_ROLES), queueController.checkIn);
router.post("/call-next", requireRole(ROLES.DOCTOR), queueController.callNext);
router.patch("/:id/complete", requireRole(...STAFF_ROLES, ROLES.DOCTOR), queueController.complete);
router.delete("/:id", requireRole(...STAFF_ROLES), queueController.remove);

export default router;

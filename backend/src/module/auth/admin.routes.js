import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { ROLES } from "../../constans/roles.js";
import { prisma } from "../../config/database.js";
import { success } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";

const router = Router();
router.use(requireAuth, requireRole(ROLES.ADMIN));

// Admin-only: list every user account across roles.
router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, fullName: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return success(res, StatusCodes.OK, "Users fetched.", { users });
});

// Admin-only: deactivate a staff/doctor/patient account instead of deleting it.
router.patch("/users/:id/deactivate", async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
  return success(res, StatusCodes.OK, "User deactivated.", { user });
});

export default router;

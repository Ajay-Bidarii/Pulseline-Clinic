import { Router } from "express";
import authRoutes from "../module/auth/auth.routes.js";
import adminRoutes from "../module/auth/admin.routes.js";
import patientRoutes from "../module/patient/patient.routes.js";
import doctorRoutes from "../module/doctor/doctor.routes.js";
import departmentRoutes from "../module/department/department.routes.js";
import appointmentRoutes from "../module/appointment/appointent.routes.js";
import queueRoutes from "../module/queue/queue.routes.js";
import billingRoutes from "../module/billing/billing.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/departments", departmentRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/queue", queueRoutes);
router.use("/billing", billingRoutes);

export default router;

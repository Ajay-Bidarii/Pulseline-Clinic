import { Router } from "express";
import { medicalRecordController } from "./medicalRecord.controller.js";
import { requireAuth, requireRole } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
  createPrescriptionSchema,
  createReportSchema,
} from "./medicalRecord.schema.js";
import { ROLES, STAFF_ROLES } from "../../constans/roles.js";

const router = Router();

router.use(requireAuth);

// Fetches historical diagnostics for a patient.
router.get("/patient/:patientId/history", medicalRecordController.getPatientHistory);

// Lists/creates medical records. Only doctors (and staff, for admin purposes) can create.
router.get("/", medicalRecordController.list);
router.post("/", requireRole(ROLES.DOCTOR, ...STAFF_ROLES), validate(createMedicalRecordSchema), medicalRecordController.create);

// Access/update/delete individual medical logs.
router.get("/:id", medicalRecordController.getOne);
router.put("/:id", requireRole(ROLES.DOCTOR, ...STAFF_ROLES), validate(updateMedicalRecordSchema), medicalRecordController.update);
router.delete("/:id", requireRole(ROLES.DOCTOR, ...STAFF_ROLES), medicalRecordController.remove);

// Prescription management.
router.post("/prescription", requireRole(ROLES.DOCTOR), validate(createPrescriptionSchema), medicalRecordController.createPrescription);
router.get("/prescription/:id", medicalRecordController.getPrescription);

// Diagnostic report uploads.
router.post("/report", requireRole(ROLES.DOCTOR, ...STAFF_ROLES), validate(createReportSchema), medicalRecordController.createReport);
router.get("/report/:id", medicalRecordController.getReport);

export default router;

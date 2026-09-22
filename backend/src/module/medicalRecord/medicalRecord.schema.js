import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  doctorId: z.string().min(1, "Doctor ID is required"),
  appointmentId: z.string().optional(),
  diagnosis: z.string().optional(),
  diagnosisDate: z.string().datetime().optional(),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial().omit({
  patientId: true,
  doctorId: true,
});

export const createPrescriptionSchema = z.object({
  medicalRecordId: z.string().min(1, "Medical record ID is required"),
  medicationName: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().optional(),
  instructions: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).default("ACTIVE"),
});

export const createReportSchema = z.object({
  medicalRecordId: z.string().min(1, "Medical record ID is required"),
  type: z.enum(["BLOOD_TEST", "X_RAY", "MRI", "CT_SCAN", "ULTRASOUND", "ECG", "OTHER"]),
  title: z.string().min(1, "Report title is required"),
  fileUrl: z.string().min(1, "File URL is required"),
  notes: z.string().optional(),
  reportDate: z.string().datetime().optional(),
});

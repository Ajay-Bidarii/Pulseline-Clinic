import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().optional(), // resolved from req.user for PATIENT role bookings
  doctorId: z.string(),
  date: z.string().datetime(),
  time: z.string(), // e.g. "09:30"
  type: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"]),
});

export const addPrescriptionSchema = z.object({
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().datetime().optional(),
});

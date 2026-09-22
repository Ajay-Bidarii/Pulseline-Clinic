import { z } from "zod";

export const updateDoctorSchema = z.object({
  departmentId: z.string().optional(),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  experience: z.number().int().nonnegative().optional(),
  hospital: z.string().optional(),
  consultationFee: z.number().nonnegative().optional(),
  availableDays: z.any().optional(),
  bio: z.string().optional(),
});

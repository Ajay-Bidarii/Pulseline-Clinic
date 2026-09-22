import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  hospital: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  location: z.string().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

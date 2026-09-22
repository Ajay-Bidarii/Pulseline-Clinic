import { z } from "zod";

const billItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().positive("Unit price must be greater than 0"),
  discount: z.number().min(0).default(0),
  total: z.number().positive("Item total must be greater than 0"),
});

export const generateBillSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  appointmentId: z.string().optional(),
  items: z.array(billItemSchema).min(1, "At least one billing item is required"),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  notes: z.string().optional(),
  generatedBy: z.string().min(1, "generatedBy is required"),
});

export const updateBillSchema = z.object({
  items: z.array(billItemSchema).min(1).optional(),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const initiatePaymentSchema = z.object({
  method: z.enum(["ESEWA", "KHALTI", "CASH"]),
});

export const khaltiCallbackSchema = z.object({
  pidx: z.string().min(1),
  billId: z.string().min(1),
});

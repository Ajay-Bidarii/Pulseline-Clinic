import { z } from "zod";

export const paymentSchema = z.object({
  billId: z.string().min(1, "Bill ID is required"),
  amount: z.number().positive("Amount must be a positive number"),
  method: z.enum(["CASH", "KHALTI", "ESEWA"], { message: "Payment method must be one of CASH, KHALTI, or ESEWA" }),
  transactionId: z.string().optional(),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
});

export const getPaymentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
  method: z.enum(["CASH", "KHALTI", "ESEWA"]).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
});

export const updatePaymentSchema = z.object({
  transactionId: z.string().optional(),
  note: z.string().max(500).optional(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
});

export const refundPaymentSchema = z.object({
  amount: z.number().positive("Refund amount must be a positive number").optional(),
  reason: z.string().min(1, "A refund reason is required").max(500),
});

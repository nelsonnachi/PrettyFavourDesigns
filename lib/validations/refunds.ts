import { z } from "zod";

// ============================================================
// REFUND STATUS
// ============================================================

export const refundStatusSchema = z.enum([
  "pending",
  "processing",
  "processed",
  "failed",
]);

// ============================================================
// CREATE REFUND
// ============================================================

export const createRefundSchema = z.object({
  orderId: z
    .string()
    .uuid("Invalid order ID"),

  paymentId: z
    .string()
    .uuid("Invalid payment ID"),

  amount: z
    .number()
    .positive(
      "Refund amount must be greater than zero",
    ),

  reason: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

// ============================================================
// UPDATE REFUND
// ============================================================

export const updateRefundSchema = z.object({
  status: refundStatusSchema,
});

// ============================================================
// REFUND PARAMS
// ============================================================

export const refundIdParamSchema = z.object({
  id: z.string().uuid("Invalid refund ID"),
});




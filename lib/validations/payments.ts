import { z } from "zod";

// ============================================================
// PAYSTACK PAYMENT INITIALIZATION
// ============================================================

export const initializePaymentSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
});

// ============================================================
// PAYSTACK PAYMENT VERIFICATION
// ============================================================

export const verifyPaymentSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(1, "Payment reference is required"),
});

// ============================================================
// ADMIN PAYMENT LIST FILTERS
// ============================================================

export const adminPaymentFiltersSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  search: z
    .string()
    .trim()
    .min(1)
    .optional(),

  status: z
    .enum([
      "pending",
      "paid",
      "failed",
      "refunded",
      "partially_refunded",
    ])
    .optional(),

  provider: z
    .string()
    .trim()
    .min(1)
    .optional(),

  paymentMethod: z
    .enum([
      "paystack",
      "cash_on_delivery",
    ])
    .optional(),

  sort: z
    .enum([
      "newest",
      "oldest",
      "amount_asc",
      "amount_desc",
    ])
    .default("newest"),
});

// ============================================================
// ADMIN PAYMENT ID
// ============================================================

export const adminPaymentIdSchema = z.object({
  id: z.string().uuid("Invalid payment ID"),
});
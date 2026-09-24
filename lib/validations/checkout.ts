import { z } from "zod";

// ============================================================
// CHECKOUT
// ============================================================

export const checkoutSchema = z.object({
  // ==========================================================
  // IDEMPOTENCY KEY
  // ==========================================================
  //
  // One key represents one checkout attempt.
  //
  idempotencyKey: z
    .string()
    .uuid("Invalid checkout idempotency key"),

  // ==========================================================
  // SHIPPING ADDRESS
  // ==========================================================

  addressId: z
    .string()
    .uuid("Invalid shipping address"),

  // ==========================================================
  // PAYMENT METHOD
  // ==========================================================

  paymentMethod: z.enum([
    "paystack",
    "cash_on_delivery",
  ]),

  // ==========================================================
  // NOTES
  // ==========================================================

  notes: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
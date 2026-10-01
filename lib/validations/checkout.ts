// lib/validations/checkout.ts

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
  idempotencyKey: z.string().uuid("Invalid checkout idempotency key"),

  // ==========================================================
  // SHIPPING ADDRESS
  // ==========================================================

  addressId: z.string().uuid("Invalid shipping address"),

  // ==========================================================
  // PAYMENT METHOD
  // ==========================================================

  paymentMethod: z.enum(["paystack", "cash_on_delivery"]),

  // ==========================================================
  // NOTES
  // ==========================================================

  notes: z.string().trim().max(1000).optional(),

  // ==========================================================
  // DISCOUNT CODE (optional)
  // ==========================================================
  //
  // The customer only sends the CODE, never the amount.
  // The server works out the discount itself.
  //
  // - " blackfriday " becomes "BLACKFRIDAY"
  // - an empty value ("" or null) is treated as "no code"
  // - whether the code is valid is checked later by
  //   checkDiscount() inside the checkout route
  //
  discountCode: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z
      .string()
      .trim()
      .toUpperCase()
      .max(30, "Discount code is too long")
      .optional()
  ),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

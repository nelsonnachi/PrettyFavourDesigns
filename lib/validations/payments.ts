import { z } from "zod";

// ============================================================
// INITIALIZE PAYSTACK PAYMENT
// ============================================================

export const initializePaymentSchema =
  z.object({
    orderId: z
      .string()
      .uuid("Invalid order ID"),
  });

// ============================================================
// VERIFY PAYMENT
// ============================================================

export const verifyPaymentSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(
      1,
      "Payment reference is required",
    ),
});



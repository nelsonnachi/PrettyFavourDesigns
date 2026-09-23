import { z } from "zod";

// ============================================================
// CHECKOUT
// ============================================================
//
// The customer does NOT send the shipping address itself.
//
// They send the ID of one of their saved addresses.
//
// The server will fetch the address from PostgreSQL and create
// a permanent snapshot for the order.
//
// ============================================================

export const checkoutSchema = z.object({
  // ==========================================================
  // SHIPPING ADDRESS
  // ==========================================================

  addressId: z.string().uuid(
    "Invalid shipping address",
  ),

  // ==========================================================
  // PAYMENT METHOD
  // ==========================================================

  paymentMethod: z.enum([
    "paystack",
    "cash_on_delivery",
  ]),

  // ==========================================================
  // ORDER NOTES
  // ==========================================================

  notes: z
    .string()
    .trim()
    .max(
      1000,
      "Order notes cannot exceed 1000 characters",
    )
    .optional(),
});
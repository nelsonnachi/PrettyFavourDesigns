import { z } from "zod";

// ============================================================
// ORDER STATUS
// ============================================================

export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

// ============================================================
// PAYMENT STATUS
// ============================================================

export const paymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
]);

// ============================================================
// PAYMENT METHOD
// ============================================================

export const paymentMethodSchema = z.enum([
  "paystack",
  "cash_on_delivery",
]);

// ============================================================
// CHECKOUT ITEM
// ============================================================
//
// The client sends product + selected color.
// The SERVER must calculate the price.
//
// Never trust a price sent from the browser.
// ============================================================

export const checkoutItemSchema = z.object({
  productId: z
    .string()
    .uuid("Invalid product ID"),

  variantId: z
    .string()
    .uuid("Invalid product variant"),

  quantity: z
    .number()
    .int()
    .min(1)
    .max(50),
});

// ============================================================
// CREATE ORDER
// ============================================================

export const createOrderSchema = z.object({
  shippingAddressId: z
    .string()
    .uuid("Invalid shipping address"),

  paymentMethod:
    paymentMethodSchema.default("paystack"),

  items: z
    .array(checkoutItemSchema)
    .min(
      1,
      "Your order must contain at least one item",
    ),

  notes: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export const updateOrderStatusSchema =
  z.object({
    status: orderStatusSchema,
  });

// ============================================================
// ORDER PARAMS
// ============================================================

export const orderIdParamSchema = z.object({
  id: z.string().uuid("Invalid order ID"),
});

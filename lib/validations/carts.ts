import { z } from "zod";

// ============================================================
// ADD TO CART
// ============================================================

export const addToCartSchema = z.object({
  productId: z
    .string()
    .uuid("Invalid product ID"),

  variantId: z
    .string()
    .uuid("Invalid product variant"),

  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(
      50,
      "You can only add up to 50 items",
    ),
});

// ============================================================
// UPDATE CART ITEM
// ============================================================

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(
      50,
      "You can only have up to 50 items",
    ),
});

// ============================================================
// CART ITEM PARAMS
// ============================================================

export const cartItemIdParamSchema = z.object({
  id: z
    .string()
    .uuid("Invalid cart item ID"),
});
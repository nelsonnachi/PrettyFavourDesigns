import { z } from "zod";

// ============================================================
// CREATE INVENTORY MOVEMENT
// ============================================================

export const createInventoryMovementSchema =
  z.object({
    variantId: z
      .string()
      .uuid("Invalid product variant"),

    quantityChange: z
      .number()
      .int()
      .refine(
        (value) => value !== 0,
        {
          message:
            "Quantity change cannot be zero",
        },
      ),

    reason: z
      .string()
      .trim()
      .min(
        2,
        "Inventory movement reason is required",
      )
      .max(500),
  });

// ============================================================
// INVENTORY UPDATE
// ============================================================

export const updateInventorySchema =
  z.object({
    variantId: z
      .string()
      .uuid("Invalid product variant"),

    stock: z
      .number()
      .int()
      .min(0, "Stock cannot be negative"),
  });

// ============================================================
// INVENTORY PARAMS
// ============================================================

export const inventoryVariantParamSchema =
  z.object({
    variantId: z
      .string()
      .uuid("Invalid variant ID"),
  });

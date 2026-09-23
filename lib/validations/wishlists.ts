import { z } from "zod";

// ============================================================
// ADD TO WISHLIST
// ============================================================

export const addWishlistSchema = z.object({
  productId: z
    .string()
    .uuid("Invalid product ID"),
});

// ============================================================
// WISHLIST PARAMS
// ============================================================

export const wishlistProductParamSchema =
  z.object({
    productId: z
      .string()
      .uuid("Invalid product ID"),
  });


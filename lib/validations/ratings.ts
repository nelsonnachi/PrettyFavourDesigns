import { z } from "zod";

// ============================================================
// CREATE RATING
// ============================================================

export const createRatingSchema = z.object({
  productId: z
    .string()
    .uuid("Invalid product ID"),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5"),
});

// ============================================================
// UPDATE RATING
// ============================================================

export const updateRatingSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1)
    .max(5),
});

// ============================================================
// RATING PARAMS
// ============================================================

export const ratingIdParamSchema = z.object({
  id: z.string().uuid("Invalid rating ID"),
});


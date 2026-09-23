import { z } from "zod";

// ============================================================
// CREATE CATEGORY
// ============================================================

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Category name must be at least 2 characters",
    )
    .max(
      100,
      "Category name is too long",
    ),

  slug: z
    .string()
    .trim()
    .min(
      2,
      "Category slug is required",
    )
    .max(
      120,
      "Category slug is too long",
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens",
    ),

  description: z
    .string()
    .trim()
    .max(
      1000,
      "Description is too long",
    )
    .optional(),

  position: z
    .number()
    .int()
    .min(0)
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

// ============================================================
// UPDATE CATEGORY
// ============================================================

export const updateCategorySchema =
  createCategorySchema.partial();

// ============================================================
// CATEGORY PARAMS
// ============================================================

export const categoryIdParamSchema = z.object({
  id: z.string().uuid(
    "Invalid category ID",
  ),
});

export const categorySlugParamSchema = z.object({
  slug: z
    .string()
    .min(
      1,
      "Category slug is required",
    ),
});
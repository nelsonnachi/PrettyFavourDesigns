import { z } from "zod";

// ============================================================
// PRODUCT STATUS
// ============================================================

export const productStatusSchema = z.enum([
  "draft",
  "active",
  "out_of_stock",
  "archived",
]);

// ============================================================
// PRODUCT IMAGE INPUT
// ============================================================

export const productImageInputSchema = z.object({
  id: z.string().uuid("Invalid image ID").optional(),

  fileKey: z.string().trim().min(1, "Image file key is required").optional(),

  position: z.number().int().min(0).optional(),

  isPrimary: z.boolean().optional().default(false),
});

// ============================================================
// PRODUCT VARIANT
// ============================================================

export const productVariantSchema = z.object({
  id: z.string().uuid("Invalid variant ID").optional(),

  colorId: z.string().uuid("Invalid color ID"),

  sku: z
    .string()
    .trim()
    .min(1, "Variant SKU is required")
    .max(100, "Variant SKU is too long"),

  stock: z.number().int().min(0, "Stock cannot be negative"),

  reservedStock: z
    .number()
    .int()
    .min(0, "Reserved stock cannot be negative")
    .optional()
    .default(0),
});

// ============================================================
// PRODUCT BASE OBJECT
// ============================================================
//
// IMPORTANT:
// Keep this as a plain z.object().
//
// We use this object to create updateProductSchema.partial().
//
// Do NOT put .refine() directly on this object.
//

const productBaseSchema = z.object({
  // ==========================================================
  // BASIC INFORMATION
  // ==========================================================

  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name is too long"),

  slug: z
    .string()
    .trim()
    .min(2, "Product slug is required")
    .max(250, "Product slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  sku: z
    .string()
    .trim()
    .min(1, "Product SKU is required")
    .max(100, "Product SKU is too long"),

  description: z
    .string()
    .trim()
    .min(10, "Product description must be at least 10 characters")
    .max(10000, "Product description is too long"),

  categoryId: z.string().uuid("Invalid category ID"),

  // ==========================================================
  // PRICING
  // ==========================================================

  price: z.number().nonnegative("Price cannot be negative"),

  compareAtPrice: z
    .number()
    .nonnegative("Compare-at price cannot be negative")
    .nullable()
    .optional(),

  costPrice: z
    .number()
    .nonnegative("Cost price cannot be negative")
    .nullable()
    .optional(),

  // ==========================================================
  // STATUS
  // ==========================================================

  status: productStatusSchema.optional().default("draft"),

  // ==========================================================
  // LABELS
  // ==========================================================

  isFeatured: z.boolean().optional().default(false),

  isNewArrival: z.boolean().optional().default(false),

  isBestSeller: z.boolean().optional().default(false),

  // ==========================================================
  // SEO
  // ==========================================================

  metaTitle: z
    .string()
    .trim()
    .max(200, "Meta title is too long")
    .nullable()
    .optional(),

  metaDescription: z
    .string()
    .trim()
    .max(500, "Meta description is too long")
    .nullable()
    .optional(),

  // ==========================================================
  // IMAGES
  // ==========================================================

  images: z
    .array(productImageInputSchema)
    .min(1, "At least one product image is required"),

  // ==========================================================
  // COLORS / VARIANTS
  // ==========================================================

  variants: z
    .array(productVariantSchema)
    .min(1, "A product must have at least one color"),
});

// ============================================================
// CREATE PRODUCT
// ============================================================
//
// Now we add the cross-field validation here.
//
// ============================================================

export const createProductSchema = productBaseSchema

  // ==========================================================
  // COMPARE PRICE
  // ==========================================================

  .refine(
    (data) => {
      if (data.compareAtPrice === null || data.compareAtPrice === undefined) {
        return true;
      }

      return data.compareAtPrice >= data.price;
    },
    {
      message:
        "Compare-at price must be greater than or equal to the selling price",

      path: ["compareAtPrice"],
    }
  )

  // ==========================================================
  // PRIMARY IMAGE
  // ==========================================================

  .refine(
    (data) => {
      return data.images.filter((image) => image.isPrimary).length <= 1;
    },
    {
      message: "A product can only have one primary image",

      path: ["images"],
    }
  )

  // ==========================================================
  // RESERVED STOCK
  // ==========================================================

  .refine(
    (data) => {
      return data.variants.every(
        (variant) => (variant.reservedStock ?? 0) <= variant.stock
      );
    },
    {
      message: "Reserved stock cannot be greater than stock",

      path: ["variants"],
    }
  )

  // ==========================================================
  // UNIQUE COLORS
  // ==========================================================

  .refine(
    (data) => {
      const colorIds = data.variants.map((variant) => variant.colorId);

      return new Set(colorIds).size === colorIds.length;
    },
    {
      message: "A product cannot have the same color more than once",

      path: ["variants"],
    }
  );

// ============================================================
// UPDATE PRODUCT
// ============================================================
//
// IMPORTANT:
// Use the plain base object here, NOT createProductSchema.
//
// This avoids the Zod .partial() + .refine() error.
//

export const updateProductSchema = productBaseSchema.partial().extend({
  removedImageIds: z
    .array(z.string().uuid("Invalid image ID"))
    .optional()
    .default([]),

  removedVariantIds: z
    .array(z.string().uuid("Invalid variant ID"))
    .optional()
    .default([]),
});

// ============================================================
// PRODUCT PARAMS
// ============================================================

export const productSlugParamSchema = z.object({
  slug: z.string().min(1, "Product slug is required"),
});

export const productIdParamSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
});

// ============================================================
// PRODUCT SEARCH / FILTERS
// ============================================================

export const productFiltersSchema = z
  .object({
    search: z.string().trim().optional(),

    categoryId: z.string().uuid("Invalid category ID").optional(),

    colorId: z.string().uuid("Invalid color ID").optional(),

    minPrice: z.number().nonnegative().optional(),

    maxPrice: z.number().nonnegative().optional(),

    status: productStatusSchema.optional(),

    inStock: z.boolean().optional(),

    isFeatured: z.boolean().optional(),

    isNewArrival: z.boolean().optional(),

    isBestSeller: z.boolean().optional(),

    page: z.number().int().min(1).default(1),

    limit: z.number().int().min(1).max(100).default(12),

    sort: z
      .enum([
        "newest",
        "oldest",
        "price_asc",
        "price_desc",
        "name_asc",
        "name_desc",
        "rating",
        "best_selling",
      ])
      .default("newest"),
  })

  .refine(
    (data) => {
      if (data.minPrice === undefined || data.maxPrice === undefined) {
        return true;
      }

      return data.maxPrice >= data.minPrice;
    },
    {
      message: "Maximum price must be greater than or equal to minimum price",

      path: ["maxPrice"],
    }
  );

import { z } from "zod";

// ============================================================
// CREATE COLOR
// ============================================================

export const createColorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Color name must be at least 2 characters")
    .max(50, "Color name is too long"),

  hexCode: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
    .optional(),

  isActive: z.boolean().optional(),
});

// ============================================================
// UPDATE COLOR
// ============================================================

export const updateColorSchema = createColorSchema.partial();

// ============================================================
// COLOR PARAMS
// ============================================================

export const colorIdParamSchema = z.object({
  id: z.string().uuid("Invalid color ID"),
});

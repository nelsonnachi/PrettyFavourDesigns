import { z } from "zod";

// ============================================================
// CREATE ADDRESS
// ============================================================

export const createAddressSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name is required")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name is required")
    .max(100),

  phone: z
    .string()
    .trim()
    .min(7, "Invalid phone number")
    .max(30),

  addressLine1: z
    .string()
    .trim()
    .min(
      5,
      "Address must be at least 5 characters",
    )
    .max(300),

  addressLine2: z
    .string()
    .trim()
    .max(300)
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100),

  state: z
    .string()
    .trim()
    .min(2, "State is required")
    .max(100),

  country: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .default("Nigeria"),

  postalCode: z
    .string()
    .trim()
    .max(20)
    .optional(),

  isDefault: z
    .boolean()
    .optional(),
  });

// ============================================================
// UPDATE ADDRESS
// ============================================================

export const updateAddressSchema =
  createAddressSchema.partial();

// ============================================================
// ADDRESS PARAMS
// ============================================================

export const addressIdParamSchema = z.object({
  id: z.string().uuid("Invalid address ID"),
});

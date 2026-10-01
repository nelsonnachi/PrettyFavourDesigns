// lib/validations/discount.ts

import { z } from "zod";

// ============================================================
// REUSABLE PIECES
// ============================================================

// A discount code: trimmed, UPPERCASE, only letters, numbers, - and _
// "  blackfriday " becomes "BLACKFRIDAY"
const codeField = z
  .string()
  .trim()
  .toUpperCase()
  .min(3, "Code must be at least 3 characters")
  .max(30, "Code must be 30 characters or less")
  .regex(/^[A-Z0-9_-]+$/, "Code can only contain letters, numbers, - and _");

// A whole number greater than 0 (used for limits and quantities)
const positiveInt = z.coerce
  .number()
  .int("Must be a whole number")
  .positive("Must be greater than 0");

// ============================================================
// CREATE DISCOUNT (admin form)
// ============================================================

export const createDiscountSchema = z
  .object({
    // ---------- Basic info ----------
    name: z.string().trim().min(1, "Name is required").max(100),

    description: z.string().trim().max(500).optional(),

    code: codeField,

    // ---------- Type and value ----------
    // These must match the values in your enums.ts
    type: z.enum(["percentage", "fixed"]),

    value: z.coerce.number().positive("Value must be greater than 0"),

    // ---------- What it applies to ----------
    appliesTo: z.enum(["order", "products", "categories"]).default("order"),

    // Only needed when appliesTo is "products" or "categories"
    productIds: z.array(z.string().uuid()).default([]),
    categoryIds: z.array(z.string().uuid()).default([]),

    // ---------- Who can use it ----------
    eligibility: z.enum(["all", "specific_customers"]).default("all"),

    // Only needed when eligibility is "specific_customers"
    customerIds: z.array(z.string().uuid()).default([]),

    // ---------- Conditions (leave empty for no condition) ----------
    minimumPurchaseAmount: z.coerce.number().min(0).optional(),
    maximumDiscountAmount: z.coerce.number().positive().optional(),
    minimumQuantity: positiveInt.optional(),

    // ---------- Usage limits (leave empty for unlimited) ----------
    usageLimit: positiveInt.optional(),
    usageLimitPerCustomer: positiveInt.optional(),

    // ---------- Status and schedule ----------
    isActive: z.boolean().default(true),

    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().optional(),
  })
  // Rules that depend on more than one field
  .superRefine((data, ctx) => {
    // 1. A percentage can't be more than 100
    if (data.type === "percentage" && data.value > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: "A percentage discount cannot be more than 100",
      });
    }

    // 2. "products" discounts need at least one product
    if (data.appliesTo === "products" && data.productIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["productIds"],
        message: "Select at least one product",
      });
    }

    // 3. "categories" discounts need at least one category
    if (data.appliesTo === "categories" && data.categoryIds.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["categoryIds"],
        message: "Select at least one category",
      });
    }

    // 4. "specific_customers" discounts need at least one customer
    if (
      data.eligibility === "specific_customers" &&
      data.customerIds.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["customerIds"],
        message: "Select at least one customer",
      });
    }

    // 5. The end date must be after the start date
    if (data.endsAt && data.endsAt <= data.startsAt) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "End date must be after the start date",
      });
    }

    // 6. Per-customer limit can't be bigger than the total limit
    if (
      data.usageLimit &&
      data.usageLimitPerCustomer &&
      data.usageLimitPerCustomer > data.usageLimit
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["usageLimitPerCustomer"],
        message: "Per-customer limit cannot be more than the total limit",
      });
    }
  });

// ============================================================
// UPDATE DISCOUNT (admin form)
// ============================================================
// Same rules as create. Every field is already validated above,
// so we reuse the same schema. (The discount id comes from the URL.)

export const updateDiscountSchema = createDiscountSchema;

// ============================================================
// APPLY A CODE (customer, in the cart)
// ============================================================

export const applyDiscountSchema = z.object({
  code: codeField,
});

// ============================================================
// TYPES (so TypeScript knows the shape of the data)
// ============================================================

export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
export type ApplyDiscountInput = z.infer<typeof applyDiscountSchema>;

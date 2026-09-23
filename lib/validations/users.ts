import { z } from "zod";

// ============================================================
// USER ROLE
// ============================================================

export const userRoleSchema = z.enum([
  "customer",
  "admin",
  "super_admin",
]);

// ============================================================
// CREATE USER
// ============================================================

export const createUserSchema = z.object({
  clerkId: z
    .string()
    .min(1, "Clerk ID is required"),

  email: z
    .string()
    .email("Please provide a valid email address"),

  firstName: z
    .string()
    .trim()
    .min(1, "First name cannot be empty")
    .max(100, "First name is too long")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name cannot be empty")
    .max(100, "Last name is too long")
    .optional(),

  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional(),

  phone: z
    .string()
    .trim()
    .min(7, "Invalid phone number")
    .max(30, "Phone number is too long")
    .optional(),

  isBanned: z
    .boolean()
    .optional(),

  role: userRoleSchema.optional(),
});

// ============================================================
// UPDATE USER
// ============================================================

export const updateUserSchema =
  createUserSchema.partial();

// ============================================================
// UPDATE MY PROFILE
// ============================================================

export const updateMyProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name cannot be empty")
    .max(100, "First name is too long")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name cannot be empty")
    .max(100, "Last name is too long")
    .optional(),

  phone: z
    .string()
    .trim()
    .min(7, "Invalid phone number")
    .max(30, "Phone number is too long")
    .optional(),
});

// ============================================================
// ADMIN USER UPDATE
// ============================================================

export const updateAdminUserSchema = z.object({
  isBanned: z.boolean().optional(),
  role: userRoleSchema.optional(),
});

// ============================================================
// ADMIN USERS QUERY
// ============================================================

export const adminUsersQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .default(""),

  status: z
    .enum([
      "all",
      "active",
      "banned",
    ])
    .default("all"),

  role: z
    .enum([
      "all",
      "customer",
      "admin",
      "super_admin",
    ])
    .default("all"),

  sort: z
    .enum([
      "newest",
      "oldest",
      "name_asc",
      "name_desc",
    ])
    .default("newest"),
});

// ============================================================
// PARAMS
// ============================================================

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});
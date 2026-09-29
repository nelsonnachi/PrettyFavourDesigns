import type { z } from "zod";

import {
  adminUsersQuerySchema,
  createUserSchema,
  updateAdminUserSchema,
} from "@/lib/validations";

// ============================================================
// QUERY INPUT TYPES
// ============================================================

export type AdminUsersQuery = z.infer<
  typeof adminUsersQuerySchema
>;

// ============================================================
// MUTATION INPUT TYPES
// ============================================================

export type CreateAdminUserInput = z.infer<
  typeof createUserSchema
>;

export type UpdateAdminUserInput = z.infer<
  typeof updateAdminUserSchema
>;

// ============================================================
// USER ROLE
// ============================================================

export type AdminUserRole =
  | "customer"
  | "admin"
  | "super_admin";

// ============================================================
// ADMIN USER
// ============================================================

export type AdminUser = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  phone: string | null;
  isBanned: boolean;
  role: AdminUserRole;
  createdAt: string;
  updatedAt: string;
};

// ============================================================
// ADMIN USERS LIST RESPONSE
// ============================================================

export type AdminUsersResponse = {
  success: boolean;
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

// ============================================================
// USER ADDRESS
// ============================================================

export type AdminUserAddress = {
  id: string;
  [key: string]: unknown;
};

// ============================================================
// USER ORDER
// ============================================================

export type AdminUserOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

// ============================================================
// CART
// ============================================================

export type AdminUserCartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
  };
  variant: {
    id: string;
  };
};

export type AdminUserCart = {
  id: string;
  items: AdminUserCartItem[];
} | null;

// ============================================================
// RATING
// ============================================================

export type AdminUserRating = {
  [key: string]: unknown;
  product?: {
    id: string;
    name: string;
  };
};

// ============================================================
// WISHLIST
// ============================================================

export type AdminUserWishlistItem = {
  [key: string]: unknown;
  product?: {
    id: string;
    name: string;
  };
};

// ============================================================
// SINGLE USER DETAILS
// ============================================================

export type AdminUserDetails = AdminUser & {
  addresses: AdminUserAddress[];
  orders: AdminUserOrder[];
  cart: AdminUserCart;
  ratings: AdminUserRating[];
  wishlistItems: AdminUserWishlistItem[];
  contactMessages: unknown[];
  inventoryMovements: unknown[];
};

// ============================================================
// SINGLE USER RESPONSE
// ============================================================

export type AdminUserResponse = {
  success: boolean;
  data: AdminUserDetails;
};

// ============================================================
// CREATE RESPONSE
// ============================================================

export type CreateAdminUserResponse = {
  success: boolean;
  message: string;
  data: AdminUser;
};

// ============================================================
// UPDATE RESPONSE
// ============================================================

export type UpdateAdminUserResponse = {
  success: boolean;
  message: string;
  data: AdminUser;
};

// ============================================================
// DELETE RESPONSE
// ============================================================

export type DeleteAdminUserResponse = {
  success: boolean;
  message: string;
};
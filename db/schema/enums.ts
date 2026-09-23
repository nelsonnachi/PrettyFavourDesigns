import { pgEnum } from "drizzle-orm/pg-core";

// ============================================================
// USERS
// ============================================================

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "admin",
  "super_admin",
]);

// ============================================================
// PRODUCTS
// ============================================================

export const productStatusEnum = pgEnum(
  "product_status",
  [
    "draft",
    "active",
    "out_of_stock",
    "archived",
  ],
);

// ============================================================
// ORDERS
// ============================================================

export const orderStatusEnum = pgEnum(
  "order_status",
  [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ],
);

// ============================================================
// PAYMENTS
// ============================================================

export const paymentStatusEnum = pgEnum(
  "payment_status",
  [
    "pending",
    "paid",
    "failed",
    "refunded",
    "partially_refunded",
  ],
);

export const paymentMethodEnum = pgEnum(
  "payment_method",
  [
    "paystack",
    "cash_on_delivery",
  ],
);

// ============================================================
// REFUNDS
// ============================================================

export const refundStatusEnum = pgEnum(
  "refund_status",
  [
    "pending",
    "processing",
    "processed",
    "failed",
  ],
);

// ============================================================
// ANNOUNCEMENTS
// ============================================================

export const announcementTypeEnum = pgEnum(
  "announcement_type",
  [
    "general",
    "sale",
    "event",
    "class",
  ],
);
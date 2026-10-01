import {
  pgTable,
  uuid,
  text,
  timestamp,
  decimal,
  integer,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import {
  orderStatusEnum,
  paymentStatusEnum,
  paymentMethodEnum,
} from "./enums";

import { users } from "./users";
import { products, productVariants } from "./products";
import { discounts } from "./discounts"; // NEW

// ============================================================
// ORDERS
// ============================================================

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    orderNumber: text("order_number").notNull().unique(),

    // Stops the same checkout from creating two orders
    checkoutIdempotencyKey: text("checkout_idempotency_key")
      .notNull()
      .unique(),

    // Nullable: the order stays if the user is deleted (also allows guests)
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    status: orderStatusEnum("status").notNull().default("pending"),

    paymentStatus: paymentStatusEnum("payment_status")
      .notNull()
      .default("pending"),

    paymentMethod: paymentMethodEnum("payment_method")
      .notNull()
      .default("paystack"),

    // ---------- Money ----------

    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),

    shippingFee: decimal("shipping_fee", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),

    // The amount taken off by the discount (0 if no discount was used)
    discount: decimal("discount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),

    // total = subtotal - discount + shippingFee
    total: decimal("total", { precision: 12, scale: 2 }).notNull(),

    // ---------- Discount used (NEW) ----------

    // Which discount was used. NULL = no discount.
    discountId: uuid("discount_id").references(() => discounts.id, {
      onDelete: "set null",
    }),

    // A copy of the code, so the order still shows it
    // even if the discount is edited or deleted later.
    discountCode: text("discount_code"),

    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },

  (t) => [
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
    index("orders_payment_status_idx").on(t.paymentStatus),
    index("orders_created_at_idx").on(t.createdAt),

    // Money can never be negative
    check("orders_subtotal_check", sql`${t.subtotal} >= 0`),
    check("orders_shipping_fee_check", sql`${t.shippingFee} >= 0`),
    check("orders_discount_check", sql`${t.discount} >= 0`),
    check("orders_total_check", sql`${t.total} >= 0`),
  ],
);

// ============================================================
// ORDER ITEMS
// ============================================================

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    // Nullable: the order item stays if the product is deleted
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),

    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),

    // Copies of product info at the time of purchase
    productName: text("product_name").notNull(),
    productSku: text("product_sku").notNull(),
    variantSku: text("variant_sku"),
    colorName: text("color_name"),
    productImageUrl: text("product_image_url"),

    quantity: integer("quantity").notNull(),

    unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),

    totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },

  (t) => [
    index("order_items_order_idx").on(t.orderId),
    index("order_items_product_idx").on(t.productId),
    index("order_items_variant_idx").on(t.variantId),

    check("order_items_quantity_check", sql`${t.quantity} > 0`),
    check("order_items_unit_price_check", sql`${t.unitPrice} >= 0`),
    check("order_items_total_price_check", sql`${t.totalPrice} >= 0`),
  ],
);
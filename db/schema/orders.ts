import {
  pgTable,
  uuid,
  text,
  timestamp,
  decimal,
  integer,
  index,
} from "drizzle-orm/pg-core";

import { orderStatusEnum, paymentStatusEnum, paymentMethodEnum } from "./enums";

import { users } from "./users";
import { products, productVariants } from "./products";

// ============================================================
// ORDERS
// ============================================================

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // ========================================================
    // ORDER NUMBER
    // ========================================================

    orderNumber: text("order_number").notNull().unique(),

    // ========================================================
    // CUSTOMER
    // ========================================================

    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    // ========================================================
    // ORDER STATUS
    // ========================================================

    status: orderStatusEnum("status").notNull().default("pending"),

    // ========================================================
    // PAYMENT
    // ========================================================

    paymentStatus: paymentStatusEnum("payment_status")
      .notNull()
      .default("pending"),

    paymentMethod: paymentMethodEnum("payment_method")
      .notNull()
      .default("paystack"),

    // ========================================================
    // PRICING
    // ========================================================

    subtotal: decimal("subtotal", {
      precision: 12,
      scale: 2,
    }).notNull(),

    shippingFee: decimal("shipping_fee", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    discount: decimal("discount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    total: decimal("total", {
      precision: 12,
      scale: 2,
    }).notNull(),

    // ========================================================
    // NOTES
    // ========================================================

    notes: text("notes"),

    // ========================================================
    // TIMESTAMPS
    // ========================================================

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    // ========================================================
    // INDEXES
    // ========================================================

    userIdx: index("orders_user_idx").on(table.userId),

    statusIdx: index("orders_status_idx").on(table.status),

    paymentStatusIdx: index("orders_payment_status_idx").on(
      table.paymentStatus
    ),

    createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
  })
);

// ============================================================
// ORDER ITEMS
// ============================================================

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // ========================================================
    // ORDER
    // ========================================================

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    // ========================================================
    // PRODUCT
    // ========================================================

    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),

    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),

    // ========================================================
    // PRODUCT SNAPSHOTS
    // ========================================================

    productName: text("product_name").notNull(),

    productSku: text("product_sku").notNull(),

    variantSku: text("variant_sku"),

    colorName: text("color_name"),

    productImageUrl: text("product_image_url"),

    // ========================================================
    // QUANTITY
    // ========================================================

    quantity: integer("quantity").notNull(),

    // ========================================================
    // PRICE SNAPSHOTS
    // ========================================================

    unitPrice: decimal("unit_price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    totalPrice: decimal("total_price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    // ========================================================
    // TIMESTAMP
    // ========================================================

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    // ========================================================
    // INDEXES
    // ========================================================

    orderIdx: index("order_items_order_idx").on(table.orderId),

    productIdx: index("order_items_product_idx").on(table.productId),

    variantIdx: index("order_items_variant_idx").on(table.variantId),
  })
);

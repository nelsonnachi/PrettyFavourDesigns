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

// ============================================================
// ORDERS
// ============================================================

export const orders = pgTable(
  "orders",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    orderNumber: text("order_number")
      .notNull()
      .unique(),

    checkoutIdempotencyKey: text(
      "checkout_idempotency_key",
    )
      .notNull()
      .unique(),

    userId: uuid("user_id").references(
      () => users.id,
      {
        onDelete: "set null",
      },
    ),

    status: orderStatusEnum("status")
      .notNull()
      .default("pending"),

    paymentStatus: paymentStatusEnum(
      "payment_status",
    )
      .notNull()
      .default("pending"),

    paymentMethod: paymentMethodEnum(
      "payment_method",
    )
      .notNull()
      .default("paystack"),

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

    notes: text("notes"),

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
    userIdx: index("orders_user_idx").on(
      table.userId,
    ),

    statusIdx: index("orders_status_idx").on(
      table.status,
    ),

    paymentStatusIdx: index(
      "orders_payment_status_idx",
    ).on(table.paymentStatus),

    createdAtIdx: index(
      "orders_created_at_idx",
    ).on(table.createdAt),

    subtotalPositiveCheck: check(
      "orders_subtotal_positive_check",
      sql`${table.subtotal} >= 0`,
    ),

    shippingFeePositiveCheck: check(
      "orders_shipping_fee_positive_check",
      sql`${table.shippingFee} >= 0`,
    ),

    discountPositiveCheck: check(
      "orders_discount_positive_check",
      sql`${table.discount} >= 0`,
    ),

    totalPositiveCheck: check(
      "orders_total_positive_check",
      sql`${table.total} >= 0`,
    ),
  }),
);

// ============================================================
// ORDER ITEMS
// ============================================================

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    productId: uuid("product_id").references(
      () => products.id,
      {
        onDelete: "set null",
      },
    ),

    variantId: uuid("variant_id").references(
      () => productVariants.id,
      {
        onDelete: "set null",
      },
    ),

    productName: text("product_name")
      .notNull(),

    productSku: text("product_sku")
      .notNull(),

    variantSku: text("variant_sku"),

    colorName: text("color_name"),

    productImageUrl: text("product_image_url"),

    quantity: integer("quantity")
      .notNull(),

    unitPrice: decimal("unit_price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    totalPrice: decimal("total_price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    orderIdx: index(
      "order_items_order_idx",
    ).on(table.orderId),

    productIdx: index(
      "order_items_product_idx",
    ).on(table.productId),

    variantIdx: index(
      "order_items_variant_idx",
    ).on(table.variantId),

    quantityPositiveCheck: check(
      "order_items_quantity_positive_check",
      sql`${table.quantity} > 0`,
    ),

    unitPricePositiveCheck: check(
      "order_items_unit_price_positive_check",
      sql`${table.unitPrice} >= 0`,
    ),

    totalPricePositiveCheck: check(
      "order_items_total_price_positive_check",
      sql`${table.totalPrice} >= 0`,
    ),
  }),
);
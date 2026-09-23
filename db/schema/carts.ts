import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import {
  products,
  productVariants,
} from "./products";

// ============================================================
// CARTS
// ============================================================

export const carts = pgTable(
  "carts",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    userId: uuid("user_id").references(
      () => users.id,
      {
        onDelete: "cascade",
      },
    ),

    // Used for guest carts.
    sessionId: text("session_id"),

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
    userIdx: index(
      "carts_user_idx",
    ).on(table.userId),

    sessionIdx: index(
      "carts_session_idx",
    ).on(table.sessionId),

    userUnique: uniqueIndex(
      "carts_user_unique",
    ).on(table.userId),

    sessionUnique: uniqueIndex(
      "carts_session_unique",
    ).on(table.sessionId),
  }),
);

// ============================================================
// CART ITEMS
// ============================================================

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, {
        onDelete: "cascade",
      }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "restrict",
      }),

    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, {
        onDelete: "restrict",
      }),

    quantity: integer("quantity")
      .notNull()
      .default(1),

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
    cartVariantUnique: uniqueIndex(
      "cart_variant_unique",
    ).on(
      table.cartId,
      table.variantId,
    ),

    cartIdx: index(
      "cart_items_cart_idx",
    ).on(table.cartId),

    productIdx: index(
      "cart_items_product_idx",
    ).on(table.productId),

    variantIdx: index(
      "cart_items_variant_idx",
    ).on(table.variantId),
  }),
);
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
import { products, productVariants } from "./products";

// ============================================================
// CARTS
// ============================================================

export const carts = pgTable(
  "carts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Set for logged-in users. NULL for guest carts.
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),

    // Set for guest carts (comes from the cookie). NULL for user carts.
    sessionId: text("session_id"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },

  (t) => [
    // One cart per user, and one cart per guest session.
    // A unique index also speeds up lookups, so no separate
    // index is needed. Many NULL values are allowed, so
    // guest carts (userId = NULL) don't clash with each other.
    uniqueIndex("carts_user_unique").on(t.userId),
    uniqueIndex("carts_session_unique").on(t.sessionId),
  ]
);

// ============================================================
// CART ITEMS
// ============================================================

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),

    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict" }),

    quantity: integer("quantity").notNull().default(1),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },

  (t) => [
    // The same variant can only appear once per cart.
    // This also speeds up "all items in this cart" lookups,
    // because cartId is the first column, so no separate
    // cartId index is needed.
    uniqueIndex("cart_variant_unique").on(t.cartId, t.variantId),

    // Speeds up checks like "is this product/variant in any cart?"
    index("cart_items_product_idx").on(t.productId),
    index("cart_items_variant_idx").on(t.variantId),
  ]
);

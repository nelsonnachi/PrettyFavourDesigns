import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { products } from "./products";

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    userProductUnique: uniqueIndex(
      "wishlist_user_product_unique",
    ).on(
      table.userId,
      table.productId,
    ),

    userIdx: index(
      "wishlist_user_idx",
    ).on(table.userId),

    productIdx: index(
      "wishlist_product_idx",
    ).on(table.productId),
  }),
);
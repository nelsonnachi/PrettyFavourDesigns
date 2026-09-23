import {
  pgTable,
  uuid,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { products } from "./products";

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    rating: integer("rating")
      .notNull(),

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
    // A user can only rate the same product once.
    userProductUnique: uniqueIndex(
      "ratings_user_product_unique",
    ).on(
      table.userId,
      table.productId,
    ),

    // Useful when fetching all ratings
    // belonging to a product.
    productIdx: index(
      "ratings_product_idx",
    ).on(table.productId),

    // Useful when fetching ratings
    // belonging to a user.
    userIdx: index(
      "ratings_user_idx",
    ).on(table.userId),
  }),
);
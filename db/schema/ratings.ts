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
    userProductUnique: uniqueIndex(
      "ratings_user_product_unique",
    ).on(
      table.userId,
      table.productId,
    ),

    productIdx: index(
      "ratings_product_idx",
    ).on(table.productId),

    userIdx: index(
      "ratings_user_idx",
    ).on(table.userId),
  }),
);

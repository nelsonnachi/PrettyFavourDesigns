import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { productVariants } from "./products";
import { orders } from "./orders";

export const inventoryMovements =
  pgTable(
    "inventory_movements",
    {
      id: uuid("id")
        .primaryKey()
        .defaultRandom(),

      variantId: uuid("variant_id")
        .notNull()
        .references(
          () => productVariants.id,
          {
            onDelete: "cascade",
          },
        ),

      userId: uuid("user_id").references(
        () => users.id,
        {
          onDelete: "set null",
        },
      ),

      orderId: uuid("order_id").references(
        () => orders.id,
        {
          onDelete: "set null",
        },
      ),

      quantityChange: integer(
        "quantity_change",
      ).notNull(),

      reason: text("reason")
        .notNull(),

      createdAt: timestamp(
        "created_at",
        {
          withTimezone: true,
        },
      )
        .notNull()
        .defaultNow(),
    },

    (table) => ({
      variantIdx: index(
        "inventory_movements_variant_idx",
      ).on(table.variantId),

      userIdx: index(
        "inventory_movements_user_idx",
      ).on(table.userId),

      orderIdx: index(
        "inventory_movements_order_idx",
      ).on(table.orderId),

      createdAtIdx: index(
        "inventory_movements_created_at_idx",
      ).on(table.createdAt),
    }),
  );
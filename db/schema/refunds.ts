import {
  pgTable,
  uuid,
  text,
  decimal,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { refundStatusEnum } from "./enums";

import { orders } from "./orders";
import { payments } from "./payments";

export const refunds = pgTable(
  "refunds",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    paymentId: uuid("payment_id")
      .notNull()
      .references(() => payments.id, {
        onDelete: "cascade",
      }),

    amount: decimal("amount", {
      precision: 12,
      scale: 2,
    }).notNull(),

    reason: text("reason"),

    status: refundStatusEnum("status")
      .notNull()
      .default("pending"),

    reference: text("reference")
      .unique(),

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
    orderIdx: index(
      "refunds_order_idx",
    ).on(table.orderId),

    paymentIdx: index(
      "refunds_payment_idx",
    ).on(table.paymentId),
  }),
);

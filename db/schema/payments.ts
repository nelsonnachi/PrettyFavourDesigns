import {
  pgTable,
  uuid,
  text,
  decimal,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { paymentStatusEnum } from "./enums";

import { orders } from "./orders";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    provider: text("provider")
      .notNull()
      .default("paystack"),

    reference: text("reference")
      .notNull()
      .unique(),

    amount: decimal("amount", {
      precision: 12,
      scale: 2,
    }).notNull(),

    currency: text("currency")
      .notNull()
      .default("NGN"),

    status: paymentStatusEnum("status")
      .notNull()
      .default("pending"),

    gatewayResponse: text(
      "gateway_response",
    ),

    paidAt: timestamp("paid_at", {
      withTimezone: true,
    }),

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
      "payments_order_idx",
    ).on(table.orderId),

    statusIdx: index(
      "payments_status_idx",
    ).on(table.status),

    createdAtIdx: index(
      "payments_created_at_idx",
    ).on(table.createdAt),
  }),
);
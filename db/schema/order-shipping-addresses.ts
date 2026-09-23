import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

import { orders } from "./orders";

// ============================================================
// ORDER SHIPPING ADDRESSES
// ============================================================
//
// This is a permanent snapshot of the shipping address used
// for a specific order.
//
// It is separate from the customer's saved addresses.
//
// If the customer later edits or deletes their saved address,
// the address on the old order remains unchanged.
//
// ============================================================

export const orderShippingAddresses = pgTable("order_shipping_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),

  // ========================================================
  // ORDER
  // ========================================================

  // One order can have only one shipping address snapshot.
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    })
    .unique(),

  // ========================================================
  // CUSTOMER INFORMATION SNAPSHOT
  // ========================================================

  firstName: text("first_name").notNull(),

  lastName: text("last_name").notNull(),

  phone: text("phone").notNull(),

  // ========================================================
  // ADDRESS SNAPSHOT
  // ========================================================

  addressLine1: text("address_line_1").notNull(),

  addressLine2: text("address_line_2"),

  city: text("city").notNull(),

  state: text("state").notNull(),

  country: text("country").notNull().default("Nigeria"),

  postalCode: text("postal_code"),

  // ========================================================
  // TIMESTAMP
  // ========================================================

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

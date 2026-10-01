import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  decimal,
  index,
  primaryKey,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import {
  discountTypeEnum,
  discountAppliesToEnum,
  discountEligibilityEnum,
} from "./enums";
import { categories } from "./categories";
import { products } from "./products";
import { users } from "./users";
import { orders } from "./orders";

// ------------------------------------------------------------
// DISCOUNTS
// ------------------------------------------------------------

export const discounts = pgTable(
  "discounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull(),
    description: text("description"),

    // Store uppercase, e.g. "BLACKFRIDAY" (normalise in your code)
    code: text("code").notNull().unique(),

    // "percentage" or "fixed"
    type: discountTypeEnum("type").notNull(),

    // percentage: 20 = 20%   |   fixed: 5000.00 = ₦5,000
    value: decimal("value", { precision: 12, scale: 2 }).notNull(),

    // "order", "products" or "categories"
    appliesTo: discountAppliesToEnum("applies_to").notNull().default("order"),

    // "all" or "specific_customers"
    eligibility: discountEligibilityEnum("eligibility")
      .notNull()
      .default("all"),

    // Conditions (NULL = no condition)
    minimumPurchaseAmount: decimal("minimum_purchase_amount", {
      precision: 12,
      scale: 2,
    }),
    maximumDiscountAmount: decimal("maximum_discount_amount", {
      precision: 12,
      scale: 2,
    }),
    minimumQuantity: integer("minimum_quantity"),

    // Usage limits (NULL = unlimited)
    usageLimit: integer("usage_limit"),
    usageLimitPerCustomer: integer("usage_limit_per_customer"),
    usageCount: integer("usage_count").notNull().default(0),

    isActive: boolean("is_active").notNull().default(true),

    startsAt: timestamp("starts_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    endsAt: timestamp("ends_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("discounts_value_check", sql`${t.value} > 0`),
    check(
      "discounts_percentage_check",
      sql`${t.type} <> 'percentage' OR ${t.value} <= 100`,
    ),
    check(
      "discounts_dates_check",
      sql`${t.endsAt} IS NULL OR ${t.endsAt} > ${t.startsAt}`,
    ),
  ],
);

// ------------------------------------------------------------
// DISCOUNT CATEGORIES (which categories a discount applies to)
// ------------------------------------------------------------

export const discountCategories = pgTable(
  "discount_categories",
  {
    discountId: uuid("discount_id")
      .notNull()
      .references(() => discounts.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.discountId, t.categoryId] })],
);

// ------------------------------------------------------------
// DISCOUNT PRODUCTS (which products a discount applies to)
// ------------------------------------------------------------

export const discountProducts = pgTable(
  "discount_products",
  {
    discountId: uuid("discount_id")
      .notNull()
      .references(() => discounts.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.discountId, t.productId] })],
);

// ------------------------------------------------------------
// DISCOUNT CUSTOMERS (only used when eligibility = "specific_customers")
// ------------------------------------------------------------

export const discountCustomers = pgTable(
  "discount_customers",
  {
    discountId: uuid("discount_id")
      .notNull()
      .references(() => discounts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.discountId, t.userId] })],
);

// ------------------------------------------------------------
// DISCOUNT USAGES (one row per order that used a discount)
// ------------------------------------------------------------

export const discountUsages = pgTable(
  "discount_usages",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    discountId: uuid("discount_id")
      .notNull()
      .references(() => discounts.id, { onDelete: "cascade" }),

    // Nullable so guest checkout can be supported later
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    // .unique() = an order can only use one discount
    orderId: uuid("order_id")
      .notNull()
      .unique()
      .references(() => orders.id, { onDelete: "cascade" }),

    discountAmount: decimal("discount_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),

    usedAt: timestamp("used_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // Speeds up "how many times has this user used this discount?"
    index("discount_usages_discount_user_idx").on(t.discountId, t.userId),
  ],
);
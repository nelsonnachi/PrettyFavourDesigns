import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  decimal,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { productStatusEnum } from "./enums";

import { categories } from "./categories";
import { colors } from "./colors";

// ============================================================
// PRODUCTS
// ============================================================

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // ========================================================
    // BASIC INFORMATION
    // ========================================================

    name: text("name").notNull(),

    slug: text("slug").notNull().unique(),

    sku: text("sku").notNull().unique(),

    description: text("description").notNull(),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "restrict",
      }),

    // ========================================================
    // PRICING
    // ========================================================

    price: decimal("price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    compareAtPrice: decimal("compare_at_price", {
      precision: 12,
      scale: 2,
    }),

    costPrice: decimal("cost_price", {
      precision: 12,
      scale: 2,
    }),

    // ========================================================
    // PRODUCT STATUS
    // ========================================================

    status: productStatusEnum("status").notNull().default("draft"),

    // ========================================================
    // PRODUCT LABELS
    // ========================================================

    isFeatured: boolean("is_featured").notNull().default(false),

    isNewArrival: boolean("is_new_arrival").notNull().default(false),

    isBestSeller: boolean("is_best_seller").notNull().default(false),

    // ========================================================
    // RATINGS
    // ========================================================

    averageRating: decimal("average_rating", {
      precision: 3,
      scale: 2,
    })
      .notNull()
      .default("0"),

    ratingCount: integer("rating_count").notNull().default(0),

    // ========================================================
    // SALES
    // ========================================================

    soldCount: integer("sold_count").notNull().default(0),

    // ========================================================
    // SEO
    // ========================================================

    metaTitle: text("meta_title"),

    metaDescription: text("meta_description"),

    // ========================================================
    // TIMESTAMPS
    // ========================================================

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

    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
    }),
  },

  (table) => ({
    categoryIdx: index("products_category_idx").on(table.categoryId),

    statusIdx: index("products_status_idx").on(table.status),

    priceIdx: index("products_price_idx").on(table.price),

    featuredIdx: index("products_featured_idx").on(table.isFeatured),

    newArrivalIdx: index("products_new_arrival_idx").on(table.isNewArrival),

    bestSellerIdx: index("products_best_seller_idx").on(table.isBestSeller),

    createdAtIdx: index("products_created_at_idx").on(table.createdAt),
  })
);

// ============================================================
// PRODUCT VARIANTS
// ============================================================
//
// A variant represents ONE COLOR.
//
// Example:
//
// Classic Tote Bag
//
// Brown -> stock 10
// Black -> stock 5
// Green -> stock 0
//
// IMPORTANT:
//
// - No variant price
// - No variant image
// - No variant attributes
//
// The product price is used for every color.
// Stock belongs to each color.
//
// ============================================================

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    colorId: uuid("color_id")
      .notNull()
      .references(() => colors.id, {
        onDelete: "restrict",
      }),

    // ========================================================
    // SKU
    // ========================================================

    sku: text("sku").notNull().unique(),

    // ========================================================
    // STOCK
    // ========================================================

    stock: integer("stock").notNull().default(0),

    // ========================================================
    // RESERVED STOCK
    // ========================================================

    reservedStock: integer("reserved_stock").notNull().default(0),

    // ========================================================
    // TIMESTAMPS
    // ========================================================

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
    // A color can only appear once on a product.
    productColorUnique: uniqueIndex("product_variant_product_color_unique").on(
      table.productId,
      table.colorId
    ),

    productIdx: index("product_variants_product_idx").on(table.productId),

    colorIdx: index("product_variants_color_idx").on(table.colorId),

    stockIdx: index("product_variants_stock_idx").on(table.stock),
  })
);

// ============================================================
// PRODUCT IMAGES
// ============================================================
//
// Images belong to the PRODUCT.
//
// They do NOT belong to a color.
//
// Therefore every color uses the same product gallery.
//
// ============================================================

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    url: text("url").notNull(),

    publicId: text("public_id").notNull(),

    position: integer("position").notNull().default(0),

    isPrimary: boolean("is_primary").notNull().default(false),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => ({
    productIdx: index("product_images_product_idx").on(table.productId),

    positionIdx: index("product_images_position_idx").on(table.position),
  })
);

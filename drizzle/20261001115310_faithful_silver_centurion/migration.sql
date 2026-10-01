CREATE TYPE "discount_applies_to" AS ENUM('order', 'products', 'categories');--> statement-breakpoint
CREATE TYPE "discount_eligibility" AS ENUM('all', 'specific_customers');--> statement-breakpoint
CREATE TYPE "discount_type" AS ENUM('percentage', 'fixed');--> statement-breakpoint
CREATE TABLE "discount_categories" (
	"discount_id" uuid,
	"category_id" uuid,
	CONSTRAINT "discount_categories_pkey" PRIMARY KEY("discount_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "discount_customers" (
	"discount_id" uuid,
	"user_id" uuid,
	CONSTRAINT "discount_customers_pkey" PRIMARY KEY("discount_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "discount_products" (
	"discount_id" uuid,
	"product_id" uuid,
	CONSTRAINT "discount_products_pkey" PRIMARY KEY("discount_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "discount_usages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"discount_id" uuid NOT NULL,
	"user_id" uuid,
	"order_id" uuid NOT NULL UNIQUE,
	"discount_amount" numeric(12,2) NOT NULL,
	"used_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"description" text,
	"code" text NOT NULL UNIQUE,
	"type" "discount_type" NOT NULL,
	"value" numeric(12,2) NOT NULL,
	"applies_to" "discount_applies_to" DEFAULT 'order'::"discount_applies_to" NOT NULL,
	"eligibility" "discount_eligibility" DEFAULT 'all'::"discount_eligibility" NOT NULL,
	"minimum_purchase_amount" numeric(12,2),
	"maximum_discount_amount" numeric(12,2),
	"minimum_quantity" integer,
	"usage_limit" integer,
	"usage_limit_per_customer" integer,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"starts_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "discounts_value_check" CHECK ("value" > 0),
	CONSTRAINT "discounts_percentage_check" CHECK ("type" <> 'percentage' OR "value" <= 100),
	CONSTRAINT "discounts_dates_check" CHECK ("ends_at" IS NULL OR "ends_at" > "starts_at")
);
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_quantity_positive_check";--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_unit_price_positive_check";--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_total_price_positive_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_subtotal_positive_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_shipping_fee_positive_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_discount_positive_check";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_total_positive_check";--> statement-breakpoint
DROP INDEX "cart_items_cart_idx";--> statement-breakpoint
DROP INDEX "carts_user_idx";--> statement-breakpoint
DROP INDEX "carts_session_idx";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount_code" text;--> statement-breakpoint
CREATE INDEX "discount_usages_discount_user_idx" ON "discount_usages" ("discount_id","user_id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_id_discounts_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "discount_categories" ADD CONSTRAINT "discount_categories_discount_id_discounts_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "discount_categories" ADD CONSTRAINT "discount_categories_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "discount_customers" ADD CONSTRAINT "discount_customers_discount_id_discounts_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "discount_customers" ADD CONSTRAINT "discount_customers_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "discount_products" ADD CONSTRAINT "discount_products_discount_id_discounts_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "discount_products" ADD CONSTRAINT "discount_products_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "discount_usages" ADD CONSTRAINT "discount_usages_discount_id_discounts_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "discount_usages" ADD CONSTRAINT "discount_usages_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "discount_usages" ADD CONSTRAINT "discount_usages_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_check" CHECK ("quantity" > 0);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_unit_price_check" CHECK ("unit_price" >= 0);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_total_price_check" CHECK ("total_price" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_subtotal_check" CHECK ("subtotal" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_fee_check" CHECK ("shipping_fee" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_check" CHECK ("discount" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_check" CHECK ("total" >= 0);
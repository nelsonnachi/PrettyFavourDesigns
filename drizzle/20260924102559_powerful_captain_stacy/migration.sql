ALTER TABLE "orders" ADD COLUMN "checkout_idempotency_key" text;--> statement-breakpoint

UPDATE "orders"
SET "checkout_idempotency_key" = 'legacy-' || "id"::text
WHERE "checkout_idempotency_key" IS NULL;--> statement-breakpoint

ALTER TABLE "orders" ALTER COLUMN "checkout_idempotency_key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_checkout_idempotency_key_key" UNIQUE("checkout_idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_order_unique_idx" ON "payments" ("order_id");--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_positive_check" CHECK ("quantity" > 0);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_unit_price_positive_check" CHECK ("unit_price" >= 0);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_total_price_positive_check" CHECK ("total_price" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_subtotal_positive_check" CHECK ("subtotal" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_fee_positive_check" CHECK ("shipping_fee" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_positive_check" CHECK ("discount" >= 0);--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_positive_check" CHECK ("total" >= 0);
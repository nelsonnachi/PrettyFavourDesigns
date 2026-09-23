// lib/APIs/payments/complete-payment.ts

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { payments, orders, orderItems, productVariants } from "@/db/schema";

import { ApiError } from "@/lib/APIs/api-errors";

// ============================================================
// TYPES
// ============================================================

type CompletePaymentInput = {
  reference: string;

  gatewayResponse?: string | null;

  paidAt?: Date | null;
};

// ============================================================
// COMPLETE SUCCESSFUL PAYMENT
// ============================================================

export async function completeSuccessfulPayment({
  reference,
  gatewayResponse = null,
  paidAt = null,
}: CompletePaymentInput) {
  return await db.transaction(async (tx) => {
    // ========================================================
    // 1. FIND AND LOCK PAYMENT
    // ========================================================
    //
    // The row is locked for the duration of this transaction.
    //
    // This is important because Paystack can potentially send
    // a webhook while the customer is also verifying payment.
    //
    // Only one request should be allowed to complete the payment.
    //
    // ========================================================

    const paymentResult = await tx
      .select()
      .from(payments)
      .where(eq(payments.reference, reference))
      .for("update")
      .limit(1);

    const payment = paymentResult[0];

    if (!payment) {
      throw new ApiError("Payment not found", 404);
    }

    // ========================================================
    // 2. IDEMPOTENCY CHECK
    // ========================================================
    //
    // If the payment has already been completed, do not touch
    // inventory again.
    //
    // This protects us from:
    //
    // - duplicate webhook events
    // - verification being called multiple times
    // - webhook + verification arriving together
    //
    // ========================================================

    if (payment.status === "paid") {
      const existingOrderResult = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, payment.orderId))
        .limit(1);

      const existingOrder = existingOrderResult[0];

      if (!existingOrder) {
        throw new ApiError(
          "Order associated with this payment was not found",
          404
        );
      }

      return {
        payment,
        order: existingOrder,
        alreadyCompleted: true,
      };
    }

    // ========================================================
    // 3. PAYMENT MUST NOT ALREADY BE REFUNDED
    // ========================================================

    if (
      payment.status === "refunded" ||
      payment.status === "partially_refunded"
    ) {
      throw new ApiError("This payment has already been refunded", 400);
    }

    // ========================================================
    // 4. FIND ORDER
    // ========================================================

    const orderResult = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, payment.orderId))
      .limit(1);

    const order = orderResult[0];

    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    // ========================================================
    // 5. MAKE SURE ORDER IS NOT CANCELLED
    // ========================================================

    if (order.status === "cancelled") {
      throw new ApiError("This order has already been cancelled", 400);
    }

    // ========================================================
    // 6. GET ORDER ITEMS
    // ========================================================

    const items = await tx
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    if (items.length === 0) {
      throw new ApiError("Order has no items", 400);
    }

    // ========================================================
    // 7. PROCESS INVENTORY
    // ========================================================
    //
    // SHOPPFD inventory model:
    //
    // Product
    //   ├── Brown variant
    //   ├── Black variant
    //   └── Green variant
    //
    // Every order item must point to a variant.
    //
    // At checkout:
    //
    // reservedStock increases.
    //
    // After successful payment:
    //
    // stock decreases
    // reservedStock decreases
    //
    // ========================================================

    for (const item of items) {
      // ======================================================
      // 7A. VARIANT MUST EXIST ON ORDER ITEM
      // ======================================================

      if (!item.variantId) {
        throw new ApiError(
          `No product variant was specified for "${item.productName}"`,
          400
        );
      }

      // ======================================================
      // 7B. ATOMIC INVENTORY UPDATE
      // ======================================================
      //
      // We update stock and reservedStock only if BOTH are
      // sufficient.
      //
      // This is safer than:
      //
      // SELECT
      // then
      // UPDATE
      //
      // because another request cannot sneak in between those
      // operations.
      //
      // ======================================================

      const updatedVariantResult = await tx
        .update(productVariants)
        .set({
          stock: sql`${productVariants.stock} - ${item.quantity}`,

          reservedStock: sql`${productVariants.reservedStock} - ${item.quantity}`,

          updatedAt: new Date(),
        })
        .where(
          and(
            eq(productVariants.id, item.variantId),

            sql`${productVariants.stock} >= ${item.quantity}`,

            sql`${productVariants.reservedStock} >= ${item.quantity}`
          )
        )
        .returning();

      // ======================================================
      // 7C. INVENTORY UPDATE FAILED
      // ======================================================

      if (updatedVariantResult.length === 0) {
        throw new ApiError(
          `Insufficient reserved stock for "${item.productName}"`,
          409
        );
      }
    }

    // ========================================================
    // 8. UPDATE PAYMENT
    // ========================================================

    const paymentUpdateResult = await tx
      .update(payments)
      .set({
        status: "paid",

        gatewayResponse,

        paidAt: paidAt ?? new Date(),

        updatedAt: new Date(),
      })
      .where(eq(payments.id, payment.id))
      .returning();

    const updatedPayment = paymentUpdateResult[0];

    if (!updatedPayment) {
      throw new ApiError("Failed to update payment", 500);
    }

    // ========================================================
    // 9. UPDATE ORDER
    // ========================================================

    const orderUpdateResult = await tx
      .update(orders)
      .set({
        paymentStatus: "paid",

        status: "processing",

        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning();

    const updatedOrder = orderUpdateResult[0];

    if (!updatedOrder) {
      throw new ApiError("Failed to update order", 500);
    }

    // ========================================================
    // 10. RETURN RESULT
    // ========================================================

    return {
      payment: updatedPayment,

      order: updatedOrder,

      alreadyCompleted: false,
    };
  });
}

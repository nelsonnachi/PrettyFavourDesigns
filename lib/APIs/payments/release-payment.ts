// lib/APIs/payments/release-payment.ts

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";

import {
  payments,
  orders,
  orderItems,
  productVariants,
} from "@/db/schema";

import { ApiError } from "@/lib/APIs/api-errors";

// ============================================================
// TYPES
// ============================================================

type ReleaseFailedPaymentReservationInput = {
  reference: string;

  gatewayResponse?: string | null;
};

// ============================================================
// RELEASE RESERVED STOCK FOR FAILED PAYMENT
// ============================================================

export async function releaseFailedPaymentReservation({
  reference,
  gatewayResponse = null,
}: ReleaseFailedPaymentReservationInput) {
  return await db.transaction(async (tx) => {
    // ========================================================
    // 1. FIND AND LOCK PAYMENT
    // ========================================================
    //
    // Locking the payment prevents the verification route
    // and webhook from trying to release the same payment
    // at the same time.
    //
    // ========================================================

    const paymentResult = await tx
      .select()
      .from(payments)
      .where(eq(payments.reference, reference))
      .for("update")
      .limit(1);

    const payment = paymentResult[0];

    // ========================================================
    // 2. MAKE SURE PAYMENT EXISTS
    // ========================================================

    if (!payment) {
      throw new ApiError("Payment not found", 404);
    }

    // ========================================================
    // 3. IDEMPOTENCY
    // ========================================================
    //
    // If the payment has already been marked as failed,
    // the reservation should already have been released.
    //
    // Do not release it again.
    //
    // ========================================================

    if (payment.status === "failed") {
      const existingOrderResult = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, payment.orderId))
        .limit(1);

      const existingOrder = existingOrderResult[0];

      if (!existingOrder) {
        throw new ApiError(
          "Order associated with this payment was not found",
          404,
        );
      }

      return {
        payment,
        order: existingOrder,
        alreadyReleased: true,
      };
    }

    // ========================================================
    // 4. DO NOT RELEASE A SUCCESSFUL PAYMENT
    // ========================================================
    //
    // Once a payment has been successfully completed,
    // its reserved stock has already been converted into
    // a completed sale.
    //
    // Never give that stock back here.
    //
    // ========================================================

    if (payment.status === "paid") {
      throw new ApiError(
        "Cannot release reservation for a successful payment",
        400,
      );
    }

    // ========================================================
    // 5. FIND ORDER
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
    // 7. RELEASE RESERVED STOCK
    // ========================================================
    //
    // Example:
    //
    // Before:
    //
    // stock = 10
    // reservedStock = 2
    //
    // Payment fails.
    //
    // After:
    //
    // stock = 10
    // reservedStock = 0
    //
    // We DO NOT increase stock because the physical stock
    // was never removed.
    //
    // We only release the reservation.
    //
    // ========================================================

    for (const item of items) {
      // ======================================================
      // 7A. ORDER ITEM MUST HAVE A VARIANT
      // ======================================================

      if (!item.variantId) {
        throw new ApiError(
          `No product variant was specified for "${item.productName}"`,
          400,
        );
      }

      // ======================================================
      // 7B. RELEASE RESERVED STOCK ATOMICALLY
      // ======================================================
      //
      // We only perform the update if reservedStock is
      // greater than or equal to the quantity being released.
      //
      // This prevents reservedStock from becoming negative.
      //
      // ======================================================

      const updatedVariantResult = await tx
        .update(productVariants)
        .set({
          reservedStock: sql`
            ${productVariants.reservedStock} - ${item.quantity}
          `,

          updatedAt: new Date(),
        })
        .where(
          and(
            eq(productVariants.id, item.variantId),

            sql`
              ${productVariants.reservedStock}
              >= ${item.quantity}
            `,
          ),
        )
        .returning();

      // ======================================================
      // 7C. MAKE SURE RELEASE WORKED
      // ======================================================

      if (updatedVariantResult.length === 0) {
        throw new ApiError(
          `Unable to release reserved stock for "${item.productName}"`,
          409,
        );
      }
    }

    // ========================================================
    // 8. UPDATE PAYMENT
    // ========================================================

    const paymentUpdateResult = await tx
      .update(payments)
      .set({
        status: "failed",

        gatewayResponse,

        updatedAt: new Date(),
      })
      .where(eq(payments.id, payment.id))
      .returning();

    const updatedPayment = paymentUpdateResult[0];

    if (!updatedPayment) {
      throw new ApiError(
        "Failed to update payment",
        500,
      );
    }

    // ========================================================
    // 9. UPDATE ORDER
    // ========================================================
    //
    // The payment failed, so the order should no longer remain
    // pending.
    //
    // We use "cancelled" because your current order statuses
    // already include "cancelled".
    //
    // ========================================================

    const orderUpdateResult = await tx
      .update(orders)
      .set({
        paymentStatus: "failed",

        status: "cancelled",

        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning();

    const updatedOrder = orderUpdateResult[0];

    if (!updatedOrder) {
      throw new ApiError(
        "Failed to update order",
        500,
      );
    }

    // ========================================================
    // 10. RETURN RESULT
    // ========================================================

    return {
      payment: updatedPayment,

      order: updatedOrder,

      alreadyReleased: false,
    };
  });
}
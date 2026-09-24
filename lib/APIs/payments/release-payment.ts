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

    const paymentResult = await tx
      .select()
      .from(payments)
      .where(eq(payments.reference, reference))
      .for("update")
      .limit(1);

    const payment = paymentResult[0];

    if (!payment) {
      throw new ApiError(
        "Payment not found",
        404,
      );
    }

    // ========================================================
    // 2. IDEMPOTENCY
    // ========================================================

    if (payment.status === "failed") {
      const orderResult = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, payment.orderId))
        .limit(1);

      const order = orderResult[0];

      if (!order) {
        throw new ApiError(
          "Order associated with this payment was not found",
          404,
        );
      }

      return {
        payment,
        order,
        alreadyReleased: true,
      };
    }

    // ========================================================
    // 3. ONLY PENDING PAYMENTS CAN BE RELEASED
    // ========================================================

    if (payment.status !== "pending") {
      throw new ApiError(
        `Cannot release reservation for payment with status "${payment.status}"`,
        400,
      );
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
      throw new ApiError(
        "Order not found",
        404,
      );
    }

    // ========================================================
    // 5. GET ORDER ITEMS
    // ========================================================

    const items = await tx
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    if (items.length === 0) {
      throw new ApiError(
        "Order has no items",
        400,
      );
    }

    // ========================================================
    // 6. RELEASE RESERVED STOCK
    // ========================================================

    for (const item of items) {
      if (!item.variantId) {
        throw new ApiError(
          `No product variant was specified for "${item.productName}"`,
          400,
        );
      }

      const updatedVariantResult = await tx
        .update(productVariants)
        .set({
          reservedStock: sql`
            ${productVariants.reservedStock}
            - ${item.quantity}
          `,

          updatedAt: new Date(),
        })
        .where(
          and(
            eq(
              productVariants.id,
              item.variantId,
            ),

            sql`
              ${productVariants.reservedStock}
              >= ${item.quantity}
            `,
          ),
        )
        .returning();

      if (updatedVariantResult.length === 0) {
        throw new ApiError(
          `Unable to release reserved stock for "${item.productName}"`,
          409,
        );
      }
    }

    // ========================================================
    // 7. UPDATE PAYMENT
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

    const updatedPayment =
      paymentUpdateResult[0];

    if (!updatedPayment) {
      throw new ApiError(
        "Failed to update payment",
        500,
      );
    }

    // ========================================================
    // 8. UPDATE ORDER
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

    const updatedOrder =
      orderUpdateResult[0];

    if (!updatedOrder) {
      throw new ApiError(
        "Failed to update order",
        500,
      );
    }

    // ========================================================
    // 9. RETURN
    // ========================================================

    return {
      payment: updatedPayment,
      order: updatedOrder,
      alreadyReleased: false,
    };
  });
}
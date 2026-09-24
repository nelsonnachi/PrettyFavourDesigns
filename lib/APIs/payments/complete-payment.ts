import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";

import {
  payments,
  orders,
  orderItems,
  productVariants,
  inventoryMovements,
} from "@/db/schema";

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

    if (payment.status === "paid") {
      const existingOrderResult = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, payment.orderId))
        .limit(1);

      const existingOrder =
        existingOrderResult[0];

      if (!existingOrder) {
        throw new ApiError(
          "Order associated with this payment was not found",
          404,
        );
      }

      return {
        payment,
        order: existingOrder,
        alreadyCompleted: true,
      };
    }

    // ========================================================
    // 3. DO NOT COMPLETE REFUNDED PAYMENT
    // ========================================================

    if (
      payment.status === "refunded" ||
      payment.status === "partially_refunded"
    ) {
      throw new ApiError(
        "This payment has already been refunded",
        400,
      );
    }

    // ========================================================
    // 4. PAYMENT MUST BE PENDING
    // ========================================================

    if (payment.status !== "pending") {
      throw new ApiError(
        `Cannot complete payment with status "${payment.status}"`,
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
      throw new ApiError(
        "Order not found",
        404,
      );
    }

    // ========================================================
    // 6. ORDER MUST NOT BE CANCELLED
    // ========================================================

    if (order.status === "cancelled") {
      throw new ApiError(
        "This order has already been cancelled",
        400,
      );
    }

    // ========================================================
    // 7. GET ORDER ITEMS
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
    // 8. PROCESS INVENTORY
    // ========================================================

    for (const item of items) {
      if (!item.variantId) {
        throw new ApiError(
          `No product variant was specified for "${item.productName}"`,
          400,
        );
      }

      // ------------------------------------------------------
      // REDUCE STOCK + RELEASE RESERVATION
      // ------------------------------------------------------

      const updatedVariantResult = await tx
        .update(productVariants)
        .set({
          stock: sql`
            ${productVariants.stock}
            - ${item.quantity}
          `,

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
              ${productVariants.stock}
              >= ${item.quantity}
            `,

            sql`
              ${productVariants.reservedStock}
              >= ${item.quantity}
            `,
          ),
        )
        .returning();

      if (updatedVariantResult.length === 0) {
        throw new ApiError(
          `Insufficient reserved stock for "${item.productName}"`,
          409,
        );
      }

      // ------------------------------------------------------
      // INVENTORY MOVEMENT
      // ------------------------------------------------------

      await tx
        .insert(inventoryMovements)
        .values({
          variantId: item.variantId,

          userId: order.userId,

          orderId: order.id,

          quantityChange: -item.quantity,

          reason: "sale",
        });
    }

    // ========================================================
    // 9. UPDATE PAYMENT
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

    const updatedPayment =
      paymentUpdateResult[0];

    if (!updatedPayment) {
      throw new ApiError(
        "Failed to update payment",
        500,
      );
    }

    // ========================================================
    // 10. UPDATE ORDER
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

    const updatedOrder =
      orderUpdateResult[0];

    if (!updatedOrder) {
      throw new ApiError(
        "Failed to update order",
        500,
      );
    }

    // ========================================================
    // 11. RETURN
    // ========================================================

    return {
      payment: updatedPayment,

      order: updatedOrder,

      alreadyCompleted: false,
    };
  });
}
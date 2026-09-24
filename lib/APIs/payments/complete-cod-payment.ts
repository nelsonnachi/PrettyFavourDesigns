import {
  and,
  eq,
  sql,
} from "drizzle-orm";

import { db } from "@/db/drizzle";

import {
  payments,
  orders,
  orderItems,
  productVariants,
} from "@/db/schema";

import {
  inventoryMovements,
} from "@/db/schema/inventory-movements";

import {
  ApiError,
} from "@/lib/APIs/api-errors";

// ============================================================
// COMPLETE COD PAYMENT
// ============================================================

type CompleteCODPaymentInput = {
  orderId: string;
};

// ============================================================
// COMPLETE CASH ON DELIVERY
// ============================================================
//
// This function should be called when:
//
// 1. The order is actually delivered.
// 2. The customer pays the courier.
// 3. The system records the COD payment.
//
// It therefore:
// - consumes stock
// - releases reservation
// - records inventory movement
// - marks payment paid
// - marks order delivered
//
// ============================================================

export async function completeCashOnDeliveryPayment({
  orderId,
}: CompleteCODPaymentInput) {
  return await db.transaction(
    async (tx) => {
      // ======================================================
      // 1. LOCK ORDER
      // ======================================================

      const orderResult =
        await tx
          .select()
          .from(orders)
          .where(
            eq(
              orders.id,
              orderId,
            ),
          )
          .for("update")
          .limit(1);

      const order =
        orderResult[0];

      if (!order) {
        throw new ApiError(
          "Order not found",
          404,
        );
      }

      // ======================================================
      // 2. VERIFY PAYMENT METHOD
      // ======================================================

      if (
        order.paymentMethod !==
        "cash_on_delivery"
      ) {
        throw new ApiError(
          "This order is not a cash-on-delivery order",
          400,
        );
      }

      // ======================================================
      // 3. FIND + LOCK PAYMENT
      // ======================================================

      const paymentResult =
        await tx
          .select()
          .from(payments)
          .where(
            and(
              eq(
                payments.orderId,
                order.id,
              ),

              eq(
                payments.provider,
                "cash_on_delivery",
              ),
            ),
          )
          .for("update")
          .limit(1);

      const payment =
        paymentResult[0];

      if (!payment) {
        throw new ApiError(
          "COD payment not found",
          404,
        );
      }

      // ======================================================
      // 4. IDEMPOTENCY
      // ======================================================

      if (
        payment.status === "paid"
      ) {
        return {
          payment,
          order,
          alreadyCompleted: true,
        };
      }

      // ======================================================
      // 5. PAYMENT MUST BE PENDING
      // ======================================================

      if (
        payment.status !==
        "pending"
      ) {
        throw new ApiError(
          `Cannot complete COD payment with status "${payment.status}"`,
          400,
        );
      }

      // ======================================================
      // 6. ORDER MUST NOT BE CANCELLED
      // ======================================================

      if (
        order.status ===
        "cancelled"
      ) {
        throw new ApiError(
          "Cannot complete payment for a cancelled order",
          400,
        );
      }

      // ======================================================
      // 7. GET ORDER ITEMS
      // ======================================================

      const items =
        await tx
          .select()
          .from(orderItems)
          .where(
            eq(
              orderItems.orderId,
              order.id,
            ),
          );

      if (items.length === 0) {
        throw new ApiError(
          "Order has no items",
          400,
        );
      }

      // ======================================================
      // 8. COMPLETE INVENTORY
      // ======================================================

      for (const item of items) {
        if (!item.variantId) {
          throw new ApiError(
            `No product variant was specified for "${item.productName}"`,
            400,
          );
        }

        const updatedVariantResult =
          await tx
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

              updatedAt:
                new Date(),
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

        if (
          updatedVariantResult.length ===
          0
        ) {
          throw new ApiError(
            `Unable to complete inventory for "${item.productName}"`,
            409,
          );
        }

        // ====================================================
        // INVENTORY MOVEMENT
        // ====================================================

        await tx
          .insert(inventoryMovements)
          .values({
            variantId:
              item.variantId,

            userId:
              order.userId,

            orderId:
              order.id,

            quantityChange:
              -item.quantity,

            reason: "sale",
          });
      }

      // ======================================================
      // 9. UPDATE PAYMENT
      // ======================================================

      const paymentUpdateResult =
        await tx
          .update(payments)
          .set({
            status: "paid",

            gatewayResponse:
              "Cash collected on delivery",

            paidAt:
              new Date(),

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              payments.id,
              payment.id,
            ),
          )
          .returning();

      const updatedPayment =
        paymentUpdateResult[0];

      if (!updatedPayment) {
        throw new ApiError(
          "Failed to update COD payment",
          500,
        );
      }

      // ======================================================
      // 10. UPDATE ORDER
      // ======================================================

      const orderUpdateResult =
        await tx
          .update(orders)
          .set({
            paymentStatus:
              "paid",

            status:
              "delivered",

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              orders.id,
              order.id,
            ),
          )
          .returning();

      const updatedOrder =
        orderUpdateResult[0];

      if (!updatedOrder) {
        throw new ApiError(
          "Failed to update COD order",
          500,
        );
      }

      // ======================================================
      // 11. RETURN
      // ======================================================

      return {
        payment:
          updatedPayment,

        order:
          updatedOrder,

        alreadyCompleted:
          false,
      };
    },
  );
}
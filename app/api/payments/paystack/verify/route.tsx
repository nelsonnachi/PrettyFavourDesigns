import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { requireUser } from "@/lib/APIs/auth";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { verifyPaymentSchema } from "@/lib/validations";

import { completeSuccessfulPayment } from "@/lib/APIs/payments/complete-payment";

import { releaseFailedPaymentReservation } from "@/lib/APIs/payments/release-payment";
import { verifyPaystackTransaction } from "@/lib/payments/paystack";

// ============================================================
// PAYSTACK VERIFY PAYMENT
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // ========================================================
    // 1. REQUIRE AUTHENTICATED USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // 2. READ REQUEST BODY
    // ========================================================

    const body = await request.json();

    // ========================================================
    // 3. VALIDATE REQUEST BODY
    // ========================================================

    const { reference } = verifyPaymentSchema.parse(body);

    // ========================================================
    // 4. FIND PAYMENT
    // ========================================================

    const payment = await db.query.payments.findFirst({
      where: {
        reference,
      },
    });

    if (!payment) {
      throw new ApiError("Payment not found", 404);
    }

    // ========================================================
    // 5. FIND ORDER AND VERIFY OWNERSHIP
    // ========================================================

    const order = await db.query.orders.findFirst({
      where: {
        id: payment.orderId,
        userId: user.id,
      },
    });

    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    // ========================================================
    // 6. ALREADY PAID
    // ========================================================

    if (payment.status === "paid") {
      return NextResponse.json({
        success: true,

        message: "Payment already verified",

        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          reference: payment.reference,
          status: payment.status,
          orderStatus: order.status,
          paymentStatus: order.paymentStatus,
          paidAt: payment.paidAt,
          alreadyCompleted: true,
        },
      });
    }

    // ========================================================
    // 7. ALREADY FAILED
    // ========================================================

    if (payment.status === "failed") {
      return NextResponse.json({
        success: false,

        message: "Payment has already failed",

        data: {
          paymentId: payment.id,
          orderId: payment.orderId,
          reference: payment.reference,
          status: payment.status,
          orderStatus: order.status,
          paymentStatus: order.paymentStatus,
          alreadyReleased: true,
        },
      });
    }

    // ========================================================
    // 8. VERIFY TRANSACTION WITH PAYSTACK
    // ========================================================

    const transaction = await verifyPaystackTransaction(payment.reference);

    // ========================================================
    // 9. VALIDATE PAYSTACK REFERENCE
    // ========================================================

    if (transaction.reference !== payment.reference) {
      throw new ApiError("Payment reference mismatch", 400);
    }

    // ========================================================
    // 10. VALIDATE CURRENCY
    // ========================================================

    if (transaction.currency !== payment.currency) {
      throw new ApiError("Payment currency mismatch", 400);
    }

    // ========================================================
    // 11. VALIDATE AMOUNT
    // ========================================================

    const expectedAmountInKobo = Math.round(Number(payment.amount) * 100);

    if (transaction.amount !== expectedAmountInKobo) {
      throw new ApiError("Payment amount mismatch", 400);
    }

    // ========================================================
    // 12. SUCCESSFUL PAYMENT
    // ========================================================

    if (transaction.status === "success") {
      const result = await completeSuccessfulPayment({
        reference: payment.reference,

        gatewayResponse: transaction.gateway_response ?? null,

        paidAt: transaction.paid_at
          ? new Date(transaction.paid_at)
          : new Date(),
      });

      return NextResponse.json({
        success: true,

        message: result.alreadyCompleted
          ? "Payment already completed"
          : "Payment verified and completed successfully",

        data: {
          paymentId: result.payment.id,

          orderId: result.order.id,

          reference: result.payment.reference,

          status: result.payment.status,

          orderStatus: result.order.status,

          paymentStatus: result.order.paymentStatus,

          paidAt: result.payment.paidAt,

          alreadyCompleted: result.alreadyCompleted,
        },
      });
    }

    // ========================================================
    // 13. FAILED / ABANDONED PAYMENT
    // ========================================================

    if (transaction.status === "failed" || transaction.status === "abandoned") {
      const result = await releaseFailedPaymentReservation({
        reference: payment.reference,

        gatewayResponse: transaction.gateway_response ?? null,
      });

      return NextResponse.json({
        success: false,

        message: result.alreadyReleased
          ? "Payment already failed"
          : "Payment failed and reserved stock was released",

        data: {
          paymentId: result.payment.id,

          orderId: result.order.id,

          reference: result.payment.reference,

          status: result.payment.status,

          orderStatus: result.order.status,

          paymentStatus: result.order.paymentStatus,

          paystackStatus: transaction.status,

          alreadyReleased: result.alreadyReleased,
        },
      });
    }

    // ========================================================
    // 14. REVERSED PAYMENT
    // ========================================================

    if (transaction.status === "reversed") {
      // ------------------------------------------------------
      // PENDING PAYMENT
      // ------------------------------------------------------

      if (payment.status === "pending") {
        const result = await releaseFailedPaymentReservation({
          reference: payment.reference,

          gatewayResponse:
            transaction.gateway_response ?? "Paystack transaction reversed",
        });

        return NextResponse.json({
          success: false,

          message: result.alreadyReleased
            ? "Reversed payment already processed"
            : "Payment was reversed and reserved stock was released",

          data: {
            paymentId: result.payment.id,

            orderId: result.order.id,

            reference: result.payment.reference,

            status: result.payment.status,

            orderStatus: result.order.status,

            paymentStatus: result.order.paymentStatus,

            paystackStatus: transaction.status,

            alreadyReleased: result.alreadyReleased,
          },
        });
      }


      // ------------------------------------------------------
      // OTHER PAYMENT STATE
      // ------------------------------------------------------

      return NextResponse.json({
        success: false,

        message:
          "Payment was reversed and requires no further reservation action",

        data: {
          paymentId: payment.id,

          orderId: payment.orderId,

          reference: payment.reference,

          status: payment.status,

          paystackStatus: transaction.status,
        },
      });
    }

    // ========================================================
    // 15. STILL PROCESSING
    // ========================================================

    return NextResponse.json({
      success: true,

      message: "Payment is still being processed",

      data: {
        paymentId: payment.id,

        orderId: payment.orderId,

        reference: payment.reference,

        status: payment.status,

        paystackStatus: transaction.status,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

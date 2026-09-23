import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { requireUser } from "@/lib/APIs/auth";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { verifyPaymentSchema } from "@/lib/validations";

import { completeSuccessfulPayment } from "@/lib/APIs/payments/complete-payment";

import { releaseFailedPaymentReservation } from "@/lib/APIs/payments/release-payment";

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
    // 4. GET PAYSTACK SECRET KEY
    // ========================================================

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      throw new ApiError("Paystack secret key is not configured", 500);
    }

    // ========================================================
    // 5. FIND OUR PAYMENT
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
    // 6. VERIFY PAYMENT BELONGS TO CURRENT USER
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
    // 7. IF ALREADY PAID
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
        },
      });
    }

    // ========================================================
    // 8. ASK PAYSTACK TO VERIFY TRANSACTION
    // ========================================================

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference,
      )}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${secretKey}`,
        },

        cache: "no-store",
      },
    );

    // ========================================================
    // 9. READ PAYSTACK RESPONSE
    // ========================================================

    const paystackData = await paystackResponse.json();

    // ========================================================
    // 10. MAKE SURE PAYSTACK RESPONDED SUCCESSFULLY
    // ========================================================

    if (!paystackResponse.ok || !paystackData.status) {
      throw new ApiError(
        paystackData.message || "Unable to verify payment with Paystack",
        400,
      );
    }

    const transaction = paystackData.data;

    if (!transaction) {
      throw new ApiError("Invalid Paystack transaction response", 400);
    }

    // ========================================================
    // 11. VALIDATE REFERENCE
    // ========================================================

    if (transaction.reference !== payment.reference) {
      throw new ApiError("Payment reference mismatch", 400);
    }

    // ========================================================
    // 12. VALIDATE CURRENCY
    // ========================================================

    if (transaction.currency !== payment.currency) {
      throw new ApiError("Payment currency mismatch", 400);
    }

    // ========================================================
    // 13. VALIDATE AMOUNT
    // ========================================================
    //
    // Database:
    // NGN
    //
    // Paystack:
    // kobo
    //
    // ========================================================

    const expectedAmountInKobo = Math.round(Number(payment.amount) * 100);

    if (transaction.amount !== expectedAmountInKobo) {
      throw new ApiError("Payment amount mismatch", 400);
    }

    // ========================================================
    // 14. PAYMENT SUCCESS
    // ========================================================

    if (transaction.status === "success") {
      const result = await completeSuccessfulPayment({
        reference: payment.reference,

        gatewayResponse: transaction.gateway_response || null,

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
    // 15. PAYMENT FAILED
    // ========================================================
    //
    // These statuses mean the transaction did not complete.
    //
    // We must release the stock reservation.
    //
    // ========================================================

    if (
      transaction.status === "failed" ||
      transaction.status === "abandoned" ||
      transaction.status === "reversed"
    ) {
      const result = await releaseFailedPaymentReservation({
        reference: payment.reference,

        gatewayResponse:
          transaction.gateway_response || transaction.message || null,
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
    // 16. PAYMENT STILL PROCESSING
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

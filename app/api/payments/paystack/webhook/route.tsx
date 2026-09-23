import { NextRequest, NextResponse } from "next/server";

import crypto from "crypto";

import { db } from "@/db/drizzle";

import { releaseFailedPaymentReservation } from "@/lib/APIs/payments/release-payment";

import { completeSuccessfulPayment } from "@/lib/APIs/payments/complete-payment";

// ============================================================
// PAYSTACK WEBHOOK
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // ========================================================
    // 1. GET PAYSTACK SECRET KEY
    // ========================================================

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY is not configured");

      return NextResponse.json(
        {
          success: false,

          message: "Paystack secret key is not configured",
        },
        {
          status: 500,
        },
      );
    }

    // ========================================================
    // 2. GET RAW REQUEST BODY
    // ========================================================
    //
    // We must use the raw body to validate the
    // Paystack webhook signature.
    //
    // ========================================================

    const rawBody = await request.text();

    // ========================================================
    // 3. GET PAYSTACK SIGNATURE
    // ========================================================

    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        {
          success: false,

          message: "Missing Paystack signature",
        },
        {
          status: 401,
        },
      );
    }

    // ========================================================
    // 4. GENERATE EXPECTED SIGNATURE
    // ========================================================

    const expectedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    // ========================================================
    // 5. COMPARE SIGNATURES SAFELY
    // ========================================================

    const receivedBuffer = Buffer.from(signature, "utf8");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      return NextResponse.json(
        {
          success: false,

          message: "Invalid Paystack signature",
        },
        {
          status: 401,
        },
      );
    }

    // ========================================================
    // 6. PARSE WEBHOOK BODY
    // ========================================================

    const event = JSON.parse(rawBody);

    // ========================================================
    // 7. GET TRANSACTION
    // ========================================================

    const transaction = event.data;

    // ========================================================
    // 8. EVENTS WITHOUT TRANSACTION DATA
    // ========================================================

    if (!transaction) {
      return NextResponse.json({
        success: true,

        message: "Webhook received",
      });
    }

    // ========================================================
    // 9. GET PAYMENT REFERENCE
    // ========================================================

    const reference = transaction.reference;

    if (!reference) {
      return NextResponse.json(
        {
          success: false,

          message: "Payment reference missing",
        },
        {
          status: 400,
        },
      );
    }

    // ========================================================
    // 10. FIND PAYMENT
    // ========================================================

    const payment = await db.query.payments.findFirst({
      where: {
        reference,
      },
    });

    // ========================================================
    // 11. PAYMENT DOES NOT BELONG TO OUR SYSTEM
    // ========================================================

    if (!payment) {
      console.error("Paystack payment not found:", reference);

      // Return 200 because this transaction
      // does not belong to our system.
      return NextResponse.json({
        success: true,

        message: "Payment not found",
      });
    }

    // ========================================================
    // 12. VALIDATE CURRENCY
    // ========================================================

    if (transaction.currency !== payment.currency) {
      console.error("Paystack currency mismatch:", reference);

      return NextResponse.json(
        {
          success: false,

          message: "Payment currency mismatch",
        },
        {
          status: 400,
        },
      );
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
      console.error("Paystack amount mismatch:", reference);

      return NextResponse.json(
        {
          success: false,

          message: "Payment amount mismatch",
        },
        {
          status: 400,
        },
      );
    }

    // ========================================================
    // 14. SUCCESSFUL PAYMENT
    // ========================================================

    if (event.event === "charge.success" && transaction.status === "success") {
      // ------------------------------------------------------
      // COMPLETE PAYMENT
      // ------------------------------------------------------

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
          ? "Payment already processed"
          : "Payment webhook processed successfully",

        data: {
          paymentId: result.payment.id,

          orderId: result.order.id,

          reference: result.payment.reference,

          paymentStatus: result.payment.status,

          orderStatus: result.order.status,

          alreadyCompleted: result.alreadyCompleted,
        },
      });
    }

    // ========================================================
    // 15. FAILED PAYMENT
    // ========================================================
    //
    // We only release the reservation for events that
    // represent a genuinely failed transaction.
    //
    // ========================================================

    if (
      event.event === "charge.failed" ||
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
        success: true,

        message: result.alreadyReleased
          ? "Failed payment already processed"
          : "Failed payment processed and reserved stock released",

        data: {
          paymentId: result.payment.id,

          orderId: result.order.id,

          reference: result.payment.reference,

          paymentStatus: result.payment.status,

          orderStatus: result.order.status,

          alreadyReleased: result.alreadyReleased,
        },
      });
    }

    // ========================================================
    // 16. OTHER PAYSTACK EVENTS
    // ========================================================
    //
    // We acknowledge events that we do not need to process.
    //
    // ========================================================

    return NextResponse.json({
      success: true,

      message: "Webhook received",
    });
  } catch (error) {
    console.error("Paystack webhook error:", error);

    return NextResponse.json(
      {
        success: false,

        message: "Webhook processing failed",
      },
      {
        status: 500,
      },
    );
  }
}

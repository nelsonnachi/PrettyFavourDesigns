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
    // 5. SAFELY COMPARE SIGNATURES
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

    let event: any;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid webhook payload",
        },
        {
          status: 400,
        },
      );
    }

    // ========================================================
    // 7. GET TRANSACTION
    // ========================================================

    const transaction = event?.data;

    if (!transaction) {
      return NextResponse.json({
        success: true,
        message: "Webhook received",
      });
    }

    // ========================================================
    // 8. GET PAYMENT REFERENCE
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
    // 9. FIND PAYMENT
    // ========================================================

    const payment = await db.query.payments.findFirst({
      where: {
        reference,
      },
    });

    // ========================================================
    // 10. UNKNOWN PAYMENT
    // ========================================================

    if (!payment) {
      console.warn("Paystack payment not found:", reference);

      // Paystack should receive 200 so that it does not
      // repeatedly retry a webhook for an unknown reference.
      return NextResponse.json({
        success: true,
        message: "Payment not found",
      });
    }

    // ========================================================
    // 11. VALIDATE CURRENCY
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
    // 12. VALIDATE AMOUNT
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
    // 13. SUCCESSFUL PAYMENT
    // ========================================================

    if (event.event === "charge.success" && transaction.status === "success") {
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
    // 14. FAILED / ABANDONED PAYMENT
    // ========================================================

    if (
      event.event === "charge.failed" ||
      transaction.status === "failed" ||
      transaction.status === "abandoned"
    ) {
      // ------------------------------------------------------
      // ALREADY PAID
      // ------------------------------------------------------

      if (payment.status === "paid") {
        console.warn(
          `Received failed/abandoned Paystack event for already-paid payment: ${reference}`,
        );

        return NextResponse.json({
          success: true,

          message: "Payment was already completed; no reservation was released",
        });
      }

      // ------------------------------------------------------
      // ALREADY FAILED
      // ------------------------------------------------------

      if (payment.status === "failed") {
        return NextResponse.json({
          success: true,

          message: "Failed payment already processed",
        });
      }

      // ------------------------------------------------------
      // ONLY PENDING PAYMENTS MAY RELEASE RESERVATION
      // ------------------------------------------------------

      if (payment.status !== "pending") {
        return NextResponse.json({
          success: true,

          message:
            "Payment is already in a final state; no reservation action was required",
        });
      }

      // ------------------------------------------------------
      // RELEASE RESERVATION
      // ------------------------------------------------------

      const result = await releaseFailedPaymentReservation({
        reference: payment.reference,

        gatewayResponse:
  transaction.gateway_response ?? null,
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
    // 15. REVERSED PAYMENT
    // ========================================================

    if (transaction.status === "reversed") {
      // ------------------------------------------------------
      // PAYMENT STILL PENDING
      // ------------------------------------------------------

      if (payment.status === "pending") {
        const result = await releaseFailedPaymentReservation({
          reference: payment.reference,

          gatewayResponse:
  transaction.gateway_response ??
  "Paystack transaction reversed",
        });

        return NextResponse.json({
          success: true,

          message: result.alreadyReleased
            ? "Reversed payment already processed"
            : "Reversed payment processed and reserved stock released",

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

      // ------------------------------------------------------
      // PAYMENT ALREADY PAID
      // ------------------------------------------------------

      if (payment.status === "paid") {
        console.warn(
          `Paystack reversal received after payment was completed: ${reference}`,
        );

        return NextResponse.json({
          success: true,

          message:
            "Payment reversal received after completion; no inventory change was made",
        });
      }

      // ------------------------------------------------------
      // OTHER FINAL STATE
      // ------------------------------------------------------

      return NextResponse.json({
        success: true,

        message: "Reversed payment received and no further action was required",
      });
    }

    // ========================================================
    // 16. OTHER PAYSTACK EVENTS / STATUSES
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

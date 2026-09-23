import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { requireUser } from "@/lib/APIs/auth";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { initializePaymentSchema } from "@/lib/validations";

import { initializePaystackTransaction } from "@/lib/payments/paystack";

// ============================================================
// INITIALIZE PAYSTACK PAYMENT
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // ========================================================
    // 1. REQUIRE LOGIN
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // 2. READ REQUEST BODY
    // ========================================================

    const body = await request.json();

    // ========================================================
    // 3. VALIDATE REQUEST
    // ========================================================

    const data = initializePaymentSchema.parse(body);

    // ========================================================
    // 4. FIND THE USER'S ORDER
    // ========================================================

    const order = await db.query.orders.findFirst({
      where: {
        id: data.orderId,

        userId: user.id,
      },
    });

    // ========================================================
    // 5. MAKE SURE ORDER EXISTS
    // ========================================================

    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    // ========================================================
    // 6. MAKE SURE THIS IS A PAYSTACK ORDER
    // ========================================================

    if (order.paymentMethod !== "paystack") {
      throw new ApiError("This order is not a Paystack payment", 400);
    }

    // ========================================================
    // 7. CHECK PAYMENT STATUS
    // ========================================================

    if (order.paymentStatus === "paid") {
      throw new ApiError("This order has already been paid", 400);
    }

    // ========================================================
    // 8. CHECK ORDER STATUS
    // ========================================================

    if (order.status === "cancelled") {
      throw new ApiError("This order has been cancelled", 400);
    }

    // ========================================================
    // 9. FIND EXISTING PAYMENT
    // ========================================================
    //
    // Checkout already created the payment.
    //
    // We MUST NOT create another payment here.
    //
    // ========================================================

    const payment = await db.query.payments.findFirst({
      where: {
        orderId: order.id,

        provider: "paystack",

        status: "pending",
      },
    });

    // ========================================================
    // 10. MAKE SURE PAYMENT EXISTS
    // ========================================================

    if (!payment) {
      throw new ApiError(
        "Pending Paystack payment not found for this order",
        404,
      );
    }

    // ========================================================
    // 11. MAKE SURE PAYMENT AMOUNT MATCHES ORDER
    // ========================================================

    if (Number(payment.amount) !== Number(order.total)) {
      throw new ApiError("Payment amount does not match order total", 409);
    }

    // ========================================================
    // 12. GET APPLICATION URL
    // ========================================================

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      throw new ApiError("NEXT_PUBLIC_APP_URL is not configured", 500);
    }

    // ========================================================
    // 13. INITIALIZE PAYSTACK
    // ========================================================

    const paystack = await initializePaystackTransaction({
      email: user.email,

      amount: Number(payment.amount),

      reference: payment.reference,

      callbackUrl: `${appUrl}/payment/paystack/callback`,

      metadata: {
        orderId: order.id,

        orderNumber: order.orderNumber,

        paymentId: payment.id,

        userId: user.id,
      },
    });

    // ========================================================
    // 14. RETURN PAYMENT INFORMATION
    // ========================================================

    return NextResponse.json({
      success: true,

      message: "Payment initialized successfully",

      data: {
        paymentId: payment.id,

        orderId: order.id,

        orderNumber: order.orderNumber,

        reference: paystack.reference,

        authorizationUrl: paystack.authorization_url,

        accessCode: paystack.access_code,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

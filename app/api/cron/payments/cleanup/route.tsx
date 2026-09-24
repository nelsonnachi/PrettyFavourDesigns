import { NextRequest, NextResponse } from "next/server";

import {
  cleanupAbandonedPaystackPayments,
} from "@/lib/APIs/payments/cleanup-pending-payments";

// ============================================================
// CLEANUP ABANDONED PAYMENTS
// ============================================================

export async function GET(
  request: NextRequest,
) {
  try {
    // ========================================================
    // 1. GET CRON SECRET
    // ========================================================

    const cronSecret =
      process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error(
        "CRON_SECRET is not configured",
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "CRON_SECRET is not configured",
        },
        {
          status: 500,
        },
      );
    }

    // ========================================================
    // 2. VERIFY AUTHORIZATION
    // ========================================================

    const authorization =
      request.headers.get(
        "authorization",
      );

    if (
      authorization !==
      `Bearer ${cronSecret}`
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // ========================================================
    // 3. RUN CLEANUP
    // ========================================================

    const result =
      await cleanupAbandonedPaystackPayments();

    // ========================================================
    // 4. RETURN RESULT
    // ========================================================

    return NextResponse.json({
      success: true,

      message:
        "Abandoned Paystack payments cleaned up successfully",

      data: result,
    });
  } catch (error) {
    console.error(
      "Payment cleanup error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Payment cleanup failed",
      },
      {
        status: 500,
      },
    );
  }
}
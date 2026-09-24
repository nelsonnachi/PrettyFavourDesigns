import {
  and,
  eq,
  lt,
} from "drizzle-orm";

import { db } from "@/db/drizzle";

import { payments } from "@/db/schema/payments";



import {
  completeSuccessfulPayment,
} from "./complete-payment";

import {
  releaseFailedPaymentReservation,
} from "./release-payment";
import { verifyPaystackTransaction } from "@/lib/payments/paystack";

// ============================================================
// CLEANUP RESULT
// ============================================================

type CleanupResult = {
  checked: number;
  completed: number;
  released: number;
  stillPending: number;
  skipped: number;
};

// ============================================================
// CLEANUP ABANDONED PAYSTACK PAYMENTS
// ============================================================
//
// IMPORTANT:
//
// We do NOT simply assume an old payment failed.
//
// We first ask Paystack.
//
// Possible outcomes:
//
// success
//   -> complete payment
//
// failed / abandoned
//   -> release reservation
//
// pending / processing / unknown
//   -> leave payment alone
//
// COD payments are never touched.
//
// ============================================================

export async function cleanupAbandonedPaystackPayments(
  ageMinutes = 30,
): Promise<CleanupResult> {
  const cutoff = new Date(
    Date.now() -
      ageMinutes * 60 * 1000,
  );

  const pendingPayments =
    await db
      .select({
        id: payments.id,

        reference:
          payments.reference,

        amount:
          payments.amount,

        currency:
          payments.currency,
      })
      .from(payments)
      .where(
        and(
          eq(
            payments.provider,
            "paystack",
          ),

          eq(
            payments.status,
            "pending",
          ),

          lt(
            payments.createdAt,
            cutoff,
          ),
        ),
      );

  let completed = 0;
  let released = 0;
  let stillPending = 0;
  let skipped = 0;

  // ==========================================================
  // PROCESS EACH PAYMENT
  // ==========================================================

  for (const payment of pendingPayments) {
    try {
      // ======================================================
      // ASK PAYSTACK FOR THE REAL STATUS
      // ======================================================

      const transaction =
        await verifyPaystackTransaction(
          payment.reference,
        );

      // ======================================================
      // VERIFY REFERENCE
      // ======================================================

      if (
        transaction.reference !==
        payment.reference
      ) {
        console.error(
          "Paystack reference mismatch during cleanup:",
          payment.reference,
        );

        skipped++;

        continue;
      }

      // ======================================================
      // VERIFY CURRENCY
      // ======================================================

      if (
        transaction.currency !==
        payment.currency
      ) {
        console.error(
          "Paystack currency mismatch during cleanup:",
          payment.reference,
        );

        skipped++;

        continue;
      }

      // ======================================================
      // VERIFY AMOUNT
      // ======================================================

      const expectedAmountInKobo =
        Math.round(
          Number(payment.amount) *
            100,
        );

      if (
        transaction.amount !==
        expectedAmountInKobo
      ) {
        console.error(
          "Paystack amount mismatch during cleanup:",
          payment.reference,
        );

        skipped++;

        continue;
      }

      // ======================================================
      // SUCCESSFUL PAYMENT
      // ======================================================

      if (
        transaction.status ===
        "success"
      ) {
        await completeSuccessfulPayment(
          {
            reference:
              payment.reference,

            gatewayResponse:
              transaction.gateway_response,

            paidAt:
              transaction.paid_at
                ? new Date(
                    transaction.paid_at,
                  )
                : new Date(),
          },
        );

        completed++;

        continue;
      }

      // ======================================================
      // FAILED PAYMENT
      // ======================================================

      if (
        transaction.status ===
          "failed" ||
        transaction.status ===
          "abandoned"
      ) {
        await releaseFailedPaymentReservation(
          {
            reference:
              payment.reference,

            gatewayResponse:
              transaction.gateway_response ??
              `Paystack payment ${transaction.status}`,
          },
        );

        released++;

        continue;
      }

      // ======================================================
      // STILL PROCESSING
      // ======================================================

      stillPending++;

      console.log(
        `Paystack payment still pending: ${payment.reference} (${transaction.status})`,
      );
    } catch (error) {
      skipped++;

      console.error(
        "Unable to process pending Paystack payment:",
        payment.reference,
        error,
      );
    }
  }

  // ==========================================================
  // RETURN SUMMARY
  // ==========================================================

  return {
    checked: pendingPayments.length,

    completed,

    released,

    stillPending,

    skipped,
  };
}
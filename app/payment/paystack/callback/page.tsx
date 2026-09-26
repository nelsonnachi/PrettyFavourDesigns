"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useVerifyPaystackPayment } from "@/lib/query/checkout/checkout-mutations";

// ============================================================
// PAYMENT STATE
// ============================================================

type PaymentState = "verifying" | "success" | "failed" | "processing";

// ============================================================
// CONSTANTS
// ============================================================

const POLL_INTERVAL = 3000;

const MAX_ATTEMPTS = 10;

// ============================================================
// CALLBACK CONTENT
// ============================================================

function PaystackCallbackContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  // ==========================================================
  // STATE
  // ==========================================================

  const [state, setState] = useState<PaymentState>("verifying");

  const [message, setMessage] = useState("Verifying your payment...");

  const [orderId, setOrderId] = useState<string | null>(null);

  // ==========================================================
  // REFS
  // ==========================================================

  const startedRef = useRef(false);

  // ==========================================================
  // MUTATION
  // ==========================================================

  const verifyPaymentMutation = useVerifyPaystackPayment();

  const verifyPayment = verifyPaymentMutation.mutateAsync;

  // ==========================================================
  // PAYMENT REFERENCE
  // ==========================================================

  const reference = searchParams.get("reference");

  // ==========================================================
  // VERIFY + POLL
  // ==========================================================

  useEffect(() => {
    if (!reference) {
      setState("failed");

      setMessage("Payment reference was not found.");

      return;
    }

    if (startedRef.current) {
      return;
    }

    startedRef.current = true;

    let cancelled = false;

    const runVerification = async () => {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        if (cancelled) {
          return;
        }

        try {
          const result = await verifyPayment({
            reference,
          });

          // ==================================================
          // SAVE ORDER ID
          // ==================================================

          if (result.data?.orderId) {
            setOrderId(result.data.orderId);
          }

          // ==================================================
          // PAYMENT SUCCESS
          // ==================================================

          if (result.success && result.data?.status === "paid") {
            setState("success");

            setMessage(result.message || "Payment completed successfully.");

            return;
          }

          // ==================================================
          // PAYMENT FAILED
          // ==================================================

          if (result.data?.status === "failed") {
            setState("failed");

            setMessage(result.message || "Your payment was not successful.");

            return;
          }

          // ==================================================
          // STILL PROCESSING
          // ==================================================

          setState("verifying");

          setMessage(
            `Payment is still being processed. Checking again... (${attempt}/${MAX_ATTEMPTS})`,
          );

          if (attempt < MAX_ATTEMPTS) {
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
          }
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error("Payment verification error:", error);

          if (attempt < MAX_ATTEMPTS) {
            setState("verifying");

            setMessage(
              "We are having trouble confirming your payment. Retrying...",
            );

            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));

            continue;
          }

          setState("failed");

          setMessage(
            error instanceof Error
              ? error.message
              : "We could not verify your payment.",
          );

          return;
        }
      }

      // ======================================================
      // MAX ATTEMPTS REACHED
      // ======================================================

      if (!cancelled) {
        setState("processing");

        setMessage(
          "Your payment is still being confirmed. You can check your orders while we finish processing it.",
        );
      }
    };

    runVerification();

    return () => {
      cancelled = true;
    };
  }, [reference, verifyPayment]);

  // ==========================================================
  // VIEW ORDER
  // ==========================================================

  const handleViewOrder = () => {
    if (!orderId) {
      router.push("/orders");

      return;
    }

    router.push(`/orders/${orderId}`);
  };

  // ==========================================================
  // GO TO ORDERS
  // ==========================================================

  const handleContinue = () => {
    router.push("/orders");
  };

  // ==========================================================
  // VERIFYING
  // ==========================================================

  if (state === "verifying") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Verifying Payment
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

          <p className="mt-6 text-xs text-slate-400">
            Please do not close this page.
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // SUCCESS
  // ==========================================================

  if (state === "success") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <span className="text-3xl text-green-600">✓</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Payment Successful
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

          <div className="mt-8 flex flex-col gap-3">
            {orderId && (
              <button
                type="button"
                onClick={handleViewOrder}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Order
              </button>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="w-full rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Go to My Orders
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // PROCESSING
  // ==========================================================

  if (state === "processing") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <span className="text-3xl text-blue-600">…</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Payment Processing
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

          <div className="mt-8 flex flex-col gap-3">
            {orderId && (
              <button
                type="button"
                onClick={handleViewOrder}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Order
              </button>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="w-full rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Go to My Orders
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // FAILED
  // ==========================================================

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <span className="text-3xl font-bold text-red-600">!</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Payment Failed</h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go to My Orders
          </button>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// SUSPENSE FALLBACK
// ============================================================

function PaystackCallbackLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Loading Payment</h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Preparing your payment verification...
        </p>
      </div>
    </main>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function PaystackCallbackPage() {
  return (
    <Suspense fallback={<PaystackCallbackLoading />}>
      <PaystackCallbackContent />
    </Suspense>
  );
}

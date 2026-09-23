"use client";

import { Suspense, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

// ============================================================
// TYPES
// ============================================================

type PaymentState = "verifying" | "success" | "failed";

type VerifyPaymentResponse = {
  success: boolean;

  message: string;

  data?: {
    paymentId: string;

    orderId: string;

    reference: string;

    status: string;

    orderStatus?: string;

    paymentStatus?: string;

    paidAt?: string | null;

    paystackStatus?: string;
  };
};

// ============================================================
// PAYSTACK CALLBACK CONTENT
// ============================================================

function PaystackCallbackContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [state, setState] = useState<PaymentState>("verifying");

  const [message, setMessage] = useState("Verifying your payment...");

  const [orderId, setOrderId] = useState<string | null>(null);

  // ==========================================================
  // VERIFY PAYMENT
  // ==========================================================

  useEffect(() => {
    const reference = searchParams.get("reference");

    // ========================================================
    // 1. MAKE SURE REFERENCE EXISTS
    // ========================================================

    if (!reference) {
      setState("failed");

      setMessage("Payment reference was not found.");

      return;
    }

    // ========================================================
    // 2. VERIFY PAYMENT
    // ========================================================

    const verifyPayment = async () => {
      try {
        setState("verifying");

        setMessage("Verifying your payment with Paystack...");

        const response = await fetch("/api/payments/paystack/verify", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            reference,
          }),
        });

        const result = (await response.json()) as VerifyPaymentResponse;

        // ====================================================
        // 3. PAYMENT COMPLETED
        // ====================================================

        if (response.ok && result.success && result.data?.status === "paid") {
          setState("success");

          setMessage(result.message || "Payment completed successfully.");

          setOrderId(result.data.orderId);

          return;
        }

        // ====================================================
        // 4. PAYMENT FAILED
        // ====================================================

        if (result.data?.status === "failed") {
          setState("failed");

          setMessage(result.message || "Your payment was not successful.");

          if (result.data.orderId) {
            setOrderId(result.data.orderId);
          }

          return;
        }

        // ====================================================
        // 5. PAYMENT STILL PROCESSING
        // ====================================================

        setState("verifying");

        setMessage(result.message || "Your payment is still being processed.");
      } catch (error) {
        console.error("Payment verification error:", error);

        setState("failed");

        setMessage("We could not verify your payment. Please try again.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  // ==========================================================
  // VIEW ORDER
  // ==========================================================

  const handleViewOrder = () => {
    if (!orderId) {
      router.push("/orders");

      return;
    }

    router.push(`/account/orders/${orderId}`);
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

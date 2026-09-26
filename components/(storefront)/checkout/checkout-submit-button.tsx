"use client";

import { useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import {
  useCreateCheckout,
  useInitializePaystackPayment,
} from "@/lib/query/checkout/checkout-mutations";

import type { PaymentMethod } from "@/lib/query/checkout/checkout-types";

type CheckoutSubmitButtonProps = {
  addressId: string;
  paymentMethod: PaymentMethod;
  notes: string;
};

function createIdempotencyKey() {
  return crypto.randomUUID();
}

export function CheckoutSubmitButton({
  addressId,
  paymentMethod,
  notes,
}: CheckoutSubmitButtonProps) {
  const createCheckoutMutation =
    useCreateCheckout();

  const initializePaystackMutation =
    useInitializePaystackPayment();

  const [errorMessage, setErrorMessage] =
    useState("");

  const isPending =
    createCheckoutMutation.isPending ||
    initializePaystackMutation.isPending;

  async function handleCheckout() {
    setErrorMessage("");

    // ======================================================
    // ADDRESS
    // ======================================================

    if (!addressId) {
      setErrorMessage(
        "Please select a shipping address.",
      );

      return;
    }

    // ======================================================
    // IDEMPOTENCY KEY
    // ======================================================

    const idempotencyKey =
      createIdempotencyKey();

    try {
      // ====================================================
      // CREATE ORDER
      // ====================================================

      const checkoutResponse =
        await createCheckoutMutation.mutateAsync({
          idempotencyKey,

          addressId,

          paymentMethod,

          notes: notes.trim() || undefined,
        });

      const order =
        checkoutResponse.data.order;

      // ====================================================
      // CASH ON DELIVERY
      // ====================================================

      if (
        paymentMethod ===
        "cash_on_delivery"
      ) {
        window.location.href = `/checkout/success?order=${encodeURIComponent(
          order.orderNumber,
        )}`;

        return;
      }

      // ====================================================
      // PAYSTACK
      // ====================================================

      const paymentResponse =
        await initializePaystackMutation.mutateAsync({
          orderId: order.id,
        });

      const authorizationUrl =
        paymentResponse.data
          .authorizationUrl;

      if (!authorizationUrl) {
        throw new Error(
          "Paystack payment could not be initialized.",
        );
      }

      // ====================================================
      // REDIRECT TO PAYSTACK
      // ====================================================

      window.location.href =
        authorizationUrl;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while processing your order.",
      );
    }
  }

  return (
    <div>
      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

          <p className="text-sm leading-6 text-destructive">
            {errorMessage}
          </p>
        </div>
      )}

      {/* ================================================== */}
      {/* BUTTON */}
      {/* ================================================== */}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isPending || !addressId}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />

            {paymentMethod ===
            "paystack"
              ? "Preparing payment..."
              : "Placing order..."}
          </>
        ) : (
          <>
            <LockKeyhole className="h-4 w-4" />

            {paymentMethod ===
            "paystack"
              ? "Continue to payment"
              : "Place order"}

            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
        By placing your order, you agree to our terms and
        conditions.
      </p>
    </div>
  );
}
"use client";

import { CreditCard, Banknote } from "lucide-react";

import type { PaymentMethod } from "@/lib/query/checkout/checkout-types";

type CheckoutPaymentSectionProps = {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (
    method: PaymentMethod,
  ) => void;
};

export function CheckoutPaymentSection({
  paymentMethod,
  onPaymentMethodChange,
}: CheckoutPaymentSectionProps) {
  return (
    <section>
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Payment method
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Choose how you would like to pay for your order.
        </p>
      </div>

      {/* ================================================== */}
      {/* PAYMENT OPTIONS */}
      {/* ================================================== */}

      <div className="space-y-4">
        {/* PAYSTACK */}

        <button
          type="button"
          onClick={() =>
            onPaymentMethodChange("paystack")
          }
          className={`w-full rounded-2xl border p-5 text-left transition ${
            paymentMethod === "paystack"
              ? "border-accent bg-accent/5"
              : "border-border bg-card hover:border-accent/40"
          }`}
        >
          <div className="flex items-start gap-4">
            <span
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                paymentMethod === "paystack"
                  ? "border-accent bg-accent"
                  : "border-muted-foreground/40"
              }`}
            >
              {paymentMethod === "paystack" && (
                <span className="h-2 w-2 rounded-full bg-white" />
              )}
            </span>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <CreditCard className="h-5 w-5" />
            </span>

            <span className="min-w-0">
              <span className="block font-medium">
                Paystack
              </span>

              <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                Pay securely online using your card or available Paystack payment methods.
              </span>
            </span>
          </div>
        </button>

        {/* CASH ON DELIVERY */}

        <button
          type="button"
          onClick={() =>
            onPaymentMethodChange(
              "cash_on_delivery",
            )
          }
          className={`w-full rounded-2xl border p-5 text-left transition ${
            paymentMethod === "cash_on_delivery"
              ? "border-accent bg-accent/5"
              : "border-border bg-card hover:border-accent/40"
          }`}
        >
          <div className="flex items-start gap-4">
            <span
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                paymentMethod ===
                "cash_on_delivery"
                  ? "border-accent bg-accent"
                  : "border-muted-foreground/40"
              }`}
            >
              {paymentMethod ===
                "cash_on_delivery" && (
                <span className="h-2 w-2 rounded-full bg-white" />
              )}
            </span>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <Banknote className="h-5 w-5" />
            </span>

            <span className="min-w-0">
              <span className="block font-medium">
                Cash on delivery
              </span>

              <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                Pay for your order when it is delivered to you.
              </span>
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
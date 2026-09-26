"use client";

import { useState } from "react";


import type { PaymentMethod } from "@/lib/query/checkout/checkout-types";
import { CheckoutAddressSection } from "./checkout-address-section";
import { CheckoutPaymentSection } from "./checkout-payment-section";
import { CheckoutNotes } from "./checkout-notes";
import { CheckoutSubmitButton } from "./checkout-submit-button";
import { CheckoutSummary } from "./checkout-summary";

export function CheckoutForm() {
  const [selectedAddressId, setSelectedAddressId] =
    useState<string>("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("paystack");

  const [notes, setNotes] = useState("");

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
          {/* ================================================== */}
          {/* LEFT */}
          {/* ================================================== */}

          <div className="space-y-10">
            <CheckoutAddressSection
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
            />

            <CheckoutPaymentSection
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />

            <CheckoutNotes
              notes={notes}
              onNotesChange={setNotes}
            />

            <CheckoutSubmitButton
              addressId={selectedAddressId}
              paymentMethod={paymentMethod}
              notes={notes}
            />
          </div>

          {/* ================================================== */}
          {/* RIGHT */}
          {/* ================================================== */}

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <CheckoutSummary />
          </aside>
        </div>
      </div>
    </section>
  );
}
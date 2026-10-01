"use client";

import { useState } from "react";

import { useCart } from "@/lib/query/cart/cart-queries";
import { useDiscountPreview } from "@/lib/query/discount/discount-hooks"; // NEW

import type { PaymentMethod } from "@/lib/query/checkout/checkout-types";
import { CheckoutAddressSection } from "./checkout-address-section";
import { CheckoutPaymentSection } from "./checkout-payment-section";
import { CheckoutNotes } from "./checkout-notes";
import { CheckoutSubmitButton } from "./checkout-submit-button";
import { CheckoutSummary } from "./checkout-summary";

export function CheckoutForm() {
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");

  const [notes, setNotes] = useState("");

  // ============================================================
  // DISCOUNT (NEW)
  // ============================================================
  //
  // appliedCode = the code the customer clicked "Apply" with.
  // The preview asks the server if it is valid and how much it saves.
  // It checks again by itself when the cart subtotal changes.

  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const { data: cartData } = useCart();

  const subtotal = cartData?.data.subtotal ?? 0;

  const discountPreview = useDiscountPreview(appliedCode, subtotal);

  // Money taken off (0 if there is no valid discount)
  const discountAmount = discountPreview.data?.data.discountAmount ?? 0;

  // The message to show if the code is not valid
  const discountError = discountPreview.isError
    ? discountPreview.error instanceof Error
      ? discountPreview.error.message
      : "Unable to apply this discount code."
    : "";

  // Only send the code to checkout if the server said it is valid
  const validDiscountCode = discountPreview.data ? appliedCode ?? undefined : undefined;

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

            <CheckoutNotes notes={notes} onNotesChange={setNotes} />

            <CheckoutSubmitButton
              addressId={selectedAddressId}
              paymentMethod={paymentMethod}
              notes={notes}
              discountCode={validDiscountCode}
              isCheckingDiscount={discountPreview.isFetching}
            />
          </div>

          {/* ================================================== */}
          {/* RIGHT */}
          {/* ================================================== */}

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <CheckoutSummary
              appliedCode={appliedCode}
              discountAmount={discountAmount}
              isCheckingDiscount={discountPreview.isFetching}
              discountError={discountError}
              onApplyCode={setAppliedCode}
              onRemoveCode={() => setAppliedCode(null)}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
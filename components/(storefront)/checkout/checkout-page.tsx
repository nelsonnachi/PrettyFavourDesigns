"use client";

import { CheckoutForm } from "./checkout-form";
import { CheckoutHeader } from "./checkout-header";
import { CheckoutProgress } from "./checkout-progress";



export function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <CheckoutHeader />

      <CheckoutProgress />

      <CheckoutForm />
    </main>
  );
}
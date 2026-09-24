
import { apiClient } from "@/lib/api/client";
import type {
  CheckoutRequest,
  CheckoutResponse,
  InitializePaystackRequest,
  InitializePaystackResponse,
  VerifyPaystackRequest,
  VerifyPaystackResponse,
} from "./checkout-types";

// ============================================================
// CREATE CHECKOUT
// ============================================================

export async function createCheckout(
  data: CheckoutRequest,
) {
  return apiClient<CheckoutResponse>(
    "/api/checkout",
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
}

// ============================================================
// INITIALIZE PAYSTACK
// ============================================================

export async function initializePaystackPayment(
  data: InitializePaystackRequest,
) {
  return apiClient<InitializePaystackResponse>(
    "/api/payments/paystack/initialize",
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
}

// ============================================================
// VERIFY PAYSTACK PAYMENT
// ============================================================

export async function verifyPaystackPayment(
  data: VerifyPaystackRequest,
) {
  return apiClient<VerifyPaystackResponse>(
    "/api/payments/paystack/verify",
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
}
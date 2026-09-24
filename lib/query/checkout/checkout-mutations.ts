"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCheckout,
  initializePaystackPayment,
  verifyPaystackPayment,
} from "./checkout-queries";

import type {
  CheckoutRequest,
  InitializePaystackRequest,
  VerifyPaystackRequest,
} from "./checkout-types";

import { cartKeys } from "@/lib/query/cart/cart-keys";

// ============================================================
// CREATE CHECKOUT
// ============================================================

export function useCreateCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckoutRequest) =>
      createCheckout(data),

    retry: false,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.all,
      });
    },
  });
}

// ============================================================
// INITIALIZE PAYSTACK
// ============================================================

export function useInitializePaystackPayment() {
  return useMutation({
    mutationFn: (
      data: InitializePaystackRequest,
    ) =>
      initializePaystackPayment(data),

    retry: false,
  });
}

// ============================================================
// VERIFY PAYSTACK
// ============================================================

export function useVerifyPaystackPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: VerifyPaystackRequest,
    ) =>
      verifyPaystackPayment(data),

    retry: false,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.all,
      });
    },
  });
}
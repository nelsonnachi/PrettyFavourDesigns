"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCheckout,
  initializePaystackPayment,
  verifyPaystackPayment,
} from "./checkout-api";

import type {
  CheckoutRequest,
  InitializePaystackRequest,
  VerifyPaystackRequest,
} from "./checkout-types";

import { cartKeys } from "@/lib/query/cart/cart-keys";

import { orderKeys } from "../orders/order-keys";

// ============================================================
// CREATE CHECKOUT
// ============================================================

export function useCreateCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CheckoutRequest,
    ) => createCheckout(data),

    retry: false,

    onSuccess: (result) => {
      // ======================================================
      // CART
      // ======================================================

      queryClient.invalidateQueries({
        queryKey: cartKeys.all,
      });

      // ======================================================
      // CUSTOMER ORDER LIST
      // ======================================================

      queryClient.invalidateQueries({
        queryKey: orderKeys.customer.lists(),
      });

      // ======================================================
      // CUSTOMER ORDER DETAIL
      // ======================================================

      const orderId =
        result.data?.order?.id;

      if (orderId) {
        queryClient.invalidateQueries({
          queryKey:
            orderKeys.customer.detail(orderId),
        });
      }
    },
  });
}

// ============================================================
// INITIALIZE PAYSTACK PAYMENT
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
// VERIFY PAYSTACK PAYMENT
// ============================================================

export function useVerifyPaystackPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: VerifyPaystackRequest,
    ) =>
      verifyPaystackPayment(data),

    retry: false,

    onSuccess: (result) => {
      // ======================================================
      // CART
      // ======================================================

      queryClient.invalidateQueries({
        queryKey: cartKeys.all,
      });

      // ======================================================
      // CUSTOMER ORDER LIST
      // ======================================================

      queryClient.invalidateQueries({
        queryKey:
          orderKeys.customer.lists(),
      });

      // ======================================================
      // CUSTOMER ORDER DETAIL
      // ======================================================

      const orderId =
        result.data?.orderId;

      if (orderId) {
        queryClient.invalidateQueries({
          queryKey:
            orderKeys.customer.detail(orderId),
        });
      }
    },
  });
}
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addToCart,
  clearCart,
  removeCartItem,
  updateCartItem,
} from "./cart-api";

import { cartKeys } from "./cart-keys";

import type {
  AddToCartInput,
  UpdateCartItemInput,
} from "./cart-types";

// ============================================================
// ADD TO CART
// ============================================================

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddToCartInput) => {
      return addToCart(input);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.current(),
      });
    },
  });
}

// ============================================================
// UPDATE CART ITEM
// ============================================================

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quantity,
    }: UpdateCartItemInput) => {
      return updateCartItem(id, quantity);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.current(),
      });
    },
  });
}

// ============================================================
// REMOVE CART ITEM
// ============================================================

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return removeCartItem(id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.current(),
      });
    },
  });
}

// ============================================================
// CLEAR CART
// ============================================================

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.current(),
      });
    },
  });
}
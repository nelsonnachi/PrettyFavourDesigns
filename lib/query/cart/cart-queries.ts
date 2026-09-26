import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cart-api";

import { cartKeys } from "./cart-keys";

import type {
  AddToCartInput,
  UpdateCartItemInput,
} from "./cart-types";

// ============================================================
// GET CART
// ============================================================

export function useCart() {
  return useQuery({
    queryKey: cartKeys.current(),

    queryFn: getCart,

    staleTime: 60 * 1000,
  });
}

// ============================================================
// ADD TO CART
// ============================================================

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddToCartInput) => {
      return addToCart(input);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
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

    onSuccess: async () => {
      // ------------------------------------------------------
      // Mark the cart query as stale and immediately refetch
      // active cart queries.
      // ------------------------------------------------------

      await queryClient.invalidateQueries({
        queryKey: cartKeys.current(),
        refetchType: "active",
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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartKeys.current(),
        refetchType: "active",
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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartKeys.current(),
        refetchType: "active",
      });
    },
  });
}
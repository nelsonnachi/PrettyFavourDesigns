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
  CartResponse,
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
        refetchType: "active",
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

    onSuccess: async (_, deletedItemId) => {
      // ------------------------------------------------------
      // Immediately remove the item from the cached cart.
      // This makes the UI respond immediately after a
      // successful DELETE request.
      // ------------------------------------------------------

      queryClient.setQueryData<CartResponse>(
        cartKeys.current(),
        (currentData) => {
          if (!currentData?.data) {
            return currentData;
          }

          const currentCart =
            currentData.data;

          const deletedItem =
            currentCart.items.find(
              (item) =>
                item.id === deletedItemId,
            );

          if (!deletedItem) {
            return currentData;
          }

          const nextItems =
            currentCart.items.filter(
              (item) =>
                item.id !== deletedItemId,
            );

          return {
            ...currentData,

            data: {
              ...currentCart,

              items: nextItems,

              // Keep distinct-item count correct.
              itemCount:
                nextItems.length,

              // Remove the deleted item's quantity
              // from the total quantity.
              totalItems:
                currentCart.totalItems -
                deletedItem.quantity,

              // Remove the deleted item's subtotal.
              subtotal:
                currentCart.subtotal -
                Number(
                  deletedItem.subtotal,
                ),
            },
          };
        },
      );

      // ------------------------------------------------------
      // Refetch from server to guarantee synchronization.
      // ------------------------------------------------------

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
      // ------------------------------------------------------
      // Clear the cached cart immediately.
      // ------------------------------------------------------

      queryClient.setQueryData<CartResponse>(
        cartKeys.current(),
        (currentData) => {
          if (!currentData?.data) {
            return currentData;
          }

          return {
            ...currentData,

            data: {
              ...currentData.data,

              items: [],

              totalItems: 0,

              itemCount: 0,

              subtotal: 0,
            },
          };
        },
      );

      // ------------------------------------------------------
      // Refetch to guarantee synchronization.
      // ------------------------------------------------------

      await queryClient.invalidateQueries({
        queryKey: cartKeys.current(),
        refetchType: "active",
      });
    },
  });
}
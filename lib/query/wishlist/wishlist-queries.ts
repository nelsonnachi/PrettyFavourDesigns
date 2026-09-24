import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import { wishlistKeys } from "./wishlist-keys";

import type {
  AddWishlistInput,
  AddWishlistResponse,
  DeleteWishlistResponse,
  WishlistCheckResponse,
  WishlistItem,
  WishlistResponse,
} from "./wishlist-types";

// ============================================================
// GET CURRENT USER WISHLIST
// ============================================================
//
// GET /api/wishlist
//
// Requires authentication.
//
// Returns all wishlist items belonging to the current user.
//
// ============================================================

async function getWishlist(): Promise<WishlistItem[]> {
  const response = await apiClient<WishlistResponse>(
    "/api/wishlist"
  );

  return response.data;
}

// ============================================================
// CHECK PRODUCT WISHLIST STATUS
// ============================================================
//
// GET /api/wishlist/[productId]
//
// Requires authentication.
//
// ============================================================

async function getWishlistStatus(
  productId: string
): Promise<WishlistCheckResponse["data"]> {
  const response = await apiClient<WishlistCheckResponse>(
    `/api/wishlist/${productId}`
  );

  return response.data;
}

// ============================================================
// ADD PRODUCT TO WISHLIST
// ============================================================
//
// POST /api/wishlist
//
// Requires authentication.
//
// ============================================================

async function addToWishlist(
  input: AddWishlistInput
): Promise<AddWishlistResponse["data"]> {
  const response = await apiClient<AddWishlistResponse>(
    "/api/wishlist",
    {
      method: "POST",

      body: JSON.stringify(input),
    }
  );

  return response.data;
}

// ============================================================
// REMOVE PRODUCT FROM WISHLIST
// ============================================================
//
// DELETE /api/wishlist/[productId]
//
// Requires authentication.
//
// ============================================================

async function removeFromWishlist(
  productId: string
): Promise<void> {
  await apiClient<DeleteWishlistResponse>(
    `/api/wishlist/${productId}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// GET WISHLIST
// ============================================================

export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.list(),

    queryFn: getWishlist,

    staleTime: 60 * 1000,
  });
}

// ============================================================
// CHECK PRODUCT WISHLIST STATUS
// ============================================================
//
// Example:
//
// const { data } = useWishlistStatus(productId);
//
// data?.isInWishlist
//
// ============================================================

export function useWishlistStatus(productId: string) {
  return useQuery({
    queryKey: wishlistKeys.product(productId),

    queryFn: () => getWishlistStatus(productId),

    enabled: Boolean(productId),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// ADD TO WISHLIST
// ============================================================

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWishlist,

    onSuccess: (addedItem, variables) => {
      // ------------------------------------------------------
      // Refresh the complete wishlist.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: wishlistKeys.list(),
      });

      // ------------------------------------------------------
      // Update the individual product status immediately.
      // ------------------------------------------------------

      queryClient.setQueryData(
        wishlistKeys.product(variables.productId),
        {
          isInWishlist: true,

          item: {
            id: addedItem.id,

            productId: addedItem.productId,

            createdAt: addedItem.createdAt,
          },
        }
      );
    },
  });
}

// ============================================================
// REMOVE FROM WISHLIST
// ============================================================

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWishlist,

    onSuccess: (_data, productId) => {
      // ------------------------------------------------------
      // Refresh the complete wishlist.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: wishlistKeys.list(),
      });

      // ------------------------------------------------------
      // Update the individual product status immediately.
      // ------------------------------------------------------

      queryClient.setQueryData(
        wishlistKeys.product(productId),
        {
          isInWishlist: false,

          item: null,
        }
      );
    },
  });
}
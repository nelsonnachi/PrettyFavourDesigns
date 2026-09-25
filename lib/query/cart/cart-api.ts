import { apiClient } from "@/lib/api/client";

import type {
  AddToCartInput,
  AddToCartResponse,
  CartResponse,
  ClearCartResponse,
  RemoveCartItemResponse,
  UpdateCartItemResponse,
} from "./cart-types";

// ============================================================
// GET CART
// ============================================================

export async function getCart() {
  return apiClient<CartResponse>("/api/cart");
}

// ============================================================
// ADD TO CART
// ============================================================

export async function addToCart(input: AddToCartInput) {
  return apiClient<AddToCartResponse>("/api/cart", {
    method: "POST",

    body: JSON.stringify(input),
  });
}

// ============================================================
// UPDATE CART ITEM
// ============================================================

export async function updateCartItem(
  id: string,
  quantity: number,
) {
  return apiClient<UpdateCartItemResponse>(
    `/api/cart/${id}`,
    {
      method: "PATCH",

      body: JSON.stringify({
        quantity,
      }),
    },
  );
}

// ============================================================
// REMOVE CART ITEM
// ============================================================

export async function removeCartItem(id: string) {
  return apiClient<RemoveCartItemResponse>(
    `/api/cart/${id}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================
// CLEAR CART
// ============================================================

export async function clearCart() {
  return apiClient<ClearCartResponse>(
    "/api/cart/clear",
    {
      method: "DELETE",
    },
  );
}
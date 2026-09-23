import { useQuery } from "@tanstack/react-query";

import { getCart } from "./cart-api";

import { cartKeys } from "./cart-keys";

// ============================================================
// GET CART
// ============================================================

export function useCart() {
  return useQuery({
    queryKey: cartKeys.current(),

    queryFn: getCart,
  });
}
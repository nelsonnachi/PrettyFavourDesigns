"use client";

import { useQuery } from "@tanstack/react-query";

import { applyDiscount } from "./discount-api";
import { discountKeys } from "./discount-keys";

// ============================================================
// DISCOUNT PREVIEW
// ============================================================
//
// Checks a code against the current cart.
//
//   code     = the code the customer applied (null = none yet)
//   subtotal = the current cart subtotal
//
// How it behaves:
//
//   - code is null            -> does nothing
//   - code is valid           -> returns the discount amount
//   - code is invalid         -> goes into "error" (use error.message)
//   - cart subtotal changes   -> checks the code again automatically
//
// This only PREVIEWS the discount. The real discount is applied
// by the checkout route when the order is created.
//
// ============================================================

export function useDiscountPreview(code: string | null, subtotal: number) {
  return useQuery({
    queryKey: discountKeys.preview(code ?? "", subtotal),

    // "enabled" stops this from running when code is null,
    // so "code as string" is safe here.
    queryFn: () => applyDiscount({ code: code as string }),

    enabled: Boolean(code),

    // A wrong code won't become right by retrying
    retry: false,

    // Don't re-check just because the customer switched tabs
    refetchOnWindowFocus: false,

    staleTime: 30 * 1000,
  });
}
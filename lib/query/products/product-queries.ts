import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getAdminProducts,
  getProductRatings,
  getPublicProduct,
  getPublicProducts,
} from "./product-api";

import { productKeys } from "./product-keys";

import type {
  AdminProductFilters,
  PublicProductFilters,
} from "./product-types";

// ============================================================
// PUBLIC PRODUCT LIST
// ============================================================

export function useProducts(
  filters: PublicProductFilters = {},
) {
  return useQuery({
    queryKey: productKeys.publicList(filters),

    queryFn: () => getPublicProducts(filters),

    // ==========================================================
    // CACHE
    // ==========================================================
    //
    // Keep products fresh for 30 minutes.
    // During this time, navigating away and coming back
    // will use the cached products immediately.
    //
    staleTime: 30 * 60 * 1000,

    // Keep unused product lists in memory for 1 hour.
    //
    // This means if the user leaves Shop and visits Contact,
    // the product data is still available when they return.
    //
    gcTime: 60 * 60 * 1000,

    // Do not refetch simply because the Shop component
    // mounts again after navigating back to it.
    //
    refetchOnMount: false,

    // Do not refetch when the browser window receives focus.
    refetchOnWindowFocus: false,

    // Retry a failed request once.
    retry: 1,

    // Keep the old products visible while filters change.
    placeholderData: keepPreviousData,
  });
}

// ============================================================
// PUBLIC PRODUCT DETAIL
// ============================================================

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.publicDetail(slug),

    queryFn: () => getPublicProduct(slug),

    enabled: Boolean(slug),

    // Keep product details fresh for 30 minutes.
    staleTime: 30 * 60 * 1000,

    // Keep product details cached for 1 hour.
    gcTime: 60 * 60 * 1000,

    // Do not refetch when navigating back to the page.
    refetchOnMount: false,

    // Do not refetch when browser window receives focus.
    refetchOnWindowFocus: false,

    // Retry once if the request fails.
    retry: 1,
  });
}

// ============================================================
// PRODUCT RATINGS
// ============================================================

export function useProductRatings(slug: string) {
  return useQuery({
    queryKey: productKeys.productRatings(slug),

    queryFn: () => getProductRatings(slug),

    enabled: Boolean(slug),

    // Ratings can also stay cached.
    staleTime: 10 * 60 * 1000,

    gcTime: 60 * 60 * 1000,

    refetchOnMount: false,

    refetchOnWindowFocus: false,

    retry: 1,
  });
}

// ============================================================
// ADMIN PRODUCT LIST
// ============================================================

export function useAdminProducts(
  filters: AdminProductFilters = {},
) {
  return useQuery({
    queryKey: productKeys.adminList(filters),

    queryFn: () => getAdminProducts(filters),

    staleTime: 5 * 60 * 1000,

    gcTime: 30 * 60 * 1000,

    refetchOnMount: false,

    refetchOnWindowFocus: false,

    retry: 1,

    placeholderData: keepPreviousData,
  });
}
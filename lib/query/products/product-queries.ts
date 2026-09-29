import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getAdminProduct,
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

    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,

    refetchOnMount: false,
    refetchOnWindowFocus: false,

    retry: 1,

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

    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,

    refetchOnMount: false,
    refetchOnWindowFocus: false,

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

// ============================================================
// ADMIN PRODUCT DETAIL
// ============================================================

export function useAdminProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.adminDetail(slug),

    queryFn: () => getAdminProduct(slug),

    enabled: Boolean(slug),

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    refetchOnMount: false,
    refetchOnWindowFocus: false,

    retry: 1,
  });
}
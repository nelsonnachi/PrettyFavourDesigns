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

export function useProducts(filters: PublicProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.publicList(filters),

    queryFn: () => getPublicProducts(filters),

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
  });
}

// ============================================================
// ADMIN PRODUCT LIST
// ============================================================

export function useAdminProducts(filters: AdminProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.adminList(filters),

    queryFn: () => getAdminProducts(filters),

    placeholderData: keepPreviousData,
  });
}

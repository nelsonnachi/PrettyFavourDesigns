import { apiClient } from "@/lib/api/client";

import type {
  AdminCreateProductResponse,
  AdminDeleteProductResponse,
  AdminProductFilters,
  AdminProductListResponse,
  AdminUpdateProductResponse,
  PublicProductFilters,
  PublicProductListResponse,
  PublicProductResponse,
  ProductRatingsResponse,
  AdminProductResponse,
} from "./product-types";

// ============================================================
// HELPERS
// ============================================================

function buildProductSearchParams(
  filters: PublicProductFilters | AdminProductFilters
) {
  const params = new URLSearchParams();

  // ==========================================================
  // SEARCH
  // ==========================================================

  if (filters.search) {
    params.set("search", filters.search);
  }

  // ==========================================================
  // CATEGORY
  // ==========================================================

  if (filters.categoryId) {
    params.set("categoryId", filters.categoryId);
  }

  // ==========================================================
  // COLOR
  // ==========================================================

  if (filters.colorId) {
    params.set("colorId", filters.colorId);
  }

  // ==========================================================
  // PRICE
  // ==========================================================

  if (filters.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  // ==========================================================
  // ADMIN-ONLY STATUS
  // ==========================================================
  //
  // PublicProductFilters does not have `status`.
  //
  // `in` safely checks whether this is an AdminProductFilters
  // object before accessing the status property.
  //
  // ==========================================================

  if ("status" in filters && filters.status) {
    params.set("status", filters.status);
  }

  // ==========================================================
  // STOCK
  // ==========================================================

  if (filters.inStock !== undefined) {
    params.set("inStock", String(filters.inStock));
  }

  // ==========================================================
  // FEATURED
  // ==========================================================

  if (filters.isFeatured !== undefined) {
    params.set("isFeatured", String(filters.isFeatured));
  }

  // ==========================================================
  // NEW ARRIVAL
  // ==========================================================

  if (filters.isNewArrival !== undefined) {
    params.set("isNewArrival", String(filters.isNewArrival));
  }

  // ==========================================================
  // BEST SELLER
  // ==========================================================

  if (filters.isBestSeller !== undefined) {
    params.set("isBestSeller", String(filters.isBestSeller));
  }

  // ==========================================================
  // PAGINATION
  // ==========================================================

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  // ==========================================================
  // SORT
  // ==========================================================

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  return params;
}

// ============================================================
// PUBLIC PRODUCTS
// ============================================================

export async function getPublicProducts(filters: PublicProductFilters = {}) {
  const params = buildProductSearchParams(filters);

  const queryString = params.toString();

  const url = queryString ? `/api/products?${queryString}` : "/api/products";

  return apiClient<PublicProductListResponse>(url);
}

// ============================================================
// PUBLIC PRODUCT DETAIL
// ============================================================

export async function getPublicProduct(slug: string) {
  return apiClient<PublicProductResponse>(`/api/products/${slug}`);
}

// ============================================================
// PRODUCT RATINGS
// ============================================================

export async function getProductRatings(slug: string) {
  return apiClient<ProductRatingsResponse>(`/api/products/${slug}/ratings`);
}

// ============================================================
// ADMIN PRODUCTS
// ============================================================

export async function getAdminProducts(filters: AdminProductFilters = {}) {
  const params = buildProductSearchParams(filters);

  const queryString = params.toString();

  const url = queryString
    ? `/api/admin/products?${queryString}`
    : "/api/admin/products";

  return apiClient<AdminProductListResponse>(url);
}

// ============================================================
// CREATE ADMIN PRODUCT
// ============================================================

export async function createAdminProduct(formData: FormData) {
  return apiClient<AdminCreateProductResponse>("/api/admin/products", {
    method: "POST",
    body: formData,
  });
}

// ============================================================
// UPDATE ADMIN PRODUCT
// ============================================================

export async function updateAdminProduct(slug: string, formData: FormData) {
  return apiClient<AdminUpdateProductResponse>(`/api/admin/products/${slug}`, {
    method: "PATCH",
    body: formData,
  });
}

// ============================================================
// DELETE ADMIN PRODUCT
// ============================================================

export async function deleteAdminProduct(slug: string) {
  return apiClient<AdminDeleteProductResponse>(`/api/admin/products/${slug}`, {
    method: "DELETE",
  });
}

// ============================================================
// ADMIN PRODUCT DETAIL
// ============================================================

export async function getAdminProduct(slug: string) {
  return apiClient<AdminProductResponse>(
    `/api/admin/products/${slug}`,
  );
}

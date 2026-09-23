"use client";

import {
  useQuery,
} from "@tanstack/react-query";


import {
  categoryKeys,
} from "./category-keys";

import type {
  CategoriesResponse,
  CategoryResponse,
} from "./category-types";
import { apiClient } from "@/lib/api/client";

// ============================================================
// PUBLIC CATEGORIES
// ============================================================
//
// GET /api/categories
//
// Returns only active categories.
//
// ============================================================

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.publicList(),

    queryFn: async () => {
      return apiClient<CategoriesResponse>(
        "/api/categories",
      );
    },

    staleTime: 60 * 1000,
  });
}

// ============================================================
// PUBLIC CATEGORY BY SLUG
// ============================================================
//
// GET /api/categories/[slug]
//
// Example:
//
// /api/categories/bags
//
// ============================================================

export function useCategoryBySlug(
  slug: string,
) {
  return useQuery({
    queryKey: categoryKeys.publicDetail(slug),

    queryFn: async () => {
      return apiClient<CategoryResponse>(
        `/api/categories/${slug}`,
      );
    },

    enabled: Boolean(slug),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// ADMIN - ALL CATEGORIES
// ============================================================
//
// GET /api/admin/categories
//
// Returns active + inactive categories.
//
// ============================================================

export function useAdminCategories() {
  return useQuery({
    queryKey: categoryKeys.adminList(),

    queryFn: async () => {
      return apiClient<CategoriesResponse>(
        "/api/admin/categories",
      );
    },

    staleTime: 60 * 1000,
  });
}

// ============================================================
// ADMIN - CATEGORY BY ID
// ============================================================
//
// GET /api/admin/categories/[id]
//
// ============================================================

export function useAdminCategory(
  id: string,
) {
  return useQuery({
    queryKey: categoryKeys.adminDetail(id),

    queryFn: async () => {
      return apiClient<CategoryResponse>(
        `/api/admin/categories/${id}`,
      );
    },

    enabled: Boolean(id),

    staleTime: 60 * 1000,
  });
}
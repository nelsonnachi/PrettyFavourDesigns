"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoryKeys } from "./category-keys";

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryMutationResponse,
  DeleteCategoryResponse,
} from "./category-types";
import { apiClient } from "@/lib/api/client";

// ============================================================
// CREATE CATEGORY
// ============================================================
//
// POST /api/admin/categories
//
// ============================================================

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      return apiClient<CategoryMutationResponse>("/api/admin/categories", {
        method: "POST",

        body: JSON.stringify(data),
      });
    },

    onSuccess: () => {
      // ------------------------------------------------------
      // Refresh admin category list
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: categoryKeys.adminList(),
      });

      // ------------------------------------------------------
      // Refresh public categories
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: categoryKeys.publicList(),
      });
    },
  });
}

// ============================================================
// UPDATE CATEGORY
// ============================================================
//
// PATCH /api/admin/categories/[id]
//
// ============================================================

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;

      data: UpdateCategoryInput;
    }) => {
      return apiClient<CategoryMutationResponse>(
        `/api/admin/categories/${id}`,
        {
          method: "PATCH",

          body: JSON.stringify(data),
        }
      );
    },

    onSuccess: (response, variables) => {
      // ------------------------------------------------------
      // Update the individual admin category cache
      // ------------------------------------------------------

      queryClient.setQueryData(categoryKeys.adminDetail(variables.id), {
        success: true,
        data: response.data,
      });

      // ------------------------------------------------------
      // Refresh admin category list
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: categoryKeys.adminList(),
      });

      // ------------------------------------------------------
      // Refresh public category list
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: categoryKeys.publicList(),
      });

      // ------------------------------------------------------
      // Refresh public category details
      //
      // We invalidate the entire public category
      // section because the slug may have changed.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: categoryKeys.public(),
      });
    },
  });
}

// ============================================================
// DELETE CATEGORY
// ============================================================
//
// DELETE /api/admin/categories/[id]
//
// ============================================================

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient<DeleteCategoryResponse>(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
    },

    onSuccess: (_response, id) => {
      // ------------------------------------------------------
      // Remove deleted category from individual cache
      // ------------------------------------------------------

      queryClient.removeQueries({
        queryKey: categoryKeys.adminDetail(id),
      });

      // ------------------------------------------------------
      // Refresh admin categories
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: categoryKeys.adminList(),
      });

      // ------------------------------------------------------
      // Refresh public categories
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: categoryKeys.publicList(),
      });
    },
  });
}

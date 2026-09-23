import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
} from "./product-api";

import { productKeys } from "./product-keys";

// ============================================================
// CREATE PRODUCT
// ============================================================

export function useCreateAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
}

// ============================================================
// UPDATE PRODUCT
// ============================================================

export function useUpdateAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, formData }: { slug: string; formData: FormData }) =>
      updateAdminProduct(slug, formData),

    onSuccess: (response, variables) => {
      // ------------------------------------------------------
      // Refresh admin product lists
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: productKeys.adminLists(),
      });

      // ------------------------------------------------------
      // Refresh admin detail using old slug
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: productKeys.adminDetail(variables.slug),
      });

      // ------------------------------------------------------
      // Refresh public product lists
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: productKeys.publicLists(),
      });

      // ------------------------------------------------------
      // Refresh old public detail
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: productKeys.publicDetail(variables.slug),
      });

      // ------------------------------------------------------
      // If slug changed, refresh the new slug too
      // ------------------------------------------------------

      if (response.data.slug) {
        queryClient.invalidateQueries({
          queryKey: productKeys.adminDetail(response.data.slug),
        });

        queryClient.invalidateQueries({
          queryKey: productKeys.publicDetail(response.data.slug),
        });
      }
    },
  });
}

// ============================================================
// DELETE PRODUCT
// ============================================================

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminProduct,

    onSuccess: (_, slug) => {
      // ------------------------------------------------------
      // Refresh admin product lists
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: productKeys.adminLists(),
      });

      // ------------------------------------------------------
      // Refresh public product lists
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: productKeys.publicLists(),
      });

      // ------------------------------------------------------
      // Remove public detail
      // ------------------------------------------------------

      queryClient.removeQueries({
        queryKey: productKeys.publicDetail(slug),
      });

      // ------------------------------------------------------
      // Remove admin detail
      // ------------------------------------------------------

      queryClient.removeQueries({
        queryKey: productKeys.adminDetail(slug),
      });
    },
  });
}

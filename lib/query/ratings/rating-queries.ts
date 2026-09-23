import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ratingKeys } from "./rating-keys";

import type {
  CreateRatingInput,
  Rating,
  UpdateRatingInput,
} from "./rating-types";
import { apiClient } from "@/lib/api/client";

// ============================================================
// RESPONSE TYPES
// ============================================================

interface RatingsResponse {
  success: boolean;
  data: Rating[];
}

interface RatingResponse {
  success: boolean;
  data: Rating;
  message?: string;
}

interface DeleteRatingResponse {
  success: boolean;
  message: string;
}

// ============================================================
// GET PRODUCT RATINGS
// ============================================================
//
// GET /api/products/[slug]/ratings
//
// Public endpoint.
//
// Customers can use this to see all ratings for a product.
//
// ============================================================

async function getProductRatings(slug: string): Promise<Rating[]> {
  const response = await apiClient<RatingsResponse>(
    `/api/products/${slug}/ratings`
  );

  return response.data;
}

// ============================================================
// CREATE RATING
// ============================================================
//
// POST /api/ratings
//
// Requires authentication.
//
// ============================================================

async function createRating(input: CreateRatingInput): Promise<Rating> {
  const response = await apiClient<RatingResponse>("/api/ratings", {
    method: "POST",

    body: JSON.stringify(input),
  });

  return response.data;
}

// ============================================================
// UPDATE RATING
// ============================================================
//
// PATCH /api/ratings/[id]
//
// Requires authentication.
//
// A user can only update their own rating.
//
// ============================================================

async function updateRating({
  id,
  data,
}: {
  id: string;
  data: UpdateRatingInput;
}): Promise<Rating> {
  const response = await apiClient<RatingResponse>(`/api/ratings/${id}`, {
    method: "PATCH",

    body: JSON.stringify(data),
  });

  return response.data;
}

// ============================================================
// DELETE RATING
// ============================================================
//
// DELETE /api/ratings/[id]
//
// Requires authentication.
//
// A user can only delete their own rating.
//
// ============================================================

async function deleteRating(id: string): Promise<void> {
  await apiClient<DeleteRatingResponse>(`/api/ratings/${id}`, {
    method: "DELETE",
  });
}

// ============================================================
// GET PRODUCT RATINGS QUERY
// ============================================================

export function useProductRatings(slug: string) {
  return useQuery({
    queryKey: ratingKeys.product(slug),

    queryFn: () => getProductRatings(slug),

    enabled: Boolean(slug),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// CREATE RATING MUTATION
// ============================================================

export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,

    onSuccess: (_createdRating, variables) => {
      // ------------------------------------------------------
      // Refresh the product ratings.
      //
      // The API also updates:
      // - product.averageRating
      // - product.ratingCount
      //
      // So we need the product query refreshed as well.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: ratingKeys.product(variables.productId),
      });
    },
  });
}

// ============================================================
// UPDATE RATING MUTATION
// ============================================================

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,

    onSuccess: (updatedRating) => {
      // ------------------------------------------------------
      // Cache the updated rating.
      // ------------------------------------------------------

      queryClient.setQueryData(
        ratingKeys.detail(updatedRating.id),
        updatedRating
      );

      // ------------------------------------------------------
      // Refresh product ratings.
      //
      // The product average and count are also recalculated
      // by the backend.
      // ------------------------------------------------------
      //
      // We don't know the product slug from the update
      // response, so the product rating queries are handled
      // through invalidation below.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: ratingKeys.all,
      });
    },
  });
}

// ============================================================
// DELETE RATING MUTATION
// ============================================================

export function useDeleteRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,

    onSuccess: (_data, deletedId) => {
      // ------------------------------------------------------
      // Remove the deleted rating from its detail cache.
      // ------------------------------------------------------

      queryClient.removeQueries({
        queryKey: ratingKeys.detail(deletedId),
      });

      // ------------------------------------------------------
      // Refresh product ratings.
      //
      // The backend recalculates the product's:
      // - averageRating
      // - ratingCount
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: ratingKeys.all,
      });
    },
  });
}

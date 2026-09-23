import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import { ratingKeys } from "./rating-keys";

import type {
  CreateRatingInput,
  Rating,
  UpdateRatingInput,
} from "./rating-types";

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
// ============================================================

async function deleteRating(id: string): Promise<void> {
  await apiClient<DeleteRatingResponse>(`/api/ratings/${id}`, {
    method: "DELETE",
  });
}

// ============================================================
// GET PRODUCT RATINGS
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
// CREATE RATING
// ============================================================

export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,

    onSuccess: (_createdRating, variables) => {
      // ------------------------------------------------------
      // Refresh ratings for this product.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: ratingKeys.product(variables.productId),
      });

      // ------------------------------------------------------
      // The product averageRating and ratingCount were also
      // updated by the backend.
      //
      // Product cache can be invalidated here once the
      // product query key is available.
      // ------------------------------------------------------
    },
  });
}

// ============================================================
// UPDATE RATING
// ============================================================

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,

    onSuccess: (updatedRating) => {
      // ------------------------------------------------------
      // Update the rating detail cache.
      // ------------------------------------------------------

      queryClient.setQueryData(
        ratingKeys.detail(updatedRating.id),
        updatedRating
      );

      // ------------------------------------------------------
      // Refresh all product rating lists.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: ratingKeys.all,
      });
    },
  });
}

// ============================================================
// DELETE RATING
// ============================================================

export function useDeleteRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,

    onSuccess: (_data, deletedId) => {
      // ------------------------------------------------------
      // Remove rating detail cache.
      // ------------------------------------------------------

      queryClient.removeQueries({
        queryKey: ratingKeys.detail(deletedId),
      });

      // ------------------------------------------------------
      // Refresh product rating lists.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: ratingKeys.all,
      });
    },
  });
}

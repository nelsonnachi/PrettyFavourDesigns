import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { colorKeys } from "./color-keys";

import type { Color, CreateColorInput, UpdateColorInput } from "./color-types";
import { apiClient } from "@/lib/api/client";

// ============================================================
// RESPONSE TYPES
// ============================================================

interface ColorsResponse {
  success: boolean;
  data: Color[];
}

interface ColorResponse {
  success: boolean;
  data: Color;
  message?: string;
}

// ============================================================
// GET ACTIVE COLORS
// ============================================================
//
// GET /api/colors
//
// Public query.
//
// Used by:
// - Product filters
// - Product variant selectors
// - Customer-facing color options
//
// ============================================================

async function getActiveColors(): Promise<Color[]> {
  const response = await apiClient<ColorsResponse>("/api/colors");

  return response.data;
}

// ============================================================
// GET ALL COLORS - ADMIN
// ============================================================
//
// GET /api/admin/colors
//
// Admin only.
//
// Returns both active and inactive colors.
//
// ============================================================

async function getAdminColors(): Promise<Color[]> {
  const response = await apiClient<ColorsResponse>("/api/admin/colors");

  return response.data;
}

// ============================================================
// GET SINGLE COLOR - ADMIN
// ============================================================
//
// GET /api/admin/colors/[id]
//
// ============================================================

async function getAdminColor(id: string): Promise<Color> {
  const response = await apiClient<ColorResponse>(`/api/admin/colors/${id}`);

  return response.data;
}

// ============================================================
// CREATE COLOR
// ============================================================
//
// POST /api/admin/colors
//
// ============================================================

async function createColor(input: CreateColorInput): Promise<Color> {
  const response = await apiClient<ColorResponse>("/api/admin/colors", {
    method: "POST",

    body: JSON.stringify(input),
  });

  return response.data;
}

// ============================================================
// UPDATE COLOR
// ============================================================
//
// PATCH /api/admin/colors/[id]
//
// ============================================================

async function updateColor({
  id,
  data,
}: {
  id: string;
  data: UpdateColorInput;
}): Promise<Color> {
  const response = await apiClient<ColorResponse>(`/api/admin/colors/${id}`, {
    method: "PATCH",

    body: JSON.stringify(data),
  });

  return response.data;
}

// ============================================================
// DELETE COLOR
// ============================================================
//
// DELETE /api/admin/colors/[id]
//
// ============================================================

async function deleteColor(id: string): Promise<void> {
  await apiClient<{
    success: boolean;
    message: string;
  }>(`/api/admin/colors/${id}`, {
    method: "DELETE",
  });
}

// ============================================================
// PUBLIC COLORS QUERY
// ============================================================

export function useColors() {
  return useQuery({
    queryKey: colorKeys.active(),

    queryFn: getActiveColors,

    staleTime: 60 * 1000,
  });
}

// ============================================================
// ADMIN COLORS QUERY
// ============================================================

export function useAdminColors() {
  return useQuery({
    queryKey: colorKeys.admin(),

    queryFn: getAdminColors,

    staleTime: 60 * 1000,
  });
}

// ============================================================
// SINGLE ADMIN COLOR QUERY
// ============================================================

export function useAdminColor(id: string) {
  return useQuery({
    queryKey: colorKeys.detail(id),

    queryFn: () => getAdminColor(id),

    enabled: Boolean(id),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// CREATE COLOR MUTATION
// ============================================================

export function useCreateColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createColor,

    onSuccess: () => {
      // ------------------------------------------------------
      // Refresh admin colors
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: colorKeys.admin(),
      });

      // ------------------------------------------------------
      // Refresh public active colors
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: colorKeys.active(),
      });
    },
  });
}

// ============================================================
// UPDATE COLOR MUTATION
// ============================================================

export function useUpdateColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateColor,

    onSuccess: (updatedColor) => {
      // ------------------------------------------------------
      // Update the individual color cache immediately
      // ------------------------------------------------------

      queryClient.setQueryData(colorKeys.detail(updatedColor.id), updatedColor);

      // ------------------------------------------------------
      // Refresh admin colors
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: colorKeys.admin(),
      });

      // ------------------------------------------------------
      // Refresh public colors
      //
      // Important because isActive can change.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: colorKeys.active(),
      });
    },
  });
}

// ============================================================
// DELETE COLOR MUTATION
// ============================================================

export function useDeleteColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteColor,

    onSuccess: (_data, deletedId) => {
      // ------------------------------------------------------
      // Remove deleted color from detail cache
      // ------------------------------------------------------

      queryClient.removeQueries({
        queryKey: colorKeys.detail(deletedId),
      });

      // ------------------------------------------------------
      // Refresh admin colors
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: colorKeys.admin(),
      });

      // ------------------------------------------------------
      // Refresh public colors
      //
      // This matters when a color was physically deleted.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: colorKeys.active(),
      });
    },
  });
}

"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import {
  announcementKeys,
} from "./announcements-keys";

import type {
  AdminAnnouncementListResponse,
  AdminAnnouncementResponse,
  AdminCreateAnnouncementResponse,
  AdminDeleteAnnouncementResponse,
  AdminUpdateAnnouncementResponse,
  CreateAnnouncementInput,
  PublicAnnouncementResponse,
  UpdateAnnouncementInput,
} from "./announcements-types";

// ============================================================
// PUBLIC - GET CURRENT ANNOUNCEMENT
// ============================================================

export async function getAnnouncement(
  filters?: {
    type?: string;
  },
) {
  const params =
    new URLSearchParams();

  if (filters?.type) {
    params.set(
      "type",
      filters.type,
    );
  }

  const queryString =
    params.toString();

  const url = queryString
    ? `/api/announcements?${queryString}`
    : "/api/announcements";

  return apiClient<PublicAnnouncementResponse>(
    url,
  );
}

// ============================================================
// ADMIN - GET CURRENT ANNOUNCEMENT
// ============================================================

export async function getAdminAnnouncement() {
  return apiClient<AdminAnnouncementListResponse>(
    "/api/admin/announcements",
  );
}

// ============================================================
// ADMIN - GET ANNOUNCEMENT BY ID
// ============================================================

export async function getAdminAnnouncementById(
  id: string,
) {
  return apiClient<AdminAnnouncementResponse>(
    `/api/admin/announcements/${id}`,
  );
}

// ============================================================
// ADMIN - CREATE / REPLACE
// ============================================================

export async function createAnnouncement(
  input: CreateAnnouncementInput,
) {
  const formData =
    new FormData();

  formData.append(
    "image",
    input.image,
  );

  if (input.type) {
    formData.append(
      "type",
      input.type,
    );
  }

  if (
    input.title !== undefined
  ) {
    formData.append(
      "title",
      input.title,
    );
  }

  if (
    input.ctaText !== undefined
  ) {
    formData.append(
      "ctaText",
      input.ctaText,
    );
  }

  if (
    input.ctaUrl !== undefined
  ) {
    formData.append(
      "ctaUrl",
      input.ctaUrl,
    );
  }

  return apiClient<AdminCreateAnnouncementResponse>(
    "/api/admin/announcements",
    {
      method: "POST",
      body: formData,
    },
  );
}

// ============================================================
// ADMIN - UPDATE
// ============================================================

export async function updateAnnouncement(
  input: UpdateAnnouncementInput,
) {
  const formData =
    new FormData();

  if (input.image) {
    formData.append(
      "image",
      input.image,
    );
  }

  if (
    input.type !== undefined
  ) {
    formData.append(
      "type",
      input.type,
    );
  }

  if (
    input.title !== undefined
  ) {
    formData.append(
      "title",
      input.title ?? "",
    );
  }

  if (
    input.ctaText !== undefined
  ) {
    formData.append(
      "ctaText",
      input.ctaText ?? "",
    );
  }

  if (
    input.ctaUrl !== undefined
  ) {
    formData.append(
      "ctaUrl",
      input.ctaUrl ?? "",
    );
  }

  return apiClient<AdminUpdateAnnouncementResponse>(
    `/api/admin/announcements/${input.id}`,
    {
      method: "PATCH",
      body: formData,
    },
  );
}

// ============================================================
// ADMIN - DELETE
// ============================================================

export async function deleteAnnouncement(
  id: string,
) {
  return apiClient<AdminDeleteAnnouncementResponse>(
    `/api/admin/announcements/${id}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================
// PUBLIC QUERY
// ============================================================

export function useAnnouncement(
  filters?: {
    type?: string;
  },
) {
  return useQuery({
    queryKey: [
      ...announcementKeys.public(),
      filters?.type ?? "all",
    ],

    queryFn: () =>
      getAnnouncement(filters),

    staleTime: 60 * 1000,

    select: (response) =>
      response.data.announcement,
  });
}

// ============================================================
// ADMIN CURRENT QUERY
// ============================================================

export function useAdminAnnouncement() {
  return useQuery({
    queryKey:
      announcementKeys.adminCurrent(),

    queryFn:
      getAdminAnnouncement,

    staleTime: 30 * 1000,

    select: (response) =>
      response.data.announcement,
  });
}

// ============================================================
// ADMIN DETAIL QUERY
// ============================================================

export function useAdminAnnouncementById(
  id: string,
) {
  return useQuery({
    queryKey:
      announcementKeys.adminDetail(id),

    queryFn: () =>
      getAdminAnnouncementById(id),

    enabled: Boolean(id),

    staleTime: 30 * 1000,

    select: (response) =>
      response.data.announcement,
  });
}

// ============================================================
// CREATE / REPLACE MUTATION
// ============================================================

export function useCreateAnnouncement() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: CreateAnnouncementInput,
    ) =>
      createAnnouncement(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.all,
      });
    },
  });
}

// ============================================================
// UPDATE MUTATION
// ============================================================

export function useUpdateAnnouncement() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: UpdateAnnouncementInput,
    ) =>
      updateAnnouncement(input),

    onSuccess: (
      _response,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.adminDetail(
            variables.id,
          ),
      });
    },
  });
}

// ============================================================
// DELETE MUTATION
// ============================================================

export function useDeleteAnnouncement() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) =>
      deleteAnnouncement(id),

    onSuccess: (
      _response,
      id,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.all,
      });

      queryClient.removeQueries({
        queryKey:
          announcementKeys.adminDetail(id),
      });
    },
  });
}
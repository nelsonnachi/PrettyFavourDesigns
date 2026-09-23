import { apiClient } from "@/lib/api/client";

import type {
  AdminAnnouncementFilters,
  AdminAnnouncementListResponse,
  AdminAnnouncementResponse,
  AdminCreateAnnouncementResponse,
  AdminDeleteAnnouncementResponse,
  AdminUpdateAnnouncementResponse,
  PublicAnnouncementFilters,
  PublicAnnouncementListResponse,
} from "./announcement-types";

// ============================================================
// HELPERS
// ============================================================

function buildPublicAnnouncementSearchParams(
  filters: PublicAnnouncementFilters,
) {
  const params = new URLSearchParams();

  if (filters.type) {
    params.set("type", filters.type);
  }

  return params;
}

function buildAdminAnnouncementSearchParams(
  filters: AdminAnnouncementFilters,
) {
  const params = new URLSearchParams();

  // ==========================================================
  // SEARCH
  // ==========================================================

  if (filters.search) {
    params.set("search", filters.search);
  }

  // ==========================================================
  // TYPE
  // ==========================================================

  if (filters.type) {
    params.set("type", filters.type);
  }

  // ==========================================================
  // PUBLISHED
  // ==========================================================

  if (filters.isPublished !== undefined) {
    params.set(
      "isPublished",
      String(filters.isPublished),
    );
  }

  // ==========================================================
  // PAGINATION
  // ==========================================================

  if (filters.page !== undefined) {
    params.set(
      "page",
      String(filters.page),
    );
  }

  if (filters.limit !== undefined) {
    params.set(
      "limit",
      String(filters.limit),
    );
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
// PUBLIC ANNOUNCEMENTS
// ============================================================

export async function getPublicAnnouncements(
  filters: PublicAnnouncementFilters = {},
) {
  const params =
    buildPublicAnnouncementSearchParams(
      filters,
    );

  const queryString =
    params.toString();

  const url = queryString
    ? `/api/announcements?${queryString}`
    : "/api/announcements";

  return apiClient<PublicAnnouncementListResponse>(
    url,
  );
}

// ============================================================
// ADMIN ANNOUNCEMENTS
// ============================================================

export async function getAdminAnnouncements(
  filters: AdminAnnouncementFilters = {},
) {
  const params =
    buildAdminAnnouncementSearchParams(
      filters,
    );

  const queryString =
    params.toString();

  const url = queryString
    ? `/api/admin/announcements?${queryString}`
    : "/api/admin/announcements";

  return apiClient<AdminAnnouncementListResponse>(
    url,
  );
}

// ============================================================
// ADMIN ANNOUNCEMENT DETAIL
// ============================================================

export async function getAdminAnnouncement(
  id: string,
) {
  return apiClient<AdminAnnouncementResponse>(
    `/api/admin/announcements/${id}`,
  );
}

// ============================================================
// CREATE ADMIN ANNOUNCEMENT
// ============================================================

export async function createAdminAnnouncement(
  data: unknown,
) {
  return apiClient<AdminCreateAnnouncementResponse>(
    "/api/admin/announcements",
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
}

// ============================================================
// UPDATE ADMIN ANNOUNCEMENT
// ============================================================

export async function updateAdminAnnouncement(
  id: string,
  data: unknown,
) {
  return apiClient<AdminUpdateAnnouncementResponse>(
    `/api/admin/announcements/${id}`,
    {
      method: "PATCH",

      body: JSON.stringify(data),
    },
  );
}

// ============================================================
// DELETE ADMIN ANNOUNCEMENT
// ============================================================

export async function deleteAdminAnnouncement(
  id: string,
) {
  return apiClient<AdminDeleteAnnouncementResponse>(
    `/api/admin/announcements/${id}`,
    {
      method: "DELETE",
    },
  );
}
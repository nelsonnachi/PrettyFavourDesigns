import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminAnnouncement,
  getAdminAnnouncements,
  getPublicAnnouncements,
} from "./announcement-api";

import {
  announcementKeys,
} from "./announcement-keys";

import type {
  AdminAnnouncementFilters,
  PublicAnnouncementFilters,
} from "./announcement-types";

// ============================================================
// PUBLIC ANNOUNCEMENTS
// ============================================================

export function useAnnouncements(
  filters: PublicAnnouncementFilters = {},
) {
  return useQuery({
    queryKey:
      announcementKeys.publicList(
        filters,
      ),

    queryFn: () =>
      getPublicAnnouncements(
        filters,
      ),
  });
}

// ============================================================
// ADMIN ANNOUNCEMENTS
// ============================================================

export function useAdminAnnouncements(
  filters: AdminAnnouncementFilters = {},
) {
  return useQuery({
    queryKey:
      announcementKeys.adminList(
        filters,
      ),

    queryFn: () =>
      getAdminAnnouncements(
        filters,
      ),

    placeholderData:
      keepPreviousData,
  });
}

// ============================================================
// ADMIN ANNOUNCEMENT DETAIL
// ============================================================

export function useAdminAnnouncement(
  id: string,
) {
  return useQuery({
    queryKey:
      announcementKeys.adminDetail(
        id,
      ),

    queryFn: () =>
      getAdminAnnouncement(id),

    enabled: Boolean(id),
  });
}
// ============================================================
// ANNOUNCEMENT QUERY KEYS
// ============================================================

export const announcementKeys = {
  // ----------------------------------------------------------
  // ROOT
  // ----------------------------------------------------------

  all: ["announcements"] as const,

  // ----------------------------------------------------------
  // PUBLIC
  // ----------------------------------------------------------

  public: () =>
    [...announcementKeys.all, "public"] as const,

  publicLists: () =>
    [...announcementKeys.public(), "list"] as const,

  publicList: (
    filters: Record<string, unknown>,
  ) =>
    [
      ...announcementKeys.publicLists(),
      filters,
    ] as const,

  // ----------------------------------------------------------
  // ADMIN
  // ----------------------------------------------------------

  admin: () =>
    [...announcementKeys.all, "admin"] as const,

  adminLists: () =>
    [...announcementKeys.admin(), "list"] as const,

  adminList: (
    filters: Record<string, unknown>,
  ) =>
    [
      ...announcementKeys.adminLists(),
      filters,
    ] as const,

  adminDetails: () =>
    [...announcementKeys.admin(), "detail"] as const,

  adminDetail: (id: string) =>
    [
      ...announcementKeys.adminDetails(),
      id,
    ] as const,
};
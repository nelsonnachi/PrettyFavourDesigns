// ============================================================
// NEWSLETTER QUERY KEYS
// ============================================================

export const newsletterKeys = {
  // ----------------------------------------------------------
  // ROOT
  // ----------------------------------------------------------

  all: ["newsletter"] as const,

  // ----------------------------------------------------------
  // PUBLIC
  // ----------------------------------------------------------

  public: () =>
    [...newsletterKeys.all, "public"] as const,

  // ----------------------------------------------------------
  // ADMIN
  // ----------------------------------------------------------

  admin: () =>
    [...newsletterKeys.all, "admin"] as const,

  adminLists: () =>
    [...newsletterKeys.admin(), "list"] as const,

  adminList: (
    filters: Record<string, unknown>,
  ) =>
    [
      ...newsletterKeys.adminLists(),
      filters,
    ] as const,

  adminDetails: () =>
    [...newsletterKeys.admin(), "detail"] as const,

  adminDetail: (id: string) =>
    [
      ...newsletterKeys.adminDetails(),
      id,
    ] as const,
};
// ============================================================
// CONTACT MESSAGE QUERY KEYS
// ============================================================

export const contactMessageKeys = {
  // ----------------------------------------------------------
  // Root
  // ----------------------------------------------------------

  all: ["contact-messages"] as const,

  // ----------------------------------------------------------
  // Admin list
  // ----------------------------------------------------------

  admin: () =>
    [...contactMessageKeys.all, "admin"] as const,

  // ----------------------------------------------------------
  // Admin list with filters
  // ----------------------------------------------------------

  adminList: (
    page: number,
    limit: number,
    search?: string,
    isRead?: boolean,
    sort?: "newest" | "oldest"
  ) =>
    [
      ...contactMessageKeys.admin(),
      "list",
      {
        page,
        limit,
        search,
        isRead,
        sort,
      },
    ] as const,

  // ----------------------------------------------------------
  // Admin single message
  // ----------------------------------------------------------

  adminDetail: (id: string) =>
    [...contactMessageKeys.admin(), "detail", id] as const,
};
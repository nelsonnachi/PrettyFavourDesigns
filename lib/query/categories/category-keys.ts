// ============================================================
// CATEGORY QUERY KEYS
// ============================================================

export const categoryKeys = {
  // ----------------------------------------------------------
  // Everything related to categories
  // ----------------------------------------------------------

  all: ["categories"] as const,

  // ----------------------------------------------------------
  // Public categories
  // ----------------------------------------------------------

  public: () => [...categoryKeys.all, "public"] as const,

  publicList: () =>
    [...categoryKeys.public(), "list"] as const,

  publicDetail: (slug: string) =>
    [...categoryKeys.public(), "detail", slug] as const,

  // ----------------------------------------------------------
  // Admin categories
  // ----------------------------------------------------------

  admin: () =>
    [...categoryKeys.all, "admin"] as const,

  adminList: () =>
    [...categoryKeys.admin(), "list"] as const,

  adminDetail: (id: string) =>
    [...categoryKeys.admin(), "detail", id] as const,
};
// ============================================================
// PRODUCT QUERY KEYS
// ============================================================

export const productKeys = {
  // ----------------------------------------------------------
  // ROOT
  // ----------------------------------------------------------

  all: ["products"] as const,

  // ----------------------------------------------------------
  // PUBLIC PRODUCTS
  // ----------------------------------------------------------

  public: () => [...productKeys.all, "public"] as const,

  publicLists: () => [...productKeys.public(), "list"] as const,

  publicList: (filters: Record<string, unknown>) =>
    [...productKeys.publicLists(), filters] as const,

  publicDetails: () => [...productKeys.public(), "detail"] as const,

  publicDetail: (slug: string) =>
    [...productKeys.publicDetails(), slug] as const,

  // ----------------------------------------------------------
  // ADMIN PRODUCTS
  // ----------------------------------------------------------

  admin: () => [...productKeys.all, "admin"] as const,

  adminLists: () => [...productKeys.admin(), "list"] as const,

  adminList: (filters: Record<string, unknown>) =>
    [...productKeys.adminLists(), filters] as const,

  adminDetails: () => [...productKeys.admin(), "detail"] as const,

  adminDetail: (slug: string) => [...productKeys.adminDetails(), slug] as const,

  // ----------------------------------------------------------
  // RATINGS
  // ----------------------------------------------------------

  ratings: () => [...productKeys.all, "ratings"] as const,

  productRatings: (slug: string) => [...productKeys.ratings(), slug] as const,
};

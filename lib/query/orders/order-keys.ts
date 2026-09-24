// ============================================================
// ORDER QUERY KEYS
// ============================================================

export const orderKeys = {
  // ==========================================================
  // CUSTOMER
  // ==========================================================

  customer: {
    all: ["orders", "customer"] as const,

    lists: () => [...orderKeys.customer.all, "list"] as const,

    list: (params: {
      page?: number;
      limit?: number;
    }) => [...orderKeys.customer.lists(), params] as const,

    details: () => [...orderKeys.customer.all, "detail"] as const,

    detail: (id: string) =>
      [...orderKeys.customer.details(), id] as const,
  },

  // ==========================================================
  // ADMIN
  // ==========================================================

  admin: {
    all: ["orders", "admin"] as const,

    lists: () => [...orderKeys.admin.all, "list"] as const,

    list: (params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      paymentStatus?: string;
      paymentMethod?: string;
    }) => [...orderKeys.admin.lists(), params] as const,

    details: () => [...orderKeys.admin.all, "detail"] as const,

    detail: (id: string) =>
      [...orderKeys.admin.details(), id] as const,
  },
};
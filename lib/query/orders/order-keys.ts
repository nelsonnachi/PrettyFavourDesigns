import type {
  AdminOrderQueryParams,
  CustomerOrderQueryParams,
} from "./order-types";

// ============================================================
// ORDER QUERY KEYS
// ============================================================

export const orderKeys = {
  // ==========================================================
  // CUSTOMER
  // ==========================================================

  customer: {
    all: [
      "orders",
      "customer",
    ] as const,

    lists: () =>
      [
        ...orderKeys.customer.all,
        "list",
      ] as const,

    list: (
      params: CustomerOrderQueryParams,
    ) =>
      [
        ...orderKeys.customer.lists(),
        params,
      ] as const,

    details: () =>
      [
        ...orderKeys.customer.all,
        "detail",
      ] as const,

    detail: (
      id: string,
    ) =>
      [
        ...orderKeys.customer.details(),
        id,
      ] as const,
  },

  // ==========================================================
  // ADMIN
  // ==========================================================

  admin: {
    all: [
      "orders",
      "admin",
    ] as const,

    lists: () =>
      [
        ...orderKeys.admin.all,
        "list",
      ] as const,

    list: (
      params: AdminOrderQueryParams,
    ) =>
      [
        ...orderKeys.admin.lists(),
        params,
      ] as const,

    details: () =>
      [
        ...orderKeys.admin.all,
        "detail",
      ] as const,

    detail: (
      id: string,
    ) =>
      [
        ...orderKeys.admin.details(),
        id,
      ] as const,
  },
};
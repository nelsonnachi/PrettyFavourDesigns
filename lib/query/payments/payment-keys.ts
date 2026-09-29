import type { AdminPaymentFilters } from "./payment-types";

// ============================================================
// ADMIN PAYMENT QUERY KEYS
// ============================================================

export const adminPaymentKeys = {
  all: ["admin", "payments"] as const,

  lists: () =>
    [...adminPaymentKeys.all, "list"] as const,

  list: (
    filters: AdminPaymentFilters,
  ) =>
    [
      ...adminPaymentKeys.lists(),
      filters,
    ] as const,

  details: () =>
    [...adminPaymentKeys.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...adminPaymentKeys.details(),
      id,
    ] as const,
};
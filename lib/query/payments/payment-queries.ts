"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { AdminPaymentFilters } from "./payment-types";
import { getAdminPayment, getAdminPayments } from "./payment-api";
import { adminPaymentKeys } from "./payment-keys";


// ============================================================
// ADMIN PAYMENTS LIST
// ============================================================

export function useAdminPayments(
  filters: AdminPaymentFilters = {},
) {
  return useQuery({
    queryKey:
      adminPaymentKeys.list(filters),

    queryFn: () =>
      getAdminPayments(filters),

    placeholderData:
      keepPreviousData,

    staleTime: 30_000,
  });
}

// ============================================================
// ADMIN PAYMENT DETAIL
// ============================================================

export function useAdminPayment(
  id: string,
) {
  return useQuery({
    queryKey:
      adminPaymentKeys.detail(id),

    queryFn: () =>
      getAdminPayment(id),

    enabled: Boolean(id),

    staleTime: 30_000,
  });
}
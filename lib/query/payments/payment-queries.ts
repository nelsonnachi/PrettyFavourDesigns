"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminPayment,
  getAdminPayments,
} from "./payment-api";

import { adminPaymentKeys } from "./payment-keys";

import type {
  AdminPaymentFilters,
  AdminSalesPeriod,
} from "./payment-types";

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
// ADMIN SALES SUMMARY
// ============================================================

export function useAdminSales(
  period: AdminSalesPeriod = 7,
) {
  return useQuery({
    queryKey:
      adminPaymentKeys.list({
        page: 1,
        limit: 1,
        period,
      }),

    queryFn: () =>
      getAdminPayments({
        page: 1,
        limit: 1,
        period,
      }),

    staleTime: 30_000,

    refetchOnWindowFocus: false,
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
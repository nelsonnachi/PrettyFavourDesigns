import { useQuery } from "@tanstack/react-query";

import {
  getAdminOrder,
  getAdminOrders,
  getCustomerOrder,
  getCustomerOrders,
} from "./order-api";

import { orderKeys } from "./order-keys";

import type {
  AdminOrderQueryParams,
  CustomerOrderQueryParams,
} from "./order-types";

// ============================================================
// CUSTOMER ORDERS
// ============================================================

// ============================================================
// GET CUSTOMER ORDERS
// ============================================================

export function useCustomerOrders(
  params: CustomerOrderQueryParams = {},
) {
  return useQuery({
    queryKey:
      orderKeys.customer.list(params),

    queryFn: () =>
      getCustomerOrders(params),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// GET CUSTOMER ORDER
// ============================================================

export function useCustomerOrder(
  orderId: string,
) {
  return useQuery({
    queryKey:
      orderKeys.customer.detail(
        orderId,
      ),

    queryFn: () =>
      getCustomerOrder(orderId),

    enabled: Boolean(orderId),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// ADMIN ORDERS
// ============================================================

// ============================================================
// GET ADMIN ORDERS
// ============================================================

export function useAdminOrders(
  params: AdminOrderQueryParams = {},
) {
  return useQuery({
    queryKey:
      orderKeys.admin.list(params),

    queryFn: () =>
      getAdminOrders(params),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// GET ADMIN ORDER
// ============================================================

export function useAdminOrder(
  orderId: string,
) {
  return useQuery({
    queryKey:
      orderKeys.admin.detail(
        orderId,
      ),

    queryFn: () =>
      getAdminOrder(orderId),

    enabled: Boolean(orderId),

    staleTime: 60 * 1000,
  });
}
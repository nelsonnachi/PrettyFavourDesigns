import { apiClient } from "@/lib/api/client";

import type {
  AdminOrderQueryParams,
  AdminOrderResponse,
  AdminOrdersResponse,
  CustomerOrderQueryParams,
  CustomerOrderResponse,
  CustomerOrdersResponse,
  UpdateOrderStatusInput,
} from "./order-types";

// ============================================================
// HELPER
// ============================================================

function buildQueryString(
  params: Record<
    string,
    string | number | undefined
  >,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== ""
      ) {
        searchParams.set(
          key,
          String(value),
        );
      }
    },
  );

  const queryString =
    searchParams.toString();

  return queryString
    ? `?${queryString}`
    : "";
}

// ============================================================
// CUSTOMER
// ============================================================

// ============================================================
// GET CUSTOMER ORDERS
// GET /api/orders
// ============================================================

export async function getCustomerOrders(
  params: CustomerOrderQueryParams = {},
) {
  const queryString =
    buildQueryString({
      page: params.page,
      limit: params.limit,
    });

  const response =
    await apiClient<CustomerOrdersResponse>(
      `/api/orders${queryString}`,
    );

  return response;
}

// ============================================================
// GET CUSTOMER ORDER
// GET /api/orders/[id]
// ============================================================

export async function getCustomerOrder(
  orderId: string,
) {
  const response =
    await apiClient<CustomerOrderResponse>(
      `/api/orders/${orderId}`,
    );

  return response;
}

// ============================================================
// CANCEL CUSTOMER ORDER
// PATCH /api/orders/[id]/cancel
// ============================================================

export async function cancelCustomerOrder(
  orderId: string,
) {
  const response =
    await apiClient<{
      success: boolean;
      message: string;

      data: {
        order: CustomerOrderResponse["data"]["order"];
      };
    }>(
      `/api/orders/${orderId}/cancel`,
      {
        method: "PATCH",
      },
    );

  return response;
}

// ============================================================
// ADMIN
// ============================================================

// ============================================================
// GET ADMIN ORDERS
// GET /api/admin/orders
// ============================================================

export async function getAdminOrders(
  params: AdminOrderQueryParams = {},
) {
  const queryString =
    buildQueryString({
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
      paymentStatus:
        params.paymentStatus,
      paymentMethod:
        params.paymentMethod,
    });

  const response =
    await apiClient<AdminOrdersResponse>(
      `/api/admin/orders${queryString}`,
    );

  return response;
}

// ============================================================
// GET ADMIN ORDER
// GET /api/admin/orders/[id]
// ============================================================

export async function getAdminOrder(
  orderId: string,
) {
  const response =
    await apiClient<AdminOrderResponse>(
      `/api/admin/orders/${orderId}`,
    );

  return response;
}

// ============================================================
// UPDATE ADMIN ORDER STATUS
// PATCH /api/admin/orders/[id]
// ============================================================

export async function updateAdminOrderStatus(
  orderId: string,
  data: UpdateOrderStatusInput,
) {
  const response =
    await apiClient<{
      success: boolean;
      message: string;

      data: {
        order: AdminOrderResponse["data"]["order"];
      };
    }>(
      `/api/admin/orders/${orderId}`,
      {
        method: "PATCH",

        body: JSON.stringify(data),
      },
    );

  return response;
}
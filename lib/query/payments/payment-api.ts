

// ============================================================
// BASE URL
// ============================================================

import { AdminPaymentDetailResponse, AdminPaymentFilters, AdminPaymentsResponse } from "./payment-types";

const PAYMENTS_API =
  "/api/admin/payments";

// ============================================================
// GET ADMIN PAYMENTS
// ============================================================

export async function getAdminPayments(
  filters: AdminPaymentFilters = {},
): Promise<AdminPaymentsResponse> {
  const params =
    new URLSearchParams();

  if (filters.page !== undefined) {
    params.set(
      "page",
      String(filters.page),
    );
  }

  if (filters.limit !== undefined) {
    params.set(
      "limit",
      String(filters.limit),
    );
  }

  if (filters.search) {
    params.set(
      "search",
      filters.search,
    );
  }

  if (filters.status) {
    params.set(
      "status",
      filters.status,
    );
  }

  if (filters.provider) {
    params.set(
      "provider",
      filters.provider,
    );
  }

  if (filters.paymentMethod) {
    params.set(
      "paymentMethod",
      filters.paymentMethod,
    );
  }

  if (filters.sort) {
    params.set(
      "sort",
      filters.sort,
    );
  }

  const queryString =
    params.toString();

  const url = queryString
    ? `${PAYMENTS_API}?${queryString}`
    : PAYMENTS_API;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type":
        "application/json",
    },
    cache: "no-store",
  });

  const result =
    (await response.json()) as
      | AdminPaymentsResponse
      | {
          success: false;
          message: string;
        };

  if (!response.ok) {
    throw new Error(
      "message" in result
        ? result.message
        : "Failed to fetch payments",
    );
  }

  return result as AdminPaymentsResponse;
}

// ============================================================
// GET ADMIN PAYMENT DETAIL
// ============================================================

export async function getAdminPayment(
  id: string,
): Promise<AdminPaymentDetailResponse> {
  const response = await fetch(
    `${PAYMENTS_API}/${id}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
      },
      cache: "no-store",
    },
  );

  const result =
    (await response.json()) as
      | AdminPaymentDetailResponse
      | {
          success: false;
          message: string;
        };

  if (!response.ok) {
    throw new Error(
      "message" in result
        ? result.message
        : "Failed to fetch payment",
    );
  }

  return result as AdminPaymentDetailResponse;
}
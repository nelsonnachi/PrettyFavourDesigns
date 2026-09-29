import { apiClient } from "@/lib/api/client";

import type {
  AdminNewsletterDeleteResponse,
  AdminNewsletterDetailResponse,
  AdminNewsletterListResponse,
  AdminNewsletterUpdateResponse,
  NewsletterFilters,
  SubscribeNewsletterResponse,
  UnsubscribeNewsletterResponse,
} from "./newsletter-types";

/**
 * ============================================================
 * SEARCH PARAMS
 * ============================================================
 */

function buildNewsletterSearchParams(
  filters: NewsletterFilters,
) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set(
      "search",
      filters.search.trim(),
    );
  }

  if (filters.isSubscribed !== undefined) {
    params.set(
      "isSubscribed",
      String(filters.isSubscribed),
    );
  }

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

  if (filters.sort) {
    params.set(
      "sort",
      filters.sort,
    );
  }

  return params;
}

/**
 * ============================================================
 * PUBLIC — SUBSCRIBE
 * ============================================================
 */

export async function subscribeToNewsletter(
  email: string,
): Promise<SubscribeNewsletterResponse> {
  return apiClient<SubscribeNewsletterResponse>(
    "/api/newsletter",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

/**
 * ============================================================
 * PUBLIC — UNSUBSCRIBE
 * ============================================================
 */

export async function unsubscribeFromNewsletter(
  email: string,
): Promise<UnsubscribeNewsletterResponse> {
  return apiClient<UnsubscribeNewsletterResponse>(
    "/api/newsletter/unsubscribe",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

/**
 * ============================================================
 * ADMIN — LIST
 * ============================================================
 */

export async function getAdminNewsletterSubscribers(
  filters: NewsletterFilters = {},
): Promise<AdminNewsletterListResponse> {
  const params =
    buildNewsletterSearchParams(filters);

  const queryString = params.toString();

  const url = queryString
    ? `/api/admin/newsletter?${queryString}`
    : "/api/admin/newsletter";

  return apiClient<AdminNewsletterListResponse>(
    url,
  );
}

/**
 * ============================================================
 * ADMIN — DETAIL
 * ============================================================
 */

export async function getAdminNewsletterSubscriber(
  id: string,
): Promise<AdminNewsletterDetailResponse> {
  return apiClient<AdminNewsletterDetailResponse>(
    `/api/admin/newsletter/${id}`,
  );
}

/**
 * ============================================================
 * ADMIN — UPDATE
 * ============================================================
 */

export async function updateAdminNewsletterSubscriber(
  id: string,
  isSubscribed: boolean,
): Promise<AdminNewsletterUpdateResponse> {
  return apiClient<AdminNewsletterUpdateResponse>(
    `/api/admin/newsletter/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        isSubscribed,
      }),
    },
  );
}

/**
 * ============================================================
 * ADMIN — DELETE
 * ============================================================
 */

export async function deleteAdminNewsletterSubscriber(
  id: string,
): Promise<AdminNewsletterDeleteResponse> {
  return apiClient<AdminNewsletterDeleteResponse>(
    `/api/admin/newsletter/${id}`,
    {
      method: "DELETE",
    },
  );
}
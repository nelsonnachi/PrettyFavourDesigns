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

// ============================================================
// HELPERS
// ============================================================

function buildNewsletterSearchParams(
  filters: NewsletterFilters,
) {
  const params = new URLSearchParams();

  // ==========================================================
  // SEARCH
  // ==========================================================

  if (filters.search) {
    params.set("search", filters.search);
  }

  // ==========================================================
  // SUBSCRIPTION STATUS
  // ==========================================================

  if (filters.isSubscribed !== undefined) {
    params.set(
      "isSubscribed",
      String(filters.isSubscribed),
    );
  }

  // ==========================================================
  // PAGINATION
  // ==========================================================

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  // ==========================================================
  // SORT
  // ==========================================================

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  return params;
}

// ============================================================
// PUBLIC NEWSLETTER
// ============================================================

// ------------------------------------------------------------
// SUBSCRIBE
// ------------------------------------------------------------

export async function subscribeToNewsletter(
  email: string,
) {
  return apiClient<SubscribeNewsletterResponse>(
    "/api/newsletter",
    {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    },
  );
}

// ------------------------------------------------------------
// UNSUBSCRIBE
// ------------------------------------------------------------

export async function unsubscribeFromNewsletter(
  email: string,
) {
  return apiClient<UnsubscribeNewsletterResponse>(
    "/api/newsletter/unsubscribe",
    {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    },
  );
}

// ============================================================
// ADMIN NEWSLETTER
// ============================================================

// ------------------------------------------------------------
// GET ALL SUBSCRIBERS
// ------------------------------------------------------------

export async function getAdminNewsletterSubscribers(
  filters: NewsletterFilters = {},
) {
  const params = buildNewsletterSearchParams(filters);

  const queryString = params.toString();

  const url = queryString
    ? `/api/admin/newsletter?${queryString}`
    : "/api/admin/newsletter";

  return apiClient<AdminNewsletterListResponse>(url);
}

// ------------------------------------------------------------
// GET SINGLE SUBSCRIBER
// ------------------------------------------------------------

export async function getAdminNewsletterSubscriber(
  id: string,
) {
  return apiClient<AdminNewsletterDetailResponse>(
    `/api/admin/newsletter/${id}`,
  );
}

// ------------------------------------------------------------
// UPDATE SUBSCRIBER
// ------------------------------------------------------------

export async function updateAdminNewsletterSubscriber(
  id: string,
  isSubscribed: boolean,
) {
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

// ------------------------------------------------------------
// DELETE SUBSCRIBER
// ------------------------------------------------------------

export async function deleteAdminNewsletterSubscriber(
  id: string,
) {
  return apiClient<AdminNewsletterDeleteResponse>(
    `/api/admin/newsletter/${id}`,
    {
      method: "DELETE",
    },
  );
}
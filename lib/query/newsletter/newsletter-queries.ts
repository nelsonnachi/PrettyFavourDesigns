import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminNewsletterSubscriber,
  getAdminNewsletterSubscribers,
} from "./newsletter-api";

import { newsletterKeys } from "./newsletter-keys";

import type {
  NewsletterFilters,
} from "./newsletter-types";

// ============================================================
// ADMIN NEWSLETTER LIST
// ============================================================

export function useAdminNewsletterSubscribers(
  filters: NewsletterFilters = {},
) {
  return useQuery({
    queryKey: newsletterKeys.adminList(filters),

    queryFn: () =>
      getAdminNewsletterSubscribers(filters),

    placeholderData: keepPreviousData,
  });
}

// ============================================================
// ADMIN NEWSLETTER DETAIL
// ============================================================

export function useAdminNewsletterSubscriber(
  id: string,
) {
  return useQuery({
    queryKey: newsletterKeys.adminDetail(id),

    queryFn: () =>
      getAdminNewsletterSubscriber(id),

    enabled: Boolean(id),
  });
}
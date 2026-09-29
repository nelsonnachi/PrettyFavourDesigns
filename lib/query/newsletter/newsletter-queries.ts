import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getAdminNewsletterSubscriber,
  getAdminNewsletterSubscribers,
} from "./newsletter-api";

import { newsletterKeys } from "./newsletter-keys";

import type { NewsletterFilters } from "./newsletter-types";

/**
 * ============================================================
 * ADMIN NEWSLETTER SUBSCRIBERS
 * ============================================================
 */

export function useAdminNewsletterSubscribers(
  filters: NewsletterFilters = {},
) {
  return useQuery({
    queryKey: newsletterKeys.adminList(filters),

    queryFn: () => getAdminNewsletterSubscribers(filters),

    placeholderData: keepPreviousData,

    staleTime: 60 * 1000,
  });
}

/**
 * ============================================================
 * ADMIN NEWSLETTER SUBSCRIBER
 * ============================================================
 */

export function useAdminNewsletterSubscriber(id: string) {
  return useQuery({
    queryKey: newsletterKeys.adminDetail(id),

    queryFn: async () => {
      const response = await getAdminNewsletterSubscriber(id);

      return response.data;
    },

    enabled: Boolean(id),

    staleTime: 60 * 1000,
  });
}
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteAdminNewsletterSubscriber,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  updateAdminNewsletterSubscriber,
} from "./newsletter-api";

import { newsletterKeys } from "./newsletter-keys";

/**
 * ============================================================
 * PUBLIC — SUBSCRIBE
 * ============================================================
 */

export function useSubscribeToNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscribeToNewsletter,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.adminLists(),
      });
    },
  });
}

/**
 * ============================================================
 * PUBLIC — UNSUBSCRIBE
 * ============================================================
 */

export function useUnsubscribeFromNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsubscribeFromNewsletter,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.adminLists(),
      });
    },
  });
}

/**
 * ============================================================
 * ADMIN — UPDATE SUBSCRIPTION STATUS
 * ============================================================
 */

export function useUpdateAdminNewsletterSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isSubscribed,
    }: {
      id: string;
      isSubscribed: boolean;
    }) =>
      updateAdminNewsletterSubscriber(
        id,
        isSubscribed,
      ),

    onSuccess: (response, variables) => {
      const updatedSubscriber = response.data;

      /**
       * Update the detail cache immediately.
       */
      queryClient.setQueryData(
        newsletterKeys.adminDetail(
          variables.id,
        ),
        updatedSubscriber,
      );

      /**
       * Refresh all admin lists.
       */
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.adminLists(),
      });
    },
  });
}

/**
 * ============================================================
 * ADMIN — DELETE
 * ============================================================
 */

export function useDeleteAdminNewsletterSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminNewsletterSubscriber,

    onSuccess: (_, id) => {
      /**
       * Remove the subscriber detail cache.
       */
      queryClient.removeQueries({
        queryKey:
          newsletterKeys.adminDetail(id),
      });

      /**
       * Refresh admin subscriber lists.
       */
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.adminLists(),
      });
    },
  });
}
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

// ============================================================
// PUBLIC NEWSLETTER
// ============================================================

// ------------------------------------------------------------
// SUBSCRIBE
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// UNSUBSCRIBE
// ------------------------------------------------------------

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

// ============================================================
// ADMIN NEWSLETTER
// ============================================================

// ------------------------------------------------------------
// UPDATE SUBSCRIBER
// ------------------------------------------------------------

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
      // Refresh all admin subscriber lists
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.adminLists(),
      });

      // Refresh this subscriber's detail
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.adminDetail(
          variables.id,
        ),
      });

      // Update the cached detail
      queryClient.setQueryData(
        newsletterKeys.adminDetail(
          variables.id,
        ),
        response,
      );
    },
  });
}

// ------------------------------------------------------------
// DELETE SUBSCRIBER
// ------------------------------------------------------------

export function useDeleteAdminNewsletterSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminNewsletterSubscriber,

    onSuccess: (_, id) => {
      // Refresh all admin lists
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.adminLists(),
      });

      // Remove deleted subscriber detail
      queryClient.removeQueries({
        queryKey: newsletterKeys.adminDetail(id),
      });
    },
  });
}
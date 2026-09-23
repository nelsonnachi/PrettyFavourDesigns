import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminAnnouncement,
  deleteAdminAnnouncement,
  updateAdminAnnouncement,
} from "./announcement-api";

import {
  announcementKeys,
} from "./announcement-keys";

// ============================================================
// CREATE ANNOUNCEMENT
// ============================================================

export function useCreateAdminAnnouncement() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createAdminAnnouncement,

    onSuccess: () => {
      // Refresh both admin and public
      // announcement lists.

      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.adminLists(),
      });

      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.publicLists(),
      });
    },
  });
}

// ============================================================
// UPDATE ANNOUNCEMENT
// ============================================================

export function useUpdateAdminAnnouncement() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: unknown;
    }) =>
      updateAdminAnnouncement(
        id,
        data,
      ),

    onSuccess: (
      response,
      variables,
    ) => {
      // ------------------------------------------------------
      // Refresh admin lists
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.adminLists(),
      });

      // ------------------------------------------------------
      // Refresh public lists
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.publicLists(),
      });

      // ------------------------------------------------------
      // Refresh the updated admin detail
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.adminDetail(
            variables.id,
          ),
      });
    },
  });
}

// ============================================================
// DELETE ANNOUNCEMENT
// ============================================================

export function useDeleteAdminAnnouncement() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminAnnouncement,

    onSuccess: (_, id) => {
      // ------------------------------------------------------
      // Refresh admin lists
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.adminLists(),
      });

      // ------------------------------------------------------
      // Refresh public lists
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          announcementKeys.publicLists(),
      });

      // ------------------------------------------------------
      // Remove admin detail from cache
      // ------------------------------------------------------

      queryClient.removeQueries({
        queryKey:
          announcementKeys.adminDetail(
            id,
          ),
      });
    },
  });
}
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import {
  contactMessageKeys,
} from "./contact-message-keys";

import type {
  ContactMessage,
  DeleteContactMessageResponse,
  UpdateContactMessageInput,
  UpdateContactMessageResponse,
} from "./contact-message-types";

export interface UpdateAdminContactMessageVariables {
  id: string;
  data: UpdateContactMessageInput;
}

async function updateAdminContactMessage(
  id: string,
  data: UpdateContactMessageInput,
): Promise<ContactMessage> {
  const response =
    await apiClient<UpdateContactMessageResponse>(
      `/api/admin/contact-messages/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );

  return response.data;
}

async function deleteAdminContactMessage(
  id: string,
): Promise<void> {
  await apiClient<DeleteContactMessageResponse>(
    `/api/admin/contact-messages/${id}`,
    {
      method: "DELETE",
    },
  );
}

export function useUpdateAdminContactMessage() {
  const queryClient =
    useQueryClient();

  return useMutation<
    ContactMessage,
    Error,
    UpdateAdminContactMessageVariables
  >({
    mutationFn: ({
      id,
      data,
    }) =>
      updateAdminContactMessage(
        id,
        data,
      ),

    onSuccess: (updatedMessage) => {
      queryClient.setQueryData<ContactMessage>(
        contactMessageKeys.adminDetail(
          updatedMessage.id,
        ),
        updatedMessage,
      );

      queryClient.invalidateQueries({
        queryKey:
          contactMessageKeys.admin(),
      });

      queryClient.invalidateQueries({
        queryKey:
          contactMessageKeys.unreadCount(),
      });
    },
  });
}

export function useDeleteAdminContactMessage() {
  const queryClient =
    useQueryClient();

  return useMutation<
    void,
    Error,
    string
  >({
    mutationFn:
      deleteAdminContactMessage,

    onSuccess: (
      _data,
      deletedId,
    ) => {
      queryClient.removeQueries({
        queryKey:
          contactMessageKeys.adminDetail(
            deletedId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          contactMessageKeys.admin(),
      });

      queryClient.invalidateQueries({
        queryKey:
          contactMessageKeys.unreadCount(),
      });
    },
  });
}
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import { contactMessageKeys } from "./contact-message-keys";

import type {
  AdminContactMessageParams,
  AdminContactMessageResponse,
  AdminContactMessagesResponse,
  ContactMessage,
  CreateContactMessageInput,
  CreateContactMessageResponse,
  DeleteContactMessageResponse,
  UpdateContactMessageInput,
  UpdateContactMessageResponse,
} from "./contact-message-types";

// ============================================================
// CREATE CONTACT MESSAGE
// ============================================================
//
// POST /api/contact
//
// Public endpoint.
//
// Can be used by:
// - logged-in users
// - guests
//
// ============================================================

async function createContactMessage(
  input: CreateContactMessageInput
): Promise<CreateContactMessageResponse["data"]> {
  const response =
    await apiClient<CreateContactMessageResponse>(
      "/api/contact",
      {
        method: "POST",

        body: JSON.stringify(input),
      }
    );

  return response.data;
}

// ============================================================
// GET ADMIN CONTACT MESSAGES
// ============================================================
//
// GET /api/admin/contact-messages
//
// Admin only.
//
// Supports:
//
// page
// limit
// search
// isRead
// sort
//
// ============================================================

async function getAdminContactMessages(
  params: AdminContactMessageParams = {}
): Promise<AdminContactMessagesResponse> {
  const searchParams = new URLSearchParams();

  // ----------------------------------------------------------
  // Page
  // ----------------------------------------------------------

  if (params.page !== undefined) {
    searchParams.set(
      "page",
      String(params.page)
    );
  }

  // ----------------------------------------------------------
  // Limit
  // ----------------------------------------------------------

  if (params.limit !== undefined) {
    searchParams.set(
      "limit",
      String(params.limit)
    );
  }

  // ----------------------------------------------------------
  // Search
  // ----------------------------------------------------------

  if (params.search) {
    searchParams.set(
      "search",
      params.search
    );
  }

  // ----------------------------------------------------------
  // Read status
  // ----------------------------------------------------------

  if (params.isRead !== undefined) {
    searchParams.set(
      "isRead",
      String(params.isRead)
    );
  }

  // ----------------------------------------------------------
  // Sort
  // ----------------------------------------------------------

  if (params.sort) {
    searchParams.set(
      "sort",
      params.sort
    );
  }

  const queryString =
    searchParams.toString();

  const url = queryString
    ? `/api/admin/contact-messages?${queryString}`
    : "/api/admin/contact-messages";

  return apiClient<AdminContactMessagesResponse>(
    url
  );
}

// ============================================================
// GET ADMIN CONTACT MESSAGE
// ============================================================
//
// GET /api/admin/contact-messages/[id]
//
// Admin only.
//
// ============================================================

async function getAdminContactMessage(
  id: string
): Promise<ContactMessage> {
  const response =
    await apiClient<AdminContactMessageResponse>(
      `/api/admin/contact-messages/${id}`
    );

  return response.data;
}

// ============================================================
// UPDATE ADMIN CONTACT MESSAGE
// ============================================================
//
// PATCH /api/admin/contact-messages/[id]
//
// Body:
//
// {
//   "isRead": true
// }
//
// ============================================================

async function updateAdminContactMessage({
  id,
  data,
}: {
  id: string;

  data: UpdateContactMessageInput;
}): Promise<ContactMessage> {
  const response =
    await apiClient<UpdateContactMessageResponse>(
      `/api/admin/contact-messages/${id}`,
      {
        method: "PATCH",

        body: JSON.stringify(data),
      }
    );

  return response.data;
}

// ============================================================
// DELETE ADMIN CONTACT MESSAGE
// ============================================================
//
// DELETE /api/admin/contact-messages/[id]
//
// ============================================================

async function deleteAdminContactMessage(
  id: string
): Promise<void> {
  await apiClient<DeleteContactMessageResponse>(
    `/api/admin/contact-messages/${id}`,
    {
      method: "DELETE",
    }
  );
}

// ============================================================
// CREATE CONTACT MESSAGE
// ============================================================

export function useCreateContactMessage() {
  return useMutation({
    mutationFn: createContactMessage,
  });
}

// ============================================================
// GET ADMIN CONTACT MESSAGES
// ============================================================

export function useAdminContactMessages(
  params: AdminContactMessageParams = {}
) {
  return useQuery({
    queryKey: contactMessageKeys.adminList(
      params.page ?? 1,
      params.limit ?? 10,
      params.search,
      params.isRead,
      params.sort ?? "newest"
    ),

    queryFn: () =>
      getAdminContactMessages(params),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// GET ADMIN CONTACT MESSAGE
// ============================================================

export function useAdminContactMessage(
  id: string
) {
  return useQuery({
    queryKey:
      contactMessageKeys.adminDetail(id),

    queryFn: () =>
      getAdminContactMessage(id),

    enabled: Boolean(id),

    staleTime: 60 * 1000,
  });
}

// ============================================================
// UPDATE ADMIN CONTACT MESSAGE
// ============================================================

export function useUpdateAdminContactMessage() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateAdminContactMessage,

    onSuccess: (
      updatedMessage
    ) => {
      // ------------------------------------------------------
      // Update the individual message cache.
      // ------------------------------------------------------

      queryClient.setQueryData(
        contactMessageKeys.adminDetail(
          updatedMessage.id
        ),
        updatedMessage
      );

      // ------------------------------------------------------
      // Refresh admin lists.
      //
      // This is important because changing isRead can move
      // a message between filtered "read" and "unread" lists.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          contactMessageKeys.admin(),
      });
    },
  });
}

// ============================================================
// DELETE ADMIN CONTACT MESSAGE
// ============================================================

export function useDeleteAdminContactMessage() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteAdminContactMessage,

    onSuccess: (
      _data,
      deletedId
    ) => {
      // ------------------------------------------------------
      // Remove the detail cache.
      // ------------------------------------------------------

      queryClient.removeQueries({
        queryKey:
          contactMessageKeys.adminDetail(
            deletedId
          ),
      });

      // ------------------------------------------------------
      // Refresh all admin contact-message lists.
      // ------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey:
          contactMessageKeys.admin(),
      });
    },
  });
}
"use client";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

import {
  contactMessageKeys,
} from "./contact-message-keys";

import type {
  AdminContactMessageParams,
  AdminContactMessageResponse,
  AdminContactMessagesResponse,
  ContactMessage,
  CreateContactMessageInput,
  CreateContactMessageResponse,
} from "./contact-message-types";

export async function createContactMessage(
  input: CreateContactMessageInput,
): Promise<CreateContactMessageResponse> {
  return apiClient<CreateContactMessageResponse>(
    "/api/contact-messages",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function useCreateContactMessage() {
  return useMutation<
    CreateContactMessageResponse,
    Error,
    CreateContactMessageInput
  >({
    mutationFn: createContactMessage,
  });
}

export async function getAdminContactMessages(
  params: AdminContactMessageParams = {},
): Promise<AdminContactMessagesResponse> {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "page",
    String(params.page ?? 1),
  );

  searchParams.set(
    "limit",
    String(params.limit ?? 12),
  );

  if (params.search?.trim()) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }

  if (params.isRead !== undefined) {
    searchParams.set(
      "isRead",
      String(params.isRead),
    );
  }

  searchParams.set(
    "sort",
    params.sort ?? "newest",
  );

  return apiClient<AdminContactMessagesResponse>(
    `/api/admin/contact-messages?${searchParams.toString()}`,
  );
}

export async function getAdminContactMessage(
  id: string,
): Promise<ContactMessage> {
  const response =
    await apiClient<AdminContactMessageResponse>(
      `/api/admin/contact-messages/${id}`,
    );

  return response.data;
}

export async function getAdminUnreadContactMessageCount(): Promise<number> {
  const response = await apiClient<{
    success: boolean;
    count: number;
  }>(
    "/api/admin/contact-messages/unread-count",
  );

  return response.count;
}

export function useAdminContactMessages(
  params: AdminContactMessageParams = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;

  const search =
    params.search?.trim() || undefined;

  const isRead = params.isRead;

  const sort =
    params.sort ?? "newest";

  return useQuery({
    queryKey:
      contactMessageKeys.adminList(
        page,
        limit,
        search,
        isRead,
        sort,
      ),

    queryFn: () =>
      getAdminContactMessages({
        page,
        limit,
        search,
        isRead,
        sort,
      }),

    staleTime: 60 * 1000,
  });
}

export function useAdminContactMessage(
  id: string,
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

export function useAdminUnreadContactMessageCount() {
  return useQuery({
    queryKey:
      contactMessageKeys.unreadCount(),

    queryFn:
      getAdminUnreadContactMessageCount,

    staleTime: 30 * 1000,

    refetchInterval: 30 * 1000,

    refetchOnWindowFocus: true,
  });
}
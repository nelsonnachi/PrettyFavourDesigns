"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminUser,
  getAdminUsers,
} from "./admin-user-api";

import { adminUserKeys } from "./admin-user-keys";

import type {
  AdminUsersQuery,
} from "./admin-user-types";

// ============================================================
// GET ADMIN USERS
// ============================================================

export function useAdminUsers(
  query: AdminUsersQuery,
) {
  return useQuery({
    queryKey: adminUserKeys.list(query),
    queryFn: () => getAdminUsers(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// ============================================================
// GET SINGLE ADMIN USER
// ============================================================

export function useAdminUser(
  id: string,
) {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => getAdminUser(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
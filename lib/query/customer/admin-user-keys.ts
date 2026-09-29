import type { AdminUsersQuery } from "./admin-user-types";

// ============================================================
// ADMIN USER QUERY KEYS
// ============================================================

export const adminUserKeys = {
  all: ["admin-users"] as const,

  lists: () =>
    [...adminUserKeys.all, "list"] as const,

  list: (query: AdminUsersQuery) =>
    [...adminUserKeys.lists(), query] as const,

  details: () =>
    [...adminUserKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...adminUserKeys.details(), id] as const,
};
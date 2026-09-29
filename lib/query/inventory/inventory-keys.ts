import type {
  AdminInventoryQuery,
} from "./inventory-types";

// ============================================================
// INVENTORY QUERY KEYS
// ============================================================

export const inventoryKeys = {
  all: ["admin-inventory"] as const,

  lists: () =>
    [...inventoryKeys.all, "list"] as const,

  list: (
    query: AdminInventoryQuery,
  ) =>
    [
      ...inventoryKeys.lists(),
      query,
    ] as const,

  details: () =>
    [...inventoryKeys.all, "detail"] as const,

  detail: (
    id: string,
  ) =>
    [
      ...inventoryKeys.details(),
      id,
    ] as const,
};
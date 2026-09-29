"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminInventory,
  getAdminInventoryItem,
} from "./inventory-api";

import { inventoryKeys } from "./inventory-keys";

import type {
  AdminInventoryQuery,
} from "./inventory-types";

// ============================================================
// GET INVENTORY
// ============================================================

export function useAdminInventory(
  query: AdminInventoryQuery,
) {
  return useQuery({
    queryKey: inventoryKeys.list(query),

    queryFn: () =>
      getAdminInventory(query),

    placeholderData:
      keepPreviousData,

    staleTime: 30_000,

    refetchOnWindowFocus: false,
  });
}

// ============================================================
// GET INVENTORY ITEM
// ============================================================

export function useAdminInventoryItem(
  id: string,
) {
  return useQuery({
    queryKey:
      inventoryKeys.detail(id),

    queryFn: () =>
      getAdminInventoryItem(id),

    enabled: Boolean(id),

    staleTime: 30_000,

    refetchOnWindowFocus: false,
  });
}
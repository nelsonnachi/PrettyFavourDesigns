import type {
  AdminInventoryDetailResponse,
  AdminInventoryQuery,
  AdminInventoryResponse,
} from "./inventory-types";

// ============================================================
// INVENTORY API
// ============================================================

const INVENTORY_API =
  "/api/admin/inventory";

// ============================================================
// GET INVENTORY
// ============================================================

export async function getAdminInventory(
  query: AdminInventoryQuery,
): Promise<AdminInventoryResponse> {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "page",
    String(query.page),
  );

  searchParams.set(
    "limit",
    String(query.limit),
  );

  if (query.search.trim()) {
    searchParams.set(
      "search",
      query.search.trim(),
    );
  }

  searchParams.set(
    "stockStatus",
    query.stockStatus,
  );

  searchParams.set(
    "sort",
    query.sort,
  );

  const queryString =
    searchParams.toString();

  const response = await fetch(
    `${INVENTORY_API}?${queryString}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const result =
    (await response.json()) as
      | AdminInventoryResponse
      | {
          success: false;
          message: string;
        };

  if (!response.ok) {
    throw new Error(
      "message" in result
        ? result.message
        : "Failed to fetch inventory",
    );
  }

  return result as AdminInventoryResponse;
}

// ============================================================
// GET INVENTORY ITEM
// ============================================================

export async function getAdminInventoryItem(
  id: string,
): Promise<AdminInventoryDetailResponse> {
  const response = await fetch(
    `${INVENTORY_API}/${id}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  const result =
    (await response.json()) as
      | AdminInventoryDetailResponse
      | {
          success: false;
          message: string;
        };

  if (!response.ok) {
    throw new Error(
      "message" in result
        ? result.message
        : "Failed to fetch inventory item",
    );
  }

  return result as AdminInventoryDetailResponse;
}
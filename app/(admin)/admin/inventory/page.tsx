"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Search,
} from "lucide-react";

import { useAdminInventory } from "@/lib/query/inventory/inventory-queries";

import type {
  InventoryItemStockStatus,
} from "@/lib/query/inventory/inventory-types";

// ============================================================
// STATUS HELPERS
// ============================================================

function getStatusLabel(
  status: InventoryItemStockStatus,
) {
  switch (status) {
    case "in_stock":
      return "In stock";

    case "low_stock":
      return "Low stock";

    case "out_of_stock":
      return "Out of stock";
  }
}

function getStatusClasses(
  status: InventoryItemStockStatus,
) {
  switch (status) {
    case "in_stock":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "low_stock":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "out_of_stock":
      return "bg-red-50 text-red-700 ring-red-600/20";
  }
}

// ============================================================
// PAGE
// ============================================================

export default function AdminInventoryPage() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [page, setPage] = useState(1);

  const [limit] = useState(20);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  // ==========================================================
  // INVENTORY QUERY
  // ==========================================================

  const inventoryQuery = useAdminInventory({
    page,
    limit,
    search,
    stockStatus: "all",
    sort: "recent",
  });

  const inventory = inventoryQuery.data;

  const items = inventory?.data ?? [];

  const pagination = inventory?.pagination;

  // ==========================================================
  // SEARCH
  // ==========================================================

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (inventoryQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="rounded-xl border bg-card">
          <div className="p-6">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>

          <div className="divide-y">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6"
              >
                <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-muted" />

                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>

                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (inventoryQuery.isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product inventory and stock levels.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Failed to load inventory
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {inventoryQuery.error instanceof Error
              ? inventoryQuery.error.message
              : "Something went wrong while loading inventory."}
          </p>

          <button
            type="button"
            onClick={() => inventoryQuery.refetch()}
            className="mt-4 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product inventory and stock levels.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />

          <span>
            {pagination?.total ?? 0} inventory items
          </span>
        </div>
      </div>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div className="rounded-xl border bg-card">
        <div className="p-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                placeholder="Search inventory..."
                className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Search
            </button>

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="h-10 rounded-md border px-5 text-sm font-medium transition hover:bg-muted"
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border bg-card">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-base font-semibold">
              No inventory found
            </h2>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {search
                ? "No inventory items matched your search."
                : "There are currently no inventory items."}
            </p>

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-4 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ==================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40">
                  <tr className="text-left">
                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      Product
                    </th>

                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      SKU
                    </th>

                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      Color
                    </th>

                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      Stock
                    </th>

                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      Available
                    </th>

                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-muted/30"
                    >
                      {/* PRODUCT */}

                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {item.product.name}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.product.status}
                        </div>
                      </td>

                      {/* SKU */}

                      <td className="px-6 py-4 font-mono text-xs">
                        {item.sku}
                      </td>

                      {/* COLOR */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {item.color.hexCode && (
                            <span
                              className="h-4 w-4 rounded-full border"
                              style={{
                                backgroundColor:
                                  item.color.hexCode,
                              }}
                            />
                          )}

                          <span>{item.color.name}</span>
                        </div>
                      </td>

                      {/* STOCK */}

                      <td className="px-6 py-4">
                        {item.stock}
                      </td>

                      {/* AVAILABLE */}

                      <td className="px-6 py-4 font-medium">
                        {item.availableStock}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                            item.stockStatus,
                          )}`}
                        >
                          {getStatusLabel(
                            item.stockStatus,
                          )}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/inventory/${item.id}`}
                          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                        >
                          <Eye className="h-3.5 w-3.5" />

                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ==================================================
                MOBILE CARDS
            ================================================== */}

            <div className="divide-y md:hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="space-y-4 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium">
                        {item.product.name}
                      </h3>

                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {item.sku}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                        item.stockStatus,
                      )}`}
                    >
                      {getStatusLabel(
                        item.stockStatus,
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Color
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        {item.color.hexCode && (
                          <span
                            className="h-4 w-4 rounded-full border"
                            style={{
                              backgroundColor:
                                item.color.hexCode,
                            }}
                          />
                        )}

                        <span>{item.color.name}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Stock
                      </p>

                      <p className="mt-1 font-medium">
                        {item.stock}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Reserved
                      </p>

                      <p className="mt-1 font-medium">
                        {item.reservedStock}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Available
                      </p>

                      <p className="mt-1 font-medium">
                        {item.availableStock}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/admin/inventory/${item.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                  >
                    <Eye className="h-4 w-4" />

                    View inventory
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ======================================================
          PAGINATION
      ====================================================== */}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1),
                )
              }
              className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />

              Previous
            </button>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPage((current) =>
                  current + 1,
                )
              }
              className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              Next

              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
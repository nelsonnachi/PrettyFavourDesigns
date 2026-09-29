"use client";

import Link from "next/link";

import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
} from "lucide-react";

import { useState } from "react";

import {
  useAdminInventory,
} from "@/lib/query/inventory/inventory-queries";

import type {
  AdminInventoryQuery,
} from "@/lib/query/inventory/inventory-types";

// ============================================================
// STOCK STATUS
// ============================================================

function getStockStatus(
  availableStock: number,
) {
  if (availableStock <= 0) {
    return {
      label: "Out of stock",
      className:
        "bg-destructive/10 text-destructive",
    };
  }

  if (availableStock <= 5) {
    return {
      label: "Low stock",
      className:
        "bg-amber-500/10 text-amber-600",
    };
  }

  return {
    label: "In stock",
    className:
      "bg-emerald-500/10 text-emerald-600",
  };
}

// ============================================================
// PAGE
// ============================================================

export default function AdminInventoryPage() {
  const [search, setSearch] =
    useState("");

  const [query, setQuery] =
    useState<AdminInventoryQuery>({
      page: 1,
      limit: 20,
      search: "",
      stockStatus: "all",
      sort: "recent",
    });

  const inventoryQuery =
    useAdminInventory(query);

  const inventory =
    inventoryQuery.data?.data ?? [];

  const pagination =
    inventoryQuery.data?.pagination;

  // ==========================================================
  // SEARCH
  // ==========================================================

  function handleSearch(
    value: string,
  ) {
    setSearch(value);

    setQuery((current) => ({
      ...current,
      page: 1,
      search: value,
    }));
  }

  // ==========================================================
  // STOCK FILTER
  // ==========================================================

  function handleStockStatus(
    value: AdminInventoryQuery["stockStatus"],
  ) {
    setQuery((current) => ({
      ...current,
      page: 1,
      stockStatus: value,
    }));
  }

  // ==========================================================
  // SORT
  // ==========================================================

  function handleSort(
    value: AdminInventoryQuery["sort"],
  ) {
    setQuery((current) => ({
      ...current,
      page: 1,
      sort: value,
    }));
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  function handlePage(
    page: number,
  ) {
    setQuery((current) => ({
      ...current,
      page,
    }));
  }

  return (
    <div className="space-y-7">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Package
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
              Inventory
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your product stock and inventory levels.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearch(
                  event.target.value,
                )
              }
              placeholder="Search product, SKU or color..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-accent"
            />
          </div>

          {/* Stock status */}

          <select
            value={query.stockStatus}
            onChange={(event) =>
              handleStockStatus(
                event.target
                  .value as AdminInventoryQuery["stockStatus"],
              )
            }
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-accent"
          >
            <option value="all">
              All stock
            </option>

            <option value="in_stock">
              In stock
            </option>

            <option value="low_stock">
              Low stock
            </option>

            <option value="out_of_stock">
              Out of stock
            </option>
          </select>

          {/* Sort */}

          <select
            value={query.sort}
            onChange={(event) =>
              handleSort(
                event.target
                  .value as AdminInventoryQuery["sort"],
              )
            }
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-accent"
          >
            <option value="recent">
              Recently updated
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="stock_asc">
              Stock: low to high
            </option>

            <option value="stock_desc">
              Stock: high to low
            </option>
          </select>
        </div>
      </section>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {inventoryQuery.isLoading && (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Loading inventory...
          </p>
        </div>
      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {inventoryQuery.isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle
              size={18}
              className="text-destructive"
            />

            <div>
              <p className="font-medium">
                Failed to load inventory
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {inventoryQuery.error
                  instanceof Error
                  ? inventoryQuery.error.message
                  : "Something went wrong."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          TABLE
      ====================================================== */}

      {!inventoryQuery.isLoading &&
        !inventoryQuery.isError && (
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-4 text-left font-medium">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left font-medium">
                      Color
                    </th>

                    <th className="px-5 py-4 text-left font-medium">
                      SKU
                    </th>

                    <th className="px-5 py-4 text-right font-medium">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-right font-medium">
                      Reserved
                    </th>

                    <th className="px-5 py-4 text-right font-medium">
                      Available
                    </th>

                    <th className="px-5 py-4 text-left font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {inventory.map(
                    (item) => {
                      const status =
                        getStockStatus(
                          item.availableStock,
                        );

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-0 hover:bg-muted/20"
                        >
                          <td className="px-5 py-4">
                            <Link
                              href={`/admin/inventory/${item.id}`}
                              className="font-medium hover:text-accent"
                            >
                              {item.product.name}
                            </Link>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.product.sku}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {item.color.hexCode && (
                                <span
                                  className="h-4 w-4 rounded-full border border-border"
                                  style={{
                                    backgroundColor:
                                      item.color.hexCode,
                                  }}
                                />
                              )}

                              <span>
                                {item.color.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-mono text-xs">
                            {item.sku}
                          </td>

                          <td className="px-5 py-4 text-right font-medium">
                            {item.stock}
                          </td>

                          <td className="px-5 py-4 text-right text-muted-foreground">
                            {item.reservedStock}
                          </td>

                          <td className="px-5 py-4 text-right font-medium">
                            {item.availableStock}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {inventory.length === 0 && (
              <div className="p-12 text-center">
                <Package
                  size={28}
                  className="mx-auto text-muted-foreground"
                  strokeWidth={1.5}
                />

                <p className="mt-3 font-medium">
                  No inventory found
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {/* ==================================================
                PAGINATION
            ================================================== */}

            {pagination &&
              pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-5 py-4">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of{" "}
                    {pagination.totalPages}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        !pagination.hasPreviousPage
                      }
                      onClick={() =>
                        handlePage(
                          pagination.page -
                            1,
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      disabled={
                        !pagination.hasNextPage
                      }
                      onClick={() =>
                        handlePage(
                          pagination.page +
                            1,
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight
                        size={16}
                      />
                    </button>
                  </div>
                </div>
              )}
          </section>
        )}
    </div>
  );
}
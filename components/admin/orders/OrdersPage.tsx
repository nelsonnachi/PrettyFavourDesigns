"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

import { useAdminOrders } from "@/lib/query/orders/order-queries";

import type {
  AdminOrderQueryParams,
} from "@/lib/query/orders/order-types";

import { OrderFilters } from "./OrderFilters";
import { OrdersTable } from "./OrdersTable";

const DEFAULT_FILTERS: AdminOrderQueryParams = {
  page: 1,
  limit: 12,
};

export function OrdersPage() {
  const [filters, setFilters] =
    useState<AdminOrderQueryParams>(
      DEFAULT_FILTERS,
    );

  const ordersQuery = useAdminOrders(filters);

  const orders = ordersQuery.data?.data.orders ?? [];

  const pagination =
    ordersQuery.data?.data.pagination;

  function handleFilterChange(
    updates: Partial<AdminOrderQueryParams>,
  ) {
    setFilters((current) => ({
      ...current,
      ...updates,
    }));
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function handlePreviousPage() {
    if (!pagination || pagination.page <= 1) {
      return;
    }

    setFilters((current) => ({
      ...current,
      page: pagination.page - 1,
    }));
  }

  function handleNextPage() {
    if (
      !pagination ||
      pagination.page >= pagination.totalPages
    ) {
      return;
    }

    setFilters((current) => ({
      ...current,
      page: pagination.page + 1,
    }));
  }

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalOrders = pagination?.total ?? 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="View and manage customer orders."
      />

      <OrderFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalOrders.toLocaleString()}{" "}
          {totalOrders === 1 ? "order" : "orders"}
        </p>

        {ordersQuery.isFetching &&
          !ordersQuery.isLoading && (
            <p className="text-xs text-muted-foreground">
              Updating...
            </p>
          )}
      </div>

      <OrdersTable
        orders={orders}
        isLoading={ordersQuery.isLoading}
        isFetching={ordersQuery.isFetching}
        error={ordersQuery.error}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="inline-flex h-10 items-center gap-2 rounded-xl border bg-card px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="inline-flex h-10 items-center gap-2 rounded-xl border bg-card px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
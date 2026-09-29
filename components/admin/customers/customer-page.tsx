"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { CustomerPageHeader } from "./customer-page-header";
import { CustomerStats } from "./customer-stats";
import { CustomerFilters } from "./customer-filters";
import { CustomerTable } from "./customer-table";
import { CustomerPagination } from "./customer-pagination";
import { AdminUsersQuery } from "@/lib/query/customer/admin-user-types";
import { adminUserKeys } from "@/lib/query/customer/admin-user-keys";
import { getAdminUsers } from "@/lib/query/customer/admin-user-queries";

const DEFAULT_QUERY: AdminUsersQuery = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
  role: "customer",
  sort: "newest",
};

export function CustomerPage() {
  const [query, setQuery] =
    React.useState<AdminUsersQuery>(DEFAULT_QUERY);

  const customersQuery = useQuery({
    queryKey: adminUserKeys.list(query),
    queryFn: () => getAdminUsers(query),
  });

  const customers =
    customersQuery.data?.data ?? [];

  const pagination =
    customersQuery.data?.pagination;

  function updateQuery(
    updates: Partial<AdminUsersQuery>,
  ) {
    setQuery((current) => ({
      ...current,
      ...updates,
      page:
        updates.page ??
        (Object.keys(updates).some(
          (key) =>
            key !== "page" &&
            key !== "limit",
        )
          ? 1
          : current.page),
    }));
  }

  function handleReset() {
    setQuery(DEFAULT_QUERY);
  }

  return (
    <div className="space-y-6">
      <CustomerPageHeader />

      <CustomerStats
        total={pagination?.total ?? 0}
        visible={customers.length}
      />

      <CustomerFilters
        query={query}
        onChange={updateQuery}
        onReset={handleReset}
      />

      {customersQuery.isLoading ? (
        <CustomerTableSkeleton />
      ) : customersQuery.isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-red-400" />

          <h3 className="font-semibold text-red-900">
            Unable to load customers
          </h3>

          <p className="mt-1 text-sm text-red-700">
            {customersQuery.error instanceof Error
              ? customersQuery.error.message
              : "Something went wrong while loading customers."}
          </p>

          <button
            type="button"
            onClick={() => customersQuery.refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <CustomerTable
            customers={customers}
          />

          {pagination && (
            <CustomerPagination
              pagination={pagination}
              onPageChange={(page) =>
                updateQuery({ page })
              }
            />
          )}
        </>
      )}
    </div>
  );
}

function CustomerTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="space-y-4 p-6">
        {Array.from({ length: 8 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-muted"
            />
          ),
        )}
      </div>
    </div>
  );
}
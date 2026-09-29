"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";


import { ProductFilters } from "./ProductFilters";
import { ProductsTable } from "./ProductsTable";
import { AdminProductFilters } from "@/lib/query/products/product-types";
import { useAdminProducts } from "@/lib/query/products/product-queries";

const DEFAULT_FILTERS: AdminProductFilters = {
  page: 1,
  limit: 12,
  sort: "newest",
};

export function ProductsPage() {
  const [filters, setFilters] =
    useState<AdminProductFilters>(DEFAULT_FILTERS);

  const productsQuery = useAdminProducts(filters);

  const products = productsQuery.data?.data ?? [];

  const pagination = productsQuery.data?.pagination;

  function updateFilters(
    updates: Partial<AdminProductFilters>,
  ) {
    setFilters((current) => ({
      ...current,
      ...updates,

      // Any filter change should return to page 1.
      page:
        updates.page !== undefined
          ? updates.page
          : 1,
    }));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Manage your product catalog, inventory and visibility."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Add product
          </Link>
        }
      />

      <ProductFilters
        filters={filters}
        onFiltersChange={updateFilters}
      />

      <ProductsTable
        products={products}
        isLoading={productsQuery.isLoading}
        isFetching={productsQuery.isFetching}
        error={productsQuery.error}
        pagination={pagination}
        onPageChange={(page) => {
          setFilters((current) => ({
            ...current,
            page,
          }));
        }}
      />
    </div>
  );
}
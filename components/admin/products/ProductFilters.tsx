"use client";

import { AdminProductFilters } from "@/lib/query/products/product-types";
import { Search, SlidersHorizontal, X } from "lucide-react";


interface ProductFiltersProps {
  filters: AdminProductFilters;

  onFiltersChange: (
    updates: Partial<AdminProductFilters>,
  ) => void;
}

export function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.categoryId) ||
    Boolean(filters.colorId) ||
    Boolean(filters.status) ||
    filters.inStock !== undefined ||
    filters.isFeatured !== undefined ||
    filters.isNewArrival !== undefined ||
    filters.isBestSeller !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  function clearFilters() {
    onFiltersChange({
      search: undefined,
      categoryId: undefined,
      colorId: undefined,
      status: undefined,
      inStock: undefined,
      isFeatured: undefined,
      isNewArrival: undefined,
      isBestSeller: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: "newest",
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={filters.search ?? ""}
            onChange={(event) => {
              onFiltersChange({
                search:
                  event.target.value.trim() || undefined,
              });
            }}
            placeholder="Search products..."
            className="h-11 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
          />
        </div>

        {/* Filters button */}
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-card px-4 text-sm font-medium transition hover:bg-muted"
        >
          <SlidersHorizontal className="size-4" />

          Filters
        </button>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <X className="size-3.5" />

          Clear filters
        </button>
      )}
    </div>
  );
}
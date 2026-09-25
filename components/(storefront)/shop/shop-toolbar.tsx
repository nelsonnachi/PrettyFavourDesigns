"use client";

import type { ShopFiltersState } from "./shop-filters";

type ShopToolbarProps = {
  filters: ShopFiltersState;
  productCount: number;
  onChange: (filters: ShopFiltersState) => void;
  onOpenFilters: () => void;
};

export function ShopToolbar({
  filters,
  productCount,
  onChange,
  onOpenFilters,
}: ShopToolbarProps) {
  function updateSearch(search: string) {
    onChange({
      ...filters,
      search,
      page: 1,
    });
  }

  function updateSort(
    sort: ShopFiltersState["sort"]
  ) {
    onChange({
      ...filters,
      sort,
      page: 1,
    });
  }

  const activeFilterCount =
    Number(Boolean(filters.categoryId)) +
    filters.colorIds.length +
    Number(filters.minPrice !== undefined) +
    Number(filters.maxPrice !== undefined) +
    Number(filters.inStock !== undefined) +
    Number(Boolean(filters.isFeatured)) +
    Number(Boolean(filters.isNewArrival)) +
    Number(Boolean(filters.isBestSeller));

  return (
    <div className="border-y border-border py-5">
      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="relative">
        <label
          htmlFor="shop-search"
          className="sr-only"
        >
          Search products
        </label>

        <input
          id="shop-search"
          type="text"
          value={filters.search}
          onChange={(event) =>
            updateSearch(event.target.value)
          }
          placeholder="Search products..."
          className="w-full border border-border bg-card px-4 py-3.5 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
        />

        {/* Search Icon */}

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />

          <path d="m20 20-4-4" />
        </svg>
      </div>

      {/* =====================================================
          MOBILE TOOLBAR
      ====================================================== */}

      <div className="mt-4 lg:hidden">
        <div className="grid grid-cols-2 gap-3">
          {/* FILTER */}

          <button
            type="button"
            onClick={onOpenFilters}
            className="relative flex h-11 items-center justify-center gap-2 border border-border bg-card text-sm font-medium text-foreground transition hover:border-foreground"
          >
            {/* Filter Icon */}

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4"
            >
              <path d="M4 6h16" />
              <path d="M7 12h10" />
              <path d="M10 18h4" />
            </svg>

            <span>Filter</span>

            {/* Active Filter Count */}

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-semibold text-background">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* SORT */}

          <div className="relative">
            <label
              htmlFor="mobile-shop-sort"
              className="sr-only"
            >
              Sort products
            </label>

            <select
              id="mobile-shop-sort"
              value={filters.sort}
              onChange={(event) =>
                updateSort(
                  event.target
                    .value as ShopFiltersState["sort"]
                )
              }
              className="h-11 w-full appearance-none border border-border bg-card px-4 pr-10 text-center text-sm font-medium text-foreground outline-none transition focus:border-accent"
            >
              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>

              <option value="name_asc">
                Name: A–Z
              </option>

              <option value="name_desc">
                Name: Z–A
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="best_selling">
                Best Selling
              </option>
            </select>

            {/* Sort Icon */}

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            >
              <path d="M8 7h12" />
              <path d="M8 12h8" />
              <path d="M8 17h4" />
              <path d="M4 7h.01" />
              <path d="M4 12h.01" />
              <path d="M4 17h.01" />
            </svg>
          </div>
        </div>

        {/* Product Count */}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {productCount}{" "}
          {productCount === 1
            ? "product"
            : "products"}
        </p>
      </div>

      {/* =====================================================
          DESKTOP TOOLBAR
      ====================================================== */}

      <div className="mt-5 hidden items-center justify-between lg:flex">
        {/* LEFT */}

        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {productCount}
          </span>{" "}
          {productCount === 1
            ? "product"
            : "products"}
        </p>

        {/* RIGHT */}

        <div className="flex items-center gap-3">
          <label
            htmlFor="shop-sort"
            className="text-sm text-muted-foreground"
          >
            Sort by
          </label>

          <select
            id="shop-sort"
            value={filters.sort}
            onChange={(event) =>
              updateSort(
                event.target
                  .value as ShopFiltersState["sort"]
              )
            }
            className="border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="price_asc">
              Price: Low to High
            </option>

            <option value="price_desc">
              Price: High to Low
            </option>

            <option value="name_asc">
              Name: A–Z
            </option>

            <option value="name_desc">
              Name: Z–A
            </option>

            <option value="rating">
              Highest Rated
            </option>

            <option value="best_selling">
              Best Selling
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
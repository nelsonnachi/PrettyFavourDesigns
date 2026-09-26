"use client";

import Image from "next/image";
import { useState } from "react";

import { ProductCard } from "@/components/(storefront)/products/product-card";

import { ShopFilters, type ShopFiltersState } from "./shop-filters";

import { ShopToolbar } from "./shop-toolbar";
import { useProducts } from "@/lib/query/products/product-queries";

const DEFAULT_FILTERS: ShopFiltersState = {
  search: "",

  categoryId: undefined,

  colorId: undefined,

  minPrice: undefined,
  maxPrice: undefined,

  inStock: undefined,

  isFeatured: undefined,
  isNewArrival: undefined,
  isBestSeller: undefined,

  sort: "newest",

  page: 1,
  limit: 12,
};

export function ShopPage() {
  const [filters, setFilters] = useState<ShopFiltersState>(DEFAULT_FILTERS);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ==========================================================
  // GET PRODUCTS FROM THE REAL API
  // ==========================================================

  const {
    data: productsResponse,
    isPending,
    isFetching,
    isError,
  } = useProducts(filters);

  // ==========================================================
  // REAL API DATA
  // ==========================================================

  const products = productsResponse?.data ?? [];

  const totalProducts = productsResponse?.pagination.total ?? 0;

  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  function resetFilters() {
    setFilters({
      ...DEFAULT_FILTERS,
    });
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ======================================================
          SHOP HEADER
      ====================================================== */}

      <section className="relative min-h-[480px] overflow-hidden border-b border-border lg:min-h-[500px]">
        <Image
          src="/images/banners/collection.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] lg:object-center"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto flex min-h-[480px] max-w-[1440px] items-center px-5 py-16 sm:px-8 lg:min-h-[560px] lg:px-12 lg:py-20">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              SHOP SHOPPFD
            </p>

            <h1 className="font-serif text-5xl leading-none tracking-tight sm:text-6xl lg:text-7xl">
              The Collection
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Thoughtfully crafted bags designed to become part of your everyday
              story.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          SHOP CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <ShopToolbar
          filters={filters}
          productCount={totalProducts}
          onChange={setFilters}
          onOpenFilters={() => setMobileFiltersOpen(true)}
        />

        <div className="mt-8 flex gap-10 lg:mt-10">
          {/* ==================================================
              DESKTOP FILTERS
          ================================================== */}

          <aside className="hidden w-[230px] shrink-0 lg:block xl:w-[250px]">
            <ShopFilters
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </aside>

          {/* ==================================================
              PRODUCTS
          ================================================== */}

          <div className="min-w-0 flex-1">
            {/* =================================================
                INITIAL LOADING
            ================================================= */}

            {isPending ? (
              <ProductGridSkeleton />
            ) : isError ? (
              <ProductError onRetry={() => window.location.reload()} />
            ) : products.length > 0 ? (
              <>
                {/* =================================================
                    FETCHING INDICATOR
                ================================================= */}

                {isFetching && (
                  <div className="mb-4 text-right text-xs text-muted-foreground">
                    Updating products...
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyProducts onReset={resetFilters} />
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/30"
          />

          <aside className="absolute right-0 top-0 h-full w-[min(88vw,380px)] overflow-y-auto bg-card px-6 py-8 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-3xl">Filters</h2>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-2xl"
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            <ShopFilters
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </aside>
        </div>
      )}
    </main>
  );
}

// ============================================================
// PRODUCT SKELETON
// ============================================================

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[4/5] animate-pulse bg-muted" />

          <div className="mt-4 h-4 w-3/4 animate-pulse bg-muted" />

          <div className="mt-2 h-4 w-1/3 animate-pulse bg-muted" />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// API ERROR
// ============================================================

function ProductError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center border border-border bg-card px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Something went wrong
      </p>

      <h2 className="mt-4 font-serif text-3xl">
        We could not load the collection
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Please try again. If the problem continues, check your connection and
        try again later.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}

// ============================================================
// EMPTY PRODUCTS
// ============================================================

function EmptyProducts({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center border border-border bg-card px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Nothing found
      </p>

      <h2 className="mt-4 font-serif text-3xl">No bags match your filters</h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Try changing your search or removing one of the filters to explore the
        full collection.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
      >
        Clear all filters
      </button>
    </div>
  );
}

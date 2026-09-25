"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { storefrontProducts } from "@/data/storefront-products";

import { ProductCard } from "@/components/(storefront)/products/product-card";

import {
  ShopFilters,
  type ShopFiltersState,
} from "./shop-filters";

import { ShopToolbar } from "./shop-toolbar";

import { filterStorefrontProducts } from "@/data/filter-products";

const DEFAULT_FILTERS: ShopFiltersState = {
  search: "",

  categoryId: undefined,

  colorIds: [],

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
  const [filters, setFilters] =
    useState<ShopFiltersState>(DEFAULT_FILTERS);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const filteredProducts = useMemo(() => {
    return filterStorefrontProducts(
      storefrontProducts,
      filters
    );
  }, [filters]);

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
        {/* Background Image */}

        <Image
          src="/images/banners/collection.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] lg:object-center"
        />

        {/* Image Overlay */}

        <div className="absolute inset-0 bg-black/40" />

        {/* Header Content */}

        <div className="relative z-10 mx-auto flex min-h-[480px] max-w-[1440px] items-center px-5 py-16 sm:px-8 lg:min-h-[560px] lg:px-12 lg:py-20">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              SHOP SHOPPFD
            </p>

            <h1 className="font-serif text-5xl leading-none tracking-tight sm:text-6xl lg:text-7xl">
              The Collection
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Thoughtfully crafted bags designed
              to become part of your everyday
              story.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          SHOP CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        {/* Search + Sort Toolbar */}

        <ShopToolbar
          filters={filters}
          productCount={filteredProducts.length}
          onChange={setFilters}
          onOpenFilters={() =>
            setMobileFiltersOpen(true)
          }
        />

        {/* Filter Sidebar + Products */}

        <div className="mt-8 flex gap-10 lg:mt-10">
          {/* Desktop Filter Sidebar */}

          <aside className="hidden w-[230px] shrink-0 lg:block xl:w-[250px]">
            <ShopFilters
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </aside>

          {/* Products */}

          <div className="min-w-0 flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-3">
                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyProducts
                onReset={resetFilters}
              />
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="absolute inset-0 bg-black/30"
          />

          {/* Drawer */}

          <aside className="absolute right-0 top-0 h-full w-[min(88vw,380px)] overflow-y-auto bg-card px-6 py-8 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-3xl">
                Filters
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
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

function EmptyProducts({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center border border-border bg-card px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Nothing found
      </p>

      <h2 className="mt-4 font-serif text-3xl">
        No bags match your filters
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Try changing your search or removing
        one of the filters to explore the full
        collection.
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
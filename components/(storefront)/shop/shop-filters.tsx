"use client";

import { useState } from "react";

import { useCategories } from "@/lib/query/categories/category-queries";
import { useColors } from "@/lib/query/colors/color-queries";

import type { Category } from "@/lib/query/categories/category-types";
import type { Color } from "@/lib/query/colors/color-types";

export type ShopFiltersState = {
  search: string;

  categoryId?: string;
  colorId?: string;

  minPrice?: number;
  maxPrice?: number;

  inStock?: boolean;

  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;

  sort:
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc"
    | "rating"
    | "best_selling";

  page: number;
  limit: number;
};

type ShopFiltersProps = {
  filters: ShopFiltersState;
  onChange: (filters: ShopFiltersState) => void;
  onReset: () => void;
};

type PriceOption = {
  label: string;
  minPrice?: number;
  maxPrice?: number;
};

const PRICE_OPTIONS: PriceOption[] = [
  {
    label: "Under ₦50,000",
    maxPrice: 49999,
  },
  {
    label: "₦50,000 – ₦100,000",
    minPrice: 50000,
    maxPrice: 100000,
  },
  {
    label: "₦100,000+",
    minPrice: 100000,
  },
];

export function ShopFilters({ filters, onChange, onReset }: ShopFiltersProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [collectionOpen, setCollectionOpen] = useState(true);

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategories();

  const categories: Category[] = categoriesResponse?.data ?? [];

  // ==========================================================
  // COLORS
  // ==========================================================

  const { data: colorsResponse, isLoading: colorsLoading } = useColors();

  const colors: Color[] = colorsResponse ?? [];

  // ==========================================================
  // UPDATE FILTER
  // ==========================================================

  function updateFilter(updates: Partial<ShopFiltersState>) {
    onChange({
      ...filters,
      ...updates,
      page: 1,
    });
  }

  // ==========================================================
  // CATEGORY
  // ==========================================================

  function handleCategoryChange(categoryId: string) {
    updateFilter({
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    });
  }

  // ==========================================================
  // COLOR
  // ==========================================================

  function handleColorChange(colorId: string) {
    updateFilter({
      colorId: filters.colorId === colorId ? undefined : colorId,
    });
  }

  // ==========================================================
  // PRICE
  // ==========================================================

  function handlePriceChange(option: PriceOption) {
    const isAlreadySelected =
      filters.minPrice === option.minPrice &&
      filters.maxPrice === option.maxPrice;

    if (isAlreadySelected) {
      updateFilter({
        minPrice: undefined,
        maxPrice: undefined,
      });

      return;
    }

    updateFilter({
      minPrice: option.minPrice,
      maxPrice: option.maxPrice,
    });
  }

  function isPriceSelected(option: PriceOption) {
    return (
      filters.minPrice === option.minPrice &&
      filters.maxPrice === option.maxPrice
    );
  }

  return (
    <aside className="w-full">
      {/* =====================================================
          CATEGORY
      ====================================================== */}

      <div className="border-t border-border py-6">
        <button
          type="button"
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span>Category</span>

          <span className="text-lg leading-none">
            {categoryOpen ? "−" : "+"}
          </span>
        </button>

        {categoryOpen && (
          <div className="mt-5 space-y-4">
            {categoriesLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No categories available.
              </p>
            ) : (
              categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground"
                >
                  <input
                    type="checkbox"
                    checked={filters.categoryId === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />

                  <span>{category.name}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          PRICE
      ====================================================== */}

      <div className="border-t border-border py-6">
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span>Price Range</span>

          <span className="text-lg leading-none">{priceOpen ? "−" : "+"}</span>
        </button>

        {priceOpen && (
          <div className="mt-5 space-y-4">
            {PRICE_OPTIONS.map((option) => (
              <label
                key={option.label}
                className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground"
              >
                <input
                  type="radio"
                  name="price-range"
                  checked={isPriceSelected(option)}
                  onChange={() => handlePriceChange(option)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />

                <span>{option.label}</span>
              </label>
            ))}

            <div className="border-t border-border pt-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Custom range
              </p>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={filters.minPrice ?? ""}
                  onChange={(event) =>
                    updateFilter({
                      minPrice:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    })
                  }
                  className="w-full border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={filters.maxPrice ?? ""}
                  onChange={(event) =>
                    updateFilter({
                      maxPrice:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    })
                  }
                  className="w-full border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          COLOR
      ====================================================== */}

      <div className="border-t border-border py-6">
        <button
          type="button"
          onClick={() => setColorOpen(!colorOpen)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span>Color</span>

          <span className="text-lg leading-none">{colorOpen ? "−" : "+"}</span>
        </button>

        {colorOpen && (
          <div className="mt-5 space-y-4">
            {colorsLoading ? (
              <p className="text-sm text-muted-foreground">Loading colors...</p>
            ) : colors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No colors available.
              </p>
            ) : (
              colors.map((color) => {
                const selected = filters.colorId === color.id;

                return (
                  <label
                    key={color.id}
                    className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleColorChange(color.id)}
                      className="sr-only"
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        selected ? "border-foreground" : "border-border"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{
                          backgroundColor: color.hexCode ?? "#e5e5e5",
                        }}
                      />
                    </span>

                    <span>{color.name}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          AVAILABILITY
      ====================================================== */}

      <div className="border-t border-border py-6">
        <button
          type="button"
          onClick={() => setAvailabilityOpen(!availabilityOpen)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span>Availability</span>

          <span className="text-lg leading-none">
            {availabilityOpen ? "−" : "+"}
          </span>
        </button>

        {availabilityOpen && (
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={filters.inStock === true}
              onChange={(event) =>
                updateFilter({
                  inStock: event.target.checked ? true : undefined,
                })
              }
              className="h-4 w-4 accent-[var(--accent)]"
            />
            In stock only
          </label>
        )}
      </div>

      {/* =====================================================
          COLLECTION
      ====================================================== */}

      <div className="border-t border-border py-6">
        <button
          type="button"
          onClick={() => setCollectionOpen(!collectionOpen)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span>Collection</span>

          <span className="text-lg leading-none">
            {collectionOpen ? "−" : "+"}
          </span>
        </button>

        {collectionOpen && (
          <div className="mt-5 space-y-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={filters.isFeatured === true}
                onChange={(event) =>
                  updateFilter({
                    isFeatured: event.target.checked ? true : undefined,
                  })
                }
                className="h-4 w-4 accent-[var(--accent)]"
              />
              Featured
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={filters.isNewArrival === true}
                onChange={(event) =>
                  updateFilter({
                    isNewArrival: event.target.checked ? true : undefined,
                  })
                }
                className="h-4 w-4 accent-[var(--accent)]"
              />
              New arrivals
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={filters.isBestSeller === true}
                onChange={(event) =>
                  updateFilter({
                    isBestSeller: event.target.checked ? true : undefined,
                  })
                }
                className="h-4 w-4 accent-[var(--accent)]"
              />
              Best sellers
            </label>
          </div>
        )}
      </div>

      {/* =====================================================
          CLEAR
      ====================================================== */}

      <button
        type="button"
        onClick={onReset}
        className="mt-4 text-sm font-medium text-accent underline underline-offset-4"
      >
        Clear all filters
      </button>
    </aside>
  );
}

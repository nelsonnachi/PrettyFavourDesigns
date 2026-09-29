"use client";

import { useAdminCategories } from "@/lib/query/categories/category-queries";
import type { ProductStatus } from "@/lib/query/products/product-types";

interface ProductOrganizationProps {
  categoryId: string;
  status: ProductStatus;

  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ProductStatus) => void;
}

const selectClassName =
  "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15";

export function ProductOrganization({
  categoryId,
  status,
  onCategoryChange,
  onStatusChange,
}: ProductOrganizationProps) {
  const categoriesQuery = useAdminCategories();

  const categories = categoriesQuery.data?.data ?? [];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="product-category"
          className="text-sm font-medium"
        >
          Category <span className="text-accent">*</span>
        </label>

        <select
          id="product-category"
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
          disabled={categoriesQuery.isLoading}
          className={selectClassName}
        >
          <option value="">
            {categoriesQuery.isLoading
              ? "Loading categories..."
              : "Select category"}
          </option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
              {!category.isActive ? " (Inactive)" : ""}
            </option>
          ))}
        </select>

        {categoriesQuery.isError && (
          <p className="text-xs text-red-600">
            Unable to load categories.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="product-status"
          className="text-sm font-medium"
        >
          Status
        </label>

        <select
          id="product-status"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as ProductStatus)
          }
          className={selectClassName}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of stock</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>
  );
}
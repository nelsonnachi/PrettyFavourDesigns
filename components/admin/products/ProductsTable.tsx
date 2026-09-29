"use client";

import Image from "next/image";
import Link from "next/link";

import {
  MoreHorizontal,
  PackageOpen,
} from "lucide-react";
import { AdminProduct, ProductPagination, ProductStatus } from "@/lib/query/products/product-types";



interface ProductsTableProps {
  products: AdminProduct[];

  isLoading: boolean;

  isFetching: boolean;

  error: Error | null;

  pagination?: ProductPagination;

  onPageChange: (page: number) => void;
}

export function ProductsTable({
  products,
  isLoading,
  isFetching,
  error,
  pagination,
  onPageChange,
}: ProductsTableProps) {
  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <h2 className="font-serif text-xl">
          Unable to load products
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <PackageOpen className="size-5 text-muted-foreground" />
        </div>

        <h2 className="mt-4 font-serif text-xl">
          No products found
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or filters.
        </p>

        <Link
          href="/admin/products/new"
          className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Add product
        </Link>
      </div>
    );
  }

  // ==========================================================
  // TABLE
  // ==========================================================

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-5 py-4 text-left font-medium">
                Product
              </th>

              <th className="px-4 py-4 text-left font-medium">
                SKU
              </th>

              <th className="px-4 py-4 text-left font-medium">
                Category
              </th>

              <th className="px-4 py-4 text-left font-medium">
                Price
              </th>

              <th className="px-4 py-4 text-left font-medium">
                Stock
              </th>

              <th className="px-4 py-4 text-left font-medium">
                Status
              </th>

              <th className="w-12 px-4 py-4" />
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <ProductsPagination
          pagination={pagination}
          isFetching={isFetching}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

// ============================================================
// PRODUCT ROW
// ============================================================

function ProductRow({
  product,
}: {
  product: AdminProduct;
}) {
  const primaryImage =
    product.images.find(
      (image) => image.isPrimary,
    ) ?? product.images[0];

  const totalStock = product.variants.reduce(
    (total, variant) => total + variant.stock,
    0,
  );

  return (
    <tr className="border-b last:border-b-0">
      {/* Product */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={product.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0">
            <Link
              href={`/admin/products/${product.slug}/edit`}
              className="block truncate font-medium transition hover:text-accent"
            >
              {product.name}
            </Link>

            <p className="truncate text-xs text-muted-foreground">
              {product.variants.length}{" "}
              {product.variants.length === 1
                ? "color"
                : "colors"}
            </p>
          </div>
        </div>
      </td>

      {/* SKU */}
      <td className="px-4 py-4 text-muted-foreground">
        {product.sku}
      </td>

      {/* Category */}
      <td className="px-4 py-4">
        {product.category.name}
      </td>

      {/* Price */}
      <td className="px-4 py-4 font-medium">
        ₦{Number(product.price).toLocaleString()}
      </td>

      {/* Stock */}
      <td className="px-4 py-4">
        {totalStock}
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <ProductStatusBadge
          status={product.status}
        />
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <Link
          href={`/admin/products/${product.slug}/edit`}
          className="flex size-9 items-center justify-center rounded-lg transition hover:bg-muted"
          aria-label={`Edit ${product.name}`}
        >
          <MoreHorizontal className="size-4" />
        </Link>
      </td>
    </tr>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function ProductStatusBadge({
  status,
}: {
  status: ProductStatus;
}) {
  const labels: Record<ProductStatus, string> = {
    draft: "Draft",
    active: "Active",
    out_of_stock: "Out of stock",
    archived: "Archived",
  };

  return (
    <span className="inline-flex items-center rounded-full border bg-muted px-2.5 py-1 text-xs font-medium">
      {labels[status]}
    </span>
  );
}

// ============================================================
// PAGINATION
// ============================================================

function ProductsPagination({
  pagination,
  isFetching,
  onPageChange,
}: {
  pagination: ProductPagination;

  isFetching: boolean;

  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, total, limit } =
    pagination;

  const start = (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    total,
  );

  return (
    <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-medium text-foreground">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {total}
        </span>{" "}
        products
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1 || isFetching}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="rounded-lg border px-3 py-2 text-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          Previous
        </button>

        <span className="px-2 text-sm text-muted-foreground">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={
            page >= totalPages ||
            isFetching
          }
          onClick={() =>
            onPageChange(page + 1)
          }
          className="rounded-lg border px-3 py-2 text-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ============================================================
// LOADING SKELETON
// ============================================================

function ProductsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="divide-y">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="size-12 shrink-0 animate-pulse rounded-xl bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />

                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>

              <div className="hidden h-4 w-24 animate-pulse rounded bg-muted sm:block" />

              <div className="hidden h-4 w-20 animate-pulse rounded bg-muted md:block" />

              <div className="hidden h-4 w-16 animate-pulse rounded bg-muted lg:block" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
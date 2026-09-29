"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Package,
  Palette,
  RefreshCw,
} from "lucide-react";

import { useAdminInventoryItem } from "@/lib/query/inventory/inventory-queries";

type InventoryStockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

function getStatusLabel(status: InventoryStockStatus) {
  switch (status) {
    case "in_stock":
      return "In stock";

    case "low_stock":
      return "Low stock";

    case "out_of_stock":
      return "Out of stock";

    default:
      return "Unknown";
  }
}

function getStatusClasses(status: InventoryStockStatus) {
  switch (status) {
    case "in_stock":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "low_stock":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "out_of_stock":
      return "bg-red-50 text-red-700 ring-red-600/20";

    default:
      return "bg-muted text-muted-foreground ring-border";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCurrency(value: string | null) {
  if (value === null) {
    return "—";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getMovementLabel(quantityChange: number) {
  if (quantityChange > 0) {
    return "Stock added";
  }

  if (quantityChange < 0) {
    return "Stock deducted";
  }

  return "No stock change";
}

function getMovementClasses(quantityChange: number) {
  if (quantityChange > 0) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (quantityChange < 0) {
    return "bg-red-50 text-red-700";
  }

  return "bg-muted text-muted-foreground";
}

export default function AdminInventoryDetailPage() {
  const params = useParams<{ id: string }>();

  const inventoryId = params?.id;

  const inventoryQuery = useAdminInventoryItem(
    inventoryId ?? "",
  );

  const inventory = inventoryQuery.data?.data;

  if (inventoryQuery.isLoading) {
    return (
      <div className="space-y-7">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />

          <div className="space-y-2">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-56 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`inventory-stat-skeleton-${index}`}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-8 w-24 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />

          <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </div>
    );
  }

  if (inventoryQuery.isError || !inventory) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to inventory
        </Link>

        <section className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-medium text-red-800">
            Unable to load inventory item
          </h1>

          <p className="mt-1 text-sm text-red-700">
            {inventoryQuery.error instanceof Error
              ? inventoryQuery.error.message
              : "The inventory item could not be found."}
          </p>

          <button
            type="button"
            onClick={() => inventoryQuery.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-100"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </section>
      </div>
    );
  }

  const status =
    inventory.stockStatus as InventoryStockStatus;

  return (
    <div className="space-y-7">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <section>
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to inventory
        </Link>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Package
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
                  {inventory.product.name}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Inventory details and stock history
                </p>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
              status,
            )}`}
          >
            {getStatusLabel(status)}
          </span>
        </div>
      </section>

      {/* ====================================================== */}
      {/* STOCK SUMMARY */}
      {/* ====================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total stock
          </p>

          <p className="mt-2 font-serif text-3xl tracking-tight">
            {inventory.stock}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Physical stock
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Reserved
          </p>

          <p className="mt-2 font-serif text-3xl tracking-tight">
            {inventory.reservedStock}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Currently reserved
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Available
          </p>

          <p className="mt-2 font-serif text-3xl tracking-tight">
            {inventory.availableStock}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Available for sale
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Product price
          </p>

          <p className="mt-2 font-serif text-3xl tracking-tight">
            {formatCurrency(inventory.product.price)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Current selling price
          </p>
        </div>
      </section>

      {/* ====================================================== */}
      {/* PRODUCT + VARIANT */}
      {/* ====================================================== */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* PRODUCT INFORMATION */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-medium">
              Product information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Details about this inventory variant.
            </p>
          </div>

          <div className="p-5">
            <div className="space-y-5">
              {/* PRODUCT */}
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Product
                </p>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {inventory.product.name}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Product SKU:{" "}
                      <span className="font-mono">
                        {inventory.product.sku}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={`/products/${inventory.product.slug}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="View product"
                  >
                    <ExternalLink
                      size={16}
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* VARIANT */}
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Variant
                </p>

                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <div className="flex items-center gap-2">
                      <Palette
                        size={16}
                        className="text-muted-foreground"
                      />

                      <p className="text-xs text-muted-foreground">
                        Color
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="h-5 w-5 rounded-full border border-border"
                        style={{
                          backgroundColor:
                            inventory.color.hexCode ??
                            undefined,
                        }}
                      />

                      <span className="font-medium">
                        {inventory.color.name}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <p className="text-xs text-muted-foreground">
                      Variant SKU
                    </p>

                    <p className="mt-3 font-mono text-sm font-medium">
                      {inventory.sku}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* PRODUCT DETAILS */}
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Product details
                </p>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {inventory.product.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Product status
                  </p>

                  <p className="mt-2 font-medium capitalize">
                    {inventory.product.status.replace(
                      /_/g,
                      " ",
                    )}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Cost price
                  </p>

                  <p className="mt-2 font-medium">
                    {formatCurrency(
                      inventory.product.costPrice,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INVENTORY META */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-medium">
              Inventory details
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Stock record information.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs text-muted-foreground">
                Inventory ID
              </p>

              <p className="mt-2 break-all font-mono text-xs">
                {inventory.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Product ID
              </p>

              <p className="mt-2 break-all font-mono text-xs">
                {inventory.productId}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Created
              </p>

              <p className="mt-2 text-sm">
                {formatDate(inventory.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Last updated
              </p>

              <p className="mt-2 text-sm">
                {formatDate(inventory.updatedAt)}
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-xs font-medium">
                Available stock
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {inventory.availableStock} units are currently
                available after reserved stock is deducted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* MOVEMENT HISTORY */}
      {/* ====================================================== */}

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-medium">
            Inventory movement history
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            A record of stock additions and deductions for this
            variant.
          </p>
        </div>

        {inventory.movements.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <Package
                size={20}
                className="text-muted-foreground"
              />
            </div>

            <h3 className="mt-4 font-medium">
              No inventory movements
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              There is no stock movement history for this variant
              yet.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Movement
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Quantity
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Reason
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Order
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Performed by
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {inventory.movements.map((movement) => (
                    <tr
                      key={movement.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getMovementClasses(
                            movement.quantityChange,
                          )}`}
                        >
                          {getMovementLabel(
                            movement.quantityChange,
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`font-medium ${
                            movement.quantityChange > 0
                              ? "text-emerald-700"
                              : movement.quantityChange < 0
                                ? "text-red-700"
                                : ""
                          }`}
                        >
                          {movement.quantityChange > 0
                            ? `+${movement.quantityChange}`
                            : movement.quantityChange}
                        </span>
                      </td>

                      <td className="max-w-xs px-5 py-4 text-sm text-muted-foreground">
                        {movement.reason}
                      </td>

                      <td className="px-5 py-4">
                        {movement.order ? (
                          <Link
                            href={`/admin/orders/${movement.order.id}`}
                            className="text-sm font-medium hover:underline"
                          >
                            {movement.order.orderNumber}
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {movement.user ? (
                          <div>
                            <p className="text-sm font-medium">
                              {[
                                movement.user.firstName,
                                movement.user.lastName,
                              ]
                                .filter(Boolean)
                                .join(" ") ||
                                movement.user.email}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {movement.user.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            System
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right text-sm text-muted-foreground">
                        {formatDate(movement.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-border md:hidden">
              {inventory.movements.map((movement) => (
                <div
                  key={movement.id}
                  className="space-y-4 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getMovementClasses(
                        movement.quantityChange,
                      )}`}
                    >
                      {getMovementLabel(
                        movement.quantityChange,
                      )}
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        movement.quantityChange > 0
                          ? "text-emerald-700"
                          : movement.quantityChange < 0
                            ? "text-red-700"
                            : ""
                      }`}
                    >
                      {movement.quantityChange > 0
                        ? `+${movement.quantityChange}`
                        : movement.quantityChange}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Reason
                    </p>

                    <p className="mt-1 text-sm">
                      {movement.reason}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order
                      </p>

                      {movement.order ? (
                        <Link
                          href={`/admin/orders/${movement.order.id}`}
                          className="mt-1 block text-sm font-medium hover:underline"
                        >
                          {movement.order.orderNumber}
                        </Link>
                      ) : (
                        <p className="mt-1 text-sm">
                          —
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Performed by
                      </p>

                      <p className="mt-1 text-sm">
                        {movement.user
                          ? [
                              movement.user.firstName,
                              movement.user.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ") ||
                            movement.user.email
                          : "System"}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {formatDate(movement.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
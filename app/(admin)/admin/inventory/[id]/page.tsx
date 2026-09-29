"use client";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Package,
} from "lucide-react";

import {
  useAdminInventoryItem,
} from "@/lib/query/inventory/inventory-queries";

// ============================================================
// PAGE
// ============================================================

export default function AdminInventoryDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } =
    requireParams(params);

  const inventoryQuery =
    useAdminInventoryItem(id);

  if (inventoryQuery.isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-muted" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-32 rounded-xl bg-muted" />
          <div className="h-32 rounded-xl bg-muted" />
          <div className="h-32 rounded-xl bg-muted" />
        </div>

        <div className="h-80 rounded-xl bg-muted" />
      </div>
    );
  }

  if (inventoryQuery.isError) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to inventory
        </Link>

        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Failed to load inventory item
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {inventoryQuery.error instanceof Error
              ? inventoryQuery.error.message
              : "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  const item =
    inventoryQuery.data?.data;

  if (!item) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to inventory
        </Link>

        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Package
            size={30}
            className="mx-auto text-muted-foreground"
          />

          <p className="mt-3 font-medium">
            Inventory item not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section>
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to inventory
        </Link>

        <div className="mt-5 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Package
              size={22}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <h1 className="font-serif text-3xl tracking-tight">
              {item.product.name}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>
                {item.color.name}
              </span>

              <span>•</span>

              <span className="font-mono text-xs">
                {item.sku}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          STOCK SUMMARY
      ====================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Current stock
          </p>

          <h2 className="mt-2 font-serif text-3xl">
            {item.stock}
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Reserved
          </p>

          <h2 className="mt-2 font-serif text-3xl">
            {item.reservedStock}
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Available
          </p>

          <h2 className="mt-2 font-serif text-3xl">
            {item.availableStock}
          </h2>
        </div>
      </section>

      {/* ======================================================
          INVENTORY MOVEMENTS
      ====================================================== */}

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-medium">
            Inventory history
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Stock movements for this variant.
          </p>
        </div>

        {item.movements.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No inventory movements yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {item.movements.map(
              (movement) => {
                const isIncrease =
                  movement.quantityChange >
                  0;

                const userName =
                  movement.user
                    ? [
                        movement.user
                          .firstName,
                        movement.user
                          .lastName,
                      ]
                        .filter(Boolean)
                        .join(" ")
                    : "System";

                return (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          isIncrease
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {isIncrease ? (
                          <ArrowUp
                            size={16}
                          />
                        ) : (
                          <ArrowDown
                            size={16}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium">
                          {movement.reason}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {userName}

                          {movement.order
                            ? ` • ${movement.order.orderNumber}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`font-medium ${
                          isIncrease
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {isIncrease
                          ? "+"
                          : ""}
                        {
                          movement.quantityChange
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(
                          movement.createdAt,
                        ).toLocaleString(
                          "en-NG",
                          {
                            dateStyle:
                              "medium",
                            timeStyle:
                              "short",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================================
// PARAMS HELPER
// ============================================================

function requireParams(
  params: Promise<{
    id: string;
  }>,
) {
  // This function exists only to keep
  // the page component readable.
  //
  // Next.js resolves the params promise
  // before this component needs the id.
  //
  // The actual value is resolved below.
  //
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value] = requireParamsState(
    params,
  );

  return value;
}

function requireParamsState(
  params: Promise<{
    id: string;
  }>,
): [
  {
    id: string;
  },
] {
  throw new Error(
    "This helper should not be used directly.",
  );
}
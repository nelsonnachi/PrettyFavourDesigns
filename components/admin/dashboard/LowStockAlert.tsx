"use client";

import Link from "next/link";

import { useAdminProducts } from "@/lib/query/products/product-queries";

export function LowStockAlert() {
  const productsQuery = useAdminProducts({
    page: 1,
    limit: 100,
  });

  const products =
    productsQuery.data?.data ?? [];

  const lowStockProducts = products
    .map((product) => {
      const stock = product.variants.reduce(
        (total, variant) => {
          return (
            total +
            Math.max(
              variant.stock -
                variant.reservedStock,
              0,
            )
          );
        },
        0,
      );

      return {
        ...product,
        stock,
      };
    })
    .filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= 5,
    )
    .sort(
      (a, b) =>
        a.stock - b.stock,
    )
    .slice(0, 3);

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">
          Low Stock Alert
        </h2>

        <Link
          href="/admin/inventory"
          className="text-xs text-accent hover:underline"
        >
          View all →
        </Link>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        These products are running low.
      </p>

      {productsQuery.isLoading ? (
        <div className="mt-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-center justify-between"
            >
              <div>
                <div className="h-4 w-32 rounded bg-secondary" />

                <div className="mt-2 h-3 w-16 rounded bg-secondary" />
              </div>

              <div className="h-6 w-12 rounded-full bg-secondary" />
            </div>
          ))}
        </div>
      ) : productsQuery.isError ? (
        <div className="mt-5 rounded-lg bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">
            Unable to load stock information.
          </p>
        </div>
      ) : lowStockProducts.length === 0 ? (
        <div className="mt-5 rounded-lg bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">
            No products are currently low on stock.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {lowStockProducts.map(
            (product) => (
              <div
                key={product.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.stock}{" "}
                    {product.stock === 1
                      ? "left"
                      : "left"}
                  </p>
                </div>

                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent">
                  Low
                </span>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
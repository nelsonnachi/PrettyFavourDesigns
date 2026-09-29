"use client";

import Link from "next/link";

import { useAdminProducts } from "@/lib/query/products/product-queries";

export function TopProducts() {
  const productsQuery = useAdminProducts({
    page: 1,
    limit: 4,
    sort: "best_selling",
  });

  const products =
    productsQuery.data?.data ?? [];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">
          Top Products
        </h2>

        <Link
          href="/admin/products"
          className="text-xs text-accent hover:underline"
        >
          View all →
        </Link>
      </div>

      {productsQuery.isLoading ? (
        <div className="mt-5 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex animate-pulse gap-3"
            >
              <div className="h-14 w-14 shrink-0 rounded-lg bg-secondary" />

              <div className="min-w-0 flex-1">
                <div className="h-4 w-3/4 rounded bg-secondary" />

                <div className="mt-2 h-3 w-1/3 rounded bg-secondary" />

                <div className="mt-3 h-1 rounded-full bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : productsQuery.isError ? (
        <div className="mt-5 rounded-lg bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">
            Unable to load top products.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="mt-5 rounded-lg bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground">
            No products available yet.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {products.map((product) => {
            const image =
              product.images.find(
                (item) => item.isPrimary,
              ) ?? product.images[0];

            return (
              <div
                key={product.id}
                className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                {/* Product Image */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {image?.url ? (
                    <img
                      src={image.url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary" />
                  )}
                </div>

                {/* Product Information */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    ₦
                    {Number(
                      product.price,
                    ).toLocaleString("en-NG")}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{
                          width: `${Math.min(
                            (product.soldCount / 150) *
                              100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      {product.soldCount} sold
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
"use client";

import Image from "next/image";

import { useCart } from "@/lib/query/cart/cart-queries";

function formatNaira(value: string | number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function CheckoutSummary() {
  const { data, isLoading } = useCart();

  const cart = data?.data;

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />

        <div className="mt-6 space-y-5">
          <div className="h-20 animate-pulse rounded-xl bg-muted" />

          <div className="h-20 animate-pulse rounded-xl bg-muted" />

          <div className="h-20 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>

        <p className="mt-3 text-sm text-muted-foreground">
          Your cart is empty.
        </p>
      </div>
    );
  }

  // ============================================================
  // ORDER SUMMARY
  // ============================================================

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order summary</h2>

        <span className="text-sm text-muted-foreground">
          {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      {/* ================================================== */}
      {/* ITEMS */}
      {/* ================================================== */}

      <div className="mt-6 divide-y divide-border">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
            {/* ================================================== */}
            {/* PRODUCT IMAGE */}
            {/* ================================================== */}

            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* ================================================== */}
            {/* PRODUCT DETAILS */}
            {/* ================================================== */}

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium">
                {item.product.name}
              </p>

              {/* ================================================== */}
              {/* COLOR */}
              {/* ================================================== */}

              {item.variant?.color && (
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-border"
                    style={{
                      backgroundColor:
                        item.variant.color.hexCode ?? "transparent",
                    }}
                  />

                  <span className="text-xs text-muted-foreground">
                    {item.variant.color.name}
                  </span>
                </div>
              )}

              {/* ================================================== */}
              {/* QUANTITY + PRICE */}
              {/* ================================================== */}

              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </span>

                <span className="text-sm font-medium">
                  {formatNaira(item.subtotal)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================== */}
      {/* TOTALS */}
      {/* ================================================== */}

      <div className="mt-7 border-t border-border pt-5">
        {/* SUBTOTAL */}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>

          <span className="font-medium">{formatNaira(cart.subtotal)}</span>
        </div>

        {/* SHIPPING */}

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>

          <span className="font-medium">Free</span>
        </div>

        {/* TOTAL */}

        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <span className="font-semibold">Total</span>

          <span className="text-xl font-semibold">
            {formatNaira(cart.subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

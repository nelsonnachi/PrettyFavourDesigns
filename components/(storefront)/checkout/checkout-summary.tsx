"use client";

import Image from "next/image";

import { useCart } from "@/lib/query/cart/cart-queries";

import { CheckoutDiscountCode } from "./checkout-discount-code";

function formatNaira(value: string | number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

type CheckoutSummaryProps = {
  appliedCode: string | null;
  discountAmount: number;
  isCheckingDiscount: boolean;
  discountError: string;
  onApplyCode: (code: string) => void;
  onRemoveCode: () => void;
};

export function CheckoutSummary({
  appliedCode,
  discountAmount,
  isCheckingDiscount,
  discountError,
  onApplyCode,
  onRemoveCode,
}: CheckoutSummaryProps) {
  const { data, isLoading } = useCart();

  const cart = data?.data;

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-6">
        <div className="h-6 w-32 max-w-full animate-pulse rounded bg-muted" />

        <div className="mt-6 min-w-0 space-y-5">
          <div className="h-20 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY CART
  // ============================================================

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>

        <p className="mt-3 break-words text-sm text-muted-foreground">
          Your cart is empty.
        </p>
      </div>
    );
  }

  // ============================================================
  // TOTAL
  // ============================================================

  const total = Math.max(cart.subtotal - discountAmount, 0);

  // ============================================================
  // ORDER SUMMARY
  // ============================================================

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-6 lg:p-7">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex min-w-0 items-center justify-between gap-3">
        <h2 className="min-w-0 break-words text-lg font-semibold">
          Order summary
        </h2>

        <span className="shrink-0 text-sm text-muted-foreground">
          {cart.totalItems}{" "}
          {cart.totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      {/* ================================================== */}
      {/* ITEMS */}
      {/* ================================================== */}

      <div className="mt-6 min-w-0 divide-y divide-border">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex min-w-0 gap-3 py-5 first:pt-0 last:pb-0 sm:gap-4"
          >
            {/* ================================================== */}
            {/* PRODUCT IMAGE */}
            {/* ================================================== */}

            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-20 sm:w-20">
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="(max-width: 640px) 64px, 80px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* ================================================== */}
            {/* PRODUCT DETAILS */}
            {/* ================================================== */}

            <div className="min-w-0 flex-1">
              {/* Product name + price */}

              <div className="flex min-w-0 items-start justify-between gap-3">
                <p className="min-w-0 flex-1 break-words text-sm font-medium leading-5">
                  {item.product.name}
                </p>

                <span className="shrink-0 text-right text-sm font-medium">
                  {formatNaira(item.subtotal)}
                </span>
              </div>

              {/* ================================================== */}
              {/* COLOR */}
              {/* ================================================== */}

              {item.variant?.color && (
                <div className="mt-2 flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border border-border"
                    style={{
                      backgroundColor:
                        item.variant.color.hexCode ?? "transparent",
                    }}
                  />

                  <span className="min-w-0 break-words text-xs text-muted-foreground">
                    {item.variant.color.name}
                  </span>
                </div>
              )}

              {/* ================================================== */}
              {/* QUANTITY */}
              {/* ================================================== */}

              <div className="mt-2">
                <span className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================== */}
      {/* DISCOUNT CODE */}
      {/* ================================================== */}

      <div className="mt-7 min-w-0 border-t border-border pt-5">
        <CheckoutDiscountCode
          appliedCode={appliedCode}
          isChecking={isCheckingDiscount}
          errorMessage={discountError}
          onApply={onApplyCode}
          onRemove={onRemoveCode}
        />
      </div>

      {/* ================================================== */}
      {/* TOTALS */}
      {/* ================================================== */}

      <div className="mt-5 min-w-0 border-t border-border pt-5">
        {/* SUBTOTAL */}

        <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
          <span className="min-w-0 text-muted-foreground">
            Subtotal
          </span>

          <span className="shrink-0 font-medium">
            {formatNaira(cart.subtotal)}
          </span>
        </div>

        {/* DISCOUNT */}

        {discountAmount > 0 && (
          <div className="mt-3 flex min-w-0 items-start justify-between gap-4 text-sm">
            <span className="min-w-0 break-words text-muted-foreground">
              Discount
              {appliedCode ? ` (${appliedCode})` : ""}
            </span>

            <span className="shrink-0 font-medium text-green-600">
              -{formatNaira(discountAmount)}
            </span>
          </div>
        )}

        {/* SHIPPING */}

        <div className="mt-4 min-w-0">
          <div className="flex min-w-0 items-start justify-between gap-4 text-sm">
            <span className="shrink-0 text-muted-foreground">
              Shipping
            </span>

            <span className="min-w-0 break-words text-right font-medium">
              Excluding shipping fee
            </span>
          </div>

          <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
            Shipping fee is not included in the total. We will contact
            you after your order to confirm the delivery fee based on
            your location.
          </p>
        </div>

        {/* TOTAL */}

        <div className="mt-5 flex min-w-0 items-center justify-between gap-4 border-t border-border pt-5">
          <span className="shrink-0 font-semibold">
            Total
          </span>

          <span className="shrink-0 text-lg font-semibold sm:text-xl">
            {formatNaira(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
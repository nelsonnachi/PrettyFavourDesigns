"use client";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";

import { useCustomerOrder } from "@/lib/query/orders/order-queries";

type CheckoutSuccessPageProps = {
  orderId: string;
};

function formatNaira(value: string | number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function CheckoutSuccessPage({
  orderId,
}: CheckoutSuccessPageProps) {
  const {
    data,
    isLoading,
    isError,
  } = useCustomerOrder(orderId);

  // ==========================================================
  // INVALID ORDER
  // ==========================================================

  if (!orderId) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5 py-16">
          <div className="w-full rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Package className="h-7 w-7" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold">
              Order not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              We could not find the order you are looking for.
              Please check your orders or return to the shop.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/orders"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                View my orders
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-16">
          <div className="animate-pulse">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted" />

            <div className="mx-auto mt-6 h-8 w-64 rounded bg-muted" />

            <div className="mx-auto mt-3 h-5 w-80 max-w-full rounded bg-muted" />

            <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="h-6 w-40 rounded bg-muted" />

              <div className="mt-6 space-y-5">
                <div className="h-20 rounded-2xl bg-muted" />
                <div className="h-20 rounded-2xl bg-muted" />
                <div className="h-20 rounded-2xl bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (isError || !data?.data) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5 py-16">
          <div className="w-full rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Package className="h-7 w-7" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold">
              We couldn't load your order
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Your order may still have been placed. You can
              check your orders to see its current status.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/orders"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                View my orders
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { order, items } = data.data;

  const isCashOnDelivery =
    order.paymentMethod ===
    "cash_on_delivery";

  // ==========================================================
  // SUCCESS
  // ==========================================================

  return (
    <main className="min-h-screen bg-background">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            SHOPPFD
          </Link>

          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />

            <span className="hidden text-sm sm:inline">
              Order confirmation
            </span>
          </div>
        </div>
      </header>

      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-16">
        {/* ================================================== */}
        {/* SUCCESS MESSAGE */}
        {/* ================================================== */}

        <section className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </span>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Order confirmed
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Your order has been received successfully. We
            have everything we need to process your order.
          </p>

          <div className="mt-5 inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium">
            Order #{order.orderNumber}
          </div>
        </section>

        {/* ================================================== */}
        {/* COD PAYMENT NOTICE */}
        {/* ================================================== */}

        {isCashOnDelivery && (
          <section className="mt-10 rounded-3xl border border-accent/20 bg-accent/5 p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Cash on delivery
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  You will pay{" "}
                  <span className="font-semibold text-foreground">
                    {formatNaira(order.total)}
                  </span>{" "}
                  when your order is delivered to you.
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your payment is currently pending because
                  payment will be collected at delivery.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ================================================== */}
        {/* ORDER DETAILS */}
        {/* ================================================== */}

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Order details
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Placed {formatDate(order.createdAt)}
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold capitalize">
              {order.status.replace("_", " ")}
            </span>
          </div>

          {/* ================================================== */}
          {/* ITEMS */}
          {/* ================================================== */}

          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-5"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {item.productName}
                  </p>

                  {item.colorName && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Color: {item.colorName}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium">
                    {formatNaira(item.totalPrice)}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatNaira(item.unitPrice)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ================================================== */}
          {/* TOTALS */}
          {/* ================================================== */}

          <div className="border-t border-border pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span className="font-medium">
                {formatNaira(order.subtotal)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Shipping
              </span>

              <span className="font-medium">
                {Number(order.shippingFee) === 0
                  ? "Free"
                  : formatNaira(order.shippingFee)}
              </span>
            </div>

            {Number(order.discount) > 0 && (
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Discount
                </span>

                <span className="font-medium">
                  -{formatNaira(order.discount)}
                </span>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-xl font-semibold">
                {formatNaira(order.total)}
              </span>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* NEXT STEPS */}
        {/* ================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <MapPin className="h-5 w-5 text-accent" />

            <h2 className="mt-4 font-semibold">
              Delivery
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your order will be delivered to the shipping
              address provided during checkout.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <Package className="h-5 w-5 text-accent" />

            <h2 className="mt-4 font-semibold">
              Order tracking
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              You can view your order status and details at
              any time from your orders page.
            </p>
          </div>
        </section>

        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View order
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/shop"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border px-7 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";

import {
  ArrowRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import { useCustomerOrders } from "@/lib/query/orders/order-queries";

// ============================================================
// HELPERS
// ============================================================

function formatCurrency(value: string) {
  const amount = Number(value);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

// ============================================================
// STATUS HELPERS
// ============================================================

function getOrderStatusClasses(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";

    case "processing":
      return "bg-blue-50 text-blue-700";

    case "shipped":
      return "bg-purple-50 text-purple-700";

    case "delivered":
      return "bg-green-50 text-green-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-50 text-slate-700";
  }
}

function getPaymentStatusClasses(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-50 text-green-700";

    case "pending":
      return "bg-amber-50 text-amber-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "refunded":
      return "bg-purple-50 text-purple-700";

    case "partially_refunded":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-slate-50 text-slate-700";
  }
}

// ============================================================
// PAGE
// ============================================================

export default function OrdersPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useCustomerOrders({
    page: 1,
    limit: 10,
  });

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#faf7f1]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12">
          <div className="mb-10">
            <div className="h-4 w-24 animate-pulse rounded bg-[#eee6da]" />

            <div className="mt-4 h-10 w-48 animate-pulse rounded bg-[#eee6da]" />

            <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-[#eee6da]" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="h-5 w-40 rounded bg-[#eee6da]" />
                    <div className="h-4 w-32 rounded bg-[#eee6da]" />
                  </div>

                  <div className="h-10 w-28 rounded bg-[#eee6da]" />

                  <div className="h-6 w-24 rounded bg-[#eee6da]" />

                  <div className="h-10 w-32 rounded bg-[#eee6da]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (isError) {
    return (
      <main className="min-h-screen bg-[#faf7f1]">
        <div className="mx-auto flex min-h-[70vh] max-w-[600px] items-center justify-center px-5 py-16">
          <div className="w-full rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Package className="h-6 w-6 text-red-600" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-[#211b17]">
              Unable to load your orders
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6f6258]">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading your orders."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#e85d22] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#cf4e1b]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const orders = data?.data?.orders ?? [];
  const pagination = data?.data?.pagination;

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf7f1]">
        <div className="mx-auto flex min-h-[70vh] max-w-[600px] items-center justify-center px-5 py-16">
          <div className="w-full text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eee6da]">
              <ShoppingBag className="h-8 w-8 text-[#e85d22]" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e85d22]">
              Your orders
            </p>

            <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl font-semibold text-[#211b17]">
              No orders yet
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6f6258]">
              You have not placed an order yet. Discover something beautiful
              from our collection and your orders will appear here.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e85d22] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#cf4e1b]"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ORDERS
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#faf7f1]">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e85d22]">
            My account
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl font-semibold text-[#211b17] sm:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#6f6258]">
            View your orders, payment status, delivery progress, and order
            details.
          </p>
        </div>

        {/* ================================================== */}
        {/* ORDER LIST */}
        {/* ================================================== */}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* ========================================== */}
                {/* ORDER INFO */}
                {/* ========================================== */}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b8d81]">
                    Order
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-[#211b17]">
                    {order.orderNumber}
                  </h2>

                  <p className="mt-2 text-sm text-[#6f6258]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* ========================================== */}
                {/* ITEM COUNT */}
                {/* ========================================== */}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b8d81]">
                    Items
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#211b17]">
                    {order.itemCount}{" "}
                    {order.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>

                {/* ========================================== */}
                {/* STATUS */}
                {/* ========================================== */}

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getOrderStatusClasses(
                      order.status,
                    )}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                      order.paymentStatus,
                    )}`}
                  >
                    {order.paymentStatus.replace("_", " ")}
                  </span>
                </div>

                {/* ========================================== */}
                {/* TOTAL */}
                {/* ========================================== */}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b8d81]">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#211b17]">
                    {formatCurrency(order.total)}
                  </p>
                </div>

                {/* ========================================== */}
                {/* VIEW ORDER */}
                {/* ========================================== */}

                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e6ddd1] px-5 py-2.5 text-sm font-semibold text-[#211b17] transition hover:border-[#e85d22] hover:text-[#e85d22]"
                >
                  View Order
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================== */}
        {/* PAGINATION INFO */}
        {/* ================================================== */}

        {pagination && pagination.total > 0 && (
          <div className="mt-8 border-t border-[#e6ddd1] pt-6 text-sm text-[#6f6258]">
            Showing{" "}
            <span className="font-semibold text-[#211b17]">
              {orders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#211b17]">
              {pagination.total}
            </span>{" "}
            orders
          </div>
        )}
      </div>
    </main>
  );
}
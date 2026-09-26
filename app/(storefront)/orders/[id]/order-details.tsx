"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  Package,
  Truck,
} from "lucide-react";

import { useCustomerOrder } from "@/lib/query/orders/order-queries";

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
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

// ============================================================
// STATUS HELPERS
// ============================================================

function getStatusStep(status: string) {
  switch (status) {
    case "pending":
      return 1;

    case "processing":
      return 2;

    case "shipped":
      return 3;

    case "delivered":
      return 4;

    default:
      return 0;
  }
}

// ============================================================
// STATUS LABEL
// ============================================================

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Order Placed";

    case "processing":
      return "Processing";

    case "shipped":
      return "Shipped";

    case "delivered":
      return "Delivered";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
}

// ============================================================
// PAGE
// ============================================================

export default function OrderDetails({
  orderId,
}: {
  orderId: string;
}) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useCustomerOrder(orderId);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#faf7f1]">
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-[#eee6da]" />

            <div className="mt-5 h-10 w-64 rounded bg-[#eee6da]" />

            <div className="mt-3 h-5 w-80 max-w-full rounded bg-[#eee6da]" />

            <div className="mt-10 h-40 rounded-2xl bg-[#eee6da]" />

            <div className="mt-6 h-64 rounded-2xl bg-[#eee6da]" />
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
      <main className="min-h-screen bg-[#faf7f1]">
        <div className="mx-auto flex min-h-[70vh] max-w-[600px] items-center justify-center px-5">
          <div className="w-full rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Package className="h-6 w-6 text-red-600" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-[#211b17]">
              Order not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6f6258]">
              {error instanceof Error
                ? error.message
                : "We could not find this order."}
            </p>

            <Link
              href="/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e85d22] px-6 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const order = data.data.order;
  const items = data.data.items;
  const payment = data.data.payment;

  const currentStep = getStatusStep(order.status);

  // ==========================================================
  // CANCELLED
  // ==========================================================

  if (order.status === "cancelled") {
    return (
      <main className="min-h-screen bg-[#faf7f1]">
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6f6258] transition hover:text-[#e85d22]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          <div className="mt-8 rounded-2xl border border-red-100 bg-[#fffdf9] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                <span className="text-xl font-bold text-red-600">
                  !
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
                  Order Cancelled
                </p>

                <h1 className="mt-2 text-2xl font-semibold text-[#211b17]">
                  {order.orderNumber}
                </h1>

                <p className="mt-2 text-sm text-[#6f6258]">
                  This order was cancelled.
                </p>
              </div>
            </div>
          </div>

          <OrderContent
            order={order}
            items={items}
            payment={payment}
            currentStep={currentStep}
          />
        </div>
      </main>
    );
  }

  // ==========================================================
  // NORMAL ORDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#faf7f1]">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6f6258] transition hover:text-[#e85d22]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e85d22]">
            Order details
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl font-semibold text-[#211b17] sm:text-5xl">
            {order.orderNumber}
          </h1>

          <p className="mt-3 text-sm text-[#6f6258]">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <OrderContent
          order={order}
          items={items}
          payment={payment}
          currentStep={currentStep}
        />
      </div>
    </main>
  );
}

// ============================================================
// ORDER CONTENT
// ============================================================

function OrderContent({
  order,
  items,
  payment,
  currentStep,
}: {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    subtotal: string;
    shippingFee: string;
    discount: string;
    total: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  };

  items: {
    id: string;
    productId: string | null;
    variantId: string | null;
    productName: string;
    productSku: string;
    variantSku: string | null;
    colorName: string | null;
    productImageUrl: string | null;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    createdAt: string;
  }[];

  payment: {
    id: string;
    provider: string;
    reference: string;
    amount: string;
    currency: string;
    status: string;
    paidAt: string | null;
    createdAt: string;
    updatedAt?: string;
  } | null;

  currentStep: number;
}) {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* ==================================================== */}
      {/* LEFT */}
      {/* ==================================================== */}

      <div className="space-y-6">
        {/* ================================================== */}
        {/* ORDER STATUS */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9b8d81]">
                Order status
              </p>

              <h2 className="mt-2 text-xl font-semibold capitalize text-[#211b17]">
                {getStatusLabel(order.status)}
              </h2>
            </div>

            <div className="rounded-full bg-[#eee6da] px-4 py-2 text-xs font-semibold capitalize text-[#211b17]">
              {order.status}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-2">
            {[
              {
                label: "Placed",
                icon: Package,
              },
              {
                label: "Processing",
                icon: Clock3,
              },
              {
                label: "Shipped",
                icon: Truck,
              },
              {
                label: "Delivered",
                icon: Check,
              },
            ].map((step, index) => {
              const stepNumber = index + 1;

              const Icon = step.icon;

              const active =
                stepNumber <= currentStep;

              return (
                <div
                  key={step.label}
                  className="text-center"
                >
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                      active
                        ? "bg-[#e85d22] text-white"
                        : "bg-[#eee6da] text-[#9b8d81]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <p
                    className={`mt-2 text-[11px] font-medium ${
                      active
                        ? "text-[#211b17]"
                        : "text-[#9b8d81]"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================== */}
        {/* ITEMS */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9b8d81]">
                Your items
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#211b17]">
                Order Items
              </h2>
            </div>

            <span className="text-sm text-[#6f6258]">
              {items.length}{" "}
              {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="mt-6 divide-y divide-[#e6ddd1]">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-5 first:pt-0 last:pb-0"
              >
                {/* IMAGE */}

                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eee6da]">
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-6 w-6 text-[#9b8d81]" />
                    </div>
                  )}
                </div>

                {/* INFO */}

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-[#211b17]">
                    {item.productName}
                  </h3>

                  <p className="mt-1 text-xs text-[#9b8d81]">
                    SKU: {item.productSku}
                  </p>

                  {item.colorName && (
                    <p className="mt-1 text-sm text-[#6f6258]">
                      Color: {item.colorName}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-[#6f6258]">
                      Qty: {item.quantity}
                    </span>

                    <span className="font-medium text-[#211b17]">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                </div>

                {/* TOTAL */}

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-[#211b17]">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* PAYMENT */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee6da]">
              <CreditCard className="h-5 w-5 text-[#e85d22]" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9b8d81]">
                Payment
              </p>

              <h2 className="mt-1 text-lg font-semibold capitalize text-[#211b17]">
                {order.paymentMethod.replace("_", " ")}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[#9b8d81]">
                Payment status
              </p>

              <p className="mt-1 text-sm font-semibold capitalize text-[#211b17]">
                {order.paymentStatus.replace("_", " ")}
              </p>
            </div>

            {payment && (
              <div>
                <p className="text-xs text-[#9b8d81]">
                  Payment reference
                </p>

                <p className="mt-1 break-all text-sm font-medium text-[#211b17]">
                  {payment.reference}
                </p>
              </div>
            )}

            {payment?.paidAt && (
              <div>
                <p className="text-xs text-[#9b8d81]">
                  Paid on
                </p>

                <p className="mt-1 text-sm font-medium text-[#211b17]">
                  {formatDate(payment.paidAt)}
                </p>
              </div>
            )}

            {payment && (
              <div>
                <p className="text-xs text-[#9b8d81]">
                  Amount paid
                </p>

                <p className="mt-1 text-sm font-semibold text-[#211b17]">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ==================================================== */}
      {/* RIGHT */}
      {/* ==================================================== */}

      <aside>
        <div className="sticky top-6 rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9b8d81]">
            Order summary
          </p>

          <h2 className="mt-2 text-xl font-semibold text-[#211b17]">
            Payment Summary
          </h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#6f6258]">
                Subtotal
              </span>

              <span className="font-medium text-[#211b17]">
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-[#6f6258]">
                Shipping
              </span>

              <span className="font-medium text-[#211b17]">
                {formatCurrency(order.shippingFee)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-[#6f6258]">
                Discount
              </span>

              <span className="font-medium text-[#211b17]">
                -{formatCurrency(order.discount)}
              </span>
            </div>
          </div>

          <div className="my-6 border-t border-[#e6ddd1]" />

          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-[#211b17]">
              Total
            </span>

            <span className="text-xl font-semibold text-[#e85d22]">
              {formatCurrency(order.total)}
            </span>
          </div>

          {order.notes && (
            <>
              <div className="my-6 border-t border-[#e6ddd1]" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b8d81]">
                  Order note
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6f6258]">
                  {order.notes}
                </p>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
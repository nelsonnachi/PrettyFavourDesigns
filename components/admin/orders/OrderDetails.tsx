"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  Package,
  Phone,
  User,
} from "lucide-react";

import { useAdminOrder } from "@/lib/query/orders/order-queries";
import { useUpdateAdminOrderStatus } from "@/lib/query/orders/order-mutations";

import type {
  OrderStatus,
} from "@/lib/query/orders/order-types";

import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderDetailsProps {
  orderId: string;
}

function formatCurrency(value: string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return `₦${value}`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
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

function getCustomerName(
  firstName: string | null,
  lastName: string | null,
) {
  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();

  return name || "Guest customer";
}

function getPaymentStatusClasses(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "pending":
      return "bg-amber-100 text-amber-700";

    case "failed":
      return "bg-red-100 text-red-700";

    case "refunded":
    case "partially_refunded":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatPaymentStatus(status: string) {
  switch (status) {
    case "partially_refunded":
      return "Partially refunded";

    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function formatPaymentMethod(method: string) {
  switch (method) {
    case "paystack":
      return "Paystack";

    case "cash_on_delivery":
      return "Cash on delivery";

    default:
      return method;
  }
}

export function OrderDetails({
  orderId,
}: OrderDetailsProps) {
  const orderQuery = useAdminOrder(orderId);

  const updateStatus = useUpdateAdminOrderStatus();

  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus | "">("");

  if (orderQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (orderQuery.error) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to orders
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
          Unable to load this order.
        </div>
      </div>
    );
  }

  const data = orderQuery.data?.data;

  if (!data) {
    return null;
  }

  const {
    order,
    customer,
    items,
    payment,
  } = data;

  const customerName = getCustomerName(
    customer.firstName,
    customer.lastName,
  );

  const statusValue =
    selectedStatus || order.status;

  async function handleStatusUpdate() {
    if (!selectedStatus || selectedStatus === order.status) {
      return;
    }

    await updateStatus.mutateAsync({
      orderId: order.id,
      status: selectedStatus,
    });

    setSelectedStatus("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to orders
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
              #{order.orderNumber}
            </h1>

            <OrderStatusBadge status={order.status} />
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Status control */}
        <div className="flex flex-col gap-2 sm:min-w-[220px]">
          <label
            htmlFor="order-status"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Update status
          </label>

          <div className="flex gap-2">
            <select
              id="order-status"
              value={statusValue}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value as OrderStatus,
                )
              }
              className="h-10 min-w-0 flex-1 rounded-xl border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
            >
              <option value="pending">Pending</option>
              <option value="processing">
                Processing
              </option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={
                !selectedStatus ||
                selectedStatus === order.status ||
                updateStatus.isPending
              }
              className="h-10 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {updateStatus.isPending
                ? "Saving..."
                : "Save"}
            </button>
          </div>

          {updateStatus.isError && (
            <p className="text-xs text-red-600">
              {updateStatus.error instanceof Error
                ? updateStatus.error.message
                : "Unable to update order status."}
            </p>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left */}
        <div className="space-y-6">
          {/* Items */}
          <section className="overflow-hidden rounded-2xl border bg-card">
            <div className="border-b px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <Package className="size-5 text-muted-foreground" />

                <div>
                  <h2 className="font-semibold">
                    Order items
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {items.length}{" "}
                    {items.length === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-5 sm:p-6"
                >
                  {/* Image */}
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl border bg-muted sm:size-24">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Package className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">
                          {item.productName}
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          SKU: {item.productSku}
                        </p>

                        {item.variantSku && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Variant: {item.variantSku}
                          </p>
                        )}

                        {item.colorName && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Color: {item.colorName}
                          </p>
                        )}
                      </div>

                      <p className="text-sm font-semibold">
                        {formatCurrency(
                          item.totalPrice,
                        )}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Qty: {item.quantity}
                      </span>

                      <span>
                        Unit price:{" "}
                        {formatCurrency(
                          item.unitPrice,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          {order.notes && (
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <h2 className="font-semibold">
                Order notes
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {order.notes}
              </p>
            </section>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <User className="size-5 text-muted-foreground" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Customer
                </h2>

                <p className="text-xs text-muted-foreground">
                  Customer information
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium">
                  {customerName}
                </p>
              </div>

              {customer.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm">
                      {customer.email}
                    </p>
                  </div>
                </div>
              )}

              {customer.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 text-muted-foreground" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Phone
                    </p>

                    <p className="mt-1 text-sm">
                      {customer.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <CreditCard className="size-5 text-muted-foreground" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Payment
                </h2>

                <p className="text-xs text-muted-foreground">
                  Payment information
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClasses(
                    order.paymentStatus,
                  )}`}
                >
                  {formatPaymentStatus(
                    order.paymentStatus,
                  )}
                </span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Method
                </p>

                <p className="mt-1 text-sm font-medium">
                  {formatPaymentMethod(
                    order.paymentMethod,
                  )}
                </p>
              </div>

              {payment?.reference && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Reference
                  </p>

                  <p className="mt-1 break-all font-mono text-xs">
                    {payment.reference}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Summary */}
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h2 className="font-semibold">
              Order summary
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span>
                  {formatCurrency(order.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Shipping
                </span>

                <span>
                  {formatCurrency(
                    order.shippingFee,
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Discount
                </span>

                <span>
                  -{formatCurrency(order.discount)}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-lg font-semibold">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
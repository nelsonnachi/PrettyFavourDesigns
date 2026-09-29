"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import type { AdminOrder } from "@/lib/query/orders/order-types";

import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrdersTableProps {
  orders: AdminOrder[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
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
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getCustomerName(order: AdminOrder) {
  const firstName = order.user.firstName ?? "";
  const lastName = order.user.lastName ?? "";

  const name = `${firstName} ${lastName}`.trim();

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
      return "bg-purple-100 text-purple-700";

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

export function OrdersTable({
  orders,
  isLoading,
  isFetching,
  error,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="divide-y">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-5 sm:px-6"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />

              <div className="h-4 w-20 animate-pulse rounded bg-muted" />

              <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
        Unable to load orders. Please try again.
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border bg-card px-6 py-16 text-center">
        <h3 className="text-base font-semibold">
          No orders found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          There are no orders matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b bg-muted/30 text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-6">
                Order
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Customer
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Payment
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Date
              </th>

              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`transition hover:bg-muted/20 ${
                  isFetching ? "opacity-70" : ""
                }`}
              >
                {/* Order */}
                <td className="px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-sm font-semibold">
                      #{order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.id.slice(0, 8)}...
                    </p>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium">
                      {getCustomerName(order)}
                    </p>

                    <p className="mt-1 max-w-[220px] truncate text-xs text-muted-foreground">
                      {order.user.email ?? "No email"}
                    </p>
                  </div>
                </td>

                {/* Payment */}
                <td className="px-5 py-4">
                  <div className="space-y-1.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClasses(
                        order.paymentStatus,
                      )}`}
                    >
                      {formatPaymentStatus(
                        order.paymentStatus,
                      )}
                    </span>

                    <p className="text-xs text-muted-foreground">
                      {formatPaymentMethod(
                        order.paymentMethod,
                      )}
                    </p>
                  </div>
                </td>

                {/* Total */}
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold">
                    {formatCurrency(order.total)}
                  </p>
                </td>

                {/* Order status */}
                <td className="px-5 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <div className="flex justify-end">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      aria-label={`View order ${order.orderNumber}`}
                    >
                      <Eye className="size-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
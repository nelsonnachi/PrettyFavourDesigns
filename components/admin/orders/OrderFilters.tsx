"use client";

import { Search, X } from "lucide-react";

import type {
  AdminOrderQueryParams,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/query/orders/order-types";

interface OrderFiltersProps {
  filters: AdminOrderQueryParams;
  onChange: (
    updates: Partial<AdminOrderQueryParams>,
  ) => void;
  onClear: () => void;
}

export function OrderFilters({
  filters,
  onChange,
  onClear,
}: OrderFiltersProps) {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    Boolean(filters.paymentStatus) ||
    Boolean(filters.paymentMethod);

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex flex-col gap-3 xl:flex-row">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="search"
            value={filters.search ?? ""}
            onChange={(event) =>
              onChange({
                search: event.target.value,
                page: 1,
              })
            }
            placeholder="Search order number or customer..."
            className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
          />
        </div>

        {/* Order status */}
        <select
          value={filters.status ?? ""}
          onChange={(event) =>
            onChange({
              status: event.target.value as
                | OrderStatus
                | "",
              page: 1,
            })
          }
          className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment status */}
        <select
          value={filters.paymentStatus ?? ""}
          onChange={(event) =>
            onChange({
              paymentStatus: event.target.value as
                | PaymentStatus
                | "",
              page: 1,
            })
          }
          className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15"
        >
          <option value="">All payments</option>
          <option value="pending">Payment pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
          <option value="partially_refunded">
            Partially refunded
          </option>
        </select>

        {/* Payment method */}
        <select
          value={filters.paymentMethod ?? ""}
          onChange={(event) =>
            onChange({
              paymentMethod: event.target.value as
                | PaymentMethod
                | "",
              page: 1,
            })
          }
          className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15"
        >
          <option value="">All methods</option>
          <option value="paystack">Paystack</option>
          <option value="cash_on_delivery">
            Cash on delivery
          </option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border bg-card px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
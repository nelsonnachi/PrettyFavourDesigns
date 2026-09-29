"use client";

import { AdminPaymentMethod, AdminPaymentSort, AdminPaymentStatus } from "@/lib/query/payments/payment-types";
import {
  ArrowDownAZ,
  ArrowDownUp,
  CreditCard,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";



interface PaymentsFiltersProps {
  search: string;
  status: AdminPaymentStatus | "all";
  paymentMethod: AdminPaymentMethod | "all";
  sort: AdminPaymentSort;

  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: AdminPaymentStatus | "all",
  ) => void;
  onPaymentMethodChange: (
    value: AdminPaymentMethod | "all",
  ) => void;
  onSortChange: (
    value: AdminPaymentSort,
  ) => void;
}

export function PaymentsFilters({
  search,
  status,
  paymentMethod,
  sort,
  onSearchChange,
  onStatusChange,
  onPaymentMethodChange,
  onSortChange,
}: PaymentsFiltersProps) {
  const hasFilters =
    search.trim().length > 0 ||
    status !== "all" ||
    paymentMethod !== "all" ||
    sort !== "newest";

  function clearFilters() {
    onSearchChange("");
    onStatusChange("all");
    onPaymentMethodChange("all");
    onSortChange("newest");
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />

          <h2 className="text-sm font-medium">
            Filters
          </h2>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search reference or order..."
            className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as
                | AdminPaymentStatus
                | "all",
            )
          }
          className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="all">
            All statuses
          </option>
          <option value="pending">
            Pending
          </option>
          <option value="paid">
            Paid
          </option>
          <option value="failed">
            Failed
          </option>
          <option value="refunded">
            Refunded
          </option>
          <option value="partially_refunded">
            Partially refunded
          </option>
        </select>

        {/* Payment method */}
        <div className="relative">
          <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <select
            value={paymentMethod}
            onChange={(event) =>
              onPaymentMethodChange(
                event.target.value as
                  | AdminPaymentMethod
                  | "all",
              )
            }
            className="h-10 w-full appearance-none rounded-lg border bg-background pl-9 pr-8 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">
              All payment methods
            </option>
            <option value="paystack">
              Paystack
            </option>
            <option value="cash_on_delivery">
              Cash on delivery
            </option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          {sort === "newest" ||
          sort === "oldest" ? (
            <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          ) : (
            <ArrowDownAZ className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          )}

          <select
            value={sort}
            onChange={(event) =>
              onSortChange(
                event.target.value as AdminPaymentSort,
              )
            }
            className="h-10 w-full appearance-none rounded-lg border bg-background pl-9 pr-8 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="newest">
              Newest first
            </option>
            <option value="oldest">
              Oldest first
            </option>
            <option value="amount_desc">
              Highest amount
            </option>
            <option value="amount_asc">
              Lowest amount
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
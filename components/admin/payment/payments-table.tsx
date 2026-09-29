"use client";

import {
  CreditCard,
  Inbox,
  Loader2,
} from "lucide-react";


import { PaymentsTableRow } from "./payments-table-row";
import { AdminPayment } from "@/lib/query/payments/payment-types";

interface PaymentsTableProps {
  payments: AdminPayment[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function PaymentsTable({
  payments,
  isLoading,
  isFetching,
  isError,
}: PaymentsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card">
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />

            <p className="text-sm">
              Loading payments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card">
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <CreditCard className="h-5 w-5 text-destructive" />
          </div>

          <h3 className="mt-4 font-medium">
            Failed to load payments
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Something went wrong while loading
            the payment records. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border bg-card">
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 font-medium">
            No payments found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            There are no payments matching your
            current filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card">
      {isFetching && !isLoading && (
        <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-muted">
          <div className="h-full w-1/3 animate-[pulse_1s_ease-in-out_infinite] bg-primary" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Payment
              </th>

              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Customer
              </th>

              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Order
              </th>

              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Method
              </th>

              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Amount
              </th>

              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </th>

              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Date
              </th>

              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <PaymentsTableRow
                key={payment.id}
                payment={payment}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
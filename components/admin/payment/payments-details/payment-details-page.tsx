"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useAdminPayment } from "@/lib/query/payments/payment-queries";
import { PaymentSummary } from "./payment-summary";
import { PaymentCustomer } from "./payment-customer";
import { PaymentOrderItems } from "./payment-order-items";
import { PaymentOrderSummary } from "./payment-order-summary";
import { PaymentRefunds } from "./payment-refunds";



interface PaymentDetailsPageProps {
  id: string;
}

export function PaymentDetailsPage({
  id,
}: PaymentDetailsPageProps) {
  const paymentQuery = useAdminPayment(id);

  if (paymentQuery.isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />

          <p className="text-sm">
            Loading payment...
          </p>
        </div>
      </div>
    );
  }

  if (
    paymentQuery.isError ||
    !paymentQuery.data?.data
  ) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <CreditCard className="h-5 w-5 text-destructive" />
        </div>

        <h1 className="mt-4 text-lg font-semibold">
          Payment not found
        </h1>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          We couldn't load this payment. It may
          have been removed or you may not have
          permission to view it.
        </p>

        <Link
          href="/admin/payments"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>
      </div>
    );
  }

  const payment = paymentQuery.data.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/payments"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Payment details
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {payment.reference}
            </p>
          </div>

          {paymentQuery.isFetching && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating...
            </div>
          )}
        </div>
      </div>

      {/* Payment summary */}
      <PaymentSummary payment={payment} />

      {/* Customer */}
      <PaymentCustomer
        customer={payment.order?.user ?? null}
      />

      {/* Order */}
      {payment.order && (
        <>
          <PaymentOrderItems
            items={payment.order.items}
          />

          <PaymentOrderSummary
            order={payment.order}
          />
        </>
      )}

      {/* Refunds */}
      <PaymentRefunds
        refunds={payment.refunds}
      />
    </div>
  );
}
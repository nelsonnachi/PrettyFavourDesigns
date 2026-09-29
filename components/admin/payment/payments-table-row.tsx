"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";


import { PaymentMethodBadge } from "./payment-method-badge";
import { PaymentStatusBadge } from "./payment-status-badge";
import { AdminPayment } from "@/lib/query/payments/payment-types";

interface PaymentsTableRowProps {
  payment: AdminPayment;
}

function formatCurrency(
  amount: string,
  currency: string,
) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${currency} ${amount}`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getCustomerName(
  payment: AdminPayment,
) {
  const user = payment.order?.user;

  if (!user) {
    return "Guest customer";
  }

  const name = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return name || user.email;
}

export function PaymentsTableRow({
  payment,
}: PaymentsTableRowProps) {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/30">
      {/* Payment */}
      <td className="px-4 py-4">
        <div className="min-w-[180px]">
          <Link
            href={`/admin/payments/${payment.id}`}
            className="group inline-flex items-center gap-1 font-medium hover:underline"
          >
            {payment.reference}

            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          <p className="mt-1 text-xs text-muted-foreground">
            {payment.provider}
          </p>
        </div>
      </td>

      {/* Customer */}
      <td className="px-4 py-4">
        <div className="min-w-[180px]">
          <p className="font-medium">
            {getCustomerName(payment)}
          </p>

          {payment.order?.user?.email && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {payment.order.user.email}
            </p>
          )}
        </div>
      </td>

      {/* Order */}
      <td className="px-4 py-4">
        {payment.order ? (
          <Link
            href={`/admin/orders/${payment.order.id}`}
            className="font-medium hover:underline"
          >
            #{payment.order.orderNumber}
          </Link>
        ) : (
          <span className="text-muted-foreground">
            —
          </span>
        )}
      </td>

      {/* Method */}
      <td className="px-4 py-4">
        {payment.order?.paymentMethod ? (
          <PaymentMethodBadge
            method={
              payment.order.paymentMethod
            }
          />
        ) : (
          <span className="text-muted-foreground">
            —
          </span>
        )}
      </td>

      {/* Amount */}
      <td className="px-4 py-4">
        <span className="font-medium whitespace-nowrap">
          {formatCurrency(
            payment.amount,
            payment.currency,
          )}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <PaymentStatusBadge
          status={payment.status}
        />
      </td>

      {/* Date */}
      <td className="px-4 py-4">
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(payment.createdAt)}
        </span>
      </td>

      {/* Action */}
      <td className="px-4 py-4 text-right">
        <Link
          href={`/admin/payments/${payment.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          aria-label={`View payment ${payment.reference}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}
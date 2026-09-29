"use client";

import { AdminPayment } from "@/lib/query/payments/payment-types";
import {
  CircleDollarSign,
  Clock3,
  CreditCard,
  RotateCcw,
  XCircle,
} from "lucide-react";


interface PaymentsStatsProps {
  payments: AdminPayment[];
}

export function PaymentsStats({
  payments,
}: PaymentsStatsProps) {
  const total = payments.length;

  const paid = payments.filter(
    (payment) => payment.status === "paid",
  ).length;

  const pending = payments.filter(
    (payment) => payment.status === "pending",
  ).length;

  const failed = payments.filter(
    (payment) => payment.status === "failed",
  ).length;

  const refunded = payments.filter(
    (payment) =>
      payment.status === "refunded" ||
      payment.status === "partially_refunded",
  ).length;

  const stats = [
    {
      label: "Total payments",
      value: total,
      icon: CreditCard,
    },
    {
      label: "Paid",
      value: paid,
      icon: CircleDollarSign,
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
    },
    {
      label: "Failed",
      value: failed,
      icon: XCircle,
    },
    {
      label: "Refunded",
      value: refunded,
      icon: RotateCcw,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {stat.value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
"use client";

import type { OrderStatus } from "@/lib/query/orders/order-types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
  },

  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700",
  },

  shipped: {
    label: "Shipped",
    className: "bg-purple-100 text-purple-700",
  },

  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-700",
  },

  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
  },
};

export function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
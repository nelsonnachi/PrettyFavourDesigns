import { AdminPaymentStatus } from "@/lib/query/payments/payment-types";
import {
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";


interface PaymentStatusBadgeProps {
  status: AdminPaymentStatus;
}

const statusConfig: Record<
  AdminPaymentStatus,
  {
    label: string;
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: Clock3,
  },

  paid: {
    label: "Paid",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2,
  },

  failed: {
    label: "Failed",
    className:
      "bg-red-500/10 text-red-700 dark:text-red-400",
    icon: XCircle,
  },

  refunded: {
    label: "Refunded",
    className:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    icon: RotateCcw,
  },

  partially_refunded: {
    label: "Partially refunded",
    className:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    icon: RotateCcw,
  },
};

export function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
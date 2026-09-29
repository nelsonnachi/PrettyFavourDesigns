import { AdminPaymentMethod } from "@/lib/query/payments/payment-types";
import {
  Banknote,
  CreditCard,
} from "lucide-react";


interface PaymentMethodBadgeProps {
  method: AdminPaymentMethod;
}

export function PaymentMethodBadge({
  method,
}: PaymentMethodBadgeProps) {
  const isPaystack = method === "paystack";

  const Icon = isPaystack
    ? CreditCard
    : Banknote;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />

      <span>
        {isPaystack
          ? "Paystack"
          : "Cash on delivery"}
      </span>
    </span>
  );
}
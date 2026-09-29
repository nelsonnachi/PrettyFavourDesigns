import { AdminPaymentDetail } from "@/lib/query/payments/payment-types";
import {
  Calculator,
  CircleDollarSign,
  Package,
  Truck,
} from "lucide-react";


interface PaymentOrderSummaryProps {
  order: NonNullable<
    AdminPaymentDetail["order"]
  >;
}

function formatCurrency(
  amount: string,
) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `₦${amount}`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function PaymentOrderSummary({
  order,
}: PaymentOrderSummaryProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-muted-foreground" />

          <h2 className="font-semibold">
            Order summary
          </h2>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-4">
          <SummaryRow
            icon={Package}
            label="Subtotal"
            value={formatCurrency(
              order.subtotal,
            )}
          />

          <SummaryRow
            icon={Truck}
            label="Shipping"
            value={formatCurrency(
              order.shippingFee,
            )}
          />

          <SummaryRow
            icon={CircleDollarSign}
            label="Discount"
            value={`-${formatCurrency(
              order.discount,
            )}`}
          />

          <div className="border-t pt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-lg font-bold">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SummaryRowProps {
  icon: typeof Package;
  label: string;
  value: string;
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <span className="text-sm font-medium">
        {value}
      </span>
    </div>
  );
}
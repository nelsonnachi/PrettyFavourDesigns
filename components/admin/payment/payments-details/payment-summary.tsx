import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Hash,
  ReceiptText,
} from "lucide-react";


import { PaymentMethodBadge } from "../payment-method-badge";
import { PaymentStatusBadge } from "../payment-status-badge";
import { AdminPaymentDetail } from "@/lib/query/payments/payment-types";

interface PaymentSummaryProps {
  payment: AdminPaymentDetail;
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

function formatDate(
  date: string | null,
) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function PaymentSummary({
  payment,
}: PaymentSummaryProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Payment amount
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                {formatCurrency(
                  payment.amount,
                  payment.currency,
                )}
              </h2>

              <PaymentStatusBadge
                status={payment.status}
              />
            </div>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <CircleDollarSign className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem
          icon={Hash}
          label="Reference"
          value={payment.reference}
          copyable
        />

        <InfoItem
          icon={CreditCard}
          label="Provider"
          value={payment.provider}
        />

        <InfoItem
          icon={ReceiptText}
          label="Payment method"
          customValue={
            payment.order?.paymentMethod ? (
              <PaymentMethodBadge
                method={payment.order.paymentMethod}
              />
            ) : (
              "—"
            )
          }
        />

        <InfoItem
          icon={CalendarDays}
          label="Created"
          value={formatDate(payment.createdAt)}
        />

        <InfoItem
          icon={CheckCircle2}
          label="Paid at"
          value={formatDate(payment.paidAt)}
        />

        <InfoItem
          icon={Clock3}
          label="Last updated"
          value={formatDate(payment.updatedAt)}
        />

        <InfoItem
          icon={ReceiptText}
          label="Order"
          value={
            payment.order
              ? `#${payment.order.orderNumber}`
              : "—"
          }
        />

        <InfoItem
          icon={CircleDollarSign}
          label="Currency"
          value={payment.currency}
        />
      </div>

      {payment.gatewayResponse && (
        <div className="border-t p-6">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-muted-foreground" />

            <h3 className="text-sm font-medium">
              Gateway response
            </h3>
          </div>

          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
            {payment.gatewayResponse}
          </pre>
        </div>
      )}
    </div>
  );
}

interface InfoItemProps {
  icon: typeof Hash;
  label: string;
  value?: string;
  customValue?: React.ReactNode;
  copyable?: boolean;
}

function InfoItem({
  icon: Icon,
  label,
  value,
  customValue,
  copyable = false,
}: InfoItemProps) {
  return (
    <div className="bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-medium">
        {customValue ?? value ?? "—"}
      </div>

      {copyable && value && (
        <button
          type="button"
          onClick={() =>
            navigator.clipboard.writeText(value)
          }
          className="mt-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Copy reference
        </button>
      )}
    </div>
  );
}
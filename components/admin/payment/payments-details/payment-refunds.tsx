import { AdminPaymentRefund } from "@/lib/query/payments/payment-types";
import {
  CircleDollarSign,
  RotateCcw,
} from "lucide-react";


interface PaymentRefundsProps {
  refunds: AdminPaymentRefund[];
}

export function PaymentRefunds({
  refunds,
}: PaymentRefundsProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />

          <h2 className="font-semibold">
            Refunds
          </h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Refund activity associated with this
          payment.
        </p>
      </div>

      {refunds.length === 0 ? (
        <div className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
          <CircleDollarSign className="h-4 w-4" />
          No refunds have been recorded.
        </div>
      ) : (
        <div className="divide-y">
          {refunds.map((refund) => (
            <div
              key={refund.id}
              className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  Refund
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  ID: {refund.id}
                </p>
              </div>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                Recorded
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
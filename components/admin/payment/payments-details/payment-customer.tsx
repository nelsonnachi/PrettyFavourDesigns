import { AdminPaymentCustomer } from "@/lib/query/payments/payment-types";
import {
  Mail,
  Phone,
  UserRound,
} from "lucide-react";


interface PaymentCustomerProps {
  customer: AdminPaymentCustomer | null;
}

export function PaymentCustomer({
  customer,
}: PaymentCustomerProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <h2 className="font-semibold">
          Customer
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Customer associated with this payment.
        </p>
      </div>

      <div className="p-5">
        {!customer ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <UserRound className="h-5 w-5" />
            Guest customer
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
              <UserRound className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-medium">
                {[
                  customer.firstName,
                  customer.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                  customer.email}
              </h3>

              <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-5">
                <span className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  {customer.email}
                </span>

                {customer.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
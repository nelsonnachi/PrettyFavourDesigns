import { CreditCard } from "lucide-react";

export function PaymentsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Payments
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage customer payment
          transactions.
        </p>
      </div>
    </div>
  );
}
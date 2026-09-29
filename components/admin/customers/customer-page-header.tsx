import Link from "next/link";
import { UserPlus, Users } from "lucide-react";

export function CustomerPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Customers
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage and view your store customers.
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/admin/customers/new"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        <UserPlus className="h-4 w-4" />
        Add customer
      </Link>
    </div>
  );
}
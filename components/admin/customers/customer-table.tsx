import { Users } from "lucide-react";
import { CustomerTableRow } from "./customer-table-row";
import { AdminUser } from "@/lib/query/customer/admin-user-types";

type CustomerTableProps = {
  customers: AdminUser[];
};

export function CustomerTable({
  customers,
}: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Users className="h-7 w-7 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-base font-semibold">
          No customers found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Joined
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <CustomerTableRow
                key={customer.id}
                customer={customer}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
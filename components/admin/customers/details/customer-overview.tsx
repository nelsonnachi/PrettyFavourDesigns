import { AdminUser } from "@/lib/query/customer/admin-user-types";
import {
  Ban,
  CheckCircle2,
  Mail,
  Shield,
} from "lucide-react";


type CustomerOverviewProps = {
  customer: AdminUser;
};

export function CustomerOverview({
  customer,
}: CustomerOverviewProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-5">
        <h2 className="font-semibold">
          Account overview
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Current account state and access information.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <OverviewItem
          icon={
            customer.isBanned
              ? Ban
              : CheckCircle2
          }
          label="Account status"
          value={
            customer.isBanned
              ? "Banned"
              : "Active"
          }
        />

        <OverviewItem
          icon={Shield}
          label="Account role"
          value={customer.role}
        />

        <OverviewItem
          icon={Mail}
          label="Email"
          value={customer.email}
        />

        <OverviewItem
          icon={Shield}
          label="Clerk account"
          value="Connected"
        />
      </div>
    </section>
  );
}

function OverviewItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Shield;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold capitalize">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
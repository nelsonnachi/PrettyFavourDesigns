import { AdminUser } from "@/lib/query/customer/admin-user-types";
import {
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";


type CustomerProfileProps = {
  customer: AdminUser;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

export function CustomerProfile({
  customer,
}: CustomerProfileProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="font-semibold">
          Customer profile
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Account information
        </p>
      </div>

      <div className="divide-y divide-border">
        <ProfileRow
          icon={User}
          label="Customer ID"
          value={customer.id}
        />

        <ProfileRow
          icon={Mail}
          label="Email"
          value={customer.email}
        />

        <ProfileRow
          icon={Phone}
          label="Phone"
          value={
            customer.phone || "Not provided"
          }
        />

        <ProfileRow
          icon={ShieldCheck}
          label="Role"
          value={customer.role}
        />

        <ProfileRow
          icon={CalendarDays}
          label="Joined"
          value={formatDate(
            customer.createdAt,
          )}
        />

        <ProfileRow
          icon={CalendarDays}
          label="Last updated"
          value={formatDate(
            customer.updatedAt,
          )}
        />
      </div>
    </section>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-all text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}
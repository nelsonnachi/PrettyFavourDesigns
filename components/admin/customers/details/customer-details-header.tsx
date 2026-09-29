import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
} from "lucide-react";


import { CustomerRoleBadge } from "../customer-role-badge";
import { CustomerStatusBadge } from "../customer-status-badge";
import { AdminUser } from "@/lib/query/customer/admin-user-types";

type CustomerDetailsHeaderProps = {
  customer: AdminUser;
};

function getName(customer: AdminUser) {
  return [
    customer.firstName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ") || "Unnamed customer";
}

function getInitials(customer: AdminUser) {
  const name = getName(customer);

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CustomerDetailsHeader({
  customer,
}: CustomerDetailsHeaderProps) {
  const name = getName(customer);
  const initials = getInitials(customer);

  return (
    <div className="space-y-5">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to customers
      </Link>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {customer.imageUrl ? (
              <img
                src={customer.imageUrl}
                alt={name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                {initials}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {name}
                </h1>

                <CustomerStatusBadge
                  isBanned={
                    customer.isBanned
                  }
                />

                <CustomerRoleBadge
                  role={customer.role}
                />
              </div>

              <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </span>

                {customer.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
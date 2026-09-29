import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Phone,
} from "lucide-react";
import { CustomerStatusBadge } from "./customer-status-badge";
import { CustomerRoleBadge } from "./customer-role-badge";
import { AdminUser } from "@/lib/query/customer/admin-user-types";

type CustomerTableRowProps = {
  customer: AdminUser;
};

function getCustomerName(
  customer: AdminUser,
) {
  const name = [
    customer.firstName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return name || "Unnamed customer";
}

function getInitials(
  customer: AdminUser,
) {
  const name = getCustomerName(customer);

  if (name === "Unnamed customer") {
    return "?";
  }

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CustomerTableRow({
  customer,
}: CustomerTableRowProps) {
  const name = getCustomerName(customer);
  const initials = getInitials(customer);

  return (
    <tr className="group transition hover:bg-muted/30">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {customer.imageUrl ? (
            <img
              src={customer.imageUrl}
              alt={name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <Link
              href={`/admin/customers/${customer.id}`}
              className="block truncate text-sm font-semibold hover:text-primary"
            >
              {name}
            </Link>

            <p className="truncate text-xs text-muted-foreground">
              {customer.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <span>{customer.email}</span>
          </div>

          {customer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>
      </td>

      <td className="px-5 py-4">
        <CustomerRoleBadge role={customer.role} />
      </td>

      <td className="px-5 py-4">
        <CustomerStatusBadge
          isBanned={customer.isBanned}
        />
      </td>

      <td className="px-5 py-4 text-sm text-muted-foreground">
        {new Date(
          customer.createdAt,
        ).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>

      <td className="px-5 py-4 text-right">
        <Link
          href={`/admin/customers/${customer.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
        >
          View
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </td>
    </tr>
  );
}
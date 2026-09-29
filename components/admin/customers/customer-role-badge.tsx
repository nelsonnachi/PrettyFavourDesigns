import { AdminUserRole } from "@/lib/query/customer/admin-user-types";


type CustomerRoleBadgeProps = {
  role: AdminUserRole;
};

const roleLabels: Record<
  AdminUserRole,
  string
> = {
  customer: "Customer",
  admin: "Admin",
  super_admin: "Super Admin",
};

export function CustomerRoleBadge({
  role,
}: CustomerRoleBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
      {roleLabels[role]}
    </span>
  );
}
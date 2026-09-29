import { AdminLayoutClient } from "@/components/admin/layout/AdminLayoutClient";
import { requireAdmin } from "@/lib/APIs/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  await requireAdmin();

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
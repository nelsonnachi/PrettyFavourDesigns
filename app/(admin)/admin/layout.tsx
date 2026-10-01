import { redirect } from "next/navigation";

import { AdminLayoutClient } from "@/components/admin/layout/AdminLayoutClient";
import { requireAdmin } from "@/lib/APIs/auth";
import { ApiError } from "@/lib/APIs/api-errors";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 401) redirect("/sign-in?redirect_url=/admin");
      if (error.statusCode === 403) redirect("/");
    }

    throw error;
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
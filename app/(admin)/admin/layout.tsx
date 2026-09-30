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
    // ========================================================
    // NOT AUTHENTICATED
    // ========================================================

    if (error instanceof ApiError && error.statusCode === 401) {
      redirect("/sign-in?redirect_url=/admin");
    }

    // ========================================================
    // AUTHENTICATED BUT NOT ADMIN
    // ========================================================

    if (error instanceof ApiError && error.statusCode === 403) {
      redirect("/");
    }

    // ========================================================
    // UNEXPECTED ERROR
    // ========================================================

    throw error;
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

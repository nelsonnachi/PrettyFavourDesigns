"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api/client";

import {
  DiscountTable,
  type AdminDiscount,
} from "./discount-table";

import { DiscountStats } from "./discount-stats";
import { DiscountSkeleton } from "./discount-skeleton";
import { DiscountDeleteDialog } from "./discount-delete-dialog";

interface DiscountsResponse {
  success: boolean;
  data: AdminDiscount[];
}

interface DiscountMutationResponse {
  success: boolean;
  message: string;
  data?: AdminDiscount;
}

export function DiscountsPage() {
  const router = useRouter();

  const [discounts, setDiscounts] = useState<AdminDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [deleteDiscount, setDeleteDiscount] =
    useState<AdminDiscount | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  async function loadDiscounts() {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient<DiscountsResponse>(
        "/api/admin/discounts",
      );

      setDiscounts(response.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load discounts.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDiscounts();
  }, []);

  const filteredDiscounts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return discounts;

    return discounts.filter((discount) => {
      return (
        discount.name.toLowerCase().includes(value) ||
        discount.code.toLowerCase().includes(value) ||
        discount.description?.toLowerCase().includes(value)
      );
    });
  }, [discounts, search]);

  const stats = useMemo(() => {
    const now = new Date();

    const active = discounts.filter((discount) => {
      if (!discount.isActive) return false;

      const startsAt = new Date(discount.startsAt);
      const endsAt = discount.endsAt
        ? new Date(discount.endsAt)
        : null;

      return (
        startsAt <= now &&
        (!endsAt || endsAt >= now)
      );
    }).length;

    const scheduled = discounts.filter((discount) => {
      if (!discount.isActive) return false;

      return new Date(discount.startsAt) > now;
    }).length;

    const totalUsage = discounts.reduce(
      (total, discount) => total + discount.usageCount,
      0,
    );

    return {
      total: discounts.length,
      active,
      scheduled,
      totalUsage,
    };
  }, [discounts]);

  async function handleToggle(discount: AdminDiscount) {
    try {
      const response = await apiClient<DiscountMutationResponse>(
        `/api/admin/discounts/${discount.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: !discount.isActive,
          }),
        },
      );

      if (response.data) {
        setDiscounts((current) =>
          current.map((item) =>
            item.id === discount.id
              ? response.data!
              : item,
          ),
        );
      }
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to update discount.",
      );
    }
  }

  async function handleDelete() {
    if (!deleteDiscount) return;

    try {
      setDeleteLoading(true);

      await apiClient(
        `/api/admin/discounts/${deleteDiscount.id}`,
        {
          method: "DELETE",
        },
      );

      setDiscounts((current) =>
        current.filter(
          (item) => item.id !== deleteDiscount.id,
        ),
      );

      setDeleteDiscount(null);
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to delete discount.",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-[#f1ebe2]" />
          <div className="mt-2 h-5 w-80 animate-pulse rounded bg-[#f1ebe2]" />
        </div>

        <DiscountSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#211b17]">
              Discounts
            </h1>

            <p className="mt-1 text-sm text-[#6f665f]">
              Create and manage promotional discount codes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/discounts/new")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e85d22] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d94f17]"
          >
            <Plus className="h-4 w-4" />
            Create discount
          </button>
        </div>

        {/* STATS */}
        <DiscountStats {...stats} />

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SEARCH + REFRESH */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8078]" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search discounts..."
              className="h-10 w-full rounded-lg border border-[#e6ddd1] bg-[#fffdf9] pl-10 pr-4 text-sm text-[#211b17] outline-none transition placeholder:text-[#9b928a] focus:border-[#e85d22] focus:ring-2 focus:ring-[#e85d22]/10"
            />
          </div>

          <button
            type="button"
            onClick={loadDiscounts}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e6ddd1] bg-[#fffdf9] px-4 text-sm font-medium text-[#211b17] transition hover:bg-[#f1ebe2]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* TABLE */}
        <DiscountTable
          discounts={filteredDiscounts}
          onEdit={(discount) =>
            router.push(`/admin/discounts/${discount.id}`)
          }
          onToggle={handleToggle}
          onDelete={setDeleteDiscount}
        />
      </div>

      <DiscountDeleteDialog
        discount={deleteDiscount}
        open={Boolean(deleteDiscount)}
        loading={deleteLoading}
        onClose={() => setDeleteDiscount(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
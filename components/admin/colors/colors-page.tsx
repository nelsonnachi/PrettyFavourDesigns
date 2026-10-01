"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Palette,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useAdminColors } from "@/lib/query/colors/color-queries";
import { ColorSkeleton } from "./color-skeleton";
import { ColorsTable } from "./colors-table";
import { ColorDialog } from "./color-dialog";


export function ColorsPage() {
  const {
    data: colors = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminColors();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingColorId, setEditingColorId] = useState<string | null>(null);

  const filteredColors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return colors.filter((color) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        color.name.toLowerCase().includes(normalizedSearch) ||
        color.hexCode?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        status === "all" ||
        (status === "active" && color.isActive) ||
        (status === "inactive" && !color.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [colors, search, status]);

  const activeCount = colors.filter((color) => color.isActive).length;
  const inactiveCount = colors.filter((color) => !color.isActive).length;

  function handleCreate() {
    setEditingColorId(null);
    setDialogOpen(true);
  }

  function handleEdit(id: string) {
    setEditingColorId(id);
    setDialogOpen(true);
  }

  function handleDialogChange(open: boolean) {
    setDialogOpen(open);

    if (!open) {
      setEditingColorId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
              <Palette className="h-5 w-5 text-[#e85d22]" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#211b17]">
                Colors
              </h1>

              <p className="mt-1 text-sm text-[#211b17]/60">
                Manage product colors and their availability.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#211b17] px-4 text-sm font-medium text-white transition hover:bg-[#211b17]/90"
        >
          <Plus className="h-4 w-4" />
          Add Color
        </button>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Colors"
          value={colors.length}
        />

        <SummaryCard
          label="Active"
          value={activeCount}
        />

        <SummaryCard
          label="Inactive"
          value={inactiveCount}
        />
      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#211b17]/40" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search colors..."
              className="h-10 w-full rounded-lg border border-[#e6ddd1] bg-[#faf7f1] pl-10 pr-4 text-sm text-[#211b17] outline-none transition placeholder:text-[#211b17]/40 focus:border-[#e85d22] focus:ring-2 focus:ring-[#e85d22]/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusFilter
              active={status === "all"}
              onClick={() => setStatus("all")}
            >
              All
            </StatusFilter>

            <StatusFilter
              active={status === "active"}
              onClick={() => setStatus("active")}
            >
              Active
            </StatusFilter>

            <StatusFilter
              active={status === "inactive"}
              onClick={() => setStatus("inactive")}
            >
              Inactive
            </StatusFilter>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="ml-1 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#e6ddd1] bg-[#fffdf9] px-3 text-sm font-medium text-[#211b17] transition hover:bg-[#f1ebe2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />

              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {isLoading ? (
        <ColorSkeleton />
      ) : isError ? (
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to load colors."
          }
          onRetry={() => refetch()}
        />
      ) : (
        <ColorsTable
          colors={filteredColors}
          hasSearch={Boolean(search.trim()) || status !== "all"}
          onCreate={handleCreate}
          onEdit={handleEdit}
        />
      )}

      {/* =====================================================
          CREATE / EDIT DIALOG
      ===================================================== */}

      <ColorDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        colorId={editingColorId}
      />
    </div>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9] p-5">
      <p className="text-sm text-[#211b17]/60">{label}</p>

      <p className="mt-2 text-2xl font-semibold text-[#211b17]">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// STATUS FILTER
// ============================================================

function StatusFilter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-lg px-3 text-sm font-medium transition ${
        active
          ? "bg-[#211b17] text-white"
          : "border border-[#e6ddd1] bg-[#fffdf9] text-[#211b17] hover:bg-[#f1ebe2]"
      }`}
    >
      {children}
    </button>
  );
}

// ============================================================
// ERROR STATE
// ============================================================

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-5 w-5 text-red-600" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-red-900">
        Failed to load colors
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-red-700">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
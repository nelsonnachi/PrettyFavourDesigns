import { AdminUsersResponse } from "@/lib/query/customer/admin-user-types";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


type CustomerPaginationProps = {
  pagination: AdminUsersResponse["pagination"];
  onPageChange: (page: number) => void;
};

export function CustomerPagination({
  pagination,
  onPageChange,
}: CustomerPaginationProps) {
  const {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  if (total === 0) {
    return null;
  }

  const start =
    (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    total,
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-medium text-foreground">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {total}
        </span>{" "}
        customers
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium">
          {page} / {totalPages || 1}
        </div>

        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() =>
            onPageChange(page + 1)
          }
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
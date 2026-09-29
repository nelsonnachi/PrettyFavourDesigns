"use client";

import { AdminPaymentPagination } from "@/lib/query/payments/payment-types";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";


interface PaymentsPaginationProps {
  pagination: AdminPaymentPagination;
  onPageChange: (page: number) => void;
}

export function PaymentsPagination({
  pagination,
  onPageChange,
}: PaymentsPaginationProps) {
  const {
    page,
    total,
    totalPages,
    limit,
  } = pagination;

  if (total === 0 || totalPages <= 1) {
    return null;
  }

  const start =
    (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    total,
  );

  /*
   * Build a compact page list.
   *
   * Example:
   * 1 2 3 4 5 ... 20
   */
  function getPageNumbers() {
    const pages: (
      | number
      | "ellipsis-left"
      | "ellipsis-right"
    )[] = [];

    if (totalPages <= 7) {
      for (
        let index = 1;
        index <= totalPages;
        index++
      ) {
        pages.push(index);
      }

      return pages;
    }

    pages.push(1);

    if (page > 4) {
      pages.push("ellipsis-left");
    }

    const startPage = Math.max(
      2,
      page - 1,
    );

    const endPage = Math.min(
      totalPages - 1,
      page + 1,
    );

    for (
      let index = startPage;
      index <= endPage;
      index++
    ) {
      pages.push(index);
    }

    if (page < totalPages - 3) {
      pages.push("ellipsis-right");
    }

    pages.push(totalPages);

    return pages;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start.toLocaleString()}–
          {end.toLocaleString()}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {total.toLocaleString()}
        </span>{" "}
        payments
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <PaginationButton
          label="Go to first page"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </PaginationButton>

        {/* Previous */}
        <PaginationButton
          label="Go to previous page"
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationButton>

        {/* Page numbers */}
        <div className="hidden items-center gap-1 sm:flex">
          {pageNumbers.map(
            (pageNumber) => {
              if (
                pageNumber ===
                "ellipsis-left"
              ) {
                return (
                  <span
                    key="ellipsis-left"
                    className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                  >
                    …
                  </span>
                );
              }

              if (
                pageNumber ===
                "ellipsis-right"
              ) {
                return (
                  <span
                    key="ellipsis-right"
                    className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                  >
                    …
                  </span>
                );
              }

              const isActive =
                pageNumber === page;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() =>
                    onPageChange(
                      pageNumber,
                    )
                  }
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            },
          )}
        </div>

        {/* Mobile page indicator */}
        <span className="flex h-8 min-w-16 items-center justify-center px-2 text-sm text-muted-foreground sm:hidden">
          {page} / {totalPages}
        </span>

        {/* Next */}
        <PaginationButton
          label="Go to next page"
          disabled={page === totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationButton>

        {/* Last page */}
        <PaginationButton
          label="Go to last page"
          disabled={page === totalPages}
          onClick={() =>
            onPageChange(totalPages)
          }
        >
          <ChevronsRight className="h-4 w-4" />
        </PaginationButton>
      </div>
    </div>
  );
}

interface PaginationButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  label: string;
}

function PaginationButton({
  children,
  disabled = false,
  onClick,
  label,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
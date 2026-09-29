"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { NewsletterPagination as NewsletterPaginationType } from "@/lib/query/newsletter/newsletter-types";

interface NewsletterPaginationProps {
  pagination:
    | NewsletterPaginationType
    | undefined;

  page: number;
  isFetching: boolean;

  onPrevious: () => void;
  onNext: () => void;
}

export function NewsletterPagination({
  pagination,
  page,
  isFetching,
  onPrevious,
  onNext,
}: NewsletterPaginationProps) {
  const totalPages =
    pagination?.totalPages ?? 1;

  const canPrevious =
    page > 1;

  const canNext =
    page < totalPages;

  if (
    !pagination ||
    pagination.total === 0
  ) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Page{" "}
        <span className="font-medium text-gray-700">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-700">
          {totalPages}
        </span>{" "}
        ·{" "}
        {pagination.total.toLocaleString()}{" "}
        subscribers
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={
            !canPrevious ||
            isFetching
          }
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={
            !canNext ||
            isFetching
          }
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
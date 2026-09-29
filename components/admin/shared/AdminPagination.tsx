"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  page,
  totalPages,
  onPageChange,
}: AdminPaginationProps) {
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg
            border border-border
            bg-card
            text-muted-foreground
            transition-colors
            hover:bg-secondary
            hover:text-foreground
            disabled:pointer-events-none
            disabled:opacity-40
          "
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg
            border border-border
            bg-card
            text-muted-foreground
            transition-colors
            hover:bg-secondary
            hover:text-foreground
            disabled:pointer-events-none
            disabled:opacity-40
          "
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
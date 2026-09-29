"use client";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  AdminContactMessageParams,
} from "@/lib/query/contact-messages/contact-message-types";

interface MessageFiltersProps {
  filters: AdminContactMessageParams;

  onChange: (
    updates: Partial<AdminContactMessageParams>,
  ) => void;

  onClear: () => void;
}

export function MessageFilters({
  filters,
  onChange,
  onClear,
}: MessageFiltersProps) {
  const hasFilters =
    Boolean(filters.search?.trim()) ||
    filters.isRead !== undefined ||
    filters.sort === "oldest";

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontal className="size-4 text-muted-foreground" />

        <span>Filter messages</span>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={filters.search ?? ""}
            onChange={(event) =>
              onChange({
                search: event.target.value,
                page: 1,
              })
            }
            placeholder="Search by name, email, subject or message..."
            className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
          />
        </div>

        {/* Read status */}
        <select
          value={
            filters.isRead === undefined
              ? ""
              : filters.isRead
                ? "read"
                : "unread"
          }
          onChange={(event) => {
            const value = event.target.value;

            onChange({
              isRead:
                value === ""
                  ? undefined
                  : value === "read",
              page: 1,
            });
          }}
          className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15"
          aria-label="Filter by read status"
        >
          <option value="">All messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort ?? "newest"}
          onChange={(event) =>
            onChange({
              sort:
                event.target.value === "oldest"
                  ? "oldest"
                  : "newest",
              page: 1,
            })
          }
          className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15"
          aria-label="Sort messages"
        >
          <option value="newest">
            Newest first
          </option>

          <option value="oldest">
            Oldest first
          </option>
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border bg-card px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
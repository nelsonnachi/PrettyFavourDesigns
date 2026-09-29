"use client";

import { AdminUsersQuery } from "@/lib/query/customer/admin-user-types";
import {
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";


type CustomerFiltersProps = {
  query: AdminUsersQuery;
  onChange: (
    updates: Partial<AdminUsersQuery>,
  ) => void;
  onReset: () => void;
};

export function CustomerFilters({
  query,
  onChange,
  onReset,
}: CustomerFiltersProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

        <h2 className="text-sm font-semibold">
          Customer filters
        </h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={query.search}
            onChange={(event) =>
              onChange({
                search: event.target.value,
              })
            }
            placeholder="Search customers..."
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <select
          value={query.status}
          onChange={(event) =>
            onChange({
              status:
                event.target.value as AdminUsersQuery["status"],
            })
          }
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        >
          <option value="all">
            All status
          </option>

          <option value="active">
            Active
          </option>

          <option value="banned">
            Banned
          </option>
        </select>

        <select
          value={query.sort}
          onChange={(event) =>
            onChange({
              sort:
                event.target.value as AdminUsersQuery["sort"],
            })
          }
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        >
          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="name_asc">
            Name A–Z
          </option>

          <option value="name_desc">
            Name Z–A
          </option>
        </select>

        <select
          value={String(query.limit)}
          onChange={(event) =>
            onChange({
              limit: Number(event.target.value),
            })
          }
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
          <option value="100">100 / page</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
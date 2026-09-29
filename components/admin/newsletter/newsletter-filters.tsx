"use client";

import {
  ArrowDownUp,
  Search,
  X,
} from "lucide-react";

interface NewsletterFiltersProps {
  searchInput: string;
  status:
    | "all"
    | "subscribed"
    | "unsubscribed";
  sort: "newest" | "oldest";

  onSearchInputChange: (
    value: string,
  ) => void;

  onSearch: (
    event: React.FormEvent<HTMLFormElement>,
  ) => void;

  onStatusChange: (
    value:
      | "all"
      | "subscribed"
      | "unsubscribed",
  ) => void;

  onSort: () => void;
}

export function NewsletterFilters({
  searchInput,
  status,
  sort,
  onSearchInputChange,
  onSearch,
  onStatusChange,
  onSort,
}: NewsletterFiltersProps) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          onSubmit={onSearch}
          className="flex w-full gap-2 lg:max-w-md"
        >
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchInput}
              onChange={(event) =>
                onSearchInputChange(
                  event.target.value,
                )
              }
              placeholder="Search by email..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />

            {searchInput && (
              <button
                type="button"
                onClick={() =>
                  onSearchInputChange("")
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target.value as
                  | "all"
                  | "subscribed"
                  | "unsubscribed",
              )
            }
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-400"
          >
            <option value="all">
              All subscribers
            </option>

            <option value="subscribed">
              Subscribed
            </option>

            <option value="unsubscribed">
              Unsubscribed
            </option>
          </select>

          <button
            type="button"
            onClick={onSort}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowDownUp size={15} />

            {sort === "newest"
              ? "Newest"
              : "Oldest"}
          </button>
        </div>
      </div>
    </div>
  );
}
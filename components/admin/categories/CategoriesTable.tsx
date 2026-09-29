"use client";

import {
  Edit3,
  Trash2,
} from "lucide-react";

import type { Category } from "@/lib/query/categories/category-types";

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  isLoading,
  isFetching,
  error,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card">
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-5 sm:px-6"
            >
              <div className="h-4 w-8 animate-pulse rounded bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-56 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />

              <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
        Unable to load categories. Please try again.
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border bg-card px-6 py-16 text-center">
        <h3 className="text-base font-semibold">
          No categories found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Try changing your search or create a new category.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b bg-muted/30 text-left">
              <th className="w-20 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-6">
                Order
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Category
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Slug
              </th>

              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {categories.map((category) => (
              <tr
                key={category.id}
                className={`transition hover:bg-muted/20 ${
                  isFetching ? "opacity-70" : ""
                }`}
              >
                <td className="px-5 py-4 text-sm text-muted-foreground sm:px-6">
                  {category.position}
                </td>

                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium">
                      {category.name}
                    </p>

                    {category.description && (
                      <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <code className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {category.slug}
                  </code>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {category.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Edit3 className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
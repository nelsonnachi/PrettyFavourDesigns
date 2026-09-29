"use client";

import { AlertTriangle, X } from "lucide-react";

import { useDeleteCategory } from "@/lib/query/categories/category-mutations";
import type { Category } from "@/lib/query/categories/category-types";

interface CategoryDeleteDialogProps {
  category: Category;
  onClose: () => void;
}

export function CategoryDeleteDialog({
  category,
  onClose,
}: CategoryDeleteDialogProps) {
  const deleteCategory = useDeleteCategory();

  async function handleDelete() {
    try {
      await deleteCategory.mutateAsync(category.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close delete dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* DIALOG */}
      <div className="relative w-full max-w-md rounded-2xl border bg-card shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="size-5" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5">
            <h2 className="text-lg font-semibold">
              Delete category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              You're about to delete{" "}
              <span className="font-medium text-foreground">
                {category.name}
              </span>
              . This action cannot be undone.
            </p>
          </div>

          {deleteCategory.isError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteCategory.error instanceof Error
                ? deleteCategory.error.message
                : "Failed to delete category."}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={deleteCategory.isPending}
              className="inline-flex h-11 items-center justify-center rounded-xl border bg-card px-5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteCategory.isPending}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteCategory.isPending
                ? "Deleting..."
                : "Delete category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
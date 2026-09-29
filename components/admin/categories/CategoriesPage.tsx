"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { useAdminCategories } from "@/lib/query/categories/category-queries";
import { CategoriesTable } from "./CategoriesTable";
import type { Category } from "@/lib/query/categories/category-types";
import { CategoryForm } from "./CategoryForm";
import { CategoryDeleteDialog } from "./CategoryDeleteDialog";

export function CategoriesPage() {
  const categoriesQuery = useAdminCategories();

  const categories = categoriesQuery.data?.data ?? [];

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<Category | null>(null);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query)
      );
    });
  }, [categories, search]);

  function handleAddCategory() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function handleEditCategory(category: Category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setEditingCategory(null);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Organize your products into clear and manageable categories."
        action={
          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Add category
          </button>
        }
      />

      {/* SEARCH */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            className="h-11 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredCategories.length}{" "}
          {filteredCategories.length === 1
            ? "category"
            : "categories"}
        </div>
      </div>

      {/* TABLE */}
      <CategoriesTable
        categories={filteredCategories}
        isLoading={categoriesQuery.isLoading}
        isFetching={categoriesQuery.isFetching}
        error={categoriesQuery.error}
        onEdit={handleEditCategory}
        onDelete={setDeletingCategory}
      />

      {/* CREATE / EDIT */}
      {formOpen && (
        <CategoryForm
          category={editingCategory}
          onClose={handleFormClose}
        />
      )}

      {/* DELETE */}
      {deletingCategory && (
        <CategoryDeleteDialog
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  useCreateCategory,
  useUpdateCategory,
} from "@/lib/query/categories/category-mutations";

import type { Category } from "@/lib/query/categories/category-types";

interface CategoryFormProps {
  category: Category | null;
  onClose: () => void;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CategoryForm({
  category,
  onClose,
}: CategoryFormProps) {
  const isEditing = Boolean(category);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // POPULATE FORM WHEN EDITING
  // ============================================================

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description ?? "");
      setPosition(String(category.position));
      setIsActive(category.isActive);
      setSlugManuallyEdited(true);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setPosition("0");
      setIsActive(true);
      setSlugManuallyEdited(false);
    }

    setError(null);
  }, [category]);

  // ============================================================
  // NAME
  // ============================================================

  function handleNameChange(value: string) {
    setName(value);

    if (!slugManuallyEdited) {
      setSlug(createSlug(value));
    }
  }

  // ============================================================
  // SLUG
  // ============================================================

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(createSlug(value));
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (!trimmedSlug) {
      setError("Category slug is required.");
      return;
    }

    const parsedPosition = Number(position);

    if (
      !Number.isInteger(parsedPosition) ||
      parsedPosition < 0
    ) {
      setError("Position must be a whole number greater than or equal to 0.");
      return;
    }

    try {
      if (category) {
        await updateCategory.mutateAsync({
          id: category.id,
          data: {
            name: trimmedName,
            slug: trimmedSlug,
            description: trimmedDescription,
            position: parsedPosition,
            isActive,
          },
        });
      } else {
        await createCategory.mutateAsync({
          name: trimmedName,
          slug: trimmedSlug,
          description: trimmedDescription,
          position: parsedPosition,
          isActive,
        });
      }

      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : `Failed to ${
              isEditing ? "update" : "create"
            } category.`,
      );
    }
  }

  const isPending =
    createCategory.isPending ||
    updateCategory.isPending;

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close category form"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* PANEL */}
      <div className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l bg-card shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold">
              {isEditing
                ? "Edit category"
                : "Add category"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isEditing
                ? "Update the category information."
                : "Create a category for organizing your products."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* NAME */}
            <div className="space-y-2">
              <label
                htmlFor="category-name"
                className="text-sm font-medium"
              >
                Category name
                <span className="ml-1 text-accent">*</span>
              </label>

              <input
                id="category-name"
                value={name}
                onChange={(event) =>
                  handleNameChange(event.target.value)
                }
                placeholder="e.g. Bags"
                maxLength={100}
                autoFocus
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
              />
            </div>

            {/* SLUG */}
            <div className="space-y-2">
              <label
                htmlFor="category-slug"
                className="text-sm font-medium"
              >
                Slug
                <span className="ml-1 text-accent">*</span>
              </label>

              <input
                id="category-slug"
                value={slug}
                onChange={(event) =>
                  handleSlugChange(event.target.value)
                }
                placeholder="bags"
                maxLength={100}
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
              />

              <p className="text-xs text-muted-foreground">
                Used in the category URL.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label
                htmlFor="category-description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="category-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe this category..."
                rows={5}
                maxLength={500}
                className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
              />

              <div className="flex justify-end text-xs text-muted-foreground">
                {description.length}/500
              </div>
            </div>

            {/* POSITION */}
            <div className="space-y-2">
              <label
                htmlFor="category-position"
                className="text-sm font-medium"
              >
                Display position
              </label>

              <input
                id="category-position"
                type="number"
                min="0"
                step="1"
                value={position}
                onChange={(event) =>
                  setPosition(event.target.value)
                }
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15"
              />

              <p className="text-xs text-muted-foreground">
                Lower numbers appear first.
              </p>
            </div>

            {/* ACTIVE */}
            <div className="rounded-xl border bg-background p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(event.target.checked)
                  }
                  className="mt-0.5 size-4 accent-[var(--accent)]"
                />

                <span>
                  <span className="block text-sm font-medium">
                    Active category
                  </span>

                  <span className="mt-1 block text-xs text-muted-foreground">
                    Active categories can be displayed on the
                    storefront.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="border-t px-5 py-4 sm:px-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border bg-card px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                    ? "Save changes"
                    : "Create category"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
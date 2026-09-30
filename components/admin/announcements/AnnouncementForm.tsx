"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ImagePlus,
  Save,
  Upload,
} from "lucide-react";

import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "@/lib/query/announcements/announcements-api";

import type {
  AdminAnnouncement,
  AnnouncementType,
} from "@/lib/query/announcements/announcements-types";

interface AnnouncementFormProps {
  announcement:
    | AdminAnnouncement
    | null;

  onClose: () => void;
}

const ANNOUNCEMENT_TYPES: {
  value: AnnouncementType;
  label: string;
}[] = [
  {
    value: "general",
    label: "General",
  },
  {
    value: "sale",
    label: "Sale",
  },
  {
    value: "event",
    label: "Event",
  },
  {
    value: "class",
    label: "Class",
  },
];

export function AnnouncementForm({
  announcement,
  onClose,
}: AnnouncementFormProps) {
  const isEditing =
    announcement !== null;

  const createAnnouncement =
    useCreateAnnouncement();

  const updateAnnouncement =
    useUpdateAnnouncement();

  const [image, setImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(
      announcement?.imageUrl ?? null,
    );

  const [type, setType] =
    useState<AnnouncementType>(
      announcement?.type ?? "general",
    );

  const [title, setTitle] =
    useState(
      announcement?.title ?? "",
    );

  const [ctaText, setCtaText] =
    useState(
      announcement?.ctaText ?? "",
    );

  const [ctaUrl, setCtaUrl] =
    useState(
      announcement?.ctaUrl ?? "",
    );

  // ==========================================================
  // IMAGE PREVIEW
  // ==========================================================

  useEffect(() => {
    if (!image) {
      return;
    }

    const url =
      URL.createObjectURL(image);

    setImagePreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  // ==========================================================
  // IMAGE CHANGE
  // ==========================================================

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);
  }

  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    // ========================================================
    // CREATE
    // ========================================================

    if (!announcement) {
      if (!image) {
        return;
      }

      try {
        await createAnnouncement.mutateAsync({
          image,
          type,
          title: title.trim()
            ? title.trim()
            : undefined,
          ctaText: ctaText.trim()
            ? ctaText.trim()
            : undefined,
          ctaUrl: ctaUrl.trim()
            ? ctaUrl.trim()
            : undefined,
        });

        onClose();
      } catch {
        // React Query exposes the error through
        // createAnnouncement.error.
      }

      return;
    }

    // ========================================================
    // UPDATE
    // ========================================================

    try {
      await updateAnnouncement.mutateAsync({
        id: announcement.id,
        image: image ?? undefined,
        type,
        title: title.trim()
          ? title.trim()
          : null,
        ctaText: ctaText.trim()
          ? ctaText.trim()
          : null,
        ctaUrl: ctaUrl.trim()
          ? ctaUrl.trim()
          : null,
      });

      onClose();
    } catch {
      // React Query exposes the error through
      // updateAnnouncement.error.
    }
  }

  // ==========================================================
  // STATE
  // ==========================================================

  const isPending =
    createAnnouncement.isPending ||
    updateAnnouncement.isPending;

  const error =
    createAnnouncement.error ||
    updateAnnouncement.error;

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing
              ? "Edit announcement"
              : "Create announcement"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing
              ? "Update the announcement displayed on the storefront."
              : "Create the announcement that will be displayed on the storefront."}
          </p>
        </div>
      </div>

      {/* ====================================================== */}
      {/* FORM */}
      {/* ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* ================================================== */}
          {/* IMAGE */}
          {/* ================================================== */}

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5">
              <h2 className="font-semibold">
                Announcement image
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                This is the main visual customers will see.
              </p>
            </div>

            <label className="group relative block cursor-pointer overflow-hidden rounded-xl border border-dashed border-border bg-muted">
              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="sr-only"
              />

              {imagePreview ? (
                <div className="relative aspect-[16/9]">
                  <img
                    src={imagePreview}
                    alt="Announcement preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                    <div className="flex items-center gap-2 rounded-lg bg-background/90 px-4 py-2 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                      <Upload className="size-4" />

                      Change image
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-[16/9] flex-col items-center justify-center px-6 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-background">
                    <ImagePlus className="size-5 text-muted-foreground" />
                  </div>

                  <p className="mt-4 text-sm font-medium">
                    Upload announcement image
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG or WEBP
                  </p>
                </div>
              )}
            </label>

            {!isEditing &&
              !image && (
                <p className="mt-3 text-xs text-destructive">
                  An announcement image is required.
                </p>
              )}
          </div>

          {/* ================================================== */}
          {/* DETAILS */}
          {/* ================================================== */}

          <div className="space-y-6 rounded-xl border border-border bg-card p-6">
            <div>
              <h2 className="font-semibold">
                Announcement details
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Configure what accompanies the image.
              </p>
            </div>

            {/* TYPE */}

            <div className="space-y-2">
              <label
                htmlFor="announcement-type"
                className="text-sm font-medium"
              >
                Type
              </label>

              <select
                id="announcement-type"
                value={type}
                onChange={(event) =>
                  setType(
                    event.target
                      .value as AnnouncementType,
                  )
                }
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                {ANNOUNCEMENT_TYPES.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* TITLE */}

            <div className="space-y-2">
              <label
                htmlFor="announcement-title"
                className="text-sm font-medium"
              >
                Title
              </label>

              <input
                id="announcement-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                placeholder="e.g. Summer collection is here"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* CTA TEXT */}

            <div className="space-y-2">
              <label
                htmlFor="announcement-cta-text"
                className="text-sm font-medium"
              >
                CTA text
              </label>

              <input
                id="announcement-cta-text"
                type="text"
                value={ctaText}
                onChange={(event) =>
                  setCtaText(
                    event.target.value,
                  )
                }
                placeholder="e.g. Shop now"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* CTA URL */}

            <div className="space-y-2">
              <label
                htmlFor="announcement-cta-url"
                className="text-sm font-medium"
              >
                CTA URL
              </label>

              <input
                id="announcement-cta-url"
                type="text"
                value={ctaUrl}
                onChange={(event) =>
                  setCtaUrl(
                    event.target.value,
                  )
                }
                placeholder="/shop"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* ERROR */}
        {/* ==================================================== */}

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."}
          </div>
        )}

        {/* ==================================================== */}
        {/* ACTIONS */}
        {/* ==================================================== */}

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              isPending ||
              (!isEditing && !image)
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="size-4" />

            {isPending
              ? isEditing
                ? "Updating..."
                : "Publishing..."
              : isEditing
                ? "Update announcement"
                : "Publish announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
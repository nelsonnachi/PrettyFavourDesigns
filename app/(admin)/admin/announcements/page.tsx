"use client";

import { useState } from "react";

import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useAdminAnnouncement,
  useDeleteAnnouncement,
} from "@/lib/query/announcements/announcements-api";

import {
  AnnouncementForm,
} from "@/components/admin/announcements/AnnouncementForm";

import type {
  AdminAnnouncement,
} from "@/lib/query/announcements/announcements-types";

export default function AdminAnnouncementsPage() {
  const {
    data: announcement,
    isLoading,
    isError,
  } = useAdminAnnouncement();

  const deleteAnnouncement =
    useDeleteAnnouncement();

  const [formOpen, setFormOpen] =
    useState(false);

  const [
    formAnnouncement,
    setFormAnnouncement,
  ] = useState<AdminAnnouncement | null>(
    null,
  );

  // ==========================================================
  // CREATE
  // ==========================================================

  function handleCreate() {
    setFormAnnouncement(null);
    setFormOpen(true);
  }

  // ==========================================================
  // EDIT
  // ==========================================================

  function handleEdit() {
    if (!announcement) {
      return;
    }

    setFormAnnouncement(announcement);
    setFormOpen(true);
  }

  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  function handleCloseForm() {
    setFormOpen(false);
    setFormAnnouncement(null);
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async function handleDelete() {
    if (!announcement) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this announcement?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAnnouncement.mutateAsync(
        announcement.id,
      );
    } catch {
      // React Query exposes the error through
      // deleteAnnouncement.error.
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-[500px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Announcements
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the announcement currently displayed to
            customers.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Megaphone className="mx-auto size-10 text-muted-foreground" />

          <h2 className="mt-4 text-lg font-semibold">
            Unable to load announcement
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong while loading the current
            announcement.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // FORM
  // ==========================================================

  if (formOpen) {
    return (
      <AnnouncementForm
        announcement={formAnnouncement}
        onClose={handleCloseForm}
      />
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="size-5 text-primary" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Announcements
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the announcement currently displayed to
            customers.
          </p>
        </div>

        {!announcement && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />

            Create announcement
          </button>
        )}
      </div>

      {/* ====================================================== */}
      {/* EMPTY STATE */}
      {/* ====================================================== */}

      {!announcement && (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
            <Megaphone className="size-6 text-muted-foreground" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            No announcement
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            You don't currently have an announcement
            displayed on the storefront. Create one to
            promote a sale, event, class, or general update.
          </p>

          <button
            type="button"
            onClick={handleCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />

            Create announcement
          </button>
        </div>
      )}

      {/* ====================================================== */}
      {/* CURRENT ANNOUNCEMENT */}
      {/* ====================================================== */}

      {announcement && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* IMAGE */}

          <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
            <img
              src={announcement.imageUrl}
              alt={
                announcement.title ||
                "Current announcement"
              }
              className="h-full w-full object-cover"
            />

            <div className="absolute left-4 top-4">
              <span className="inline-flex rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium capitalize backdrop-blur">
                {announcement.type}
              </span>
            </div>
          </div>

          {/* CONTENT */}

          <div className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* DETAILS */}

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Current announcement
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {announcement.title ||
                    "Untitled announcement"}
                </h2>

                {announcement.ctaText &&
                  announcement.ctaUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Call to action
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {announcement.ctaText}
                      </p>

                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {announcement.ctaUrl}
                      </p>
                    </div>
                  )}
              </div>

              {/* ACTIONS */}

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Pencil className="size-4" />

                  Edit
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={
                    deleteAnnouncement.isPending
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="size-4" />

                  {deleteAnnouncement.isPending
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>

            {/* META */}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
              <span>
                Created{" "}
                {new Date(
                  announcement.createdAt,
                ).toLocaleDateString()}
              </span>

              <span>
                Updated{" "}
                {new Date(
                  announcement.updatedAt,
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
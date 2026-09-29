"use client";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

import {
  useAdminContactMessages,
} from "@/lib/query/contact-messages/contact-message-queries";

import type {
  AdminContactMessageParams,
} from "@/lib/query/contact-messages/contact-message-types";

import { MessageFilters } from "./MessageFilters";
import { MessagesTable } from "./MessagesTable";

const DEFAULT_FILTERS = {
  page: 1,
  limit: 12,
  sort: "newest",
} satisfies AdminContactMessageParams;

export function MessagesPage() {
  const [filters, setFilters] =
    useState<AdminContactMessageParams>(
      DEFAULT_FILTERS,
    );

  const messagesQuery =
    useAdminContactMessages(filters);

  const messages =
    messagesQuery.data?.data ?? [];

  const pagination =
    messagesQuery.data?.pagination;

  // ==========================================================
  // FILTERS
  // ==========================================================

  function handleFilterChange(
    updates: Partial<AdminContactMessageParams>,
  ) {
    setFilters((current) => ({
      ...current,
      ...updates,
    }));
  }

  function handleClearFilters() {
    setFilters({
      ...DEFAULT_FILTERS,
    });
  }

  // ==========================================================
  // PAGINATION
  // ==========================================================

  function handlePreviousPage() {
    if (
      !pagination ||
      pagination.page <= 1
    ) {
      return;
    }

    setFilters((current) => ({
      ...current,
      page: pagination.page - 1,
    }));
  }

  function handleNextPage() {
    if (
      !pagination ||
      pagination.page >=
        pagination.totalPages
    ) {
      return;
    }

    setFilters((current) => ({
      ...current,
      page: pagination.page + 1,
    }));
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const currentPage =
    pagination?.page ?? 1;

  const totalPages =
    pagination?.totalPages ?? 1;

  const totalMessages =
    pagination?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <AdminPageHeader
        title="Messages"
        description="View and manage messages sent through your contact form."
      />

      {/* ==================================================== */}
      {/* FILTERS */}
      {/* ==================================================== */}

      <MessageFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* ==================================================== */}
      {/* RESULTS HEADER */}
      {/* ==================================================== */}

      <div className="flex min-h-6 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Inbox className="size-4 text-muted-foreground" />

          <p className="text-sm text-muted-foreground">
            {totalMessages.toLocaleString()}{" "}
            {totalMessages === 1
              ? "message"
              : "messages"}
          </p>
        </div>

        {messagesQuery.isFetching &&
          !messagesQuery.isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Updating...
            </div>
          )}
      </div>

      {/* ==================================================== */}
      {/* TABLE / CARDS */}
      {/* ==================================================== */}

      <MessagesTable
        messages={messages}
        isLoading={
          messagesQuery.isLoading
        }
        isFetching={
          messagesQuery.isFetching
        }
        error={messagesQuery.error}
      />

      {/* ==================================================== */}
      {/* PAGINATION */}
      {/* ==================================================== */}

      {pagination &&
        pagination.totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page{" "}
              <span className="font-medium text-foreground">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  handlePreviousPage
                }
                disabled={
                  currentPage <= 1 ||
                  messagesQuery.isFetching
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border bg-card px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />

                <span className="hidden sm:inline">
                  Previous
                </span>
              </button>

              <button
                type="button"
                onClick={
                  handleNextPage
                }
                disabled={
                  currentPage >=
                    totalPages ||
                  messagesQuery.isFetching
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border bg-card px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">
                  Next
                </span>

                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
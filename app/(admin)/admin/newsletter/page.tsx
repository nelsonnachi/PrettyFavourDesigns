"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { NewsletterHeader } from "@/components/admin/newsletter/newsletter-header";
import { NewsletterStats } from "@/components/admin/newsletter/newsletter-stats";
import { NewsletterFilters } from "@/components/admin/newsletter/newsletter-filters";
import { NewsletterTable } from "@/components/admin/newsletter/newsletter-table";
import { NewsletterEmptyState } from "@/components/admin/newsletter/newsletter-empty-state";
import { NewsletterErrorState } from "@/components/admin/newsletter/newsletter-error-state";
import { NewsletterPagination } from "@/components/admin/newsletter/newsletter-pagination";
import { useAdminNewsletterSubscribers } from "@/lib/query/newsletter/newsletter-queries";
import {
  useDeleteAdminNewsletterSubscriber,
  useUpdateAdminNewsletterSubscriber,
} from "@/lib/query/newsletter/newsletter-mutations";
import type {
  NewsletterFilters as NewsletterFilterParams,
  NewsletterSubscriber,
} from "@/lib/query/newsletter/newsletter-types";

type StatusFilter = "all" | "subscribed" | "unsubscribed";
type SortOrder = "newest" | "oldest";

const LIMIT = 10;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));

export default function AdminNewsletterPage() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [page, setPage] = useState(1);

  const filters: NewsletterFilterParams = useMemo(
    () => ({
      page,
      limit: LIMIT,
      search: search || undefined,
      isSubscribed: status === "all" ? undefined : status === "subscribed",
      sort,
    }),
    [page, search, status, sort],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminNewsletterSubscribers(filters);

  const updateMutation = useUpdateAdminNewsletterSubscriber();
  const deleteMutation = useDeleteAdminNewsletterSubscriber();

  const subscribers = data?.data ?? [];
  const pagination = data?.pagination;

  const subscribedCount = subscribers.filter((s) => s.isSubscribed).length;
  const unsubscribedCount = subscribers.length - subscribedCount;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  function handleStatusChange(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  function handleSort() {
    setSort((current) => (current === "newest" ? "oldest" : "newest"));
    setPage(1);
  }

  function handleToggle(subscriber: NewsletterSubscriber) {
    updateMutation.mutate({
      id: subscriber.id,
      isSubscribed: !subscriber.isSubscribed,
    });
  }

  function handleDelete(subscriber: NewsletterSubscriber) {
    const confirmed = window.confirm(
      `Delete ${subscriber.email} from the newsletter?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(subscriber.id, {
      onSuccess: () => {
        if (subscribers.length === 1 && page > 1) {
          setPage((current) => current - 1);
        }
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <NewsletterHeader
          isFetching={isFetching}
          onRefresh={() => refetch()}
        />

        <NewsletterStats
          total={pagination?.total ?? 0}
          subscribed={subscribedCount}
          unsubscribed={unsubscribedCount}
        />

        <NewsletterFilters
          searchInput={searchInput}
          status={status}
          sort={sort}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onSort={handleSort}
        />

        {isError && (
          <NewsletterErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        )}

        <NewsletterTable
          subscribers={subscribers}
          isLoading={isLoading}
          isError={isError}
          onOpen={(subscriber) =>
            router.push(`/admin/newsletter/${subscriber.id}`)
          }
          onToggle={handleToggle}
          onDelete={handleDelete}
          updatingId={
            updateMutation.isPending ? updateMutation.variables?.id : undefined
          }
          deletingId={
            deleteMutation.isPending ? deleteMutation.variables : undefined
          }
          formatDate={formatDate}
        >
          <NewsletterEmptyState
            search={search}
            onClearSearch={handleClearSearch}
          />
        </NewsletterTable>

        <NewsletterPagination
          pagination={pagination}
          page={page}
          isFetching={isFetching}
          onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
          onNext={() =>
            setPage((current) =>
              Math.min(current + 1, pagination?.totalPages ?? current),
            )
          }
        />

        {isFetching && !isLoading && (
          <p className="mt-3 text-center text-xs text-gray-400">
            Updating subscriber list...
          </p>
        )}
      </div>
    </div>
  );
}

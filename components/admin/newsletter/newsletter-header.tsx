"use client";

import {
  RefreshCw,
  Users,
} from "lucide-react";

interface NewsletterHeaderProps {
  isFetching?: boolean;
  onRefresh: () => void;
}

export function NewsletterHeader({
  isFetching = false,
  onRefresh,
}: NewsletterHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
            <Users
              size={18}
              strokeWidth={2}
            />
          </div>

          <span className="text-sm font-medium text-gray-500">
            Audience
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Newsletter
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your newsletter subscribers.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          size={16}
          className={
            isFetching
              ? "animate-spin"
              : undefined
          }
        />

        Refresh
      </button>
    </div>
  );
}
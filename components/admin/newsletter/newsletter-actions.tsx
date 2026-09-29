"use client";

import {
  Loader2,
  Power,
  Trash2,
} from "lucide-react";

import type { NewsletterSubscriber } from "@/lib/query/newsletter/newsletter-types";

interface NewsletterActionsProps {
  subscriber: NewsletterSubscriber;

  isUpdating: boolean;
  isDeleting: boolean;

  onToggle: () => void;
  onDelete: () => void;
}

export function NewsletterActions({
  subscriber,
  isUpdating,
  isDeleting,
  onToggle,
  onDelete,
}: NewsletterActionsProps) {
  const isBusy =
    isUpdating || isDeleting;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900">
        Actions
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Manage this newsletter subscriber.
      </p>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={onToggle}
          disabled={isBusy}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Power size={16} />
          )}

          {subscriber.isSubscribed
            ? "Unsubscribe"
            : "Subscribe"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isBusy}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={16} />
          )}

          Delete subscriber
        </button>
      </div>
    </div>
  );
}
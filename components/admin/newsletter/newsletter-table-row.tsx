"use client";

import {
  Eye,
  Mail,
  MoreHorizontal,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";

import type { NewsletterSubscriber } from "@/lib/query/newsletter/newsletter-types";

import {
  NewsletterStatusBadge,
} from "./newsletter-status-badge";

interface NewsletterTableRowProps {
  subscriber: NewsletterSubscriber;

  onOpen: (
    subscriber: NewsletterSubscriber,
  ) => void;

  onToggle: (
    subscriber: NewsletterSubscriber,
  ) => void;

  onDelete: (
    subscriber: NewsletterSubscriber,
  ) => void;

  isUpdating: boolean;
  isDeleting: boolean;

  formatDate: (
    value: string,
  ) => string;
}

export function NewsletterTableRow({
  subscriber,
  onOpen,
  onToggle,
  onDelete,
  isUpdating,
  isDeleting,
  formatDate,
}: NewsletterTableRowProps) {
  return (
    <tr className="border-t border-gray-100 transition hover:bg-gray-50/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <Mail size={16} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {subscriber.email}
            </p>

            <p className="mt-0.5 text-xs text-gray-400">
              ID: {subscriber.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <NewsletterStatusBadge
          isSubscribed={
            subscriber.isSubscribed
          }
        />
      </td>

      <td className="px-5 py-4 text-sm text-gray-500">
        {formatDate(
          subscriber.subscribedAt,
        )}
      </td>

      <td className="px-5 py-4 text-sm text-gray-500">
        {subscriber.unsubscribedAt
          ? formatDate(
              subscriber.unsubscribedAt,
            )
          : "—"}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() =>
              onOpen(subscriber)
            }
            disabled={
              isUpdating ||
              isDeleting
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            title="View subscriber"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              onToggle(subscriber)
            }
            disabled={
              isUpdating ||
              isDeleting
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            title={
              subscriber.isSubscribed
                ? "Unsubscribe"
                : "Subscribe"
            }
          >
            {subscriber.isSubscribed ? (
              <UserX size={16} />
            ) : (
              <UserCheck size={16} />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(subscriber)
            }
            disabled={
              isUpdating ||
              isDeleting
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete subscriber"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
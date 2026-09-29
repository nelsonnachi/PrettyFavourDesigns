"use client";

import type { ReactNode } from "react";

import type { NewsletterSubscriber } from "@/lib/query/newsletter/newsletter-types";

import {
  NewsletterTableRow,
} from "./newsletter-table-row";

interface NewsletterTableProps {
  subscribers: NewsletterSubscriber[];

  isLoading: boolean;
  isError: boolean;

  onOpen: (
    subscriber: NewsletterSubscriber,
  ) => void;

  onToggle: (
    subscriber: NewsletterSubscriber,
  ) => void;

  onDelete: (
    subscriber: NewsletterSubscriber,
  ) => void;

  updatingId?: string;
  deletingId?: string;

  formatDate: (
    value: string,
  ) => string;

  children?: ReactNode;
}

export function NewsletterTable({
  subscribers,
  isLoading,
  isError,
  onOpen,
  onToggle,
  onDelete,
  updatingId,
  deletingId,
  formatDate,
  children,
}: NewsletterTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Subscriber
              </th>

              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Subscribed
              </th>

              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Unsubscribed
              </th>

              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <>
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-100"
                  >
                    <td
                      colSpan={5}
                      className="px-5 py-5"
                    >
                      <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))}
              </>
            ) : isError ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  Unable to load subscribers.
                </td>
              </tr>
            ) : subscribers.length > 0 ? (
              subscribers.map(
                (subscriber) => (
                  <NewsletterTableRow
                    key={
                      subscriber.id
                    }
                    subscriber={
                      subscriber
                    }
                    onOpen={onOpen}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    isUpdating={
                      updatingId ===
                      subscriber.id
                    }
                    isDeleting={
                      deletingId ===
                      subscriber.id
                    }
                    formatDate={
                      formatDate
                    }
                  />
                ),
              )
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-0"
                >
                  {children}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";

import {
  CalendarDays,
  ChevronRight,
  Eye,
  Mail,
  MailOpen,
} from "lucide-react";

import type {
  ContactMessage,
} from "@/lib/query/contact-messages/contact-message-types";

import { MessageReadBadge } from "./MessageReadBadge";

interface MessagesTableProps {
  messages: ContactMessage[];
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getSenderName(
  message: ContactMessage,
) {
  const name =
    message.name?.trim();

  if (name) {
    return name;
  }

  if (message.user) {
    const fullName =
      `${message.user.firstName ?? ""} ${message.user.lastName ?? ""}`
        .trim();

    if (fullName) {
      return fullName;
    }
  }

  return "Unknown sender";
}

function getInitials(
  message: ContactMessage,
) {
  const name =
    getSenderName(message);

  const parts = name
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function getMessagePreview(
  message: ContactMessage,
) {
  const text =
    message.message.trim();

  if (text.length <= 90) {
    return text;
  }

  return `${text.slice(0, 90)}...`;
}

// ============================================================
// LOADING
// ============================================================

function MessagesLoading() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
        <div className="border-b bg-muted/30 px-6 py-4">
          <div className="grid grid-cols-[1.3fr_1fr_1.6fr_.7fr_.8fr_50px] gap-5">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-3 animate-pulse rounded bg-muted"
                />
              ),
            )}
          </div>
        </div>

        <div className="divide-y">
          {Array.from({ length: 7 }).map(
            (_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1.3fr_1fr_1.6fr_.7fr_.8fr_50px] items-center gap-5 px-6 py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 animate-pulse rounded-full bg-muted" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-36 animate-pulse rounded bg-muted" />
                  </div>
                </div>

                <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />

                <div className="h-3.5 w-40 animate-pulse rounded bg-muted" />

                <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />

                <div className="space-y-2">
                  <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                </div>

                <div className="size-9 animate-pulse rounded-lg bg-muted" />
              </div>
            ),
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <div
              key={index}
              className="rounded-2xl border bg-card p-4"
            >
              <div className="flex gap-3">
                <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-44 animate-pulse rounded bg-muted" />
                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
}

// ============================================================
// ERROR
// ============================================================

function MessagesError() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-red-100 text-red-600">
        <Mail className="size-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-red-900">
        Unable to load messages
      </h3>

      <p className="mt-1 text-sm text-red-700">
        Something went wrong while loading your
        messages. Please try again.
      </p>
    </div>
  );
}

// ============================================================
// EMPTY
// ============================================================

function MessagesEmpty() {
  return (
    <div className="rounded-2xl border bg-card px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <Mail className="size-5 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-base font-semibold">
        No messages found
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        There are no messages matching your
        current filters.
      </p>
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================

export function MessagesTable({
  messages,
  isLoading,
  isFetching,
  error,
}: MessagesTableProps) {
  if (isLoading) {
    return <MessagesLoading />;
  }

  if (error) {
    return <MessagesError />;
  }

  if (messages.length === 0) {
    return <MessagesEmpty />;
  }

  return (
    <>
      {/* ==================================================== */}
      {/* DESKTOP TABLE */}
      {/* ==================================================== */}

      <div
        className={`hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block ${
          isFetching
            ? "opacity-70 transition-opacity"
            : ""
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Sender
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Subject
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Date
                </th>

                <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {messages.map((message) => {
                const senderName =
                  getSenderName(message);

                const initials =
                  getInitials(message);

                return (
                  <tr
                    key={message.id}
                    className={`group transition hover:bg-muted/20 ${
                      !message.isRead
                        ? "bg-orange-50/30"
                        : ""
                    }`}
                  >
                    {/* Sender */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            message.isRead
                              ? "bg-muted text-muted-foreground"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`truncate text-sm ${
                              message.isRead
                                ? "font-medium"
                                : "font-semibold"
                            }`}
                          >
                            {senderName}
                          </p>

                          <p className="mt-1 max-w-[190px] truncate text-xs text-muted-foreground">
                            {message.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-5 py-4">
                      <p
                        className={`max-w-[180px] truncate text-sm ${
                          message.isRead
                            ? "font-medium"
                            : "font-semibold"
                        }`}
                      >
                        {message.subject ||
                          "No subject"}
                      </p>
                    </td>

                    {/* Message */}
                    <td className="px-5 py-4">
                      <p className="max-w-[280px] truncate text-sm text-muted-foreground">
                        {getMessagePreview(
                          message,
                        )}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <MessageReadBadge
                        isRead={
                          message.isRead
                        }
                      />
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(
                          message.createdAt,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatTime(
                          message.createdAt,
                        )}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/messages/${message.id}`}
                          className="inline-flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label={`View message from ${senderName}`}
                        >
                          {message.isRead ? (
                            <MailOpen className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MOBILE CARDS */}
      {/* ==================================================== */}

      <div
        className={`space-y-3 md:hidden ${
          isFetching
            ? "opacity-70 transition-opacity"
            : ""
        }`}
      >
        {messages.map((message) => {
          const senderName =
            getSenderName(message);

          const initials =
            getInitials(message);

          return (
            <Link
              key={message.id}
              href={`/admin/messages/${message.id}`}
              className={`group block rounded-2xl border bg-card p-4 shadow-sm transition hover:border-ring/50 hover:shadow-md ${
                !message.isRead
                  ? "border-orange-200 bg-orange-50/30"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    message.isRead
                      ? "bg-muted text-muted-foreground"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {initials}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm ${
                          message.isRead
                            ? "font-medium"
                            : "font-semibold"
                        }`}
                      >
                        {senderName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {message.email}
                      </p>
                    </div>

                    <MessageReadBadge
                      isRead={
                        message.isRead
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <p
                      className={`truncate text-sm ${
                        message.isRead
                          ? "font-medium"
                          : "font-semibold"
                      }`}
                    >
                      {message.subject ||
                        "No subject"}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                      {getMessagePreview(
                        message,
                      )}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />

                      <span>
                        {formatDate(
                          message.createdAt,
                        )}
                      </span>

                      <span>•</span>

                      <span>
                        {formatTime(
                          message.createdAt,
                        )}
                      </span>
                    </div>

                    <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
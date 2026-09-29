"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Copy,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Trash2,
  User,
} from "lucide-react";

import { useAdminContactMessage } from "@/lib/query/contact-messages/contact-message-queries";

import {
  useDeleteAdminContactMessage,
  useUpdateAdminContactMessage,
} from "@/lib/query/contact-messages/contact-message-mutations";

import type { ContactMessage } from "@/lib/query/contact-messages/contact-message-types";

import { MessageDeleteDialog } from "./MessageDeleteDialog";
import { MessageReadBadge } from "./MessageReadBadge";

interface MessageDetailsProps {
  messageId: string;
}

// ============================================================
// DATE HELPERS
// ============================================================

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

// ============================================================
// SENDER HELPERS
// ============================================================

function getFullName(message: ContactMessage) {
  const name = message.name?.trim();

  if (name) {
    return name;
  }

  if (message.user) {
    const userName =
      `${message.user.firstName ?? ""} ${message.user.lastName ?? ""}`.trim();

    if (userName) {
      return userName;
    }
  }

  return "Unknown sender";
}

function getInitials(message: ContactMessage) {
  const name = getFullName(message);

  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ============================================================
// LOADING
// ============================================================

function MessageDetailsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-32 animate-pulse rounded bg-muted" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="border-b p-6 sm:p-8">
            <div className="flex gap-4">
              <div className="size-11 animate-pulse rounded-full bg-muted" />

              <div className="flex-1 space-y-3">
                <div className="h-7 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            </div>

            <div className="mt-6 h-4 w-48 animate-pulse rounded bg-muted" />
          </div>

          <div className="space-y-3 p-6 sm:p-8">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-2xl bg-muted" />
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ERROR
// ============================================================

function MessageDetailsError() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to messages
      </Link>

      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-red-100 text-red-600">
          <MessageSquare className="size-5" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-red-900">
          Unable to load message
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Something went wrong while loading this message. Please try again.
        </p>

        <Link
          href="/admin/messages"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-700 transition hover:bg-red-50"
        >
          Back to messages
        </Link>
      </div>
    </div>
  );
}

// ============================================================
// NOT FOUND
// ============================================================

function MessageDetailsNotFound() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to messages
      </Link>

      <div className="rounded-2xl border bg-card px-6 py-16 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="size-5 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-base font-semibold">Message not found</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          This message may have been deleted.
        </p>

        <Link
          href="/admin/messages"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-medium transition hover:bg-muted"
        >
          Back to messages
        </Link>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================

export function MessageDetails({ messageId }: MessageDetailsProps) {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const messageQuery = useAdminContactMessage(messageId);

  const updateMessage = useUpdateAdminContactMessage();

  const deleteMessage = useDeleteAdminContactMessage();

  // ==========================================================
  // LOADING
  // ==========================================================

  if (messageQuery.isLoading) {
    return <MessageDetailsLoading />;
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (messageQuery.isError) {
    return <MessageDetailsError />;
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const message = messageQuery.data;

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!message) {
    return <MessageDetailsNotFound />;
  }

  /*
   * IMPORTANT:
   *
   * From this point onward TypeScript knows that `message`
   * exists.
   *
   * We create a separate constant so the event handlers below
   * always work with a guaranteed ContactMessage.
   */
  const currentMessage: ContactMessage = message;

  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const senderName = getFullName(currentMessage);
  const initials = getInitials(currentMessage);

  // ==========================================================
  // TOGGLE READ
  // ==========================================================

  async function handleToggleRead() {
    try {
      await updateMessage.mutateAsync({
        id: currentMessage.id,
        data: {
          isRead: !currentMessage.isRead,
        },
      });
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async function handleDelete() {
    try {
      await deleteMessage.mutateAsync(currentMessage.id);

      setDeleteOpen(false);

      router.push("/admin/messages");
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  }

  // ==========================================================
  // COPY MESSAGE ID
  // ==========================================================

  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(currentMessage.id);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy message ID:", error);
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <div className="space-y-6">
        {/* ================================================== */}
        {/* TOP BAR */}
        {/* ================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/messages"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to messages
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {/* MARK READ / UNREAD */}

            <button
              type="button"
              onClick={handleToggleRead}
              disabled={updateMessage.isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border bg-card px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateMessage.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}

              {currentMessage.isRead ? "Mark as unread" : "Mark as read"}
            </button>

            {/* DELETE */}

            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              disabled={deleteMessage.isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-card px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteMessage.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* UPDATE ERROR */}
        {/* ================================================== */}

        {updateMessage.isError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            Unable to update the message. Please try again.
          </div>
        )}

        {/* ================================================== */}
        {/* DELETE ERROR */}
        {/* ================================================== */}

        {deleteMessage.isError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            Unable to delete the message. Please try again.
          </div>
        )}

        {/* ================================================== */}
        {/* MAIN GRID */}
        {/* ================================================== */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* ================================================= */}
          {/* MESSAGE */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            {/* MESSAGE HEADER */}

            <div className="border-b px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  {/* AVATAR */}

                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      currentMessage.isRead
                        ? "bg-muted text-muted-foreground"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {initials}
                  </div>

                  {/* TITLE */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h1 className="break-words text-xl font-semibold tracking-tight sm:text-2xl">
                          {currentMessage.subject || "No subject"}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                          From{" "}
                          <span className="font-medium text-foreground">
                            {senderName}
                          </span>
                        </p>
                      </div>

                      <div className="shrink-0">
                        <MessageReadBadge isRead={currentMessage.isRead} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DATE */}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />

                    {formatDate(currentMessage.createdAt)}
                  </span>

                  <span>{formatTime(currentMessage.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* MESSAGE BODY */}

            <div className="px-6 py-7 sm:px-8 sm:py-9">
              <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-foreground">
                {currentMessage.message}
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside className="space-y-6">
            {/* ================================================= */}
            {/* SENDER */}
            {/* ================================================= */}

            <section className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />

                <h2 className="text-sm font-semibold">Sender</h2>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    currentMessage.isRead
                      ? "bg-muted text-muted-foreground"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{senderName}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentMessage.user
                      ? "Registered customer"
                      : "Contact form visitor"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {/* EMAIL */}

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>

                  <a
                    href={`mailto:${currentMessage.email}`}
                    className="mt-1.5 flex items-start gap-2 break-all text-sm font-medium transition hover:text-accent"
                  >
                    <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                    <span>{currentMessage.email}</span>
                  </a>
                </div>

                {/* PHONE */}

                {currentMessage.phone && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Phone
                    </p>

                    <a
                      href={`tel:${currentMessage.phone}`}
                      className="mt-1.5 flex items-center gap-2 text-sm font-medium transition hover:text-accent"
                    >
                      <Phone className="size-4 shrink-0 text-muted-foreground" />

                      {currentMessage.phone}
                    </a>
                  </div>
                )}

                {/* CUSTOMER ID */}

                {currentMessage.user && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Customer ID
                    </p>

                    <p className="mt-1.5 break-all font-mono text-xs text-muted-foreground">
                      {currentMessage.user.id}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ================================================= */}
            {/* MESSAGE INFORMATION */}
            {/* ================================================= */}

            <section className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-muted-foreground" />

                <h2 className="text-sm font-semibold">Message information</h2>
              </div>

              <dl className="mt-5 space-y-5">
                {/* SUBJECT */}

                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Subject
                  </dt>

                  <dd className="mt-1.5 break-words text-sm">
                    {currentMessage.subject || "No subject"}
                  </dd>
                </div>

                {/* STATUS */}

                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </dt>

                  <dd className="mt-2">
                    <MessageReadBadge isRead={currentMessage.isRead} />
                  </dd>
                </div>

                {/* RECEIVED */}

                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Received
                  </dt>

                  <dd className="mt-1.5 text-sm">
                    {formatDate(currentMessage.createdAt)}

                    <span className="ml-2 text-muted-foreground">
                      {formatTime(currentMessage.createdAt)}
                    </span>
                  </dd>
                </div>

                {/* MESSAGE ID */}

                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Message ID
                  </dt>

                  <dd className="mt-1.5 flex items-start gap-2">
                    <span className="min-w-0 flex-1 break-all font-mono text-xs text-muted-foreground">
                      {currentMessage.id}
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      aria-label="Copy message ID"
                      title="Copy message ID"
                    >
                      {copied ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>

      {/* ==================================================== */}
      {/* DELETE DIALOG */}
      {/* ==================================================== */}

      <MessageDeleteDialog
        open={deleteOpen}
        messageName={senderName}
        isDeleting={deleteMessage.isPending}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

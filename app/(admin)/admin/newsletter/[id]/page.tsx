"use client";

import { use, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { NewsletterDetailHeader } from "@/components/admin/newsletter/newsletter-detail-header";
import { NewsletterInfoCard } from "@/components/admin/newsletter/newsletter-info-card";
import { NewsletterActions } from "@/components/admin/newsletter/newsletter-actions";
import { NewsletterStatusCard } from "@/components/admin/newsletter/newsletter-status-card";
import { NewsletterStatusBadge } from "@/components/admin/newsletter/newsletter-status-badge";
import { useAdminNewsletterSubscriber } from "@/lib/query/newsletter/newsletter-queries";
import {
  useDeleteAdminNewsletterSubscriber,
  useUpdateAdminNewsletterSubscriber,
} from "@/lib/query/newsletter/newsletter-mutations";

interface NewsletterDetailPageProps {
  params: Promise<{ id: string }>;
}

const LIST_PATH = "/admin/newsletter";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}

export default function NewsletterDetailPage({
  params,
}: NewsletterDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data, isLoading, isError, error, refetch } =
    useAdminNewsletterSubscriber(id);

  const updateMutation = useUpdateAdminNewsletterSubscriber();
  const deleteMutation = useDeleteAdminNewsletterSubscriber();

  function handleToggle() {
    if (!data) return;

    updateMutation.mutate(
      { id: data.id, isSubscribed: !data.isSubscribed },
      { onSuccess: () => refetch() },
    );
  }

  function handleDelete() {
    if (!data) return;

    const confirmed = window.confirm(
      `Delete ${data.email} from the newsletter?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(data.id, {
      onSuccess: () => router.push(LIST_PATH),
    });
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-32 rounded bg-gray-200" />
          <div className="mb-8 h-10 w-72 rounded bg-gray-200" />
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="h-80 rounded-xl bg-gray-200" />
            <div className="h-64 rounded-xl bg-gray-200" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (isError || !data) {
    return (
      <PageShell>
        <button
          type="button"
          onClick={() => router.push(LIST_PATH)}
          className="mb-6 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          ← Back to newsletter
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">
            Subscriber not found
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "We couldn't load this newsletter subscriber."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <NewsletterDetailHeader email={data.email} />

      <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Current status
          </p>
          <p className="mt-1 text-sm text-gray-600">Newsletter subscription</p>
        </div>

        <NewsletterStatusBadge isSubscribed={data.isSubscribed} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <NewsletterInfoCard subscriber={data} formatDate={formatDate} />
          <NewsletterStatusCard isSubscribed={data.isSubscribed} />
        </div>

        <div>
          <NewsletterActions
            subscriber={data}
            isUpdating={updateMutation.isPending}
            isDeleting={deleteMutation.isPending}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </PageShell>
  );
}

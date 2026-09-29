import {
  Calendar,
  Clock,
  Mail,
} from "lucide-react";

import type { NewsletterSubscriber } from "@/lib/query/newsletter/newsletter-types";

import {
  NewsletterStatusBadge,
} from "./newsletter-status-badge";

interface NewsletterInfoCardProps {
  subscriber: NewsletterSubscriber;
  formatDate: (
    value: string,
  ) => string;
}

export function NewsletterInfoCard({
  subscriber,
  formatDate,
}: NewsletterInfoCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Subscriber information
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        <div className="flex items-center gap-4 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <Mail size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-gray-500">
              Email address
            </p>

            <p className="mt-1 break-all text-sm font-medium text-gray-900">
              {subscriber.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <Calendar size={18} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Subscribed at
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(
                subscriber.subscribedAt,
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <Clock size={18} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Unsubscribed at
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {subscriber.unsubscribedAt
                ? formatDate(
                    subscriber.unsubscribedAt,
                  )
                : "Not unsubscribed"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-xs text-gray-500">
              Current status
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              Newsletter subscription
            </p>
          </div>

          <NewsletterStatusBadge
            isSubscribed={
              subscriber.isSubscribed
            }
          />
        </div>
      </div>
    </div>
  );
}
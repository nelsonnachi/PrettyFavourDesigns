import type { ReactNode } from "react";

interface NewsletterStatusBadgeProps {
  isSubscribed: boolean;
}

export function NewsletterStatusBadge({
  isSubscribed,
}: NewsletterStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full",
        "px-2.5 py-1 text-xs font-medium",
        isSubscribed
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isSubscribed
            ? "bg-emerald-500"
            : "bg-gray-400",
        ].join(" ")}
      />

      {isSubscribed
        ? "Subscribed"
        : "Unsubscribed"}
    </span>
  );
}
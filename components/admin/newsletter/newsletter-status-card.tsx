import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface NewsletterStatusCardProps {
  isSubscribed: boolean;
}

export function NewsletterStatusCard({
  isSubscribed,
}: NewsletterStatusCardProps) {
  return (
    <div
      className={[
        "rounded-xl border p-5",
        isSubscribed
          ? "border-emerald-200 bg-emerald-50"
          : "border-gray-200 bg-gray-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            isSubscribed
              ? "bg-emerald-100 text-emerald-600"
              : "bg-gray-200 text-gray-500",
          ].join(" ")}
        >
          {isSubscribed ? (
            <CheckCircle2 size={18} />
          ) : (
            <XCircle size={18} />
          )}
        </div>

        <div>
          <h3
            className={[
              "text-sm font-semibold",
              isSubscribed
                ? "text-emerald-900"
                : "text-gray-900",
            ].join(" ")}
          >
            {isSubscribed
              ? "Currently subscribed"
              : "Currently unsubscribed"}
          </h3>

          <p
            className={[
              "mt-1 text-sm",
              isSubscribed
                ? "text-emerald-700"
                : "text-gray-500",
            ].join(" ")}
          >
            {isSubscribed
              ? "This subscriber is currently receiving newsletter communications."
              : "This subscriber is no longer receiving newsletter communications."}
          </p>
        </div>
      </div>
    </div>
  );
}
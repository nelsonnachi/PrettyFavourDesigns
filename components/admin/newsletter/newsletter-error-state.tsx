import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface NewsletterErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function NewsletterErrorState({
  message,
  onRetry,
}: NewsletterErrorStateProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <AlertCircle
          size={20}
          className="mt-0.5 shrink-0 text-red-500"
        />

        <div>
          <p className="text-sm font-medium text-red-800">
            Failed to load newsletter subscribers
          </p>

          <p className="mt-1 text-xs text-red-600">
            {message ||
              "Something went wrong while loading the subscriber list."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
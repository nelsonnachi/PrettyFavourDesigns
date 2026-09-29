import {
  MailOpen,
  SearchX,
} from "lucide-react";

interface NewsletterEmptyStateProps {
  search?: string;
  onClearSearch: () => void;
}

export function NewsletterEmptyState({
  search,
  onClearSearch,
}: NewsletterEmptyStateProps) {
  const hasSearch = Boolean(
    search?.trim(),
  );

  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        {hasSearch ? (
          <SearchX size={21} />
        ) : (
          <MailOpen size={21} />
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-900">
        {hasSearch
          ? "No subscribers found"
          : "No newsletter subscribers yet"}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500">
        {hasSearch
          ? `No subscriber matches "${search}".`
          : "Newsletter subscribers will appear here when people sign up."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
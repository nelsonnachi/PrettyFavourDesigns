"use client";

export function DiscountSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-[#f1ebe2]"
          />
        ))}
      </div>

      <div className="h-[420px] animate-pulse rounded-xl bg-[#f1ebe2]" />
    </div>
  );
}
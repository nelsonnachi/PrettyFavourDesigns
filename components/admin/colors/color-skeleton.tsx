export function ColorSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
      {/* Desktop */}

      <div className="hidden md:block">
        <div className="flex h-12 items-center border-b border-[#e6ddd1] bg-[#f1ebe2]/50 px-5">
          <Skeleton className="h-3 w-24" />
        </div>

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-5 border-b border-[#e6ddd1] px-5 py-4 last:border-0"
          >
            <Skeleton className="h-10 w-10 rounded-full" />

            <Skeleton className="h-4 w-32" />

            <Skeleton className="ml-auto h-5 w-20" />

            <Skeleton className="h-5 w-16" />

            <Skeleton className="h-4 w-24" />

            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Mobile */}

      <div className="divide-y divide-[#e6ddd1] md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#eee6da] ${className}`}
    />
  );
}
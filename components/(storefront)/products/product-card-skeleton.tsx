import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <article className="flex min-w-0 flex-col">
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <Skeleton className="aspect-[1/1.08] w-full" />

      {/* =====================================================
          INFORMATION
      ===================================================== */}

      <div className="pt-4">
        <Skeleton className="h-6 w-3/4" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        <Skeleton className="mt-3 h-5 w-24" />

        <Skeleton className="mt-4 h-11 w-full" />
      </div>
    </article>
  );
}
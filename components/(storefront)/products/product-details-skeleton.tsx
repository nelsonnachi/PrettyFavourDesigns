import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="bg-background">
      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-8 flex items-center gap-2 sm:mb-10">
          <Skeleton className="h-4 w-12" />

          <Skeleton className="h-3 w-3" />

          <Skeleton className="h-4 w-32" />
        </div>

        {/* ==================================================
            MAIN PRODUCT
        ================================================== */}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] lg:gap-16 xl:gap-20">
          {/* =================================================
              GALLERY
          ================================================= */}

          <div className="min-w-0">
            <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
              {/* THUMBNAILS */}

              <div className="order-2 flex gap-3 overflow-hidden lg:order-1 lg:flex-col">
                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="size-20 shrink-0 sm:size-24 lg:size-[76px]"
                  />
                ))}
              </div>

              {/* MAIN IMAGE */}

              <Skeleton className="order-1 aspect-[4/5] w-full lg:order-2" />
            </div>
          </div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="flex flex-col lg:pt-2">
            {/* LABEL */}

            <Skeleton className="h-3 w-24" />

            {/* TITLE */}

            <Skeleton className="mt-4 h-14 w-3/4 sm:h-16 lg:h-20" />

            {/* RATING */}

            <div className="mt-5 flex items-center gap-3">
              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-4 w-8" />

              <Skeleton className="h-4 w-20" />
            </div>

            {/* PRICE */}

            <Skeleton className="mt-7 h-9 w-32" />

            {/* DESCRIPTION */}

            <div className="mt-7 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
            </div>

            <div className="my-8 border-t border-border" />

            {/* COLOR */}

            <Skeleton className="h-4 w-16" />

            <Skeleton className="mt-2 h-4 w-24" />

            <div className="mt-4 flex flex-wrap gap-3">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-11 w-28"
                />
              ))}
            </div>

            {/* STOCK */}

            <Skeleton className="mt-6 h-4 w-40" />

            {/* QUANTITY */}

            <Skeleton className="mt-7 h-14 w-[145px]" />

            {/* CART */}

            <Skeleton className="mt-3 h-14 w-full" />

            {/* WISHLIST */}

            <Skeleton className="mt-3 h-12 w-full" />

            {/* PRODUCT INFO */}

            <div className="mt-8 border-t border-border">
              <div className="flex items-center justify-between border-b border-border py-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="flex items-center justify-between border-b border-border py-4">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="flex items-center justify-between py-4">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
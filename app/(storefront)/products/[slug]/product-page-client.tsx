"use client";

import { ProductDetails } from "@/components/(storefront)/products/product-details";
import { ProductDetailsSkeleton } from "@/components/(storefront)/products/product-details-skeleton";
import { useProduct } from "@/lib/query/products/product-queries";

type ProductPageClientProps = {
  slug: string;
};

export function ProductPageClient({
  slug,
}: ProductPageClientProps) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useProduct(slug);

  // ==========================================================
  // INITIAL LOADING
  // ==========================================================
  //
  // Only show the skeleton when we have NO product data yet.
  //
  // This is important because TanStack Query can have cached
  // product data while fetching fresh data in the background.
  //
  // Without "!data", the page can disappear and show the
  // skeleton every time the product query starts fetching.
  // ==========================================================

  if (isLoading && !data) {
    return <ProductDetailsSkeleton />;
  }

  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (isError || !data?.data) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[1440px] items-center justify-center px-5">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#211b17]">
            Product not found
          </h1>

          <p className="mt-3 text-sm text-[#756a60]">
            The product you are looking for is
            unavailable.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PRODUCT
  // ==========================================================

  return (
    <div className="relative">
      <ProductDetails product={data.data} />

      {/* ======================================================
          BACKGROUND REFRESH INDICATOR
      ====================================================== */}
      {isFetching && (
        <div className="pointer-events-none fixed right-4 top-20 z-40 sm:right-6">
          <div className="flex items-center gap-2 border border-[#e6ddd1] bg-[#fffdf9] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#756a60] shadow-sm">
            <span className="size-2 animate-pulse rounded-full bg-[#e85d22]" />
            Updating
          </div>
        </div>
      )}
    </div>
  );
}
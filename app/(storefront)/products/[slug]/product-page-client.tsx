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
    isError,
  } = useProduct(slug);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
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
    <ProductDetails product={data.data} />
  );
}
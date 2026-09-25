"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";


import { ProductCard } from "../products/product-card";
import { useProducts } from "@/lib/query/products/product-queries";
import { ProductCardSkeleton } from "../products/product-card-skeleton";


export function OurCollection() {
  const {
    data,
    isLoading,
    isError,
  } = useProducts({
    isFeatured: true,
    limit: 4,
    sort: "newest",
  });

  const products = data?.data ?? [];

  return (
    <section
      aria-labelledby="our-collection-heading"
      className="border-b border-[#e6ddd1] bg-[#faf7f1]"
    >
      <div className="mx-auto max-w-360 px-5 py-12 sm:px-8 sm:py-14 md:py-16 lg:px-10 lg:py-18">
        {/* ====================================================
            SECTION HEADER
        ==================================================== */}

        <div className="mb-7 sm:mb-8 lg:mb-9">
          <h2
            id="our-collection-heading"
            className="font-serif text-[34px] font-medium leading-none tracking-[-0.025em] text-[#211b17] sm:text-[38px] lg:text-[42px]"
          >
            Our Collection
          </h2>

          <p className="mt-3 max-w-[470px] text-[12px] leading-[1.7] text-[#756a60] sm:text-[13px]">
            Discover bags that fit your lifestyle —
            from everyday essentials to statement
            pieces.
          </p>

          <Link
            href="/shop"
            className="group mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#211b17] transition-colors duration-200 hover:text-[#e85d22] sm:text-[11px]"
          >
            <span>Shop All Bags</span>

            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.6}
            />
          </Link>
        </div>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {isLoading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <ProductCardSkeleton
                key={index}
              />
            ))}
          </div>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {isError && (
          <div className="border border-[#e6ddd1] bg-[#fffdf9] px-6 py-12 text-center">
            <p className="font-serif text-[20px] text-[#211b17]">
              Unable to load our collection.
            </p>

            <p className="mt-2 text-[11px] text-[#756a60]">
              Please try again shortly.
            </p>
          </div>
        )}

        {/* ====================================================
            PRODUCTS
        ==================================================== */}

        {!isLoading &&
          !isError &&
          products.length > 0 && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {!isLoading &&
          !isError &&
          products.length === 0 && (
            <div className="border border-[#e6ddd1] bg-[#fffdf9] px-6 py-12 text-center">
              <p className="font-serif text-[20px] text-[#211b17]">
                Our collection is coming soon.
              </p>

              <p className="mt-2 text-[11px] text-[#756a60]">
                Check back shortly for our featured
                bags.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}
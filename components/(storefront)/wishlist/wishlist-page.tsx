"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  HeartOff,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  useRemoveFromWishlist,
  useWishlist,
} from "@/lib/query/wishlist/wishlist-queries";

// ============================================================
// WISHLIST PAGE
// ============================================================

export function WishlistPage() {
  // ==========================================================
  // GET WISHLIST
  // ==========================================================

  const {
    data: wishlist = [],
    isLoading,
    isError,
  } = useWishlist();

  // ==========================================================
  // REMOVE FROM WISHLIST
  // ==========================================================

  const removeWishlist =
    useRemoveFromWishlist();

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <section className="min-h-[60vh] bg-[#faf7f1]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mb-12">
            <div className="h-3 w-24 animate-pulse bg-[#eee6da]" />

            <div className="mt-4 h-10 w-64 animate-pulse bg-[#eee6da]" />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
              >
                <div className="aspect-[1/1.08] bg-[#eee6da]" />

                <div className="mt-4 h-5 w-3/4 bg-[#eee6da]" />

                <div className="mt-3 h-4 w-1/2 bg-[#eee6da]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (isError) {
    return (
      <section className="min-h-[60vh] bg-[#faf7f1]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center px-5 py-24 text-center sm:px-8 lg:px-12">
          <HeartOff
            className="size-10 text-[#756a60]"
            strokeWidth={1}
          />

          <h1 className="mt-6 font-serif text-3xl text-[#211b17]">
            Unable to load your wishlist
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#756a60]">
            Something went wrong while
            loading your wishlist. Please
            try again.
          </p>
        </div>
      </section>
    );
  }

  // ==========================================================
  // EMPTY WISHLIST
  // ==========================================================

  if (wishlist.length === 0) {
    return (
      <section className="min-h-[60vh] bg-[#faf7f1]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center px-5 py-24 text-center sm:px-8 lg:px-12">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#eee6da]">
            <Heart
              className="size-7 text-[#211b17]"
              strokeWidth={1.3}
            />
          </div>

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e85d22]">
            Your favourites
          </p>

          <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.03em] text-[#211b17] sm:text-5xl">
            Your wishlist is empty
          </h1>

          <p className="mt-5 max-w-md text-sm leading-6 text-[#756a60]">
            Save the pieces you love and
            come back to them whenever
            you're ready.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 bg-[#211b17] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#e85d22]"
          >
            Explore collection
          </Link>
        </div>
      </section>
    );
  }

  // ==========================================================
  // WISHLIST
  // ==========================================================

  return (
    <section className="min-h-screen bg-[#faf7f1]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="border-b border-[#e6ddd1] pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e85d22]">
            Saved pieces
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-serif text-4xl font-medium tracking-[-0.03em] text-[#211b17] sm:text-5xl">
                My Wishlist
              </h1>

              <p className="mt-3 text-sm text-[#756a60]">
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "item"
                  : "items"}{" "}
                saved
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex w-fit items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#211b17] underline underline-offset-4 transition-colors hover:text-[#e85d22]"
            >
              Continue shopping
            </Link>
          </div>
        </div>

        {/* ====================================================
            PRODUCTS
        ==================================================== */}

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16">
          {wishlist.map(
            (item) => {
              const product =
                item.product;

              const price =
                Number(
                  product.price,
                );

              const compareAtPrice =
                product.compareAtPrice !==
                null
                  ? Number(
                      product.compareAtPrice,
                    )
                  : null;

              const hasDiscount =
                compareAtPrice !== null &&
                compareAtPrice > price;

              return (
                <article
                  key={item.id}
                  className="group flex min-w-0 flex-col"
                >
                  {/* ==========================================
                      IMAGE
                  ========================================== */}

                  <div className="relative overflow-hidden bg-[#f3eee8]">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block"
                    >
                      <div className="relative aspect-[1/1.08] w-full">
                        <div className="flex h-full w-full items-center justify-center text-xs text-[#756a60]">
                          No image
                        </div>
                      </div>
                    </Link>

                    {/* ======================================
                        REMOVE
                    ====================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        removeWishlist.mutate(
                          product.id,
                        )
                      }
                      disabled={
                        removeWishlist.isPending
                      }
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#211b17] shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-[#e85d22] disabled:opacity-50"
                    >
                      <Trash2
                        className="size-4"
                        strokeWidth={1.5}
                      />
                    </button>

                    {/* ======================================
                        BADGES
                    ====================================== */}

                    {product.isNewArrival && (
                      <span className="absolute left-3 top-3 bg-[#211b17] px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white">
                        New
                      </span>
                    )}
                  </div>

                  {/* ==========================================
                      INFORMATION
                  ========================================== */}

                  <div className="flex flex-1 flex-col pt-4">
                    <Link
                      href={`/products/${product.slug}`}
                    >
                      <h2 className="font-serif text-[18px] font-medium leading-[1.15] tracking-[-0.02em] text-[#211b17] transition-colors group-hover:text-[#e85d22] sm:text-[19px]">
                        {product.name}
                      </h2>
                    </Link>

                    {/* PRICE */}

                    <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[14px] font-semibold text-[#211b17]">
                        ₦
                        {price.toLocaleString(
                          "en-NG",
                        )}
                      </span>

                      {hasDiscount && (
                        <span className="text-[11px] text-[#8b8178] line-through">
                          ₦
                          {compareAtPrice.toLocaleString(
                            "en-NG",
                          )}
                        </span>
                      )}
                    </div>

                    {/* ADD TO CART */}

                    <button
                      type="button"
                      className="mt-4 flex w-full items-center justify-center gap-2 border border-[#211b17] bg-[#211b17] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-[#e85d22] hover:bg-[#e85d22]"
                    >
                      <ShoppingBag
                        className="size-3.5"
                        strokeWidth={1.5}
                      />

                      <span>
                        Add to cart
                      </span>
                    </button>
                  </div>
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
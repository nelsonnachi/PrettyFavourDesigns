"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart, ShoppingBag } from "lucide-react";

import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlistStatus,
} from "@/lib/query/wishlist/wishlist-queries";

import type { PublicProduct } from "@/lib/query/products/product-types";

// ============================================================
// TYPES
// ============================================================

type ProductCardProps = {
  product: PublicProduct;
};

// ============================================================
// PRODUCT CARD
// ============================================================

export function ProductCard({ product }: ProductCardProps) {
  // ==========================================================
  // PRIMARY IMAGE
  // ==========================================================

  const primaryImage =
    product.images.find((image) => image.isPrimary) ??
    product.images[0] ??
    null;

  // ==========================================================
  // PRICE
  // ==========================================================

  const price = Number(product.price);

  const compareAtPrice =
    product.compareAtPrice !== null ? Number(product.compareAtPrice) : null;

  // ==========================================================
  // DISCOUNT
  // ==========================================================

  const hasDiscount = compareAtPrice !== null && compareAtPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // ==========================================================
  // WISHLIST STATUS
  // ==========================================================

  const { data: wishlistStatus, isLoading: wishlistLoading } =
    useWishlistStatus(product.id);

  // ==========================================================
  // WISHLIST MUTATIONS
  // ==========================================================

  const addWishlist = useAddToWishlist();

  const removeWishlist = useRemoveFromWishlist();

  // ==========================================================
  // CURRENT WISHLIST STATE
  // ==========================================================

  const isInWishlist = wishlistStatus?.isInWishlist ?? false;

  const wishlistMutationLoading =
    addWishlist.isPending || removeWishlist.isPending;

  // ==========================================================
  // HANDLE WISHLIST
  // ==========================================================

  function handleWishlist() {
    // --------------------------------------------------------
    // Prevent multiple clicks while request is running
    // --------------------------------------------------------

    if (wishlistMutationLoading) {
      return;
    }

    // --------------------------------------------------------
    // Remove from wishlist
    // --------------------------------------------------------

    if (isInWishlist) {
      removeWishlist.mutate(product.id);

      return;
    }

    // --------------------------------------------------------
    // Add to wishlist
    // --------------------------------------------------------

    addWishlist.mutate({
      productId: product.id,
    });
  }

  return (
    <article className="group flex min-w-0 flex-col">
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div className="relative overflow-hidden bg-[#f3eee8]">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[1/1.08] w-full">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={product.name}
                fill
                sizes="
                  (max-width: 639px) 50vw,
                  (max-width: 1023px) 33vw,
                  25vw
                "
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[#756a60]">
                No image
              </div>
            )}
          </div>
        </Link>

        {/* ===================================================
            BADGES
        =================================================== */}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="inline-flex w-fit bg-[#211b17] px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white">
              New
            </span>
          )}

          {hasDiscount && (
            <span className="inline-flex w-fit bg-[#e85d22] px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* ===================================================
            WISHLIST
        =================================================== */}

        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading || wishlistMutationLoading}
          aria-label={
            isInWishlist
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isInWishlist}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#211b17] shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-[#e85d22] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Heart
            className="size-4"
            strokeWidth={1.5}
            fill={isInWishlist ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <div className="flex flex-1 flex-col pt-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-[18px] font-medium leading-[1.15] tracking-[-0.02em] text-[#211b17] transition-colors duration-200 group-hover:text-[#e85d22] sm:text-[19px]">
            {product.name}
          </h3>
        </Link>

        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[12px] leading-5 text-[#756a60]">
          {product.description}
        </p>

        {/* ===================================================
            PRICE
        =================================================== */}

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[14px] font-semibold text-[#211b17]">
            ₦{price.toLocaleString("en-NG")}
          </span>

          {hasDiscount && (
            <span className="text-[11px] text-[#8b8178] line-through">
              ₦{compareAtPrice.toLocaleString("en-NG")}
            </span>
          )}
        </div>

        {/* ===================================================
            ADD TO CART
        =================================================== */}

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 border border-[#211b17] bg-[#211b17] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:border-[#e85d22] hover:bg-[#e85d22]"
        >
          <ShoppingBag className="size-3.5" strokeWidth={1.5} />

          <span>Add to cart</span>
        </button>
      </div>
    </article>
  );
}

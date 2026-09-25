"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

export type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;

  description: string;

  price: number;
  compareAtPrice?: number | null;

  status: string;

  isFeatured: boolean;
  isNewArrival: boolean;

  image: string;
};

type ProductCardProps = {
  product: ProductCardProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const {
    name,
    slug,
    description,
    price,
    compareAtPrice,
    isFeatured,
    isNewArrival,
    image,
  } = product;

  const hasDiscount =
    compareAtPrice !== null &&
    compareAtPrice !== undefined &&
    compareAtPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((compareAtPrice - price) / compareAtPrice) * 100
      )
    : 0;

  return (
    <article className="group flex min-w-0 flex-col">
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}
      <div className="relative overflow-hidden bg-[#f3eee8]">
        <Link
          href={`/products/${slug}`}
          className="block"
        >
          <div className="relative aspect-[1/1.08] w-full">
            <Image
              src={image}
              alt={name}
              fill
              sizes="
                (max-width: 639px) 50vw,
                (max-width: 1023px) 33vw,
                25vw
              "
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </Link>

        {/* ===================================================
            TOP LEFT BADGES
        =================================================== */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isNewArrival && (
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
            FEATURED / WISHLIST BUTTON
        =================================================== */}
        {isFeatured && (
          <button
            type="button"
            aria-label={`Add ${name} to wishlist`}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#211b17] shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-[#e85d22]"
          >
            <Heart
              className="size-4"
              strokeWidth={1.5}
            />
          </button>
        )}
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}
      <div className="flex flex-1 flex-col pt-4">
        {/* Product Name */}
        <Link href={`/products/${slug}`}>
          <h3 className="font-serif text-[18px] font-medium leading-[1.15] tracking-[-0.02em] text-[#211b17] transition-colors duration-200 group-hover:text-[#e85d22] sm:text-[19px]">
            {name}
          </h3>
        </Link>

        {/* ===================================================
            DESCRIPTION
        =================================================== */}
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[12px] leading-5 text-[#756a60]">
          {description}
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
          <ShoppingBag
            className="size-3.5"
            strokeWidth={1.5}
          />

          <span>Add to cart</span>
        </button>
      </div>
    </article>
  );
}
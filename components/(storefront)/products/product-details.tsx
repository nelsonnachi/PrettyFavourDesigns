"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import { PublicProductDetails } from "@/lib/query/products/product-types";


type ProductDetailsProps = {
  product: PublicProductDetails;
};

export function ProductDetails({
  product,
}: ProductDetailsProps) {
  // ==========================================================
  // SORT IMAGES
  // ==========================================================

  const sortedImages = useMemo(() => {
    return [...product.images].sort(
      (a, b) => a.position - b.position,
    );
  }, [product.images]);

  // ==========================================================
  // PRIMARY IMAGE
  // ==========================================================

  const primaryImage =
    sortedImages.find((image) => image.isPrimary) ??
    sortedImages[0] ??
    null;

  // ==========================================================
  // SELECTED IMAGE
  // ==========================================================

  const [selectedImageId, setSelectedImageId] =
    useState<string>(primaryImage?.id ?? "");

  // ==========================================================
  // SELECTED COLOR VARIANT
  // ==========================================================

  const [selectedVariantId, setSelectedVariantId] =
    useState<string>(
      product.variants[0]?.id ?? "",
    );

  // ==========================================================
  // QUANTITY
  // ==========================================================

  const [quantity, setQuantity] = useState(1);

  // ==========================================================
  // WISHLIST
  // ==========================================================

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  // ==========================================================
  // CURRENT IMAGE
  // ==========================================================

  const selectedImage =
    sortedImages.find(
      (image) => image.id === selectedImageId,
    ) ?? primaryImage;

  // ==========================================================
  // CURRENT VARIANT
  // ==========================================================

  const selectedVariant =
    product.variants.find(
      (variant) =>
        variant.id === selectedVariantId,
    ) ?? product.variants[0];

  // ==========================================================
  // AVAILABLE STOCK
  // ==========================================================
  //
  // Your API already calculates this.
  //
  // We do NOT calculate:
  //
  // stock - reservedStock
  //
  // because the public API returns:
  //
  // availableStock
  //
  // ==========================================================

  const availableStock =
    selectedVariant?.availableStock ?? 0;

  // ==========================================================
  // PRICE
  // ==========================================================

  const price = Number(product.price);

  const compareAtPrice =
    product.compareAtPrice !== null
      ? Number(product.compareAtPrice)
      : null;

  // ==========================================================
  // DISCOUNT
  // ==========================================================

  const hasDiscount =
    compareAtPrice !== null &&
    compareAtPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((compareAtPrice - price) /
          compareAtPrice) *
          100,
      )
    : 0;

  // ==========================================================
  // RATING
  // ==========================================================

  const averageRating =
    Number(product.averageRating);

  // ==========================================================
  // QUANTITY CONTROLS
  // ==========================================================

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(current - 1, 1),
    );
  }

  function increaseQuantity() {
    if (availableStock <= 0) {
      return;
    }

    setQuantity((current) =>
      Math.min(
        current + 1,
        availableStock,
      ),
    );
  }

  // ==========================================================
  // IMAGE NAVIGATION
  // ==========================================================

  function showPreviousImage() {
    if (sortedImages.length <= 1) {
      return;
    }

    const currentIndex =
      sortedImages.findIndex(
        (image) =>
          image.id === selectedImageId,
      );

    const safeCurrentIndex =
      currentIndex === -1
        ? 0
        : currentIndex;

    const previousIndex =
      safeCurrentIndex <= 0
        ? sortedImages.length - 1
        : safeCurrentIndex - 1;

    setSelectedImageId(
      sortedImages[previousIndex].id,
    );
  }

  function showNextImage() {
    if (sortedImages.length <= 1) {
      return;
    }

    const currentIndex =
      sortedImages.findIndex(
        (image) =>
          image.id === selectedImageId,
      );

    const safeCurrentIndex =
      currentIndex === -1
        ? 0
        : currentIndex;

    const nextIndex =
      safeCurrentIndex >=
      sortedImages.length - 1
        ? 0
        : safeCurrentIndex + 1;

    setSelectedImageId(
      sortedImages[nextIndex].id,
    );
  }

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  function handleAddToCart() {
    if (!selectedVariant) {
      return;
    }

    if (availableStock <= 0) {
      return;
    }

    console.log("Add to cart", {
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      colorId: selectedVariant.colorId,
      colorName: selectedVariant.color.name,
      sku: selectedVariant.sku,
      quantity,
    });
  }

  return (
    <div className="bg-background">
      {/* ======================================================
          PRODUCT
      ====================================================== */}

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground sm:mb-10">
          <Link
            href="/shop"
            className="transition-colors hover:text-foreground"
          >
            Shop
          </Link>

          <span>/</span>

          <span className="text-foreground">
            {product.name}
          </span>
        </div>

        {/* ==================================================
            MAIN PRODUCT GRID
        ================================================== */}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] lg:gap-16 xl:gap-20">
          {/* =================================================
              PRODUCT GALLERY
          ================================================= */}

          <div className="min-w-0">
            <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
              {/* THUMBNAILS */}

              <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
                {sortedImages.map(
                  (image, index) => {
                    const isSelected =
                      image.id ===
                      selectedImageId;

                    return (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() =>
                          setSelectedImageId(
                            image.id,
                          )
                        }
                        aria-label={`View product image ${
                          index + 1
                        }`}
                        className={`relative size-20 shrink-0 overflow-hidden border transition sm:size-24 lg:size-[76px] ${
                          isSelected
                            ? "border-foreground"
                            : "border-border hover:border-foreground/50"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={`${product.name} image ${
                            index + 1
                          }`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </button>
                    );
                  },
                )}
              </div>

              {/* MAIN IMAGE */}

              <div className="order-1 lg:order-2">
                <div className="group relative aspect-[4/5] overflow-hidden bg-[#f3eee8]">
                  {selectedImage ? (
                    <Image
                      key={selectedImage.id}
                      src={selectedImage.url}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 1023px) 100vw, 65vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-[#756a60]">
                      No product image
                    </div>
                  )}

                  {/* BADGES */}

                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    {product.isNewArrival && (
                      <span className="bg-[#211b17] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.15em] text-white">
                        New
                      </span>
                    )}

                    {hasDiscount && (
                      <span className="bg-[#e85d22] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.15em] text-white">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* IMAGE ARROWS */}

                  {sortedImages.length >
                    1 && (
                    <>
                      <button
                        type="button"
                        onClick={
                          showPreviousImage
                        }
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#211b17] opacity-100 shadow-sm transition hover:bg-white lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        <ChevronLeft
                          className="size-5"
                          strokeWidth={1.5}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={
                          showNextImage
                        }
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#211b17] opacity-100 shadow-sm transition hover:bg-white lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        <ChevronRight
                          className="size-5"
                          strokeWidth={1.5}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="flex flex-col lg:pt-2">
            {/* LABEL */}

            <div className="flex items-center gap-3">
              {product.isBestSeller && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  Best Seller
                </span>
              )}

              {product.isFeatured &&
                !product.isBestSeller && (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                    Featured
                  </span>
                )}
            </div>

            {/* PRODUCT NAME */}

            <h1 className="mt-3 font-serif text-4xl leading-[1.05] tracking-[-0.03em] text-[#211b17] sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-[#e85d22] text-[#e85d22]"
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              <span className="text-sm font-medium text-[#211b17]">
                {averageRating.toFixed(1)}
              </span>

              <span className="text-sm text-[#756a60]">
                ({product.ratingCount} reviews)
              </span>
            </div>

            {/* PRICE */}

            <div className="mt-7 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-semibold tracking-tight text-[#211b17] sm:text-3xl">
                ₦{price.toLocaleString("en-NG")}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-sm text-[#8b8178] line-through">
                    ₦
                    {compareAtPrice!.toLocaleString(
                      "en-NG",
                    )}
                  </span>

                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#e85d22]">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}

            <p className="mt-7 max-w-xl text-sm leading-7 text-[#756a60] sm:text-base">
              {product.description}
            </p>

            <div className="my-8 border-t border-border" />

            {/* COLOR */}

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#211b17]">
                    Color
                  </p>

                  <p className="mt-1 text-sm text-[#756a60]">
                    {selectedVariant?.color
                      .name ?? "Unavailable"}
                  </p>
                </div>

                {selectedVariant && (
                  <span className="text-xs text-[#756a60]">
                    SKU: {selectedVariant.sku}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {product.variants.map(
                  (variant) => {
                    const isSelected =
                      variant.id ===
                      selectedVariantId;

                    const isOutOfStock =
                      !variant.inStock;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => {
                          setSelectedVariantId(
                            variant.id,
                          );

                          setQuantity(1);
                        }}
                        className={`group flex items-center gap-2.5 border px-3 py-2.5 transition ${
                          isSelected
                            ? "border-foreground"
                            : "border-border hover:border-foreground/60"
                        } ${
                          isOutOfStock
                            ? "cursor-not-allowed opacity-40"
                            : ""
                        }`}
                      >
                        <span
                          className={`size-5 rounded-full border border-black/10 ${
                            isSelected
                              ? "ring-2 ring-foreground ring-offset-2"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              variant.color
                                .hexCode ??
                              "#e5e5e5",
                          }}
                        />

                        <span className="text-xs font-medium text-[#211b17]">
                          {variant.color.name}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* STOCK */}

            <div className="mt-6">
              {availableStock > 0 ? (
                <p className="text-sm text-[#756a60]">
                  <span className="font-medium text-[#211b17]">
                    {availableStock}
                  </span>{" "}
                  available in{" "}
                  {selectedVariant?.color
                    .name}
                </p>
              ) : (
                <p className="text-sm font-medium text-[#e85d22]">
                  This color is currently out
                  of stock.
                </p>
              )}
            </div>

            {/* QUANTITY */}

            <div className="mt-7 flex flex-col gap-3">
              <div className="flex h-14 w-full items-center justify-between border border-border sm:w-[145px]">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex size-14 shrink-0 items-center justify-center text-[#211b17] transition hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </button>

                <span className="text-sm font-medium text-[#211b17]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    availableStock <= 0 ||
                    quantity >=
                      availableStock
                  }
                  aria-label="Increase quantity"
                  className="flex size-14 shrink-0 items-center justify-center text-[#211b17] transition hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* ADD TO CART */}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant ||
                  availableStock <= 0
                }
                className="flex h-14 w-full items-center justify-center gap-3 bg-[#211b17] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#e85d22] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag
                  className="size-5"
                  strokeWidth={1.5}
                />

                {availableStock > 0
                  ? "Add to cart"
                  : "Out of stock"}
              </button>
            </div>

            {/* WISHLIST */}

            <button
              type="button"
              onClick={() =>
                setIsWishlisted(
                  (current) => !current,
                )
              }
              className="mt-3 flex h-14 w-full items-center justify-center gap-2 border border-border px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#211b17] transition hover:border-foreground sm:h-12"
            >
              <Heart
                className={`size-5 ${
                  isWishlisted
                    ? "fill-[#e85d22] text-[#e85d22]"
                    : ""
                }`}
                strokeWidth={1.5}
              />

              {isWishlisted
                ? "Saved to wishlist"
                : "Add to wishlist"}
            </button>

            {/* PRODUCT INFO */}

            <div className="mt-8 border-t border-border">
              <div className="flex items-center justify-between border-b border-border py-4">
                <span className="text-xs uppercase tracking-[0.12em] text-[#756a60]">
                  Product
                </span>

                <span className="text-sm font-medium text-[#211b17]">
                  {product.name}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border py-4">
                <span className="text-xs uppercase tracking-[0.12em] text-[#756a60]">
                  Sold
                </span>

                <span className="text-sm font-medium text-[#211b17]">
                  {product.soldCount} units
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-xs uppercase tracking-[0.12em] text-[#756a60]">
                  Colors
                </span>

                <span className="text-sm font-medium text-[#211b17]">
                  {product.variants.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PRODUCT DESCRIPTION
      ====================================================== */}

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                About the product
              </p>
            </div>

            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl tracking-tight text-[#211b17] sm:text-4xl">
                Designed for everyday living.
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#756a60] sm:text-base sm:leading-8">
                {product.description}
              </p>

              <p className="mt-4 text-sm leading-7 text-[#756a60] sm:text-base sm:leading-8">
                Thoughtfully designed with a balance
                of practicality and refined style,
                this piece is made to move naturally
                through your everyday routine.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Star } from "lucide-react";

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
  isBestSeller: boolean;

  averageRating: number;
  ratingCount: number;

  image: string;
};

type ProductCardProps = {
  product: ProductCardProduct;

  /**
   * "home" = compact homepage version
   * "shop" = detailed shop page version
   */
  variant?: "home" | "shop";
};

export function ProductCard({
  product,
  variant = "shop",
}: ProductCardProps) {
  const {
    name,
    slug,
    description,
    price,
    compareAtPrice,
    isFeatured,
    isNewArrival,
    isBestSeller,
    ratingCount,
    image,
  } = product;

  const hasDiscount =
    compareAtPrice !== null &&
    compareAtPrice !== undefined &&
    compareAtPrice > price;

  return (
    <article className="group min-w-0">
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}
      <div className="relative overflow-hidden bg-[#eee6da]">
        <Link href={`/products/${slug}`}>
          <div className="relative aspect-[1/1.05] w-full">
            <Image
              src={image}
              alt={name}
              fill
              sizes="
                (max-width: 639px) 50vw,
                (max-width: 1023px) 33vw,
                25vw
              "
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </Link>

        {/* ===================================================
            PRODUCT LABELS
        =================================================== */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {isNewArrival && (
            <span className="bg-[#211b17] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-white">
              New
            </span>
          )}

          {isBestSeller && (
            <span className="bg-[#e85d22] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-white">
              Best Seller
            </span>
          )}
        </div>

        {/* ===================================================
            FEATURED INDICATOR
        =================================================== */}
        {isFeatured && (
          <div className="absolute right-3 top-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#fffdf9]/90 backdrop-blur-sm">
              <Heart
                className="size-3.5 text-[#e85d22]"
                strokeWidth={1.5}
              />
            </span>
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}
      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${slug}`}>
              <h3 className="font-serif text-[18px] font-medium leading-[1.05] tracking-[-0.02em] text-[#211b17] transition-colors duration-200 group-hover:text-[#e85d22] sm:text-[19px]">
                {name}
              </h3>
            </Link>

            {/* =================================================
                HOMEPAGE DESCRIPTION
            ================================================= */}
            {variant === "home" && (
              <p className="mt-1.5 line-clamp-2 text-[10px] leading-[1.5] text-[#756a60] sm:text-[11px]">
                {description}
              </p>
            )}

            {/* =================================================
                SHOP PAGE RATING
            ================================================= */}
            {variant === "shop" && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-3 fill-[#e85d22] text-[#e85d22]"
                      strokeWidth={1}
                    />
                  ))}
                </div>

                <span className="text-[9px] text-[#756a60]">
                  ({ratingCount})
                </span>
              </div>
            )}
          </div>

          {/* =================================================
              ARROW
          ================================================= */}
          <Link
            href={`/products/${slug}`}
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center"
            aria-label={`View ${name}`}
          >
            <ArrowRight
              className="size-4 text-[#211b17] transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.4}
            />
          </Link>
        </div>

        {/* ===================================================
            PRICE
            SHOP ONLY
        =================================================== */}
        {variant === "shop" && (
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#211b17]">
              ₦{price.toLocaleString("en-NG")}
            </span>

            {hasDiscount && (
              <span className="text-[10px] text-[#756a60] line-through">
                ₦{compareAtPrice.toLocaleString("en-NG")}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
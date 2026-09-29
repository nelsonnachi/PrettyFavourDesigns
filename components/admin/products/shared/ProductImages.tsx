"use client";

import Image from "next/image";
import { Star, Trash2 } from "lucide-react";

import { ProductCard } from "./ProductCard";
import { ProductImageUpload } from "./ProductImageUpload";
import type {
  ExistingProductImage,
  ProductImageDraft,
} from "./product-form-types";

interface ProductImagesProps {
  existingImages: ExistingProductImage[];
  newImages: ProductImageDraft[];

  onAddImages: (files: File[]) => void;
  onRemoveExistingImage: (id: string) => void;
  onRemoveNewImage: (id: string) => void;
  onSetExistingPrimary: (id: string) => void;
  onSetNewPrimary: (id: string) => void;
}

export function ProductImages({
  existingImages,
  newImages,
  onAddImages,
  onRemoveExistingImage,
  onRemoveNewImage,
  onSetExistingPrimary,
  onSetNewPrimary,
}: ProductImagesProps) {
  const totalImages = existingImages.length + newImages.length;

  return (
    <ProductCard
      title="Product images"
      description="Manage the product gallery and choose a primary image."
    >
      <div className="space-y-5">
        {totalImages > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {existingImages.map((image) => (
              <div
                key={`existing-${image.id}`}
                className="group relative overflow-hidden rounded-xl border bg-background"
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt="Product image"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>

                {image.isPrimary && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground">
                    <Star className="size-3 fill-current" />
                    Primary
                  </span>
                )}

                <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => onSetExistingPrimary(image.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-card/95 px-2 py-2 text-xs font-medium shadow-sm backdrop-blur hover:bg-card"
                    >
                      <Star className="size-3.5" />
                      Primary
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage(image.id)}
                    className="flex size-9 items-center justify-center rounded-lg bg-card/95 text-red-600 shadow-sm backdrop-blur hover:bg-card"
                    aria-label="Remove image"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            {newImages.map((image) => (
              <div
                key={`new-${image.id}`}
                className="group relative overflow-hidden rounded-xl border bg-background"
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.previewUrl}
                    alt={image.file.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>

                <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-[11px] font-medium text-accent-foreground">
                  New
                </span>

                {image.isPrimary && (
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground">
                    <Star className="size-3 fill-current" />
                    Primary
                  </span>
                )}

                <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => onSetNewPrimary(image.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-card/95 px-2 py-2 text-xs font-medium shadow-sm backdrop-blur hover:bg-card"
                    >
                      <Star className="size-3.5" />
                      Primary
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveNewImage(image.id)}
                    className="flex size-9 items-center justify-center rounded-lg bg-card/95 text-red-600 shadow-sm backdrop-blur hover:bg-card"
                    aria-label="Remove new image"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ProductImageUpload onFilesSelected={onAddImages} />

        <p className="text-xs text-muted-foreground">
          {totalImages} {totalImages === 1 ? "image" : "images"} in
          gallery.
        </p>
      </div>
    </ProductCard>
  );
}
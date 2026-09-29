"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { useCreateAdminProduct } from "@/lib/query/products/product-mutations";
import type { ProductStatus } from "@/lib/query/products/product-types";

import { ProductInformation } from "../shared/ProductInformation";
import { ProductImages } from "../shared/ProductImages";
import { ProductVariants } from "../shared/ProductVariants";
import { ProductSEO } from "../shared/ProductSEO";
import { ProductPricing } from "../shared/ProductPricing";
import { ProductOrganization } from "../shared/ProductOrganization";
import { ProductLabels } from "../shared/ProductLabels";

import type {
  ExistingProductImage,
  ProductImageDraft,
  ProductVariantDraft,
} from "../shared/product-form-types";

export type ProductFormMode = "create" | "edit";

interface ProductFormProps {
  mode: ProductFormMode;
}

export function ProductForm({ mode }: ProductFormProps) {
  const router = useRouter();
  const createProduct = useCreateAdminProduct();

  const isCreate = mode === "create";

  // ============================================================
  // BASIC PRODUCT INFORMATION
  // ============================================================

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");

  // ============================================================
  // PRICING
  // ============================================================

  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");

  // ============================================================
  // ORGANIZATION
  // ============================================================

  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<ProductStatus>("draft");

  // ============================================================
  // LABELS
  // ============================================================

  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // ============================================================
  // SEO
  // ============================================================

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // ============================================================
  // IMAGES
  // ============================================================

  const [existingImages, setExistingImages] = useState<
    ExistingProductImage[]
  >([]);

  const [newImages, setNewImages] = useState<ProductImageDraft[]>([]);

  // ============================================================
  // VARIANTS
  // ============================================================

  const [variants, setVariants] = useState<ProductVariantDraft[]>([
    {
      id: crypto.randomUUID(),
      colorId: "",
      sku: "",
      stock: "",
      reservedStock: "0",
    },
  ]);

  // ============================================================
  // IMAGE HANDLERS
  // ============================================================

  function handleAddImages(files: File[]) {
    const drafts: ProductImageDraft[] = files.map((file) => ({
      id: crypto.randomUUID(),
      fileKey: `image_${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      isPrimary: false,
    }));

    setNewImages((current) => {
      const next = [...current, ...drafts];

      // If this is the first image, make it primary.
      if (
        current.length === 0 &&
        existingImages.length === 0 &&
        next.length > 0
      ) {
        next[0] = {
          ...next[0],
          isPrimary: true,
        };
      }

      return next;
    });
  }

  function handleRemoveNewImage(id: string) {
    setNewImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }

      const remaining = current.filter((item) => item.id !== id);

      // Ensure there is still a primary image.
      if (
        image?.isPrimary &&
        remaining.length > 0 &&
        existingImages.length === 0
      ) {
        remaining[0] = {
          ...remaining[0],
          isPrimary: true,
        };
      }

      return remaining;
    });
  }

  function handleSetNewPrimary(id: string) {
    setNewImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: image.id === id,
      })),
    );

    setExistingImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: false,
      })),
    );
  }

  function handleRemoveExistingImage(id: string) {
    setExistingImages((current) =>
      current.filter((image) => image.id !== id),
    );
  }

  function handleSetExistingPrimary(id: string) {
    setExistingImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: image.id === id,
      })),
    );

    setNewImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: false,
      })),
    );
  }

  // ============================================================
  // VARIANT HANDLERS
  // ============================================================

  function handleAddVariant() {
    setVariants((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        colorId: "",
        sku: "",
        stock: "",
        reservedStock: "0",
      },
    ]);
  }

  function handleUpdateVariant(
    id: string,
    updates: Partial<ProductVariantDraft>,
  ) {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              ...updates,
            }
          : variant,
      ),
    );
  }

  function handleRemoveVariant(id: string) {
    setVariants((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((variant) => variant.id !== id);
    });
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const productData = {
      name: name.trim(),
      slug: slug.trim(),
      sku: sku.trim(),
      description: description.trim(),

      categoryId,

      price: Number(price),
      compareAtPrice: compareAtPrice
        ? Number(compareAtPrice)
        : null,
      costPrice: costPrice ? Number(costPrice) : null,

      status,

      isFeatured,
      isNewArrival,
      isBestSeller,

      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,

      images: newImages.map((image, index) => ({
        fileKey: image.fileKey,
        position: index,
        isPrimary: image.isPrimary,
      })),

      variants: variants.map((variant) => ({
        colorId: variant.colorId,
        sku: variant.sku.trim(),
        stock: Number(variant.stock),
        reservedStock: Number(variant.reservedStock),
      })),
    };

    const formData = new FormData();

    formData.append(
      "productData",
      JSON.stringify(productData),
    );

    for (const image of newImages) {
      formData.append(
        image.fileKey,
        image.file,
        image.file.name,
      );
    }

    try {
      await createProduct.mutateAsync(formData);

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={isCreate ? "Add product" : "Edit product"}
        description={
          isCreate
            ? "Create a new product for your store."
            : "Update your product information, pricing and inventory."
        }
        action={
          <Link
            href="/admin/products"
            className="inline-flex h-10 items-center gap-2 rounded-xl border bg-card px-4 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to products
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}
          <div className="space-y-6">
            <ProductInformation
              name={name}
              slug={slug}
              sku={sku}
              description={description}
              onNameChange={setName}
              onSlugChange={setSlug}
              onSkuChange={setSku}
              onDescriptionChange={setDescription}
            />

            <ProductImages
              existingImages={existingImages}
              newImages={newImages}
              onAddImages={handleAddImages}
              onRemoveExistingImage={handleRemoveExistingImage}
              onRemoveNewImage={handleRemoveNewImage}
              onSetExistingPrimary={handleSetExistingPrimary}
              onSetNewPrimary={handleSetNewPrimary}
            />

            <ProductVariants
              variants={variants}
              onAdd={handleAddVariant}
              onUpdate={handleUpdateVariant}
              onRemove={handleRemoveVariant}
            />

            <ProductSEO
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              onMetaTitleChange={setMetaTitle}
              onMetaDescriptionChange={setMetaDescription}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <ProductPricing
              price={price}
              compareAtPrice={compareAtPrice}
              costPrice={costPrice}
              onPriceChange={setPrice}
              onCompareAtPriceChange={setCompareAtPrice}
              onCostPriceChange={setCostPrice}
            />

            <ProductOrganization
              categoryId={categoryId}
              status={status}
              onCategoryChange={setCategoryId}
              onStatusChange={setStatus}
            />

            <ProductLabels
              isFeatured={isFeatured}
              isNewArrival={isNewArrival}
              isBestSeller={isBestSeller}
              onFeaturedChange={setIsFeatured}
              onNewArrivalChange={setIsNewArrival}
              onBestSellerChange={setIsBestSeller}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="inline-flex h-11 items-center justify-center rounded-xl border bg-card px-5 text-sm font-medium transition hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={createProduct.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="size-4" />

            {createProduct.isPending
              ? "Creating..."
              : isCreate
                ? "Create product"
                : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
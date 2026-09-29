"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  useAdminProduct,
} from "@/lib/query/products/product-queries";
import {
  useUpdateAdminProduct,
} from "@/lib/query/products/product-mutations";
import type {
  ProductStatus,
} from "@/lib/query/products/product-types";

import { ProductCard } from "../shared/ProductCard";
import { ProductInformation } from "../shared/ProductInformation";
import { ProductPricing } from "../shared/ProductPricing";
import { ProductOrganization } from "../shared/ProductOrganization";
import { ProductImages } from "../shared/ProductImages";
import { ProductVariants } from "../shared/ProductVariants";
import { ProductLabels } from "../shared/ProductLabels";
import { ProductSEO } from "../shared/ProductSEO";

import type {
  ExistingProductImage,
  ProductImageDraft,
  ProductVariantDraft,
} from "../shared/product-form-types";

interface ProductEditFormProps {
  slug: string;
}

interface ProductFormState {
  name: string;
  slug: string;
  sku: string;
  description: string;
  categoryId: string;

  price: string;
  compareAtPrice: string;
  costPrice: string;

  status: ProductStatus;

  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;

  metaTitle: string;
  metaDescription: string;
}

function createLocalId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while saving the product.";
}

export function ProductEditForm({
  slug,
}: ProductEditFormProps) {
  const router = useRouter();

  const productQuery = useAdminProduct(slug);
  const updateProduct = useUpdateAdminProduct();

  const [form, setForm] = useState<ProductFormState | null>(
    null,
  );

  const [existingImages, setExistingImages] = useState<
    ExistingProductImage[]
  >([]);

  const [newImages, setNewImages] = useState<
    ProductImageDraft[]
  >([]);

  const [removedImageIds, setRemovedImageIds] = useState<
    string[]
  >([]);

  const [variants, setVariants] = useState<
    ProductVariantDraft[]
  >([]);

  const [removedVariantIds, setRemovedVariantIds] = useState<
    string[]
  >([]);

  const [formError, setFormError] = useState<string | null>(
    null,
  );

  const initializedSlug = useRef<string | null>(null);

  /*
   * Populate the form once the product is loaded.
   */
  useEffect(() => {
    const product = productQuery.data?.data;

    if (!product) {
      return;
    }

    if (initializedSlug.current === product.id) {
      return;
    }

    initializedSlug.current = product.id;

    setForm({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      categoryId: product.categoryId,

      price: product.price,
      compareAtPrice: product.compareAtPrice ?? "",
      costPrice: product.costPrice ?? "",

      status: product.status,

      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,

      metaTitle: product.metaTitle ?? "",
      metaDescription: product.metaDescription ?? "",
    });

    setExistingImages(
      [...product.images]
        .sort((a, b) => a.position - b.position)
        .map((image) => ({
          id: image.id,
          url: image.url,
          position: image.position,
          isPrimary: image.isPrimary,
        })),
    );

    setVariants(
      product.variants.map((variant) => ({
        id: variant.id,
        colorId: variant.colorId,
        sku: variant.sku,
        stock: String(variant.stock),
        reservedStock: String(variant.reservedStock),
      })),
    );

    setNewImages([]);
    setRemovedImageIds([]);
    setRemovedVariantIds([]);
  }, [productQuery.data]);

  /*
   * Revoke local image previews when the component unmounts.
   */
  const newImagesRef = useRef<ProductImageDraft[]>([]);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      newImagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  function updateFormField<K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) {
    setForm((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  function handleAddImages(files: File[]) {
    const validFiles = files.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validFiles.length === 0) {
      return;
    }

    const hasPrimary =
      existingImages.some((image) => image.isPrimary) ||
      newImages.some((image) => image.isPrimary);

    const images: ProductImageDraft[] = validFiles.map(
      (file, index) => ({
        id: createLocalId("image"),
        fileKey: createLocalId("file"),
        file,
        previewUrl: URL.createObjectURL(file),
        isPrimary: !hasPrimary && index === 0,
      }),
    );

    setNewImages((current) => [...current, ...images]);
  }

  function handleRemoveExistingImage(id: string) {
    const image = existingImages.find(
      (item) => item.id === id,
    );

    if (!image) {
      return;
    }

    setExistingImages((current) => {
      const next = current.filter((item) => item.id !== id);

      if (image.isPrimary && next.length > 0) {
        next[0] = {
          ...next[0],
          isPrimary: true,
        };
      }

      return next;
    });

    setNewImages((current) => {
      if (
        image.isPrimary &&
        current.length > 0
      ) {
        const alreadyHasPrimary = current.some(
          (item) => item.isPrimary,
        );

        if (!alreadyHasPrimary) {
          return current.map((item, index) =>
            index === 0
              ? { ...item, isPrimary: true }
              : item,
          );
        }
      }

      return current;
    });

    setRemovedImageIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  function handleRemoveNewImage(id: string) {
    const image = newImages.find(
      (item) => item.id === id,
    );

    if (!image) {
      return;
    }

    URL.revokeObjectURL(image.previewUrl);

    setNewImages((current) => {
      const next = current.filter(
        (item) => item.id !== id,
      );

      if (image.isPrimary && next.length > 0) {
        const existingHasPrimary = existingImages.some(
          (item) => item.isPrimary,
        );

        if (!existingHasPrimary) {
          next[0] = {
            ...next[0],
            isPrimary: true,
          };
        }
      }

      return next;
    });
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

  function handleSetNewPrimary(id: string) {
    setExistingImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: false,
      })),
    );

    setNewImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: image.id === id,
      })),
    );
  }

  function handleAddVariant() {
    setVariants((current) => [
      ...current,
      {
        id: createLocalId("variant"),
        colorId: "",
        sku: "",
        stock: "0",
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
    const variant = variants.find(
      (item) => item.id === id,
    );

    if (!variant || variants.length === 1) {
      return;
    }

    setVariants((current) =>
      current.filter((item) => item.id !== id),
    );

    /*
     * Existing variants have UUID-like IDs from the database.
     * New variants use our local "variant_" ID.
     */
    if (!id.startsWith("variant_")) {
      setRemovedVariantIds((current) =>
        current.includes(id)
          ? current
          : [...current, id],
      );
    }
  }

  function validateForm(): string | null {
    if (!form) {
      return "Product information has not loaded yet.";
    }

    if (form.name.trim().length < 2) {
      return "Product name must be at least 2 characters.";
    }

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        form.slug.trim(),
      )
    ) {
      return "Slug must contain only lowercase letters, numbers and hyphens.";
    }

    if (!form.sku.trim()) {
      return "Product SKU is required.";
    }

    if (form.description.trim().length < 10) {
      return "Product description must be at least 10 characters.";
    }

    if (!form.categoryId) {
      return "Please select a category.";
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      return "Please enter a valid selling price.";
    }

    if (form.compareAtPrice.trim()) {
      const compareAtPrice = Number(
        form.compareAtPrice,
      );

      if (
        !Number.isFinite(compareAtPrice) ||
        compareAtPrice < price
      ) {
        return "Compare-at price must be greater than or equal to the selling price.";
      }
    }

    if (form.costPrice.trim()) {
      const costPrice = Number(form.costPrice);

      if (!Number.isFinite(costPrice) || costPrice < 0) {
        return "Please enter a valid cost price.";
      }
    }

    const allImages = [
      ...existingImages,
      ...newImages,
    ];

    if (allImages.length === 0) {
      return "A product must have at least one image.";
    }

    const primaryImages = allImages.filter(
      (image) => image.isPrimary,
    );

    if (primaryImages.length !== 1) {
      return "Please select exactly one primary image.";
    }

    if (variants.length === 0) {
      return "A product must have at least one variant.";
    }

    const colorIds = variants
      .map((variant) => variant.colorId)
      .filter(Boolean);

    if (colorIds.length !== variants.length) {
      return "Every variant must have a color.";
    }

    if (new Set(colorIds).size !== colorIds.length) {
      return "Each color can only be used once.";
    }

    for (const variant of variants) {
      if (!variant.sku.trim()) {
        return "Every variant must have a SKU.";
      }

      const stock = Number(variant.stock);
      const reservedStock = Number(
        variant.reservedStock,
      );

      if (!Number.isInteger(stock) || stock < 0) {
        return "Variant stock must be a whole number greater than or equal to 0.";
      }

      if (
        !Number.isInteger(reservedStock) ||
        reservedStock < 0
      ) {
        return "Reserved stock must be a whole number greater than or equal to 0.";
      }

      if (reservedStock > stock) {
        return "Reserved stock cannot be greater than stock.";
      }
    }

    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form || updateProduct.isPending) {
      return;
    }

    setFormError(null);

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const price = Number(form.price);

    const productData = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      sku: form.sku.trim(),
      description: form.description.trim(),

      categoryId: form.categoryId,

      price,

      compareAtPrice: form.compareAtPrice.trim()
        ? Number(form.compareAtPrice)
        : null,

      costPrice: form.costPrice.trim()
        ? Number(form.costPrice)
        : null,

      status: form.status,

      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,

      metaTitle: form.metaTitle.trim() || null,
      metaDescription:
        form.metaDescription.trim() || null,

      images: [
        ...existingImages.map((image, index) => ({
          id: image.id,
          position: index,
          isPrimary: image.isPrimary,
        })),

        ...newImages.map((image, index) => ({
          fileKey: image.fileKey,
          position: existingImages.length + index,
          isPrimary: image.isPrimary,
        })),
      ],

      removedImageIds,

      variants: variants.map((variant) => ({
        ...(variant.id.startsWith("variant_")
          ? {}
          : { id: variant.id }),

        colorId: variant.colorId,
        sku: variant.sku.trim(),
        stock: Number(variant.stock),
        reservedStock: Number(
          variant.reservedStock,
        ),
      })),

      removedVariantIds,
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
      await updateProduct.mutateAsync({
        slug,
        formData,
      });

      router.push("/admin/products");
    } catch (error) {
      setFormError(getErrorMessage(error));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /*
   * Loading state
   */
  if (productQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="size-7 animate-spin text-accent" />

          <div>
            <p className="text-sm font-medium">
              Loading product
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Preparing the product information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (productQuery.isError || !productQuery.data?.data) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to products
        </Link>

        <div className="rounded-2xl border bg-card p-8 text-center">
          <h1 className="font-serif text-2xl">
            Product not found
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            We couldn't load this product. It may have been
            removed or the URL may be incorrect.
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to products
          </Link>

          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Edit product
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Update your product information, images, variants
            and inventory.
          </p>
        </div>

        <div className="hidden sm:block">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium">
            <CheckCircle2 className="size-3.5 text-accent" />
            Editing existing product
          </span>
        </div>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <ProductCard
            title="Product information"
            description="Basic information customers will see about this product."
          >
            <ProductInformation
              name={form.name}
              slug={form.slug}
              sku={form.sku}
              description={form.description}
              onNameChange={(value) =>
                updateFormField("name", value)
              }
              onSlugChange={(value) =>
                updateFormField("slug", value)
              }
              onSkuChange={(value) =>
                updateFormField("sku", value)
              }
              onDescriptionChange={(value) =>
                updateFormField(
                  "description",
                  value,
                )
              }
            />
          </ProductCard>

          <ProductImages
            existingImages={existingImages}
            newImages={newImages}
            onAddImages={handleAddImages}
            onRemoveExistingImage={
              handleRemoveExistingImage
            }
            onRemoveNewImage={handleRemoveNewImage}
            onSetExistingPrimary={
              handleSetExistingPrimary
            }
            onSetNewPrimary={handleSetNewPrimary}
          />

          <ProductVariants
            variants={variants}
            onAdd={handleAddVariant}
            onUpdate={handleUpdateVariant}
            onRemove={handleRemoveVariant}
          />

          <ProductCard
            title="Search engine optimization"
            description="Optional metadata for search engines."
          >
            <ProductSEO
              metaTitle={form.metaTitle}
              metaDescription={
                form.metaDescription
              }
              onMetaTitleChange={(value) =>
                updateFormField(
                  "metaTitle",
                  value,
                )
              }
              onMetaDescriptionChange={(value) =>
                updateFormField(
                  "metaDescription",
                  value,
                )
              }
            />
          </ProductCard>
        </div>

        <div className="space-y-6">
          <ProductCard
            title="Pricing"
            description="Set the product's pricing."
          >
            <ProductPricing
              price={form.price}
              compareAtPrice={
                form.compareAtPrice
              }
              costPrice={form.costPrice}
              onPriceChange={(value) =>
                updateFormField(
                  "price",
                  value,
                )
              }
              onCompareAtPriceChange={(value) =>
                updateFormField(
                  "compareAtPrice",
                  value,
                )
              }
              onCostPriceChange={(value) =>
                updateFormField(
                  "costPrice",
                  value,
                )
              }
            />
          </ProductCard>

          <ProductCard
            title="Organization"
            description="Control where and how this product appears."
          >
            <ProductOrganization
              categoryId={form.categoryId}
              status={form.status}
              onCategoryChange={(value) =>
                updateFormField(
                  "categoryId",
                  value,
                )
              }
              onStatusChange={(value) =>
                updateFormField(
                  "status",
                  value,
                )
              }
            />
          </ProductCard>

          <ProductCard
            title="Product labels"
            description="Highlight this product in your store."
          >
            <ProductLabels
              isFeatured={form.isFeatured}
              isNewArrival={form.isNewArrival}
              isBestSeller={form.isBestSeller}
              onFeaturedChange={(value) =>
                updateFormField(
                  "isFeatured",
                  value,
                )
              }
              onNewArrivalChange={(value) =>
                updateFormField(
                  "isNewArrival",
                  value,
                )
              }
              onBestSellerChange={(value) =>
                updateFormField(
                  "isBestSeller",
                  value,
                )
              }
            />
          </ProductCard>

          <ProductCard
            title="Save changes"
            description="Your changes will be applied to the product."
            className="xl:sticky xl:top-6"
          >
            <div className="space-y-3">
              <button
                type="submit"
                disabled={updateProduct.isPending}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateProduct.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save changes
                  </>
                )}
              </button>

              <Link
                href="/admin/products"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border bg-background px-4 text-sm font-medium transition hover:bg-muted"
              >
                Cancel
              </Link>
            </div>
          </ProductCard>
        </div>
      </div>
    </form>
  );
}
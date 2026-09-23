import { NextRequest } from "next/server";

import { eq, isNull } from "drizzle-orm";

import { products, productImages, productVariants } from "@/db/schema";

import { db } from "@/db/drizzle";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

import { uploadImageToCloudinary } from "@/lib/cloudinary/upload";

import { deleteImageFromCloudinary } from "@/lib/cloudinary/delete";

import { updateProductSchema } from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

// ============================================================
// IMAGE VALIDATION
// ============================================================

const VALID_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];

function isValidImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) {
    return true;
  }

  const fileName = file.name.toLowerCase();

  return VALID_IMAGE_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension),
  );
}

// ============================================================
// PATCH
// ============================================================

export async function PATCH(req: NextRequest, context: RouteContext) {
  const uploadedPublicIds: string[] = [];

  const imagesToDelete: string[] = [];

  try {
    await requireAdmin();

    // ========================================================
    // PARAMS
    // ========================================================

    const { slug } = await context.params;

    if (!slug) {
      throw new ApiError("Product slug is required", 400);
    }

    // ========================================================
    // FIND PRODUCT
    // ========================================================

    const existingProduct = await db.query.products.findFirst({
      where: {
        slug,
      },

      with: {
        images: true,

        variants: true,
      },
    });

    if (!existingProduct) {
      throw new ApiError("Product not found", 404);
    }

    // ========================================================
    // DO NOT UPDATE SOFT-DELETED PRODUCTS
    // ========================================================

    if (existingProduct.deletedAt) {
      throw new ApiError(
        "This product has been deleted and cannot be updated",
        400,
      );
    }

    // ========================================================
    // FORM DATA
    // ========================================================

    const formData = await req.formData();

    const productDataField = formData.get("productData");

    if (typeof productDataField !== "string") {
      throw new ApiError("Product data is required", 400);
    }

    // ========================================================
    // PARSE JSON
    // ========================================================

    let parsedProductData: unknown;

    try {
      parsedProductData = JSON.parse(productDataField);
    } catch {
      throw new ApiError("Invalid product data JSON", 400);
    }

    // ========================================================
    // VALIDATE
    // ========================================================

    const input = updateProductSchema.parse(parsedProductData);

    // ========================================================
    // UPLOAD NEW IMAGES
    // ========================================================

    const uploadedImages: UploadedImage[] = [];

    if (input.images) {
      for (const image of input.images) {
        // Existing image
        if (image.id) {
          continue;
        }

        // New image must have fileKey
        if (!image.fileKey) {
          throw new ApiError("New images require a file key", 400);
        }

        const file = formData.get(image.fileKey);

        if (!(file instanceof File)) {
          throw new ApiError(
            `Image file "${image.fileKey}" was not provided`,
            400,
          );
        }

        if (!isValidImageFile(file)) {
          throw new ApiError(`"${file.name}" is not a valid image`, 400);
        }

        const uploaded = await uploadImageToCloudinary(
          file,
          "shoppfd/products",
        );

        uploadedPublicIds.push(uploaded.publicId);

        uploadedImages.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
        });
      }
    }

    // ========================================================
    // DATABASE TRANSACTION
    // ========================================================

    const updatedProduct = await db.transaction(async (tx) => {
      // ==================================================
      // PRODUCT VALUES
      // ==================================================

      const productValues: Partial<typeof products.$inferInsert> = {};

      if (input.name !== undefined) {
        productValues.name = input.name;
      }

      if (input.slug !== undefined) {
        productValues.slug = input.slug;
      }

      if (input.sku !== undefined) {
        productValues.sku = input.sku;
      }

      if (input.description !== undefined) {
        productValues.description = input.description;
      }

      if (input.categoryId !== undefined) {
        productValues.categoryId = input.categoryId;
      }

      if (input.price !== undefined) {
        productValues.price = String(input.price);
      }

      if (input.compareAtPrice !== undefined) {
        productValues.compareAtPrice =
          input.compareAtPrice === null ? null : String(input.compareAtPrice);
      }

      if (input.costPrice !== undefined) {
        productValues.costPrice =
          input.costPrice === null ? null : String(input.costPrice);
      }

      if (input.status !== undefined) {
        productValues.status = input.status;
      }

      if (input.isFeatured !== undefined) {
        productValues.isFeatured = input.isFeatured;
      }

      if (input.isNewArrival !== undefined) {
        productValues.isNewArrival = input.isNewArrival;
      }

      if (input.isBestSeller !== undefined) {
        productValues.isBestSeller = input.isBestSeller;
      }

      if (input.metaTitle !== undefined) {
        productValues.metaTitle = input.metaTitle;
      }

      if (input.metaDescription !== undefined) {
        productValues.metaDescription = input.metaDescription;
      }

      // ==================================================
      // UPDATE PRODUCT
      // ==================================================

      if (Object.keys(productValues).length > 0) {
        await tx
          .update(products)
          .set({
            ...productValues,

            updatedAt: new Date(),
          })
          .where(eq(products.id, existingProduct.id));
      }

      // ==================================================
      // REMOVE IMAGES
      // ==================================================

      for (const imageId of input.removedImageIds) {
        const image = existingProduct.images.find(
          (item) => item.id === imageId,
        );

        if (!image) {
          continue;
        }

        imagesToDelete.push(image.publicId);

        await tx.delete(productImages).where(eq(productImages.id, imageId));
      }

      // ==================================================
      // UPDATE EXISTING IMAGES
      // ==================================================

      if (input.images) {
        for (const image of input.images) {
          if (!image.id) {
            continue;
          }

          if (input.removedImageIds.includes(image.id)) {
            continue;
          }

          const existingImage = existingProduct.images.find(
            (item) => item.id === image.id,
          );

          if (!existingImage) {
            throw new ApiError(
              `Image ${image.id} does not belong to this product`,
              400,
            );
          }

          await tx
            .update(productImages)
            .set({
              position: image.position ?? existingImage.position,

              isPrimary: image.isPrimary ?? existingImage.isPrimary,
            })
            .where(eq(productImages.id, image.id));
        }
      }

      // ==================================================
      // INSERT NEW IMAGES
      // ==================================================

      if (uploadedImages.length > 0) {
        let newImageIndex = 0;

        for (const image of input.images ?? []) {
          if (image.id) {
            continue;
          }

          const uploaded = uploadedImages[newImageIndex];

          if (!uploaded) {
            continue;
          }

          await tx.insert(productImages).values({
            productId: existingProduct.id,

            url: uploaded.url,

            publicId: uploaded.publicId,

            position:
              image.position ?? existingProduct.images.length + newImageIndex,

            isPrimary: image.isPrimary ?? false,
          });

          newImageIndex++;
        }
      }

      // ==================================================
      // REMOVE VARIANTS
      // ==================================================

      for (const variantId of input.removedVariantIds) {
        const variant = existingProduct.variants.find(
          (item) => item.id === variantId,
        );

        if (!variant) {
          continue;
        }

        await tx
          .delete(productVariants)
          .where(eq(productVariants.id, variantId));
      }

      // ==================================================
      // UPDATE / CREATE VARIANTS
      // ==================================================

      if (input.variants) {
        for (const variant of input.variants) {
          // --------------------------------------------
          // EXISTING VARIANT
          // --------------------------------------------

          if (variant.id) {
            if (input.removedVariantIds.includes(variant.id)) {
              continue;
            }

            const existingVariant = existingProduct.variants.find(
              (item) => item.id === variant.id,
            );

            if (!existingVariant) {
              throw new ApiError(
                `Variant ${variant.id} does not belong to this product`,
                400,
              );
            }

            await tx
              .update(productVariants)
              .set({
                colorId: variant.colorId,

                sku: variant.sku,

                stock: variant.stock,

                reservedStock: variant.reservedStock ?? 0,

                updatedAt: new Date(),
              })
              .where(eq(productVariants.id, variant.id));

            continue;
          }

          // --------------------------------------------
          // NEW VARIANT
          // --------------------------------------------

          await tx.insert(productVariants).values({
            productId: existingProduct.id,

            colorId: variant.colorId,

            sku: variant.sku,

            stock: variant.stock,

            reservedStock: variant.reservedStock ?? 0,
          });
        }
      }

      // ==================================================
      // GET UPDATED PRODUCT
      // ==================================================

      const product = await tx.query.products.findFirst({
        where: {
          id: existingProduct.id,
        },

        with: {
          category: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },

          images: {
            orderBy: {
              position: "asc",
            },
          },

          variants: {
            with: {
              color: true,
            },
          },
        },
      });

      if (!product) {
        throw new ApiError("Updated product could not be found", 500);
      }

      // ==================================================
      // FINAL SAFETY CHECK
      // ==================================================

      if (product.images.length === 0) {
        throw new ApiError("A product must have at least one image", 400);
      }

      if (product.variants.length === 0) {
        throw new ApiError(
          "A product must have at least one color variant",
          400,
        );
      }

      const primaryImages = product.images.filter((image) => image.isPrimary);

      if (primaryImages.length > 1) {
        throw new ApiError("A product can only have one primary image", 400);
      }

      for (const variant of product.variants) {
        if (variant.reservedStock > variant.stock) {
          throw new ApiError(
            "Reserved stock cannot be greater than stock",
            400,
          );
        }
      }

      return product;
    });

    // ========================================================
    // DELETE REMOVED CLOUDINARY IMAGES
    // ========================================================

    await Promise.allSettled(
      imagesToDelete.map((publicId) => deleteImageFromCloudinary(publicId)),
    );

    // ========================================================
    // SUCCESS
    // ========================================================

    return Response.json({
      success: true,

      data: updatedProduct,

      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/admin/products/[slug] error:", error);

    // ========================================================
    // CLEANUP NEWLY UPLOADED IMAGES
    // ========================================================

    await Promise.allSettled(
      uploadedPublicIds.map((publicId) => deleteImageFromCloudinary(publicId)),
    );

    return handleApiError(error);
  }
}

// ============================================================
// DELETE
// ============================================================

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();

    // ========================================================
    // PARAMS
    // ========================================================

    const { slug } = await context.params;

    if (!slug) {
      throw new ApiError("Product slug is required", 400);
    }

    // ========================================================
    // FIND PRODUCT
    // ========================================================

    const product = await db.query.products.findFirst({
      where: {
        slug,
      },

      with: {
        images: true,
      },
    });

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    // ========================================================
    // CHECK ALREADY DELETED
    // ========================================================

    if (product.deletedAt) {
      throw new ApiError("Product has already been deleted", 400);
    }

    // ========================================================
    // SOFT DELETE
    // ========================================================

    await db
      .update(products)
      .set({
        deletedAt: new Date(),

        status: "archived",

        updatedAt: new Date(),
      })
      .where(eq(products.id, product.id));

    // ========================================================
    // SUCCESS
    // ========================================================

    return Response.json({
      success: true,

      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[slug] error:", error);

    return handleApiError(error);
  }
}

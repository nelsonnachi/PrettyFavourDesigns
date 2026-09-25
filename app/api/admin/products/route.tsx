import { NextRequest } from "next/server";

import {
  and,
  asc,
  desc,
  eq,
  exists,
  gte,
  ilike,
  isNull,
  lte,
  notExists,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { products, productImages, productVariants } from "@/db/schema";

import { db } from "@/db/drizzle";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

import { uploadImageToCloudinary } from "@/lib/cloudinary/upload";

import { deleteImageFromCloudinary } from "@/lib/cloudinary/delete";

import { createProductSchema, productFiltersSchema } from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

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
// GET /api/admin/products
// ============================================================

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    const query = productFiltersSchema.parse({
      ...searchParams,

      page: searchParams.page ? Number(searchParams.page) : undefined,

      limit: searchParams.limit ? Number(searchParams.limit) : undefined,

      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,

      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined,

      inStock:
        searchParams.inStock === undefined
          ? undefined
          : searchParams.inStock === "true",

      isFeatured:
        searchParams.isFeatured === undefined
          ? undefined
          : searchParams.isFeatured === "true",

      isNewArrival:
        searchParams.isNewArrival === undefined
          ? undefined
          : searchParams.isNewArrival === "true",

      isBestSeller:
        searchParams.isBestSeller === undefined
          ? undefined
          : searchParams.isBestSeller === "true",
    });

    const offset = (query.page - 1) * query.limit;

    // ========================================================
    // BUILD FILTER CONDITIONS
    // ========================================================

    const conditions: SQL[] = [];

    // --------------------------------------------------------
    // ONLY SHOW PRODUCTS THAT ARE NOT SOFT DELETED
    // --------------------------------------------------------

    conditions.push(isNull(products.deletedAt));

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (query.status) {
      conditions.push(eq(products.status, query.status));
    }

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    if (query.search) {
      const searchCondition = or(
        ilike(products.name, `%${query.search}%`),

        ilike(products.description, `%${query.search}%`),

        ilike(products.sku, `%${query.search}%`),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (query.categoryId) {
      conditions.push(eq(products.categoryId, query.categoryId));
    }

    // --------------------------------------------------------
    // COLOR
    // --------------------------------------------------------
    //
    // A product matches when it has the selected color.
    //
    // IMPORTANT:
    // This is done in PostgreSQL BEFORE pagination.
    //
    // --------------------------------------------------------

    if (query.colorId) {
      const colorExists = exists(
        db
          .select({
            id: productVariants.id,
          })
          .from(productVariants)
          .where(
            and(
              eq(productVariants.productId, products.id),

              eq(productVariants.colorId, query.colorId),
            ),
          ),
      );

      conditions.push(colorExists);
    }

    // --------------------------------------------------------
    // PRICE
    // --------------------------------------------------------

    if (query.minPrice !== undefined) {
      conditions.push(gte(products.price, String(query.minPrice)));
    }

    if (query.maxPrice !== undefined) {
      conditions.push(lte(products.price, String(query.maxPrice)));
    }

    // --------------------------------------------------------
    // FEATURED
    // --------------------------------------------------------

    if (query.isFeatured) {
      conditions.push(eq(products.isFeatured, true));
    }

    // --------------------------------------------------------
    // NEW ARRIVAL
    // --------------------------------------------------------

    if (query.isNewArrival) {
      conditions.push(eq(products.isNewArrival, true));
    }

    // --------------------------------------------------------
    // BEST SELLER
    // --------------------------------------------------------

    if (query.isBestSeller) {
      conditions.push(eq(products.isBestSeller, true));
    }

    // --------------------------------------------------------
    // IN STOCK
    // --------------------------------------------------------
    //
    // A product is in stock when at least one color has:
    //
    // stock > reservedStock
    //
    // This is also handled inside PostgreSQL BEFORE
    // pagination and counting.
    //
    // --------------------------------------------------------

    if (query.inStock === true) {
      const stockExists = exists(
        db
          .select({
            id: productVariants.id,
          })
          .from(productVariants)
          .where(
            and(
              eq(productVariants.productId, products.id),

              sql`
                ${productVariants.stock}
                >
                ${productVariants.reservedStock}
              `,
            ),
          ),
      );

      conditions.push(stockExists);
    }

    if (query.inStock === false) {
      const stockDoesNotExist = notExists(
        db
          .select({
            id: productVariants.id,
          })
          .from(productVariants)
          .where(
            and(
              eq(productVariants.productId, products.id),

              sql`
                ${productVariants.stock}
                >
                ${productVariants.reservedStock}
              `,
            ),
          ),
      );

      conditions.push(stockDoesNotExist);
    }

    // ========================================================
    // FINAL WHERE CONDITION
    // ========================================================

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // ========================================================
    // ORDER BY
    // ========================================================

    let orderBy: SQL;

    switch (query.sort) {
      case "oldest":
        orderBy = asc(products.createdAt);
        break;

      case "price_asc":
        orderBy = asc(products.price);
        break;

      case "price_desc":
        orderBy = desc(products.price);
        break;

      case "name_asc":
        orderBy = asc(products.name);
        break;

      case "name_desc":
        orderBy = desc(products.name);
        break;

      case "rating":
        orderBy = desc(products.averageRating);
        break;

      case "best_selling":
        orderBy = desc(products.soldCount);
        break;

      case "newest":
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    // ========================================================
    // PRODUCT QUERY
    // ========================================================

    const productRows = await db
      .select()
      .from(products)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(offset);

    // ========================================================
    // LOAD RELATIONS
    // ========================================================

    const rows = [];

    for (const product of productRows) {
      const productWithRelations = await db.query.products.findFirst({
        where: {
          id: product.id,
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

      if (productWithRelations) {
        rows.push(productWithRelations);
      }
    }

    // ========================================================
    // COUNT
    // ========================================================
    //
    // IMPORTANT:
    // The count uses the EXACT same filters as the main query.
    //
    // ========================================================

    const total = await db.$count(products, whereCondition);

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: rows,

      pagination: {
        page: query.page,

        limit: query.limit,

        total,

        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);

    return handleApiError(error);
  }
}

// ============================================================
// POST /api/admin/products
// ============================================================

export async function POST(req: NextRequest) {
  const uploadedPublicIds: string[] = [];

  try {
    await requireAdmin();

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

    const input = createProductSchema.parse(parsedProductData);

    // ========================================================
    // UPLOAD PRODUCT IMAGES
    // ========================================================

    const uploadedImages: UploadedImage[] = [];

    for (const image of input.images) {
      if (!image.fileKey) {
        throw new ApiError("New product images require a file key", 400);
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

      const uploaded = await uploadImageToCloudinary(file, "shoppfd/products");

      uploadedPublicIds.push(uploaded.publicId);

      uploadedImages.push({
        url: uploaded.url,
        publicId: uploaded.publicId,
      });
    }

    // ========================================================
    // CREATE PRODUCT
    // ========================================================

    const createdProduct = await db.transaction(async (tx) => {
      // ----------------------------------------------------
      // PRODUCT
      // ----------------------------------------------------

      const [product] = await tx
        .insert(products)
        .values({
          name: input.name,

          slug: input.slug,

          sku: input.sku,

          description: input.description,

          categoryId: input.categoryId,

          price: String(input.price),

          compareAtPrice:
            input.compareAtPrice !== undefined && input.compareAtPrice !== null
              ? String(input.compareAtPrice)
              : undefined,

          costPrice:
            input.costPrice !== undefined && input.costPrice !== null
              ? String(input.costPrice)
              : undefined,

          status: input.status ?? "draft",

          isFeatured: input.isFeatured ?? false,

          isNewArrival: input.isNewArrival ?? false,

          isBestSeller: input.isBestSeller ?? false,

          metaTitle: input.metaTitle,

          metaDescription: input.metaDescription,
        })
        .returning();

      if (!product) {
        throw new ApiError("Product creation failed", 500);
      }

      // ----------------------------------------------------
      // PRODUCT IMAGES
      // ----------------------------------------------------

      await tx.insert(productImages).values(
        uploadedImages.map((image, index) => ({
          productId: product.id,

          url: image.url,

          publicId: image.publicId,

          position: index,

          isPrimary: input.images[index]?.isPrimary ?? index === 0,
        })),
      );

      // ----------------------------------------------------
      // PRODUCT COLOR VARIANTS
      // ----------------------------------------------------

      await tx.insert(productVariants).values(
        input.variants.map((variant) => ({
          productId: product.id,

          colorId: variant.colorId,

          sku: variant.sku,

          stock: variant.stock,

          reservedStock: variant.reservedStock ?? 0,
        })),
      );

      return product;
    });

    // ========================================================
    // SUCCESS
    // ========================================================

    return Response.json(
      {
        success: true,

        data: createdProduct,

        message: "Product created successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/admin/products error:", error);

    // ========================================================
    // CLEANUP CLOUDINARY
    // ========================================================

    await Promise.allSettled(
      uploadedPublicIds.map((publicId) => deleteImageFromCloudinary(publicId)),
    );

    console.error("POST /api/admin/products error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}

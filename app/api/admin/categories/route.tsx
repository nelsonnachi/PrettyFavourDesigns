import {
  NextRequest,
  NextResponse,
} from "next/server";

import { db } from "@/db/drizzle";

import { categories } from "@/db/schema/categories";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  createCategorySchema,
} from "@/lib/validations";

import { requireAdmin } from "@/lib/APIs/auth";

// ============================================================
// GET ALL CATEGORIES - ADMIN
// ============================================================

export async function GET() {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is an admin
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // 2. Get all categories
    // --------------------------------------------------------

    const result =
      await db.query.categories.findMany({
        columns: {
          id: true,
          name: true,
          slug: true,
          description: true,
          position: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },

        orderBy: {
          position: "asc",
        },
      });

    return NextResponse.json({
      success: true,

      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// CREATE CATEGORY - ADMIN
// ============================================================

export async function POST(
  request: NextRequest,
) {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is an admin
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // 2. Read request body
    // --------------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------------
    // 3. Validate request body
    // --------------------------------------------------------

    const data =
      createCategorySchema.parse(body);

    // --------------------------------------------------------
    // 4. Check if category name already exists
    // --------------------------------------------------------

    const existingName =
      await db.query.categories.findFirst({
        where: {
          name: data.name,
        },

        columns: {
          id: true,
        },
      });

    if (existingName) {
      throw new ApiError(
        "A category with this name already exists",
        409,
      );
    }

    // --------------------------------------------------------
    // 5. Check if category slug already exists
    // --------------------------------------------------------

    const existingSlug =
      await db.query.categories.findFirst({
        where: {
          slug: data.slug,
        },

        columns: {
          id: true,
        },
      });

    if (existingSlug) {
      throw new ApiError(
        "A category with this slug already exists",
        409,
      );
    }

    // --------------------------------------------------------
    // 6. Create category
    // --------------------------------------------------------

    const result =
      await db
        .insert(categories)
        .values({
          name: data.name,
          slug: data.slug,
          description:
            data.description,
          position:
            data.position ?? 0,
          isActive:
            data.isActive ?? true,
        })
        .returning();

    const newCategory = result[0];

    if (!newCategory) {
      throw new ApiError(
        "Failed to create category",
        500,
      );
    }

    // --------------------------------------------------------
    // 7. Return created category
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Category created successfully",

        data: newCategory,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  categorySlugParamSchema,
} from "@/lib/validations";

// ============================================================
// GET SINGLE CATEGORY
// ============================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      slug: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Get route parameters
    // --------------------------------------------------------

    const params = await context.params;

    const { slug } =
      categorySlugParamSchema.parse(params);

    // --------------------------------------------------------
    // 2. Find active category
    // --------------------------------------------------------

    const category =
      await db.query.categories.findFirst({
        where: {
          slug,
          isActive: true,
        },

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
      });

    // --------------------------------------------------------
    // 3. Make sure category exists
    // --------------------------------------------------------

    if (!category) {
      throw new ApiError(
        "Category not found",
        404,
      );
    }

    // --------------------------------------------------------
    // 4. Return category
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: category,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { db } from "@/db/drizzle";
import { colors } from "@/db/schema/colors";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

import {
  createColorSchema,
} from "@/lib/validations";

// ============================================================
// GET ALL COLORS - ADMIN
// ============================================================

export async function GET() {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is an admin
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // 2. Get all colors
    // --------------------------------------------------------
    // Latest Drizzle relational query syntax.
    // --------------------------------------------------------

    const result =
      await db.query.colors.findMany({
        columns: {
          id: true,
          name: true,
          hexCode: true,
          isActive: true,
          createdAt: true,
        },

        orderBy: {
          name: "asc",
        },
      });

    // --------------------------------------------------------
    // 3. Return colors
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// CREATE COLOR - ADMIN
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

    const body =
      await request.json();

    // --------------------------------------------------------
    // 3. Validate request body
    // --------------------------------------------------------

    const data =
      createColorSchema.parse(body);

    // --------------------------------------------------------
    // 4. Check duplicate color name
    // --------------------------------------------------------
    // RQB v2:
    //
    // where is an object.
    // --------------------------------------------------------

    const existingColor =
      await db.query.colors.findFirst({
        where: {
          name: data.name,
        },

        columns: {
          id: true,
        },
      });

    if (existingColor) {
      throw new ApiError(
        "A color with this name already exists",
        409,
      );
    }

    // --------------------------------------------------------
    // 5. Create color
    // --------------------------------------------------------

    const result =
      await db
        .insert(colors)
        .values({
          name: data.name,
          hexCode: data.hexCode,
          isActive:
            data.isActive ?? true,
        })
        .returning();

    const createdColor =
      result[0];

    // --------------------------------------------------------
    // 6. Make sure creation succeeded
    // --------------------------------------------------------

    if (!createdColor) {
      throw new ApiError(
        "Failed to create color",
        500,
      );
    }

    // --------------------------------------------------------
    // 7. Return created color
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Color created successfully",

        data: createdColor,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
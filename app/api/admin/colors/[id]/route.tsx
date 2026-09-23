import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { colors } from "@/db/schema/colors";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

import { updateColorSchema, colorIdParamSchema } from "@/lib/validations";

// ============================================================
// GET SINGLE COLOR - ADMIN
// ============================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is an admin
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // 2. Get and validate color ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } = colorIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Find color
    // --------------------------------------------------------
    // Latest Drizzle relational query syntax.
    // --------------------------------------------------------

    const color = await db.query.colors.findFirst({
      where: {
        id,
      },

      columns: {
        id: true,
        name: true,
        hexCode: true,
        isActive: true,
        createdAt: true,
      },
    });

    // --------------------------------------------------------
    // 4. Make sure color exists
    // --------------------------------------------------------

    if (!color) {
      throw new ApiError("Color not found", 404);
    }

    // --------------------------------------------------------
    // 5. Return color
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: color,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// UPDATE COLOR - ADMIN
// ============================================================

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is an admin
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // 2. Get and validate color ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } = colorIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Make sure color exists
    // --------------------------------------------------------

    const existingColor = await db.query.colors.findFirst({
      where: {
        id,
      },

      columns: {
        id: true,
        name: true,
        hexCode: true,
        isActive: true,
      },
    });

    if (!existingColor) {
      throw new ApiError("Color not found", 404);
    }

    // --------------------------------------------------------
    // 4. Read request body
    // --------------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------------
    // 5. Validate request body
    // --------------------------------------------------------

    const data = updateColorSchema.parse(body);

    // --------------------------------------------------------
    // 6. Make sure something was provided
    // --------------------------------------------------------

    if (Object.keys(data).length === 0) {
      throw new ApiError("At least one field is required", 400);
    }

    // --------------------------------------------------------
    // 7. Check duplicate color name
    // --------------------------------------------------------

    if (data.name) {
      const duplicateColor = await db.query.colors.findFirst({
        where: {
          name: data.name,
        },

        columns: {
          id: true,
        },
      });

      if (duplicateColor && duplicateColor.id !== id) {
        throw new ApiError("A color with this name already exists", 409);
      }
    }

    // --------------------------------------------------------
    // 8. Update color
    // --------------------------------------------------------
    // Mutation queries still use the core Drizzle
    // operator syntax.
    // --------------------------------------------------------

    const result = await db
      .update(colors)
      .set({
        ...data,
      })
      .where(eq(colors.id, id))
      .returning();

    const updatedColor = result[0];

    // --------------------------------------------------------
    // 9. Make sure update succeeded
    // --------------------------------------------------------

    if (!updatedColor) {
      throw new ApiError("Failed to update color", 500);
    }

    // --------------------------------------------------------
    // 10. Return updated color
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      message: "Color updated successfully",

      data: updatedColor,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// DELETE COLOR - ADMIN
// ============================================================
//
// IMPORTANT:
//
// We do not physically delete a color that is already being
// used by a product variant.
//
// Instead, we deactivate it.
//
// This works together with:
//
// productVariants.colorId
//       ↓
// colors.id
//
// and the database:
//
// ON DELETE RESTRICT
//
// ============================================================

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is an admin
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // 2. Get and validate color ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } = colorIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Make sure color exists
    // --------------------------------------------------------

    const existingColor = await db.query.colors.findFirst({
      where: {
        id,
      },

      columns: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!existingColor) {
      throw new ApiError("Color not found", 404);
    }

    // --------------------------------------------------------
    // 4. Check whether the color is being used
    // --------------------------------------------------------

    const variant = await db.query.productVariants.findFirst({
      where: {
        colorId: id,
      },

      columns: {
        id: true,
      },
    });

    // --------------------------------------------------------
    // 5. If the color is being used:
    //
    // Do not delete it.
    //
    // Simply deactivate it.
    // --------------------------------------------------------

    if (variant) {
      const result = await db
        .update(colors)
        .set({
          isActive: false,
        })
        .where(eq(colors.id, id))
        .returning();

      const deactivatedColor = result[0];

      if (!deactivatedColor) {
        throw new ApiError("Failed to deactivate color", 500);
      }

      return NextResponse.json({
        success: true,

        message:
          "Color is being used by a product and has been deactivated instead of deleted",

        data: deactivatedColor,
      });
    }

    // --------------------------------------------------------
    // 6. Color is not being used.
    //
    // It is safe to physically delete it.
    // --------------------------------------------------------

    const result = await db.delete(colors).where(eq(colors.id, id)).returning();

    const deletedColor = result[0];

    // --------------------------------------------------------
    // 7. Make sure deletion succeeded
    // --------------------------------------------------------

    if (!deletedColor) {
      throw new ApiError("Failed to delete color", 500);
    }

    // --------------------------------------------------------
    // 8. Return success
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      message: "Color deleted successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

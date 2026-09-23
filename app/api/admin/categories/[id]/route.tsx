import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { categories } from "@/db/schema/categories";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  updateCategorySchema,
  categoryIdParamSchema,
} from "@/lib/validations";

import { requireAdmin } from "@/lib/APIs/auth";

// ============================================================
// GET SINGLE CATEGORY - ADMIN
// ============================================================

export async function GET(
  _request: Request,
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
    // 2. Get and validate category ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } = categoryIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Find category
    //
    // Latest Drizzle Relational Query API syntax.
    // --------------------------------------------------------

    const category = await db.query.categories.findFirst({
      where: {
        id,
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
    // 4. Make sure category exists
    // --------------------------------------------------------

    if (!category) {
      throw new ApiError(
        "Category not found",
        404,
      );
    }

    // --------------------------------------------------------
    // 5. Return category
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: category,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// UPDATE CATEGORY - ADMIN
// ============================================================

export async function PATCH(
  request: Request,
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
    // 2. Get and validate category ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } = categoryIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Make sure category exists
    // --------------------------------------------------------

    const existingCategory =
      await db.query.categories.findFirst({
        where: {
          id,
        },

        columns: {
          id: true,
          name: true,
          slug: true,
        },
      });

    if (!existingCategory) {
      throw new ApiError(
        "Category not found",
        404,
      );
    }

    // --------------------------------------------------------
    // 4. Read request body
    // --------------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------------
    // 5. Validate request body
    // --------------------------------------------------------

    const data = updateCategorySchema.parse(body);

    // --------------------------------------------------------
    // 6. Make sure something was provided
    // --------------------------------------------------------

    if (Object.keys(data).length === 0) {
      throw new ApiError(
        "At least one field is required",
        400,
      );
    }

    // --------------------------------------------------------
    // 7. Check duplicate category name
    // --------------------------------------------------------

    if (data.name !== undefined) {
      const duplicateName =
        await db.query.categories.findFirst({
          where: {
            name: data.name,
          },

          columns: {
            id: true,
          },
        });

      if (
        duplicateName &&
        duplicateName.id !== id
      ) {
        throw new ApiError(
          "A category with this name already exists",
          409,
        );
      }
    }

    // --------------------------------------------------------
    // 8. Check duplicate category slug
    // --------------------------------------------------------

    if (data.slug !== undefined) {
      const duplicateSlug =
        await db.query.categories.findFirst({
          where: {
            slug: data.slug,
          },

          columns: {
            id: true,
          },
        });

      if (
        duplicateSlug &&
        duplicateSlug.id !== id
      ) {
        throw new ApiError(
          "A category with this slug already exists",
          409,
        );
      }
    }

    // --------------------------------------------------------
    // 9. Update category
    //
    // IMPORTANT:
    // Mutation queries use Drizzle operators.
    //
    // RQB v2:
    //   where: { id }
    //
    // Mutation:
    //   where(eq(categories.id, id))
    // --------------------------------------------------------

    const result = await db
      .update(categories)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    // --------------------------------------------------------
    // 10. Make sure update succeeded
    // --------------------------------------------------------

    const updatedCategory = result[0];

    if (!updatedCategory) {
      throw new ApiError(
        "Failed to update category",
        500,
      );
    }

    // --------------------------------------------------------
    // 11. Return updated category
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      message: "Category updated successfully",

      data: updatedCategory,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// DELETE CATEGORY - ADMIN
// ============================================================

export async function DELETE(
  _request: Request,
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
    // 2. Get and validate category ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } = categoryIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Find category
    // --------------------------------------------------------

    const category =
      await db.query.categories.findFirst({
        where: {
          id,
        },

        columns: {
          id: true,
          name: true,
        },

        with: {
          products: {
            columns: {
              id: true,
            },
          },
        },
      });

    // --------------------------------------------------------
    // 4. Make sure category exists
    // --------------------------------------------------------

    if (!category) {
      throw new ApiError(
        "Category not found",
        404,
      );
    }

    // --------------------------------------------------------
    // 5. Do not delete category that has products
    // --------------------------------------------------------

    if (category.products.length > 0) {
      throw new ApiError(
        "This category cannot be deleted because it contains products. Move the products to another category first.",
        400,
      );
    }

    // --------------------------------------------------------
    // 6. Delete category
    //
    // Mutation queries use Drizzle operators.
    // --------------------------------------------------------

    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    // --------------------------------------------------------
    // 7. Make sure deletion succeeded
    // --------------------------------------------------------

    const deletedCategory = result[0];

    if (!deletedCategory) {
      throw new ApiError(
        "Failed to delete category",
        500,
      );
    }

    // --------------------------------------------------------
    // 8. Return success
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      message: "Category deleted successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
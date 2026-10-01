// app/api/admin/discounts/[id]/route.ts

import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { discounts, discountUsages } from "@/db/schema/discounts";

import { requireAdmin } from "@/lib/APIs/auth";
import { ApiError, handleApiError } from "@/lib/APIs/api-errors";
import {
  removeEmptyValues,
  saveDiscountTargets,
  toDiscountValues,
} from "@/lib/APIs/discount-admin";

import { updateDiscountSchema } from "@/lib/validations/discount";

// In Next.js 15, "params" is a Promise, so we await it.
type RouteContext = {
  params: Promise<{ id: string }>;
};

// Makes sure the id in the URL is a real uuid
const idSchema = z.string().uuid("Invalid discount id");

// ============================================================
// GET ONE DISCOUNT
// ============================================================

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const discountId = idSchema.parse(id);

    const discount = await db.query.discounts.findFirst({
      where: {
        id: discountId,
      },

      with: {
        products: { columns: { id: true, name: true } },
        categories: { columns: { id: true, name: true } },
        customers: {
          columns: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!discount) {
      throw new ApiError("Discount not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: discount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// UPDATE A DISCOUNT
// ============================================================
//
// Send the full discount, the same body as "create".
//
// ============================================================

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const discountId = idSchema.parse(id);

    const body = await request.json();

    const data = updateDiscountSchema.parse(removeEmptyValues(body));

    const updated = await db.transaction(async (tx) => {
      // 1. Does the discount exist?
      const existing = await tx.query.discounts.findFirst({
        where: {
          id: discountId,
        },
      });

      if (!existing) {
        throw new ApiError("Discount not found", 404);
      }

      // 2. Is the code already used by a DIFFERENT discount?
      const codeTaken = await tx.query.discounts.findFirst({
        where: {
          code: data.code,
          id: { ne: discountId },
        },
      });

      if (codeTaken) {
        throw new ApiError("A discount with this code already exists", 409);
      }

      // 3. The new limit can't be lower than the uses so far
      if (data.usageLimit && data.usageLimit < existing.usageCount) {
        throw new ApiError(
          `This discount has already been used ${existing.usageCount} times, so the limit can't be lower than that`,
          400,
        );
      }

      // 4. Update the discount
      const result = await tx
        .update(discounts)
        .set(toDiscountValues(data))
        .where(eq(discounts.id, discountId))
        .returning();

      const discount = result[0];

      if (!discount) {
        throw new ApiError("Failed to update discount", 500);
      }

      // 5. Replace its products / categories / customers
      await saveDiscountTargets(tx, discountId, data);

      return discount;
    });

    return NextResponse.json({
      success: true,
      message: "Discount updated successfully",
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// TURN A DISCOUNT ON OR OFF
// ============================================================
//
// Body: { "isActive": false }
//
// ============================================================

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const discountId = idSchema.parse(id);

    const body = await request.json();

    const { isActive } = z.object({ isActive: z.boolean() }).parse(body);

    const result = await db
      .update(discounts)
      .set({ isActive })
      .where(eq(discounts.id, discountId))
      .returning();

    const discount = result[0];

    if (!discount) {
      throw new ApiError("Discount not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: isActive ? "Discount activated" : "Discount deactivated",
      data: discount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// DELETE A DISCOUNT
// ============================================================
//
// A discount that has already been used can't be deleted,
// because we'd lose the history. Turn it off instead (PATCH).
//
// ============================================================

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const discountId = idSchema.parse(id);

    // Has anyone used this discount?
    const timesUsed = await db.$count(
      discountUsages,
      eq(discountUsages.discountId, discountId),
    );

    if (timesUsed > 0) {
      throw new ApiError(
        "This discount has already been used. Deactivate it instead of deleting it.",
        409,
      );
    }

    const result = await db
      .delete(discounts)
      .where(eq(discounts.id, discountId))
      .returning({ id: discounts.id });

    if (result.length === 0) {
      throw new ApiError("Discount not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Discount deleted successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
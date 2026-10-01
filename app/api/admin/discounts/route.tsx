// app/api/admin/discounts/route.ts

import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { discounts } from "@/db/schema/discounts";

import { requireAdmin } from "@/lib/APIs/auth";
import { ApiError, handleApiError } from "@/lib/APIs/api-errors";
import {
  removeEmptyValues,
  saveDiscountTargets,
  toDiscountValues,
} from "@/lib/APIs/discount-admin";

import { createDiscountSchema } from "@/lib/validations/discount";

// ============================================================
// LIST ALL DISCOUNTS
// ============================================================

export async function GET() {
  try {
    await requireAdmin();

    const allDiscounts = await db.query.discounts.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: allDiscounts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// CREATE A DISCOUNT
// ============================================================

export async function POST(request: Request) {
  try {
    // 1. Only admins can create discounts
    await requireAdmin();

    // 2. Read and validate the request body
    const body = await request.json();

    const data = createDiscountSchema.parse(removeEmptyValues(body));

    // 3. Save everything in ONE transaction.
    //    If any step fails, nothing is saved.
    const created = await db.transaction(async (tx) => {
      // Is this code already taken?
      const existing = await tx.query.discounts.findFirst({
        where: {
          code: data.code,
        },
      });

      if (existing) {
        throw new ApiError("A discount with this code already exists", 409);
      }

      // Create the discount
      const result = await tx
        .insert(discounts)
        .values(toDiscountValues(data))
        .returning();

      const discount = result[0];

      if (!discount) {
        throw new ApiError("Failed to create discount", 500);
      }

      // Save its products / categories / customers
      await saveDiscountTargets(tx, discount.id, data);

      return discount;
    });

    // 4. Send the new discount back
    return NextResponse.json(
      {
        success: true,
        message: "Discount created successfully",
        data: created,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
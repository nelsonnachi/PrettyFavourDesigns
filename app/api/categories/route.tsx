import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { handleApiError } from "@/lib/APIs/api-errors";

// ============================================================
// GET ACTIVE CATEGORIES
// ============================================================

export async function GET() {
  try {
    const categories =
      await db.query.categories.findMany({
        where: {
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

        orderBy: {
          position: "asc",
        },
      });

    return NextResponse.json({
      success: true,

      data: categories,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
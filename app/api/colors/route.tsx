import {
  NextResponse,
} from "next/server";

import { db } from "@/db/drizzle";
import { colors } from "@/db/schema/colors";

// ============================================================
// GET ACTIVE COLORS
// ============================================================
//
// This endpoint is public.
//
// Customers use this data when:
// - Filtering products by color
// - Viewing available color options
// - Selecting a color on a product
//
// Only active colors are returned.
//
// ============================================================

export async function GET() {
  try {
    // --------------------------------------------------------
    // Get active colors
    // --------------------------------------------------------
    //
    // Latest Drizzle relational query syntax.
    //
    // No authentication is required.
    // --------------------------------------------------------

    const result =
      await db.query.colors.findMany({
        where: {
          isActive: true,
        },

        columns: {
          id: true,
          name: true,
          hexCode: true,
        },

        orderBy: {
          name: "asc",
        },
      });

    // --------------------------------------------------------
    // Return colors
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: result,
    });
  } catch (error) {
    console.error(
      "GET /api/colors error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch colors",
      },
      {
        status: 500,
      },
    );
  }
}
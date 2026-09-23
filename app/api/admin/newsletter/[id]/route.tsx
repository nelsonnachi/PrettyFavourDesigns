import { NextRequest } from "next/server";

import {
  eq,
} from "drizzle-orm";

import { db } from "@/db/drizzle";

import {
  newsletterSubscribers,
} from "@/db/schema";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  requireAdmin,
} from "@/lib/APIs/auth";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET /api/admin/newsletter/[id]
// ============================================================

export async function GET(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    // ========================================================
    // PARAMS
    // ========================================================

    const { id } =
      await context.params;

    if (!id) {
      throw new ApiError(
        "Subscriber ID is required",
        400,
      );
    }

    // ========================================================
    // FIND SUBSCRIBER
    // ========================================================

    const result =
      await db
        .select()
        .from(
          newsletterSubscribers,
        )
        .where(
          eq(
            newsletterSubscribers.id,
            id,
          ),
        )
        .limit(1);

    const subscriber =
      result[0];

    if (!subscriber) {
      throw new ApiError(
        "Newsletter subscriber not found",
        404,
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: subscriber,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/newsletter/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// PATCH /api/admin/newsletter/[id]
// ============================================================
//
// Body:
//
// {
//   "isSubscribed": true
// }
//
// or
//
// {
//   "isSubscribed": false
// }
//
// ============================================================

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    // ========================================================
    // PARAMS
    // ========================================================

    const { id } =
      await context.params;

    if (!id) {
      throw new ApiError(
        "Subscriber ID is required",
        400,
      );
    }

    // ========================================================
    // FIND SUBSCRIBER
    // ========================================================

    const result =
      await db
        .select()
        .from(
          newsletterSubscribers,
        )
        .where(
          eq(
            newsletterSubscribers.id,
            id,
          ),
        )
        .limit(1);

    const subscriber =
      result[0];

    if (!subscriber) {
      throw new ApiError(
        "Newsletter subscriber not found",
        404,
      );
    }

    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body =
      await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    if (
      typeof body.isSubscribed !==
      "boolean"
    ) {
      throw new ApiError(
        "isSubscribed must be a boolean",
        400,
      );
    }

    const isSubscribed =
      body.isSubscribed;

    // ========================================================
    // UPDATE
    // ========================================================

    const [updated] =
      await db
        .update(
          newsletterSubscribers,
        )
        .set({
          isSubscribed,

          unsubscribedAt:
            isSubscribed
              ? null
              : new Date(),
        })
        .where(
          eq(
            newsletterSubscribers.id,
            id,
          ),
        )
        .returning();

    if (!updated) {
      throw new ApiError(
        "Newsletter subscriber update failed",
        500,
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: updated,

      message: isSubscribed
        ? "Subscriber activated successfully"
        : "Subscriber unsubscribed successfully",
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/newsletter/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// DELETE /api/admin/newsletter/[id]
// ============================================================

export async function DELETE(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    // ========================================================
    // PARAMS
    // ========================================================

    const { id } =
      await context.params;

    if (!id) {
      throw new ApiError(
        "Subscriber ID is required",
        400,
      );
    }

    // ========================================================
    // FIND SUBSCRIBER
    // ========================================================

    const result =
      await db
        .select({
          id:
            newsletterSubscribers.id,
        })
        .from(
          newsletterSubscribers,
        )
        .where(
          eq(
            newsletterSubscribers.id,
            id,
          ),
        )
        .limit(1);

    const subscriber =
      result[0];

    if (!subscriber) {
      throw new ApiError(
        "Newsletter subscriber not found",
        404,
      );
    }

    // ========================================================
    // DELETE
    // ========================================================

    await db
      .delete(
        newsletterSubscribers,
      )
      .where(
        eq(
          newsletterSubscribers.id,
          id,
        ),
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      message:
        "Newsletter subscriber deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/newsletter/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}
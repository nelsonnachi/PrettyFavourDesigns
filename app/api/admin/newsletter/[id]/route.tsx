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
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } =
      await context.params;

    if (!id) {
      throw new ApiError(
        "Subscriber ID is required",
        400,
      );
    }

    // ========================================================
    // RELATIONS V2 READ
    // ========================================================

    const subscriber =
      await db.query.newsletterSubscribers.findFirst(
        {
          where: {
            id,
          },

          columns: {
            id: true,
            email: true,
            isSubscribed: true,
            subscribedAt: true,
            unsubscribedAt: true,
          },
        },
      );

    if (!subscriber) {
      throw new ApiError(
        "Newsletter subscriber not found",
        404,
      );
    }

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

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } =
      await context.params;

    if (!id) {
      throw new ApiError(
        "Subscriber ID is required",
        400,
      );
    }

    // ========================================================
    // VALIDATE BODY
    // ========================================================

    const body =
      await req.json();

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
    // CHECK EXISTENCE
    //
    // Relations v2 read.
    // ========================================================

    const existingSubscriber =
      await db.query.newsletterSubscribers.findFirst(
        {
          where: {
            id,
          },

          columns: {
            id: true,
          },
        },
      );

    if (!existingSubscriber) {
      throw new ApiError(
        "Newsletter subscriber not found",
        404,
      );
    }

    // ========================================================
    // UPDATE
    //
    // SQL UPDATE API.
    //
    // eq() is correct here.
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
        .returning({
          id:
            newsletterSubscribers.id,

          email:
            newsletterSubscribers.email,

          isSubscribed:
            newsletterSubscribers.isSubscribed,

          subscribedAt:
            newsletterSubscribers.subscribedAt,

          unsubscribedAt:
            newsletterSubscribers.unsubscribedAt,
        });

    if (!updated) {
      throw new ApiError(
        "Newsletter subscriber update failed",
        500,
      );
    }

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
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } =
      await context.params;

    if (!id) {
      throw new ApiError(
        "Subscriber ID is required",
        400,
      );
    }

    // ========================================================
    // CHECK EXISTENCE
    //
    // Relations v2 read.
    // ========================================================

    const existingSubscriber =
      await db.query.newsletterSubscribers.findFirst(
        {
          where: {
            id,
          },

          columns: {
            id: true,
          },
        },
      );

    if (!existingSubscriber) {
      throw new ApiError(
        "Newsletter subscriber not found",
        404,
      );
    }

    // ========================================================
    // DELETE
    //
    // SQL DELETE API.
    //
    // eq() is correct here.
    // ========================================================

    const [deletedSubscriber] =
      await db
        .delete(
          newsletterSubscribers,
        )
        .where(
          eq(
            newsletterSubscribers.id,
            id,
          ),
        )
        .returning({
          id:
            newsletterSubscribers.id,
        });

    if (!deletedSubscriber) {
      throw new ApiError(
        "Newsletter subscriber deletion failed",
        500,
      );
    }

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
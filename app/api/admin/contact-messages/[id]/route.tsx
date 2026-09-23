import { NextRequest } from "next/server";

import { eq } from "drizzle-orm";

import {
  contactMessages,
} from "@/db/schema";

import { db } from "@/db/drizzle";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  requireAdmin,
} from "@/lib/APIs/auth";

import {
  updateContactMessageSchema,
} from "@/lib/validations";

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
// GET /api/admin/contact-messages/[id]
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
        "Contact message ID is required",
        400,
      );
    }

    // ========================================================
    // FIND MESSAGE
    // ========================================================

    const message =
      await db.query.contactMessages.findFirst({
        where: {
          id,
        },

        with: {
          user: {
            columns: {
              id: true,

              clerkId: true,

              email: true,

              firstName: true,

              lastName: true,

              imageUrl: true,

              phone: true,

            },
          },
        },
      });

    // ========================================================
    // NOT FOUND
    // ========================================================

    if (!message) {
      throw new ApiError(
        "Contact message not found",
        404,
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: message,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/contact-messages/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// PATCH /api/admin/contact-messages/[id]
// ============================================================
//
// Body:
//
// {
//   "isRead": true
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
        "Contact message ID is required",
        400,
      );
    }

    // ========================================================
    // CHECK MESSAGE
    // ========================================================

    const existingMessage =
      await db.query.contactMessages.findFirst({
        where: {
          id,
        },
      });

    if (!existingMessage) {
      throw new ApiError(
        "Contact message not found",
        404,
      );
    }

    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input =
      updateContactMessageSchema.parse(body);

    // ========================================================
    // UPDATE
    // ========================================================

    const [updatedMessage] =
      await db
        .update(contactMessages)
        .set({
          isRead: input.isRead,
        })
        .where(
          eq(
            contactMessages.id,
            id,
          ),
        )
        .returning();

    if (!updatedMessage) {
      throw new ApiError(
        "Failed to update contact message",
        500,
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: updatedMessage,

      message:
        input.isRead
          ? "Message marked as read"
          : "Message marked as unread",
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/contact-messages/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// DELETE /api/admin/contact-messages/[id]
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
        "Contact message ID is required",
        400,
      );
    }

    // ========================================================
    // CHECK MESSAGE
    // ========================================================

    const existingMessage =
      await db.query.contactMessages.findFirst({
        where: {
          id,
        },
      });

    if (!existingMessage) {
      throw new ApiError(
        "Contact message not found",
        404,
      );
    }

    // ========================================================
    // DELETE
    // ========================================================

    await db
      .delete(contactMessages)
      .where(
        eq(
          contactMessages.id,
          id,
        ),
      );

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      message:
        "Contact message deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/contact-messages/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}
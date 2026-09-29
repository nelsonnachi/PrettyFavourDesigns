import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { contactMessages } from "@/db/schema";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

import {
  contactMessageIdParamSchema,
  updateContactMessageSchema,
} from "@/lib/validations";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET SINGLE CONTACT MESSAGE
// ============================================================

export async function GET(
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    // ----------------------------------------------------------
    // Validate ID
    // ----------------------------------------------------------

    const { id: messageId } =
      contactMessageIdParamSchema.parse({
        id,
      });

    // ----------------------------------------------------------
    // Relations v2 query
    // ----------------------------------------------------------

    const message =
      await db.query.contactMessages.findFirst({
        where: {
          id: messageId,
        },

        columns: {
          id: true,
          userId: true,
          name: true,
          email: true,
          phone: true,
          subject: true,
          message: true,
          isRead: true,
          createdAt: true,
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

    // ----------------------------------------------------------
    // Not found
    // ----------------------------------------------------------

    if (!message) {
      throw new ApiError(
        "Contact message not found",
        404,
      );
    }

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

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
// UPDATE CONTACT MESSAGE
// ============================================================

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    // ----------------------------------------------------------
    // Validate ID
    // ----------------------------------------------------------

    const { id: messageId } =
      contactMessageIdParamSchema.parse({
        id,
      });

    // ----------------------------------------------------------
    // Validate request body
    // ----------------------------------------------------------

    const body = await req.json();

    const input =
      updateContactMessageSchema.parse(body);

    // ----------------------------------------------------------
    // Check message exists
    //
    // This is a Relations v2 read.
    // ----------------------------------------------------------

    const existingMessage =
      await db.query.contactMessages.findFirst({
        where: {
          id: messageId,
        },

        columns: {
          id: true,
        },
      });

    if (!existingMessage) {
      throw new ApiError(
        "Contact message not found",
        404,
      );
    }

    // ----------------------------------------------------------
    // Update
    //
    // IMPORTANT:
    // update() is the SQL query builder.
    // eq() is the correct syntax here.
    // ----------------------------------------------------------

    const [updatedMessage] =
      await db
        .update(contactMessages)
        .set({
          isRead: input.isRead,
        })
        .where(
          eq(
            contactMessages.id,
            messageId,
          ),
        )
        .returning();

    if (!updatedMessage) {
      throw new ApiError(
        "Failed to update contact message",
        500,
      );
    }

    // ----------------------------------------------------------
    // Return updated message
    // ----------------------------------------------------------

    return Response.json({
      success: true,
      data: updatedMessage,
      message: input.isRead
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
// DELETE CONTACT MESSAGE
// ============================================================

export async function DELETE(
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    // ----------------------------------------------------------
    // Validate ID
    // ----------------------------------------------------------

    const { id: messageId } =
      contactMessageIdParamSchema.parse({
        id,
      });

    // ----------------------------------------------------------
    // Check message exists
    //
    // Relations v2 read.
    // ----------------------------------------------------------

    const existingMessage =
      await db.query.contactMessages.findFirst({
        where: {
          id: messageId,
        },

        columns: {
          id: true,
        },
      });

    if (!existingMessage) {
      throw new ApiError(
        "Contact message not found",
        404,
      );
    }

    // ----------------------------------------------------------
    // Delete
    //
    // IMPORTANT:
    // delete() is the SQL query builder.
    // eq() is the correct syntax here.
    // ----------------------------------------------------------

    const [deletedMessage] =
      await db
        .delete(contactMessages)
        .where(
          eq(
            contactMessages.id,
            messageId,
          ),
        )
        .returning({
          id: contactMessages.id,
        });

    if (!deletedMessage) {
      throw new ApiError(
        "Failed to delete contact message",
        500,
      );
    }

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

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
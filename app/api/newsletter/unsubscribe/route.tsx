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
  unsubscribeNewsletterSchema,
} from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// POST /api/newsletter/unsubscribe
// ============================================================

export async function POST(
  req: NextRequest,
) {
  try {
    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input =
      unsubscribeNewsletterSchema.parse(
        body,
      );

    const email =
      input.email.toLowerCase();

    // ========================================================
    // FIND SUBSCRIBER
    // ========================================================

    const result =
      await db
        .select()
        .from(newsletterSubscribers)
        .where(
          eq(
            newsletterSubscribers.email,
            email,
          ),
        )
        .limit(1);

    const subscriber =
      result[0];

    // ========================================================
    // NOT FOUND
    // ========================================================

    if (!subscriber) {
      throw new ApiError(
        "Newsletter subscription not found",
        404,
      );
    }

    // ========================================================
    // ALREADY UNSUBSCRIBED
    // ========================================================

    if (
      !subscriber.isSubscribed
    ) {
      return Response.json({
        success: true,

        data: subscriber,

        message:
          "You are already unsubscribed",
      });
    }

    // ========================================================
    // UNSUBSCRIBE
    // ========================================================

    const [updated] =
      await db
        .update(
          newsletterSubscribers,
        )
        .set({
          isSubscribed: false,

          unsubscribedAt:
            new Date(),
        })
        .where(
          eq(
            newsletterSubscribers.id,
            subscriber.id,
          ),
        )
        .returning();

    if (!updated) {
      throw new ApiError(
        "Unable to unsubscribe from newsletter",
        500,
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: updated,

      message:
        "You have been unsubscribed from the newsletter",
    });
  } catch (error) {
    console.error(
      "POST /api/newsletter/unsubscribe error:",
      error,
    );

    return handleApiError(error);
  }
}
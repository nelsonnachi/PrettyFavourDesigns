import { NextRequest } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { newsletterSubscribers } from "@/db/schema";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { subscribeNewsletterSchema } from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// POST /api/newsletter
// ============================================================
//
// Subscribe an email to the SHOPPFD newsletter.
//
// This endpoint works for both:
// - Logged-in users
// - Guest users
//
// ============================================================

export async function POST(req: NextRequest) {
  try {
    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input = subscribeNewsletterSchema.parse(body);

    // ========================================================
    // NORMALIZE EMAIL
    // ========================================================

    const email = input.email.toLowerCase();

    // ========================================================
    // CHECK EXISTING SUBSCRIBER
    // ========================================================

    const existingResult = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    const existing = existingResult[0];

    // ========================================================
    // ALREADY SUBSCRIBED
    // ========================================================

    if (existing && existing.isSubscribed) {
      return Response.json({
        success: true,

        data: existing,

        message: "You are already subscribed to the newsletter",
      });
    }

    // ========================================================
    // RE-SUBSCRIBE
    // ========================================================

    if (existing) {
      const [updated] = await db
        .update(newsletterSubscribers)
        .set({
          isSubscribed: true,

          subscribedAt: new Date(),

          unsubscribedAt: null,
        })
        .where(eq(newsletterSubscribers.id, existing.id))
        .returning();

      if (!updated) {
        throw new ApiError("Unable to subscribe to newsletter", 500);
      }

      return Response.json({
        success: true,

        data: updated,

        message: "You have been subscribed to the newsletter",
      });
    }

    // ========================================================
    // CREATE NEW SUBSCRIBER
    // ========================================================

    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values({
        email,

        isSubscribed: true,

        subscribedAt: new Date(),

        unsubscribedAt: null,
      })
      .returning();

    if (!subscriber) {
      throw new ApiError("Unable to subscribe to newsletter", 500);
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json(
      {
        success: true,

        data: subscriber,

        message: "You have been subscribed to the newsletter",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/newsletter error:", error);

    return handleApiError(error);
  }
}

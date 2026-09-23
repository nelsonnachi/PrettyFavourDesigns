import { NextRequest } from "next/server";


import { contactMessages } from "@/db/schema";

import { db } from "@/db/drizzle";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { getOptionalUser } from "@/lib/APIs/auth";

import { createContactMessageSchema } from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// POST /api/contact
// ============================================================

export async function POST(req: NextRequest) {
  try {
    // ========================================================
    // GET OPTIONAL USER
    // ========================================================
    //
    // Contact messages can be sent by:
    // - logged-in users
    // - guests
    //
    // ========================================================

    const user = await getOptionalUser();

    // ========================================================
    // PARSE REQUEST BODY
    // ========================================================

    const body = await req.json();

    // ========================================================
    // VALIDATE
    // ========================================================

    const input = createContactMessageSchema.parse(body);

    // ========================================================
    // CREATE CONTACT MESSAGE
    // ========================================================

    const [message] = await db
      .insert(contactMessages)
      .values({
        userId: user?.id ?? null,

        name: input.name,

        email: input.email,

        phone: input.phone ?? null,

        subject: input.subject ?? null,

        message: input.message,

        isRead: false,
      })
      .returning({
        id: contactMessages.id,

        name: contactMessages.name,

        email: contactMessages.email,

        phone: contactMessages.phone,

        subject: contactMessages.subject,

        message: contactMessages.message,

        createdAt: contactMessages.createdAt,
      });

    if (!message) {
      throw new ApiError("Failed to send contact message", 500);
    }

    // ========================================================
    // SUCCESS
    // ========================================================

    return Response.json(
      {
        success: true,

        data: message,

        message: "Your message has been sent successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);

    return handleApiError(error);
  }
}

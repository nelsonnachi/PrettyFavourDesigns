import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { contactMessages } from "@/db/schema";

import {
  handleApiError,
} from "@/lib/APIs/api-errors";

import { requireAdmin } from "@/lib/APIs/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();

    const count = await db.$count(
      contactMessages,
      eq(contactMessages.isRead, false),
    );

    return Response.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/contact-messages/unread-count error:",
      error,
    );

    return handleApiError(error);
  }
}
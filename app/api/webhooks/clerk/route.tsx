import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";

// ============================================================
// CLERK WEBHOOK
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // --------------------------------------------------------
    // Verify that the request actually came from Clerk
    // --------------------------------------------------------

    const event = await verifyWebhook(request);

    // --------------------------------------------------------
    // Get the event type
    // --------------------------------------------------------

    const eventType = event.type;

    // ========================================================
    // USER CREATED
    // ========================================================

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = event.data;

      const email =
        email_addresses[0]?.email_address?.toLowerCase();

      // ------------------------------------------------------
      // Make sure required Clerk information exists
      // ------------------------------------------------------

      if (!id || !email) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required Clerk user information",
          },
          { status: 400 },
        );
      }

      // ------------------------------------------------------
      // Create SHOPPFD database user
      // ------------------------------------------------------

      await db
        .insert(users)
        .values({
          clerkId: id,
          email,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          role: "customer",
        })
        .onConflictDoNothing({
          target: users.clerkId,
        });
    }

    // ========================================================
    // USER UPDATED
    // ========================================================

    else if (eventType === "user.updated") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = event.data;

      const email =
        email_addresses[0]?.email_address?.toLowerCase();

      // ------------------------------------------------------
      // Make sure required information exists
      // ------------------------------------------------------

      if (!id || !email) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required Clerk user information",
          },
          { status: 400 },
        );
      }

      // ------------------------------------------------------
      // Synchronize Clerk → SHOPPFD database
      //
      // We DO NOT update:
      // - role
      // - isBanned
      // - phone
      //
      // Those belong to SHOPPFD.
      // ------------------------------------------------------

      await db
        .update(users)
        .set({
          email,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, id));
    }

    // ========================================================
    // USER DELETED
    // ========================================================

    else if (eventType === "user.deleted") {
      const { id } = event.data;

      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing Clerk user ID",
          },
          { status: 400 },
        );
      }

      // ------------------------------------------------------
      // We do NOT physically delete the database user.
      //
      // This protects historical orders and other records
      // connected to the user.
      // ------------------------------------------------------

      await db
        .update(users)
        .set({
          isBanned: true,
          firstName: null,
          lastName: null,
          phone: null,
          imageUrl: null,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, id));
    }

    // ========================================================
    // SUCCESS
    // ========================================================

    return NextResponse.json({
      success: true,
      message: "Clerk webhook processed successfully",
    });
  } catch (error) {
    console.error("Clerk webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed",
      },
      { status: 400 },
    );
  }
}
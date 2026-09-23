import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { requireUser } from "@/lib/APIs/auth";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  updateMyProfileSchema,
} from "@/lib/validations";

// ============================================================
// GET CURRENT USER
// ============================================================

export async function GET() {
  try {
    const user = await requireUser();

    return NextResponse.json({
      success: true,

      data: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        phone: user.phone,
        role: user.role,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// UPDATE CURRENT USER
// ============================================================

export async function PATCH(request: NextRequest) {
  try {
    // --------------------------------------------------------
    // 1. Make sure the user is authenticated
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // 2. Read request body
    // --------------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------------
    // 3. Validate request body
    // --------------------------------------------------------

    const data = updateMyProfileSchema.parse(body);

    // --------------------------------------------------------
    // 4. Make sure something was provided
    // --------------------------------------------------------

    if (Object.keys(data).length === 0) {
      throw new ApiError(
        "At least one field is required",
        400,
      );
    }

    // ========================================================
    // 5. UPDATE CLERK
    //
    // Clerk owns:
    // - firstName
    // - lastName
    // ========================================================

    const clerkUpdates: {
      firstName?: string;
      lastName?: string;
    } = {};

    if (data.firstName !== undefined) {
      clerkUpdates.firstName = data.firstName;
    }

    if (data.lastName !== undefined) {
      clerkUpdates.lastName = data.lastName;
    }

    if (Object.keys(clerkUpdates).length > 0) {
      const client = await clerkClient();

      await client.users.updateUser(
        user.clerkId,
        clerkUpdates,
      );
    }

    // ========================================================
    // 6. UPDATE SHOPPFD DATABASE
    //
    // SHOPPFD owns:
    // - phone
    // ========================================================

    let updatedPhone = user.phone;

    if (data.phone !== undefined) {
      const result = await db
        .update(users)
        .set({
          phone: data.phone,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning({
          phone: users.phone,
          updatedAt: users.updatedAt,
        });

      const updatedDatabaseUser = result[0];

      if (!updatedDatabaseUser) {
        throw new ApiError(
          "Failed to update user",
          500,
        );
      }

      updatedPhone = updatedDatabaseUser.phone;
    }

    // ========================================================
    // 7. RETURN RESPONSE
    //
    // For firstName/lastName, return the values we just sent
    // to Clerk.
    //
    // The Clerk webhook will synchronize PostgreSQL afterward.
    // ========================================================

    return NextResponse.json({
      success: true,

      message: "Profile updated successfully",

      data: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,

        firstName:
          data.firstName !== undefined
            ? data.firstName
            : user.firstName,

        lastName:
          data.lastName !== undefined
            ? data.lastName
            : user.lastName,

        imageUrl: user.imageUrl,

        phone: updatedPhone,

        role: user.role,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
import { NextRequest, NextResponse } from "next/server";

import { eq, desc } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { addresses } from "@/db/schema/addresses";

import { requireUser } from "@/lib/APIs/auth";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  createAddressSchema,
} from "@/lib/validations";

// ============================================================
// GET MY ADDRESSES
// ============================================================

export async function GET() {
  try {
    // --------------------------------------------------------
    // 1. Make sure the user is authenticated
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // 2. Get this user's addresses
    // --------------------------------------------------------

    const result = await db.query.addresses.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        isDefault: "desc",
      },
    });

    // --------------------------------------------------------
    // 3. Return addresses
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// CREATE ADDRESS
// ============================================================

export async function POST(request: NextRequest) {
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

    const data = createAddressSchema.parse(body);

    // --------------------------------------------------------
    // 4. Get existing addresses
    // --------------------------------------------------------

    const existingAddresses =
      await db.query.addresses.findMany({
        where: {
          userId: user.id,
        },

        columns: {
          id: true,
          isDefault: true,
        },
      });

    // --------------------------------------------------------
    // 5. Decide whether this address should be default
    //
    // The first address automatically becomes default.
    // If the user explicitly selects default, it also
    // becomes the new default.
    // --------------------------------------------------------

    const shouldBeDefault =
      existingAddresses.length === 0 ||
      data.isDefault === true;

    // --------------------------------------------------------
    // 6. Remove default status from existing addresses
    // --------------------------------------------------------

    if (shouldBeDefault) {
      await db
        .update(addresses)
        .set({
          isDefault: false,
          updatedAt: new Date(),
        })
        .where(eq(addresses.userId, user.id));
    }

    // --------------------------------------------------------
    // 7. Create the new address
    // --------------------------------------------------------

    const result = await db
      .insert(addresses)
      .values({
        userId: user.id,

        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,

        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,

        city: data.city,
        state: data.state,
        country: data.country,

        postalCode: data.postalCode,

        isDefault: shouldBeDefault,
      })
      .returning();

    // --------------------------------------------------------
    // 8. Get created address
    // --------------------------------------------------------

    const newAddress = result[0];

    if (!newAddress) {
      throw new ApiError(
        "Failed to create address",
        500,
      );
    }

    // --------------------------------------------------------
    // 9. Return created address
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message: "Address created successfully",

        data: newAddress,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
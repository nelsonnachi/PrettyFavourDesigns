import { NextRequest, NextResponse } from "next/server";

import { eq, and } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { addresses } from "@/db/schema/addresses";

import { requireUser } from "@/lib/APIs/auth";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  updateAddressSchema,
  addressIdParamSchema,
} from "@/lib/validations";

// ============================================================
// GET SINGLE ADDRESS
// ============================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is authenticated
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // 2. Get and validate address ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } =
      addressIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Find address belonging to current user
    // --------------------------------------------------------

    const address =
      await db.query.addresses.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    // --------------------------------------------------------
    // 4. Make sure address exists
    // --------------------------------------------------------

    if (!address) {
      throw new ApiError(
        "Address not found",
        404,
      );
    }

    // --------------------------------------------------------
    // 5. Return address
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: address,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// UPDATE ADDRESS
// ============================================================

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is authenticated
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // 2. Get and validate address ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } =
      addressIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Find the address
    // --------------------------------------------------------

    const existingAddress =
      await db.query.addresses.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    // --------------------------------------------------------
    // 4. Make sure address exists
    // --------------------------------------------------------

    if (!existingAddress) {
      throw new ApiError(
        "Address not found",
        404,
      );
    }

    // --------------------------------------------------------
    // 5. Read request body
    // --------------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------------
    // 6. Validate request body
    // --------------------------------------------------------

    const data =
      updateAddressSchema.parse(body);

    // --------------------------------------------------------
    // 7. Make sure something was provided
    // --------------------------------------------------------

    if (Object.keys(data).length === 0) {
      throw new ApiError(
        "At least one field is required",
        400,
      );
    }

    // ========================================================
    // DEFAULT ADDRESS RULES
    // ========================================================

    // --------------------------------------------------------
    // If the current default address is explicitly changed
    // to false, reject it.
    //
    // The user must make another address default first.
    // --------------------------------------------------------

    if (
      existingAddress.isDefault &&
      data.isDefault === false
    ) {
      throw new ApiError(
        "You cannot remove the default status from your current default address. Set another address as default first.",
        400,
      );
    }

    // --------------------------------------------------------
    // If this address is being made default:
    //
    // Remove default status from the user's other addresses.
    // --------------------------------------------------------

    if (data.isDefault === true) {
      await db
        .update(addresses)
        .set({
          isDefault: false,
          updatedAt: new Date(),
        })
        .where(eq(addresses.userId, user.id));
    }

    // --------------------------------------------------------
    // 8. Update address
    // --------------------------------------------------------

    const result = await db
      .update(addresses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(addresses.id, id),
          eq(addresses.userId, user.id),
        ),
      )
      .returning();

    // --------------------------------------------------------
    // 9. Get updated address
    // --------------------------------------------------------

    const updatedAddress = result[0];

    if (!updatedAddress) {
      throw new ApiError(
        "Failed to update address",
        500,
      );
    }

    // --------------------------------------------------------
    // 10. Return updated address
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      message: "Address updated successfully",

      data: updatedAddress,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// DELETE ADDRESS
// ============================================================

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // 1. Make sure user is authenticated
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // 2. Get and validate address ID
    // --------------------------------------------------------

    const params = await context.params;

    const { id } =
      addressIdParamSchema.parse(params);

    // --------------------------------------------------------
    // 3. Find the address
    // --------------------------------------------------------

    const existingAddress =
      await db.query.addresses.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    // --------------------------------------------------------
    // 4. Make sure address exists
    // --------------------------------------------------------

    if (!existingAddress) {
      throw new ApiError(
        "Address not found",
        404,
      );
    }

    // --------------------------------------------------------
    // 5. Delete the address
    // --------------------------------------------------------

    await db
      .delete(addresses)
      .where(
        and(
          eq(addresses.id, id),
          eq(addresses.userId, user.id),
        ),
      );

    // ========================================================
    // IF THE DELETED ADDRESS WAS DEFAULT
    // ========================================================

    if (existingAddress.isDefault) {
      // ------------------------------------------------------
      // Find another address.
      //
      // The oldest remaining address becomes default.
      // ------------------------------------------------------

      const remainingAddresses =
        await db.query.addresses.findMany({
          where: {
            userId: user.id,
          },

          columns: {
            id: true,
          },

          orderBy: {
            createdAt: "asc",
          },

          limit: 1,
        });

      const nextAddress =
        remainingAddresses[0];

      // ------------------------------------------------------
      // Make the next address default
      // ------------------------------------------------------

      if (nextAddress) {
        await db
          .update(addresses)
          .set({
            isDefault: true,
            updatedAt: new Date(),
          })
          .where(
            eq(
              addresses.id,
              nextAddress.id,
            ),
          );
      }
    }

    // --------------------------------------------------------
    // 6. Return success
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      message: "Address deleted successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
import { NextRequest } from "next/server";

import { and, asc, eq } from "drizzle-orm";

import { addresses } from "@/db/schema";

import { db } from "@/db/drizzle";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import { requireUser } from "@/lib/APIs/auth";

import {
  createAddressSchema,
} from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// GET /api/addresses
// ============================================================
//
// Get all addresses belonging to the logged-in user.
//
// ============================================================

export async function GET(req: NextRequest) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // GET ADDRESSES
    // --------------------------------------------------------

    const userAddresses =
      await db.query.addresses.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "asc",
        },

        columns: {
          id: true,

          userId: true,

          firstName: true,

          lastName: true,

          phone: true,

          addressLine1: true,

          addressLine2: true,

          city: true,

          state: true,

          country: true,

          postalCode: true,

          isDefault: true,

          createdAt: true,

          updatedAt: true,
        },
      });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json({
      success: true,

      data: userAddresses,
    });
  } catch (error) {
    console.error(
      "GET /api/addresses error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// POST /api/addresses
// ============================================================
//
// Create a new address for the logged-in user.
//
// ============================================================

export async function POST(req: NextRequest) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------------

    const body = await req.json();

    // --------------------------------------------------------
    // VALIDATE
    // --------------------------------------------------------

    const input =
      createAddressSchema.parse(body);

    // --------------------------------------------------------
    // CHECK EXISTING ADDRESSES
    // --------------------------------------------------------

    const existingAddresses =
      await db.query.addresses.findMany({
        where: {
          userId: user.id,
        },

        columns: {
          id: true,
        },

        limit: 1,
      });

    // --------------------------------------------------------
    // DETERMINE DEFAULT ADDRESS
    // --------------------------------------------------------
    //
    // If this is the user's first address, automatically
    // make it the default address.
    //
    // If isDefault was explicitly true, also make it default.
    //
    // Otherwise it remains a normal address.
    //
    // --------------------------------------------------------

    const shouldBeDefault =
      existingAddresses.length === 0 ||
      input.isDefault === true;

    // --------------------------------------------------------
    // CREATE ADDRESS
    // --------------------------------------------------------

    const createdAddress =
      await db.transaction(async (tx) => {
        // ----------------------------------------------------
        // REMOVE EXISTING DEFAULT
        // ----------------------------------------------------

        if (shouldBeDefault) {
          await tx
            .update(addresses)
            .set({
              isDefault: false,

              updatedAt: new Date(),
            })
            .where(
              eq(
                addresses.userId,
                user.id,
              ),
            );
        }

        // ----------------------------------------------------
        // INSERT ADDRESS
        // ----------------------------------------------------

        const [address] =
          await tx
            .insert(addresses)
            .values({
              userId: user.id,

              firstName:
                input.firstName,

              lastName:
                input.lastName,

              phone:
                input.phone,

              addressLine1:
                input.addressLine1,

              addressLine2:
                input.addressLine2,

              city:
                input.city,

              state:
                input.state,

              country:
                input.country,

              postalCode:
                input.postalCode,

              isDefault:
                shouldBeDefault,
            })
            .returning();

        if (!address) {
          throw new ApiError(
            "Address could not be created",
            500,
          );
        }

        return address;
      });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json(
      {
        success: true,

        data: createdAddress,

        message:
          "Address created successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/addresses error:",
      error,
    );

    return handleApiError(error);
  }
}
import { NextRequest } from "next/server";

import {
  and,
  eq,
} from "drizzle-orm";

import { addresses } from "@/db/schema";

import { db } from "@/db/drizzle";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import { requireUser } from "@/lib/APIs/auth";

import {
  addressIdParamSchema,
  updateAddressSchema,
} from "@/lib/validations";

export const runtime = "nodejs";

// ============================================================
// TYPES
// ============================================================

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET /api/addresses/[id]
// ============================================================
//
// Get one address belonging to the logged-in user.
//
// ============================================================

export async function GET(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } =
      await context.params;

    const params =
      addressIdParamSchema.parse({
        id,
      });

    // --------------------------------------------------------
    // FIND ADDRESS
    // --------------------------------------------------------

    const address =
      await db.query.addresses.findFirst({
        where: {
          id: params.id,

          userId: user.id,
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
    // CHECK ADDRESS
    // --------------------------------------------------------

    if (!address) {
      throw new ApiError(
        "Address not found",
        404,
      );
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json({
      success: true,

      data: address,
    });
  } catch (error) {
    console.error(
      "GET /api/addresses/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// PATCH /api/addresses/[id]
// ============================================================
//
// Update an address belonging to the logged-in user.
//
// ============================================================

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } =
      await context.params;

    const params =
      addressIdParamSchema.parse({
        id,
      });

    // --------------------------------------------------------
    // CHECK ADDRESS OWNERSHIP
    // --------------------------------------------------------

    const existingAddress =
      await db.query.addresses.findFirst({
        where: {
          id: params.id,

          userId: user.id,
        },
      });

    if (!existingAddress) {
      throw new ApiError(
        "Address not found",
        404,
      );
    }

    // --------------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------------

    const body = await req.json();

    // --------------------------------------------------------
    // VALIDATE
    // --------------------------------------------------------

    const input =
      updateAddressSchema.parse(body);

    // --------------------------------------------------------
    // UPDATE ADDRESS
    // --------------------------------------------------------

    const updatedAddress =
      await db.transaction(async (tx) => {
        // ----------------------------------------------------
        // IF SETTING THIS ADDRESS AS DEFAULT
        // ----------------------------------------------------

        if (input.isDefault === true) {
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
        // BUILD UPDATE VALUES
        // ----------------------------------------------------

        const updateValues: {
          firstName?: string;

          lastName?: string;

          phone?: string;

          addressLine1?: string;

          addressLine2?: string | null;

          city?: string;

          state?: string;

          country?: string;

          postalCode?: string | null;

          isDefault?: boolean;

          updatedAt: Date;
        } = {
          updatedAt: new Date(),
        };

        if (
          input.firstName !== undefined
        ) {
          updateValues.firstName =
            input.firstName;
        }

        if (
          input.lastName !== undefined
        ) {
          updateValues.lastName =
            input.lastName;
        }

        if (
          input.phone !== undefined
        ) {
          updateValues.phone =
            input.phone;
        }

        if (
          input.addressLine1 !== undefined
        ) {
          updateValues.addressLine1 =
            input.addressLine1;
        }

        if (
          input.addressLine2 !== undefined
        ) {
          updateValues.addressLine2 =
            input.addressLine2;
        }

        if (
          input.city !== undefined
        ) {
          updateValues.city =
            input.city;
        }

        if (
          input.state !== undefined
        ) {
          updateValues.state =
            input.state;
        }

        if (
          input.country !== undefined
        ) {
          updateValues.country =
            input.country;
        }

        if (
          input.postalCode !== undefined
        ) {
          updateValues.postalCode =
            input.postalCode;
        }

        if (
          input.isDefault !== undefined
        ) {
          updateValues.isDefault =
            input.isDefault;
        }

        // ----------------------------------------------------
        // UPDATE
        // ----------------------------------------------------

        const [address] =
          await tx
            .update(addresses)
            .set(updateValues)
            .where(
              and(
                eq(
                  addresses.id,
                  params.id,
                ),

                eq(
                  addresses.userId,
                  user.id,
                ),
              ),
            )
            .returning();

        if (!address) {
          throw new ApiError(
            "Address could not be updated",
            500,
          );
        }

        return address;
      });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json({
      success: true,

      data: updatedAddress,

      message:
        "Address updated successfully",
    });
  } catch (error) {
    console.error(
      "PATCH /api/addresses/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}

// ============================================================
// DELETE /api/addresses/[id]
// ============================================================
//
// Delete an address belonging to the logged-in user.
//
// If the deleted address was the default address, another
// address is automatically promoted to default.
//
// ============================================================

export async function DELETE(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } =
      await context.params;

    const params =
      addressIdParamSchema.parse({
        id,
      });

    // --------------------------------------------------------
    // FIND ADDRESS
    // --------------------------------------------------------

    const existingAddress =
      await db.query.addresses.findFirst({
        where: {
          id: params.id,

          userId: user.id,
        },
      });

    if (!existingAddress) {
      throw new ApiError(
        "Address not found",
        404,
      );
    }

    // --------------------------------------------------------
    // DELETE ADDRESS
    // --------------------------------------------------------

    await db.transaction(async (tx) => {
      // ------------------------------------------------------
      // DELETE
      // ------------------------------------------------------

      await tx
        .delete(addresses)
        .where(
          and(
            eq(
              addresses.id,
              params.id,
            ),

            eq(
              addresses.userId,
              user.id,
            ),
          ),
        );

      // ------------------------------------------------------
      // IF DEFAULT WAS DELETED
      // ------------------------------------------------------

      if (existingAddress.isDefault) {
        const nextAddress =
          await tx.query.addresses.findFirst({
            where: {
              userId: user.id,
            },

            orderBy: {
              createdAt: "asc",
            },

            columns: {
              id: true,
            },
          });

        // ----------------------------------------------------
        // MAKE ANOTHER ADDRESS DEFAULT
        // ----------------------------------------------------

        if (nextAddress) {
          await tx
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
    });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json({
      success: true,

      message:
        "Address deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/addresses/[id] error:",
      error,
    );

    return handleApiError(error);
  }
}
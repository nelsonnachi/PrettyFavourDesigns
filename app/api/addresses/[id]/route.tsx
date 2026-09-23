import { NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";

import { addresses } from "@/db/schema";

import { db } from "@/db/drizzle";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { requireUser } from "@/lib/APIs/auth";

import { addressIdParamSchema, updateAddressSchema } from "@/lib/validations";

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

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } = await context.params;

    const params = addressIdParamSchema.parse({
      id,
    });

    // --------------------------------------------------------
    // FIND ADDRESS
    // --------------------------------------------------------

    const address = await db.query.addresses.findFirst({
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
      throw new ApiError("Address not found", 404);
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error("GET /api/addresses/[id] error:", error);

    return handleApiError(error);
  }
}

// ============================================================
// PATCH /api/addresses/[id]
// ============================================================

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } = await context.params;

    const params = addressIdParamSchema.parse({
      id,
    });

    // --------------------------------------------------------
    // FIND EXISTING ADDRESS
    // --------------------------------------------------------

    const existingAddress = await db.query.addresses.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      throw new ApiError("Address not found", 404);
    }

    // --------------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------------

    const body = await req.json();

    // --------------------------------------------------------
    // VALIDATE
    // --------------------------------------------------------

    const input = updateAddressSchema.parse(body);

    // --------------------------------------------------------
    // UPDATE ADDRESS
    // --------------------------------------------------------

    const updatedAddress = await db.transaction(async (tx) => {
      // ====================================================
      // CASE 1:
      // SET THIS ADDRESS AS DEFAULT
      // ====================================================

      if (input.isDefault === true) {
        // Remove default from every other
        // address belonging to this user.

        await tx
          .update(addresses)
          .set({
            isDefault: false,
            updatedAt: new Date(),
          })
          .where(
            and(eq(addresses.userId, user.id), eq(addresses.isDefault, true)),
          );
      }

      // ====================================================
      // CASE 2:
      // TRYING TO REMOVE DEFAULT
      // ====================================================

      if (input.isDefault === false && existingAddress.isDefault) {
        // Check whether the user has another address.

        const otherAddress = await tx.query.addresses.findFirst({
          where: {
            userId: user.id,
          },

          columns: {
            id: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        });

        // --------------------------------------------------
        // There is another address.
        // Promote it to default.
        // --------------------------------------------------

        if (otherAddress && otherAddress.id !== existingAddress.id) {
          await tx
            .update(addresses)
            .set({
              isDefault: true,
              updatedAt: new Date(),
            })
            .where(eq(addresses.id, otherAddress.id));

          // The current address must remain
          // non-default.
        } else {
          // ------------------------------------------------
          // This is the user's only address.
          //
          // We do not allow the user to have zero
          // default addresses.
          // ------------------------------------------------

          input.isDefault = true;
        }
      }

      // ====================================================
      // BUILD UPDATE VALUES
      // ====================================================

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

      // ----------------------------------------------------
      // FIRST NAME
      // ----------------------------------------------------

      if (input.firstName !== undefined) {
        updateValues.firstName = input.firstName;
      }

      // ----------------------------------------------------
      // LAST NAME
      // ----------------------------------------------------

      if (input.lastName !== undefined) {
        updateValues.lastName = input.lastName;
      }

      // ----------------------------------------------------
      // PHONE
      // ----------------------------------------------------

      if (input.phone !== undefined) {
        updateValues.phone = input.phone;
      }

      // ----------------------------------------------------
      // ADDRESS LINE 1
      // ----------------------------------------------------

      if (input.addressLine1 !== undefined) {
        updateValues.addressLine1 = input.addressLine1;
      }

      // ----------------------------------------------------
      // ADDRESS LINE 2
      // ----------------------------------------------------

      if (input.addressLine2 !== undefined) {
        updateValues.addressLine2 = input.addressLine2;
      }

      // ----------------------------------------------------
      // CITY
      // ----------------------------------------------------

      if (input.city !== undefined) {
        updateValues.city = input.city;
      }

      // ----------------------------------------------------
      // STATE
      // ----------------------------------------------------

      if (input.state !== undefined) {
        updateValues.state = input.state;
      }

      // ----------------------------------------------------
      // COUNTRY
      // ----------------------------------------------------

      if (input.country !== undefined) {
        updateValues.country = input.country;
      }

      // ----------------------------------------------------
      // POSTAL CODE
      // ----------------------------------------------------

      if (input.postalCode !== undefined) {
        updateValues.postalCode = input.postalCode;
      }

      // ----------------------------------------------------
      // DEFAULT STATUS
      // ----------------------------------------------------

      if (input.isDefault !== undefined) {
        updateValues.isDefault = input.isDefault;
      }

      // ====================================================
      // UPDATE
      // ====================================================

      const [address] = await tx
        .update(addresses)
        .set(updateValues)
        .where(and(eq(addresses.id, params.id), eq(addresses.userId, user.id)))
        .returning();

      if (!address) {
        throw new ApiError("Address could not be updated", 500);
      }

      return address;
    });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json({
      success: true,

      data: updatedAddress,

      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/addresses/[id] error:", error);

    return handleApiError(error);
  }
}

// ============================================================
// DELETE /api/addresses/[id]
// ============================================================

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATE USER
    // --------------------------------------------------------

    const user = await requireUser();

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } = await context.params;

    const params = addressIdParamSchema.parse({
      id,
    });

    // --------------------------------------------------------
    // FIND ADDRESS
    // --------------------------------------------------------

    const existingAddress = await db.query.addresses.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingAddress) {
      throw new ApiError("Address not found", 404);
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
        .where(and(eq(addresses.id, params.id), eq(addresses.userId, user.id)));

      // ------------------------------------------------------
      // IF DEFAULT WAS DELETED
      // ------------------------------------------------------

      if (existingAddress.isDefault) {
        const nextAddress = await tx.query.addresses.findFirst({
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
        // PROMOTE NEXT ADDRESS
        // ----------------------------------------------------

        if (nextAddress) {
          await tx
            .update(addresses)
            .set({
              isDefault: true,
              updatedAt: new Date(),
            })
            .where(eq(addresses.id, nextAddress.id));
        }
      }
    });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json({
      success: true,

      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/addresses/[id] error:", error);

    return handleApiError(error);
  }
}

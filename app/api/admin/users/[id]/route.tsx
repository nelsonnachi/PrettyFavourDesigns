import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { requireAdmin, requireSuperAdmin } from "@/lib/APIs/auth";
import { ApiError, handleApiError } from "@/lib/APIs/api-errors";
import { updateAdminUserSchema, userIdParamSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ============================================================
// GET SINGLE USER
// ============================================================

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = userIdParamSchema.parse(await context.params);

    const user = await db.query.users.findFirst({
      where: { id },

      columns: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        phone: true,
        isBanned: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },

      with: {
        addresses: true,

        orders: {
          columns: {
            id: true,
            orderNumber: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
          },
        },

        cart: {
          with: {
            items: {
              columns: { id: true, quantity: true },
              with: {
                product: { columns: { id: true, name: true } },
                variant: { columns: { id: true } },
              },
            },
          },
        },

        ratings: {
          with: { product: { columns: { id: true, name: true } } },
        },

        wishlistItems: {
          with: { product: { columns: { id: true, name: true } } },
        },

        contactMessages: true,
        inventoryMovements: true,
      },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    return Response.json({ success: true, data: user });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// UPDATE USER
// ============================================================

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const admin = await requireAdmin();

    const { id } = userIdParamSchema.parse(await context.params);
    const data = updateAdminUserSchema.parse(await request.json());

    const existingUser = await db.query.users.findFirst({
      where: { id },
    });

    if (!existingUser) {
      throw new ApiError("User not found", 404);
    }

    if (existingUser.role === "super_admin" && admin.role !== "super_admin") {
      throw new ApiError("Only a super admin can modify a super admin", 403);
    }

    if (data.role !== undefined) {
      if (admin.role !== "super_admin") {
        throw new ApiError("Only a super admin can change user roles", 403);
      }

      if (existingUser.id === admin.id && data.role !== admin.role) {
        throw new ApiError("You cannot change your own role", 403);
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return Response.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// DELETE USER
// ============================================================

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const admin = await requireSuperAdmin();

    const { id } = userIdParamSchema.parse(await context.params);

    const existingUser = await db.query.users.findFirst({
      where: { id },
      columns: { id: true },
    });

    if (!existingUser) {
      throw new ApiError("User not found", 404);
    }

    if (existingUser.id === admin.id) {
      throw new ApiError("You cannot delete your own account", 403);
    }

    await db.delete(users).where(eq(users.id, id));

    return Response.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

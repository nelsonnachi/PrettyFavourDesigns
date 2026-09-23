import { NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { users } from "@/db/schema/users";
import { orders } from "@/db/schema/orders";

import { requireAdmin } from "@/lib/APIs/auth";

import { ApiError, handleApiError } from "@/lib/APIs/api-errors";

import { updateAdminUserSchema, userIdParamSchema } from "@/lib/validations";

// ============================================================
// GET SINGLE USER
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
    // ========================================================
    // 1. REQUIRE ADMIN
    // ========================================================

    await requireAdmin();

    // ========================================================
    // 2. GET AND VALIDATE USER ID
    // ========================================================

    const params = await context.params;

    const { id } = userIdParamSchema.parse(params);

    // ========================================================
    // 3. FIND USER
    // ========================================================

    const result = await db
      .select({
        id: users.id,

        clerkId: users.clerkId,

        email: users.email,

        firstName: users.firstName,

        lastName: users.lastName,

        imageUrl: users.imageUrl,

        phone: users.phone,

        role: users.role,

        isBanned: users.isBanned,

        createdAt: users.createdAt,

        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const user = result[0];

    // ========================================================
    // 4. MAKE SURE USER EXISTS
    // ========================================================

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // ========================================================
    // 5. GET USER ORDERS
    // ========================================================

    const userOrders = await db
      .select({
        id: orders.id,

        orderNumber: orders.orderNumber,

        status: orders.status,

        paymentStatus: orders.paymentStatus,

        paymentMethod: orders.paymentMethod,

        subtotal: orders.subtotal,

        shippingFee: orders.shippingFee,

        discount: orders.discount,

        total: orders.total,

        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(orders.createdAt);

    // ========================================================
    // 6. CALCULATE ORDER SUMMARY
    // ========================================================

    const totalOrders = userOrders.length;

    const totalSpent = userOrders.reduce((total, order) => {
      return total + Number(order.total);
    }, 0);

    // ========================================================
    // 7. RETURN USER
    // ========================================================

    return NextResponse.json({
      success: true,

      data: {
        user,

        summary: {
          totalOrders,

          totalSpent: totalSpent.toFixed(2),
        },

        orders: userOrders,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// UPDATE USER
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
    // ========================================================
    // 1. REQUIRE ADMIN
    // ========================================================

    const admin = await requireAdmin();

    // ========================================================
    // 2. GET AND VALIDATE USER ID
    // ========================================================

    const params = await context.params;

    const { id } = userIdParamSchema.parse(params);

    // ========================================================
    // 3. FIND USER
    // ========================================================

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const user = result[0];

    // ========================================================
    // 4. MAKE SURE USER EXISTS
    // ========================================================

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // ========================================================
    // 5. READ REQUEST BODY
    // ========================================================

    const body = await request.json();

    // ========================================================
    // 6. VALIDATE REQUEST BODY
    // ========================================================

    const data = updateAdminUserSchema.parse(body);

    // ========================================================
    // 7. MAKE SURE SOMETHING WAS PROVIDED
    // ========================================================

    if (Object.keys(data).length === 0) {
      throw new ApiError("At least one field is required", 400);
    }

    // ========================================================
    // 8. PROTECT SUPER ADMIN
    // ========================================================
    //
    // A normal admin should not be able to modify a
    // super admin account.
    //
    // Only a super admin can modify another super admin.
    //
    // ========================================================

    if (user.role === "super_admin" && admin.role !== "super_admin") {
      throw new ApiError("Only a super admin can modify a super admin", 403);
    }

    // ========================================================
    // 9. PREVENT ADMIN FROM CREATING SUPER ADMIN
    // ========================================================

    if (data.role === "super_admin" && admin.role !== "super_admin") {
      throw new ApiError(
        "Only a super admin can assign the super admin role",
        403,
      );
    }

    // ========================================================
    // 10. PREVENT SELF BAN
    // ========================================================

    if (id === admin.id && data.isBanned === true) {
      throw new ApiError("You cannot ban your own account", 400);
    }

    // ========================================================
    // 11. PREVENT SELF ROLE CHANGE
    // ========================================================

    if (
      id === admin.id &&
      data.role !== undefined &&
      data.role !== admin.role
    ) {
      throw new ApiError("You cannot change your own role", 400);
    }

    // ========================================================
    // 12. UPDATE USER
    // ========================================================

    const updatedResult = await db
      .update(users)
      .set({
        ...data,

        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    const updatedUser = updatedResult[0];

    // ========================================================
    // 13. MAKE SURE UPDATE SUCCEEDED
    // ========================================================

    if (!updatedUser) {
      throw new ApiError("Failed to update user", 500);
    }

    // ========================================================
    // 14. RETURN UPDATED USER
    // ========================================================

    return NextResponse.json({
      success: true,

      message: "User updated successfully",

      data: updatedUser,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

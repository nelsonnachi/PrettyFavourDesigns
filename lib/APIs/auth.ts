// lib/APIs/auth.ts

import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";

import { ApiError } from "./api-errors";

// ============================================================
// REQUIRE AUTHENTICATED USER
// ============================================================

/**
 * Makes sure:
 *
 * 1. The user is logged into Clerk
 * 2. The user exists in our PostgreSQL database
 * 3. The user is not banned
 *
 * Clerk is the source of truth for identity.
 * SHOPPFD PostgreSQL stores application-specific data.
 */
export async function requireUser() {
  // ----------------------------------------------------------
  // 1. Get the currently authenticated Clerk user
  // ----------------------------------------------------------

  const { userId } = await auth();

  if (!userId) {
    throw new ApiError(
      "Authentication required",
      401,
    );
  }

  // ----------------------------------------------------------
  // 2. Find the user in our database
  // ----------------------------------------------------------

  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  const existingUser = result[0];

  // ----------------------------------------------------------
  // 3. User exists
  // ----------------------------------------------------------

  if (existingUser) {
    if (existingUser.isBanned) {
      throw new ApiError(
        "Your account has been suspended",
        403,
      );
    }

    return existingUser;
  }

  // ----------------------------------------------------------
  // 4. Clerk user exists but database user doesn't
  //
  // This is a fallback in case the Clerk webhook has not
  // created the PostgreSQL record yet.
  // ----------------------------------------------------------

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new ApiError(
      "Authentication required",
      401,
    );
  }

  // ----------------------------------------------------------
  // 5. Get email from Clerk
  // ----------------------------------------------------------

  const email =
    clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase();

  if (!email) {
    throw new ApiError(
      "Your account does not have a valid email address",
      400,
    );
  }

  // ----------------------------------------------------------
  // 6. Create the database user
  // ----------------------------------------------------------

  const createdResult = await db
    .insert(users)
    .values({
      clerkId: userId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      role: "customer",
    })
    .onConflictDoNothing({
      target: users.clerkId,
    })
    .returning();

  const createdUser = createdResult[0];

  // ----------------------------------------------------------
  // 7. User was successfully created
  // ----------------------------------------------------------

  if (createdUser) {
    return createdUser;
  }

  // ----------------------------------------------------------
  // 8. Another request may have created the user at the same
  // time.
  //
  // Fetch the user again.
  // ----------------------------------------------------------

  const syncedResult = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  const syncedUser = syncedResult[0];

  if (!syncedUser) {
    throw new ApiError(
      "Unable to create user account",
      500,
    );
  }

  if (syncedUser.isBanned) {
    throw new ApiError(
      "Your account has been suspended",
      403,
    );
  }

  return syncedUser;
}

// ============================================================
// OPTIONAL AUTHENTICATION
// ============================================================

/**
 * Returns the current database user if authenticated.
 *
 * Returns null when the visitor is not logged in.
 */
export async function getOptionalUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return requireUser();
}

// ============================================================
// REQUIRE ADMIN
// ============================================================

export async function requireAdmin() {
  const user = await requireUser();

  if (
    user.role !== "admin" &&
    user.role !== "super_admin"
  ) {
    throw new ApiError(
      "Admin access required",
      403,
    );
  }

  return user;
}

// ============================================================
// REQUIRE SUPER ADMIN
// ============================================================

export async function requireSuperAdmin() {
  const user = await requireUser();

  if (user.role !== "super_admin") {
    throw new ApiError(
      "Super admin access required",
      403,
    );
  }

  return user;
}
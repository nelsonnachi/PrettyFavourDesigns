// lib/APIs/cart.ts

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { carts } from "@/db/schema/carts";
import { requireUser } from "@/lib/APIs/auth";
import { ApiError } from "@/lib/APIs/api-errors";

// ============================================================
// CONSTANTS
// ============================================================

export const GUEST_CART_COOKIE = "shoppfd_guest_cart";

export const GUEST_CART_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// ============================================================
// GET OR CREATE CART
// ============================================================
//
// This helper handles both:
//
// 1. Logged-in users
// 2. Guest users
//
// Logged-in user:
//     cart.userId = database user ID
//
// Guest:
//     cart.sessionId = cookie value
//
// ============================================================

export async function getOrCreateCart() {
  const cookieStore = await cookies();

  // ----------------------------------------------------------
  // Check if the user is logged in
  // ----------------------------------------------------------

  const user = await getOptionalCartUser();

  // ==========================================================
  // LOGGED-IN USER
  // ==========================================================

  if (user) {
    // Find existing user cart
    const existingCart = await db.query.carts.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (existingCart) {
      return {
        cart: existingCart,
        user,
        isGuest: false,
        sessionId: null,
      };
    }

    // --------------------------------------------------------
    // No cart yet → create one
    // --------------------------------------------------------

    const result = await db
      .insert(carts)
      .values({
        userId: user.id,
      })
      .returning();

    const newCart = result[0];

    if (!newCart) {
      throw new ApiError(
        "Failed to create cart",
        500,
      );
    }

    return {
      cart: newCart,
      user,
      isGuest: false,
      sessionId: null,
    };
  }

  // ==========================================================
  // GUEST USER
  // ==========================================================

  let sessionId = cookieStore.get(
    GUEST_CART_COOKIE,
  )?.value;

  // ----------------------------------------------------------
  // Existing guest cart
  // ----------------------------------------------------------

  if (sessionId) {
    const existingCart =
      await db.query.carts.findFirst({
        where: {
          sessionId,
        },
      });

    if (existingCart) {
      return {
        cart: existingCart,
        user: null,
        isGuest: true,
        sessionId,
      };
    }
  }

  // ----------------------------------------------------------
  // Create a new guest session ID
  // ----------------------------------------------------------

  sessionId = crypto.randomUUID();

  const result = await db
    .insert(carts)
    .values({
      sessionId,
    })
    .returning();

  const newCart = result[0];

  if (!newCart) {
    throw new ApiError(
      "Failed to create guest cart",
      500,
    );
  }

  // ----------------------------------------------------------
  // Save guest cart session in cookie
  // ----------------------------------------------------------

  cookieStore.set(
    GUEST_CART_COOKIE,
    sessionId,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: GUEST_CART_MAX_AGE,
    },
  );

  return {
    cart: newCart,
    user: null,
    isGuest: true,
    sessionId,
  };
}

// ============================================================
// OPTIONAL CART USER
// ============================================================
//
// We intentionally do NOT use requireUser() here because
// guests are allowed to have carts.
//
// ============================================================

async function getOptionalCartUser() {
  try {
    return await requireUser();
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.statusCode === 401
    ) {
      return null;
    }

    throw error;
  }
}
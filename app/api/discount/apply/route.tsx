// app/api/discount/apply/route.ts

import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { requireUser } from "@/lib/APIs/auth";
import { handleApiError } from "@/lib/APIs/api-errors";
import { getOrCreateCart } from "@/lib/APIs/cart";
import { checkDiscount } from "@/lib/APIs/discount";
import type { DiscountItem } from "@/lib/APIs/discount";

import { applyDiscountSchema } from "@/lib/validations/discount";

// ============================================================
// APPLY DISCOUNT (CART PREVIEW)
// ============================================================
//
// The customer types a code in the cart. This route checks it
// and returns how much they would save.
//
// It does NOT save anything. The real discount is applied
// later, inside the checkout route.
//
// ============================================================

export async function POST(request: Request) {
  try {
    // ========================================================
    // 1. REQUIRE LOGGED-IN USER
    // ========================================================

    const user = await requireUser();

    // ========================================================
    // 2. VALIDATE THE REQUEST BODY
    // ========================================================
    //
    // Expected body: { "code": "BLACKFRIDAY" }
    // The schema also trims and uppercases the code.

    const body = await request.json();

    const { code } = applyDiscountSchema.parse(body);

    // ========================================================
    // 3. GET THE USER'S CART
    // ========================================================

    const { cart } = await getOrCreateCart();

    const cartWithItems = await db.query.carts.findFirst({
      where: {
        id: cart.id,
      },

      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!cartWithItems || cartWithItems.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty",
        },
        {
          status: 400,
        },
      );
    }

    // ========================================================
    // 4. BUILD THE LIST OF ITEMS + THE SUBTOTAL
    // ========================================================

    const discountItems: DiscountItem[] = [];

    let subtotal = 0;

    for (const item of cartWithItems.items) {
      const product = item.product;

      // Skip anything that can't be bought anymore.
      // (Checkout will show a proper error for these.)
      if (!product || product.status !== "active" || product.deletedAt) {
        continue;
      }

      const price = Number(product.price);

      subtotal += price * item.quantity;

      discountItems.push({
        productId: product.id,
        categoryId: product.categoryId,
        price,
        quantity: item.quantity,
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;

    // ========================================================
    // 5. CHECK THE DISCOUNT
    // ========================================================
    //
    // checkDiscount needs a transaction ("tx"), so we open one.
    // Nothing is written, it is only used for reading.

    const result = await db.transaction(async (tx) => {
      return await checkDiscount(tx, {
        code,
        userId: user.id,
        items: discountItems,
      });
    });

    // ========================================================
    // 6. WORK OUT THE NEW TOTAL
    // ========================================================

    const shippingFee = 0;

    const total =
      Math.round((subtotal + shippingFee - result.discountAmount) * 100) / 100;

    // ========================================================
    // 7. SEND THE RESULT
    // ========================================================

    return NextResponse.json({
      success: true,

      message: "Discount applied",

      data: {
        code: result.discount.code,

        name: result.discount.name,

        subtotal,

        discountAmount: result.discountAmount,

        shippingFee,

        total,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

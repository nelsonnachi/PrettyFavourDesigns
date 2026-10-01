// lib/APIs/discount.ts

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { discounts, discountUsages } from "@/db/schema/discounts";
import { ApiError } from "@/lib/APIs/api-errors";

// ============================================================
// TYPES
// ============================================================

// The type of "tx" inside db.transaction(async (tx) => { ... })
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// One cart item, with only what the discount needs
export type DiscountItem = {
  productId: string;
  categoryId: string;
  price: number; // price of ONE item, in naira
  quantity: number;
};

// ============================================================
// HELPER: round money to 2 decimal places
// ============================================================

function round2(amount: number) {
  return Math.round(amount * 100) / 100;
}

// ============================================================
// 1. CHECK DISCOUNT
// ============================================================
//
// Looks up the code, checks every rule, and works out how much
// money to take off. It does NOT save anything.
//
// If something is wrong it throws an ApiError with a friendly
// message, and your handleApiError sends it back to the user.
//
// ============================================================

export async function checkDiscount(
  tx: Tx,
  input: {
    code: string;
    userId: string;
    items: DiscountItem[];
  }
) {
  const { userId, items } = input;

  // Codes are always saved in uppercase
  const code = input.code.trim().toUpperCase();

  // ----------------------------------------------------------
  // Find the discount (with its products, categories, customers)
  // ----------------------------------------------------------

  const discount = await tx.query.discounts.findFirst({
    where: {
      code,
    },

    with: {
      // Only the ids, we don't need the full rows
      products: { columns: { id: true } },
      categories: { columns: { id: true } },

      // Only loads THIS user if they are on the customer list
      customers: {
        columns: { id: true },
        where: { id: userId },
      },
    },
  });

  if (!discount || !discount.isActive) {
    throw new ApiError("Invalid discount code", 400);
  }

  // ----------------------------------------------------------
  // Check the dates
  // ----------------------------------------------------------

  const now = new Date();

  if (discount.startsAt > now) {
    throw new ApiError("This discount has not started yet", 400);
  }

  if (discount.endsAt && discount.endsAt < now) {
    throw new ApiError("This discount has expired", 400);
  }

  // ----------------------------------------------------------
  // Check the total usage limit
  // ----------------------------------------------------------

  if (
    discount.usageLimit !== null &&
    discount.usageCount >= discount.usageLimit
  ) {
    throw new ApiError("This discount has reached its usage limit", 400);
  }

  // ----------------------------------------------------------
  // Check if this customer is allowed to use it
  // ----------------------------------------------------------

  if (
    discount.eligibility === "specific_customers" &&
    discount.customers.length === 0
  ) {
    throw new ApiError("This discount is not available for your account", 400);
  }

  // ----------------------------------------------------------
  // Check the per-customer limit
  // ----------------------------------------------------------

  if (discount.usageLimitPerCustomer !== null) {
    // How many times has this user already used this discount?
    const timesUsed = await tx.$count(
      discountUsages,
      and(
        eq(discountUsages.discountId, discount.id),
        eq(discountUsages.userId, userId)
      )
    );

    if (timesUsed >= discount.usageLimitPerCustomer) {
      throw new ApiError("You have already used this discount", 400);
    }
  }

  // ----------------------------------------------------------
  // Find the cart items this discount applies to
  // ----------------------------------------------------------

  const productIds = discount.products.map((product) => product.id);
  const categoryIds = discount.categories.map((category) => category.id);

  const eligibleItems = items.filter((item) => {
    if (discount.appliesTo === "products") {
      return productIds.includes(item.productId);
    }

    if (discount.appliesTo === "categories") {
      return categoryIds.includes(item.categoryId);
    }

    // appliesTo === "order": every item counts
    return true;
  });

  if (eligibleItems.length === 0) {
    throw new ApiError(
      "This discount does not apply to the items in your cart",
      400
    );
  }

  // Total quantity and total price of the eligible items
  let eligibleQuantity = 0;
  let eligibleTotal = 0;

  for (const item of eligibleItems) {
    eligibleQuantity += item.quantity;
    eligibleTotal += item.price * item.quantity;
  }

  eligibleTotal = round2(eligibleTotal);

  // ----------------------------------------------------------
  // Check the purchase conditions
  // ----------------------------------------------------------

  if (
    discount.minimumQuantity !== null &&
    eligibleQuantity < discount.minimumQuantity
  ) {
    throw new ApiError(
      `Add at least ${discount.minimumQuantity} eligible items to use this discount`,
      400
    );
  }

  if (
    discount.minimumPurchaseAmount !== null &&
    eligibleTotal < Number(discount.minimumPurchaseAmount)
  ) {
    throw new ApiError(
      "Your cart does not meet the minimum amount for this discount",
      400
    );
  }

  // ----------------------------------------------------------
  // Work out the discount amount
  // ----------------------------------------------------------

  let discountAmount = 0;

  if (discount.type === "percentage") {
    // 20% of 50,000 = 10,000
    discountAmount = (eligibleTotal * Number(discount.value)) / 100;
  } else {
    // fixed: take off a set amount, e.g. 5,000
    discountAmount = Number(discount.value);
  }

  // Never take off more than the maximum allowed
  if (discount.maximumDiscountAmount !== null) {
    discountAmount = Math.min(
      discountAmount,
      Number(discount.maximumDiscountAmount)
    );
  }

  // Never take off more than the eligible items cost
  discountAmount = Math.min(discountAmount, eligibleTotal);

  return {
    discount,
    discountAmount: round2(discountAmount),
  };
}

// ============================================================
// 2. RECORD DISCOUNT USAGE
// ============================================================
//
// Call this AFTER the order has been created, inside the same
// transaction. It reserves one use of the discount.
//
// ============================================================

export async function recordDiscountUsage(
  tx: Tx,
  input: {
    discountId: string;
    userId: string;
    orderId: string;
    discountAmount: number;
  }
) {
  // Lock the discount row so two checkouts can't use the last
  // remaining use at the same time. The second one waits here.
  const lockedResult = await tx
    .select()
    .from(discounts)
    .where(eq(discounts.id, input.discountId))
    .for("update")
    .limit(1);

  const locked = lockedResult[0];

  if (!locked) {
    throw new ApiError("Invalid discount code", 400);
  }

  // Check the limits again now that the row is locked
  if (locked.usageLimit !== null && locked.usageCount >= locked.usageLimit) {
    throw new ApiError("This discount has reached its usage limit", 400);
  }

  if (locked.usageLimitPerCustomer !== null) {
    const timesUsed = await tx.$count(
      discountUsages,
      and(
        eq(discountUsages.discountId, input.discountId),
        eq(discountUsages.userId, input.userId)
      )
    );

    if (timesUsed >= locked.usageLimitPerCustomer) {
      throw new ApiError("You have already used this discount", 400);
    }
  }

  // Add 1 to the usage count
  await tx
    .update(discounts)
    .set({
      usageCount: sql`${discounts.usageCount} + 1`,
    })
    .where(eq(discounts.id, input.discountId));

  // Save a record of this use
  await tx.insert(discountUsages).values({
    discountId: input.discountId,
    userId: input.userId,
    orderId: input.orderId,
    discountAmount: input.discountAmount.toFixed(2),
  });
}

// ============================================================
// 3. RELEASE DISCOUNT USAGE
// ============================================================
//
// Call this when an order is cancelled or its payment fails,
// so the customer (and the store) get the use back.
// It is safe to call more than once for the same order.
//
// ============================================================

export async function releaseDiscountUsage(tx: Tx, orderId: string) {
  // Delete the usage record for this order (if there is one)
  const deleted = await tx
    .delete(discountUsages)
    .where(eq(discountUsages.orderId, orderId))
    .returning({ discountId: discountUsages.discountId });

  const usage = deleted[0];

  // No record = no discount was used, or it was already released
  if (!usage) return;

  // Subtract 1 from the usage count (never below 0)
  await tx
    .update(discounts)
    .set({
      usageCount: sql`greatest(${discounts.usageCount} - 1, 0)`,
    })
    .where(eq(discounts.id, usage.discountId));
}

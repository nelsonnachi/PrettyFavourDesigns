// lib/APIs/discount-admin.ts
//
// Small helpers shared by the admin "create" and "update"
// discount routes, so we don't write the same code twice.

import { eq, inArray } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { categories } from "@/db/schema/categories";
import {
  discountCategories,
  discountCustomers,
  discountProducts,
} from "@/db/schema/discounts";
import { products } from "@/db/schema/products";
import { users } from "@/db/schema/users";

import { ApiError } from "@/lib/APIs/api-errors";
import type { CreateDiscountInput } from "@/lib/validations/discount";

// The type of "tx" inside db.transaction(async (tx) => { ... })
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// ============================================================
// 1. REMOVE EMPTY VALUES FROM THE REQUEST BODY
// ============================================================
//
// An empty form field can arrive as null or "". Zod would turn
// those into 0, which is wrong. So we remove them first, and
// Zod treats the field as "not provided".
//
// { name: "Sale", usageLimit: null }  becomes  { name: "Sale" }
//
// ============================================================

export function removeEmptyValues(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return body;
  }

  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    if (value !== null && value !== "") {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

// ============================================================
// 2. CONVERT VALIDATED DATA INTO DATABASE COLUMNS
// ============================================================
//
// Zod gives us numbers. Our "decimal" columns want strings
// like "5000.00", and empty optional fields must become null.
//
// ============================================================

export function toDiscountValues(data: CreateDiscountInput) {
  return {
    name: data.name,
    description: data.description ?? null,
    code: data.code,

    type: data.type,
    value: data.value.toFixed(2),

    appliesTo: data.appliesTo,
    eligibility: data.eligibility,

    minimumPurchaseAmount: data.minimumPurchaseAmount?.toFixed(2) ?? null,
    maximumDiscountAmount: data.maximumDiscountAmount?.toFixed(2) ?? null,
    minimumQuantity: data.minimumQuantity ?? null,

    usageLimit: data.usageLimit ?? null,
    usageLimitPerCustomer: data.usageLimitPerCustomer ?? null,

    isActive: data.isActive,

    startsAt: data.startsAt,
    endsAt: data.endsAt ?? null,
  };
}

// ============================================================
// 3. SAVE THE PRODUCTS / CATEGORIES / CUSTOMERS LISTS
// ============================================================
//
// These live in three small "junction" tables.
//
// The simplest safe way to update them is:
//   1. delete the old rows for this discount
//   2. insert the new rows
//
// Only the list that matters is saved. For example, if the
// discount applies to the whole order, no products are saved.
//
// ============================================================

export async function saveDiscountTargets(
  tx: Tx,
  discountId: string,
  data: CreateDiscountInput,
) {
  // ----------------------------------------------------------
  // Step 1: delete the old lists
  // ----------------------------------------------------------

  await tx
    .delete(discountProducts)
    .where(eq(discountProducts.discountId, discountId));

  await tx
    .delete(discountCategories)
    .where(eq(discountCategories.discountId, discountId));

  await tx
    .delete(discountCustomers)
    .where(eq(discountCustomers.discountId, discountId));

  // ----------------------------------------------------------
  // Step 2: save the products list
  // ----------------------------------------------------------

  if (data.appliesTo === "products") {
    // new Set(...) removes duplicate ids
    const productIds = [...new Set(data.productIds)];

    const found = await tx.$count(products, inArray(products.id, productIds));

    if (found !== productIds.length) {
      throw new ApiError("One or more products were not found", 400);
    }

    await tx
      .insert(discountProducts)
      .values(productIds.map((productId) => ({ discountId, productId })));
  }

  // ----------------------------------------------------------
  // Step 3: save the categories list
  // ----------------------------------------------------------

  if (data.appliesTo === "categories") {
    const categoryIds = [...new Set(data.categoryIds)];

    const found = await tx.$count(
      categories,
      inArray(categories.id, categoryIds),
    );

    if (found !== categoryIds.length) {
      throw new ApiError("One or more categories were not found", 400);
    }

    await tx
      .insert(discountCategories)
      .values(categoryIds.map((categoryId) => ({ discountId, categoryId })));
  }

  // ----------------------------------------------------------
  // Step 4: save the customers list
  // ----------------------------------------------------------

  if (data.eligibility === "specific_customers") {
    const customerIds = [...new Set(data.customerIds)];

    const found = await tx.$count(users, inArray(users.id, customerIds));

    if (found !== customerIds.length) {
      throw new ApiError("One or more customers were not found", 400);
    }

    await tx
      .insert(discountCustomers)
      .values(customerIds.map((userId) => ({ discountId, userId })));
  }
}
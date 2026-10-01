import { apiClient } from "@/lib/api/client";

import type {
  ApplyDiscountRequest,
  ApplyDiscountResponse,
} from "./discount-types";

// ============================================================
// APPLY DISCOUNT (CART PREVIEW)
// ============================================================
//
// Asks the server: "if I use this code, how much do I save?"
// Nothing is saved on the server.
//
// ============================================================

export async function applyDiscount(data: ApplyDiscountRequest) {
  return apiClient<ApplyDiscountResponse>("/api/discount/apply", {
    method: "POST",

    body: JSON.stringify(data),
  });
}
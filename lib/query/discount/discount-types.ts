// ============================================================
// DISCOUNT TYPES
// ============================================================

// ------------------------------------------------------------
// APPLY DISCOUNT REQUEST
// ------------------------------------------------------------

export type ApplyDiscountRequest = {
  code: string;
};

// ------------------------------------------------------------
// APPLY DISCOUNT RESPONSE
// ------------------------------------------------------------
//
// These are plain numbers (not strings), because the
// /api/discount/apply route sends numbers.
//
// ------------------------------------------------------------

export type ApplyDiscountResponse = {
  success: boolean;

  message: string;

  data: {
    code: string;

    name: string;

    subtotal: number;

    discountAmount: number;

    shippingFee: number;

    total: number;
  };
};
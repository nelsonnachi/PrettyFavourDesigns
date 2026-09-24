// ============================================================
// CHECKOUT QUERY KEYS
// ============================================================

export const checkoutKeys = {
  all: ["checkout"] as const,

  checkout: () =>
    [...checkoutKeys.all, "checkout"] as const,

  payment: () =>
    [...checkoutKeys.all, "payment"] as const,

  paymentByReference: (reference: string) =>
    [
      ...checkoutKeys.payment(),
      "reference",
      reference,
    ] as const,
};
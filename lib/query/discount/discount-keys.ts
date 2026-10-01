// ============================================================
// DISCOUNT QUERY KEYS
// ============================================================

export const discountKeys = {
  // ----------------------------------------------------------
  // ROOT
  // ----------------------------------------------------------

  all: ["discount"] as const,

  // ----------------------------------------------------------
  // PREVIEW
  // ----------------------------------------------------------
  //
  // The cart subtotal is part of the key. When the customer
  // changes quantities, the subtotal changes, the key changes,
  // and the discount is checked again automatically.
  //
  // ----------------------------------------------------------

  preview: (code: string, subtotal: number) =>
    [...discountKeys.all, "preview", code, subtotal] as const,
};
// ============================================================
// CART TYPES
// ============================================================

// ------------------------------------------------------------
// CART PRODUCT
// ------------------------------------------------------------

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  imageUrl: string | null;
};

// ------------------------------------------------------------
// CART VARIANT
// ------------------------------------------------------------

export type CartVariant = {
  id: string;
  sku: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
};

// ------------------------------------------------------------
// CART ITEM
// ------------------------------------------------------------

export type CartItem = {
  id: string;
  quantity: number;

  product: CartProduct;

  variant: CartVariant;

  subtotal: number;
};

// ------------------------------------------------------------
// CART
// ------------------------------------------------------------

export type Cart = {
  id: string;

  items: CartItem[];

  totalItems: number;

  subtotal: number;

  itemCount: number;
};

// ------------------------------------------------------------
// GET CART RESPONSE
// ------------------------------------------------------------

export type CartResponse = {
  success: true;

  data: Cart;
};

// ------------------------------------------------------------
// ADD TO CART INPUT
// ------------------------------------------------------------

export type AddToCartInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

// ------------------------------------------------------------
// ADD TO CART RESPONSE
// ------------------------------------------------------------

export type AddToCartResponse = {
  success: true;

  message: string;

  data: {
    id: string;
    cartId: string;
    productId: string;
    variantId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
};

// ------------------------------------------------------------
// UPDATE CART ITEM INPUT
// ------------------------------------------------------------

export type UpdateCartItemInput = {
  id: string;
  quantity: number;
};

// ------------------------------------------------------------
// UPDATE CART ITEM RESPONSE
// ------------------------------------------------------------

export type UpdateCartItemResponse = {
  success: true;

  message: string;

  data: {
    id: string;
    cartId: string;
    productId: string;
    variantId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
};

// ------------------------------------------------------------
// DELETE CART ITEM RESPONSE
// ------------------------------------------------------------

export type RemoveCartItemResponse = {
  success: true;

  message: string;
};

// ------------------------------------------------------------
// CLEAR CART RESPONSE
// ------------------------------------------------------------

export type ClearCartResponse = {
  success: true;

  message: string;
};
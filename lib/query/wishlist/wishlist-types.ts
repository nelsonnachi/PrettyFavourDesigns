// ============================================================
// WISHLIST PRODUCT
// ============================================================

export interface WishlistProduct {
  id: string;

  name: string;

  slug: string;

  sku: string;

  price: string;

  compareAtPrice: string | null;

  status: string;

  isFeatured: boolean;

  isNewArrival: boolean;

  isBestSeller: boolean;

  averageRating: string;

  ratingCount: number;

  soldCount: number;

  // Primary product image
  image: string | null;
}

// ============================================================
// WISHLIST ITEM
// ============================================================

export interface WishlistItem {
  id: string;

  productId: string;

  createdAt: string;

  product: WishlistProduct;
}

// ============================================================
// WISHLIST CHECK ITEM
// ============================================================

export interface WishlistCheckItem {
  id: string;

  productId: string;

  createdAt: string;
}

// ============================================================
// ADD WISHLIST INPUT
// ============================================================

export interface AddWishlistInput {
  productId: string;
}

// ============================================================
// GET WISHLIST RESPONSE
// ============================================================

export interface WishlistResponse {
  success: boolean;

  data: WishlistItem[];

  count: number;
}

// ============================================================
// CHECK WISHLIST RESPONSE
// ============================================================

export interface WishlistCheckResponse {
  success: boolean;

  data: {
    isInWishlist: boolean;

    item: WishlistCheckItem | null;
  };
}

// ============================================================
// ADD WISHLIST RESPONSE
// ============================================================

export interface AddWishlistResponse {
  success: boolean;

  data: {
    id: string;

    userId: string;

    productId: string;

    createdAt: string;
  };

  message: string;
}

// ============================================================
// DELETE WISHLIST RESPONSE
// ============================================================

export interface DeleteWishlistResponse {
  success: boolean;

  message: string;
}
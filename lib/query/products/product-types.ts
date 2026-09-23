// ============================================================
// PRODUCT TYPES
// ============================================================

// ------------------------------------------------------------
// PRODUCT STATUS
// ------------------------------------------------------------

export type ProductStatus = "draft" | "active" | "out_of_stock" | "archived";

// ------------------------------------------------------------
// PRODUCT SORT
// ------------------------------------------------------------

export type ProductSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "rating"
  | "best_selling";

// ------------------------------------------------------------
// COLOR
// ------------------------------------------------------------

export type ProductColor = {
  id: string;
  name: string;
  hexCode: string | null;
  isActive: boolean;
  createdAt: string;
};

// ------------------------------------------------------------
// PRODUCT IMAGE
// ------------------------------------------------------------

export type ProductImage = {
  id: string;
  url: string;
  position: number;
  isPrimary: boolean;
  createdAt: string;
};

// ------------------------------------------------------------
// PUBLIC PRODUCT VARIANT
// ------------------------------------------------------------

export type PublicProductVariant = {
  id: string;
  productId: string;
  colorId: string;
  sku: string;

  color: ProductColor;

  availableStock: number;
  inStock: boolean;
};

// ------------------------------------------------------------
// ADMIN PRODUCT VARIANT
// ------------------------------------------------------------

export type AdminProductVariant = {
  id: string;
  productId: string;
  colorId: string;
  sku: string;

  stock: number;
  reservedStock: number;

  color: ProductColor;

  createdAt: string;
  updatedAt: string;
};

// ------------------------------------------------------------
// PRODUCT CATEGORY
// ------------------------------------------------------------

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

// ------------------------------------------------------------
// PUBLIC PRODUCT
// ------------------------------------------------------------

export type PublicProduct = {
  id: string;

  name: string;
  slug: string;
  sku: string;
  description: string;

  categoryId: string;

  category: ProductCategory;

  price: string;
  compareAtPrice: string | null;

  status: ProductStatus;

  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;

  averageRating: string;
  ratingCount: number;
  soldCount: number;

  metaTitle: string | null;
  metaDescription: string | null;

  images: ProductImage[];

  variants: PublicProductVariant[];

  createdAt: string;
  updatedAt: string;
};

// ------------------------------------------------------------
// PUBLIC PRODUCT DETAILS
// ------------------------------------------------------------

export type PublicProductDetails = PublicProduct & {
  hasAvailableStock: boolean;
};

// ------------------------------------------------------------
// ADMIN PRODUCT
// ------------------------------------------------------------

export type AdminProduct = {
  id: string;

  name: string;
  slug: string;
  sku: string;
  description: string;

  categoryId: string;

  category: ProductCategory;

  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;

  status: ProductStatus;

  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;

  averageRating: string;
  ratingCount: number;
  soldCount: number;

  metaTitle: string | null;
  metaDescription: string | null;

  images: ProductImage[];

  variants: AdminProductVariant[];

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
};

// ------------------------------------------------------------
// PAGINATION
// ------------------------------------------------------------

export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ------------------------------------------------------------
// PUBLIC PRODUCT LIST RESPONSE
// ------------------------------------------------------------

export type PublicProductListResponse = {
  success: true;

  data: PublicProduct[];

  pagination: ProductPagination;
};

// ------------------------------------------------------------
// PUBLIC PRODUCT DETAILS RESPONSE
// ------------------------------------------------------------

export type PublicProductResponse = {
  success: true;

  data: PublicProductDetails;
};

// ------------------------------------------------------------
// ADMIN PRODUCT LIST RESPONSE
// ------------------------------------------------------------

export type AdminProductListResponse = {
  success: true;

  data: AdminProduct[];

  pagination: ProductPagination;
};

// ------------------------------------------------------------
// ADMIN CREATE RESPONSE
// ------------------------------------------------------------

export type AdminCreateProductResponse = {
  success: true;

  data: AdminProduct;

  message: string;
};

// ------------------------------------------------------------
// ADMIN UPDATE RESPONSE
// ------------------------------------------------------------

export type AdminUpdateProductResponse = {
  success: true;

  data: AdminProduct;

  message: string;
};

// ------------------------------------------------------------
// ADMIN DELETE RESPONSE
// ------------------------------------------------------------

export type AdminDeleteProductResponse = {
  success: true;

  message: string;
};

// ------------------------------------------------------------
// PRODUCT FILTERS
// ------------------------------------------------------------

export type ProductFilters = {
  search?: string;

  categoryId?: string;

  colorId?: string;

  minPrice?: number;

  maxPrice?: number;

  status?: ProductStatus;

  inStock?: boolean;

  isFeatured?: boolean;

  isNewArrival?: boolean;

  isBestSeller?: boolean;

  page?: number;

  limit?: number;

  sort?: ProductSort;
};

// ------------------------------------------------------------
// PUBLIC FILTERS
// ------------------------------------------------------------
//
// Public users cannot filter by product status.
// The public API automatically returns active products only.
//
// ------------------------------------------------------------

export type PublicProductFilters = Omit<ProductFilters, "status">;

// ------------------------------------------------------------
// ADMIN FILTERS
// ------------------------------------------------------------

export type AdminProductFilters = ProductFilters;

// ------------------------------------------------------------
// RATINGS
// ------------------------------------------------------------

export type ProductRating = {
  id: string;

  rating: number;

  createdAt: string;

  updatedAt: string;

  user: {
    id: string;

    firstName: string | null;

    lastName: string | null;

    imageUrl: string | null;
  };
};

// ------------------------------------------------------------
// RATINGS RESPONSE
// ------------------------------------------------------------

export type ProductRatingsResponse = {
  success: true;

  data: ProductRating[];
};


// ------------------------------------------------------------
// ADMIN PRODUCT DETAILS RESPONSE
// ------------------------------------------------------------

export type AdminProductResponse = {
  success: true;

  data: AdminProduct;
};
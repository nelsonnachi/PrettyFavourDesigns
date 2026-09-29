// ============================================================
// INVENTORY STATUS
// ============================================================

export type InventoryStockStatus =
  | "all"
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

export type InventoryItemStockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

// ============================================================
// INVENTORY SORT
// ============================================================

export type InventorySort =
  | "recent"
  | "oldest"
  | "stock_asc"
  | "stock_desc"
  | "name_asc"
  | "name_desc";

// ============================================================
// INVENTORY QUERY
// ============================================================

export type AdminInventoryQuery = {
  page: number;
  limit: number;
  search: string;
  stockStatus: InventoryStockStatus;
  sort: InventorySort;
};

// ============================================================
// INVENTORY PRODUCT
// ============================================================

export type AdminInventoryProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  status: string;

  description: string | null;
  price: string | null;
  costPrice: string | null;
};

// ============================================================
// INVENTORY COLOR
// ============================================================

export type AdminInventoryColor = {
  id: string;
  name: string;
  hexCode: string | null;
  isActive: boolean;
};

// ============================================================
// INVENTORY ITEM
// ============================================================

export type AdminInventoryItem = {
  id: string;
  productId: string;
  colorId: string;

  sku: string;

  stock: number;
  reservedStock: number;
  availableStock: number;

  stockStatus: InventoryItemStockStatus;

  createdAt: string;
  updatedAt: string;

  product: AdminInventoryProduct;
  color: AdminInventoryColor;
};

// ============================================================
// INVENTORY PAGINATION
// ============================================================

export type AdminInventoryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// ============================================================
// INVENTORY LIST RESPONSE
// ============================================================

export type AdminInventoryResponse = {
  success: boolean;
  data: AdminInventoryItem[];
  pagination: AdminInventoryPagination;
};

// ============================================================
// INVENTORY MOVEMENT USER
// ============================================================

export type AdminInventoryMovementUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
};

// ============================================================
// INVENTORY MOVEMENT ORDER
// ============================================================

export type AdminInventoryMovementOrder = {
  id: string;
  orderNumber: string;
};

// ============================================================
// INVENTORY MOVEMENT
// ============================================================

export type AdminInventoryMovement = {
  id: string;
  quantityChange: number;
  reason: string;
  createdAt: string;

  user: AdminInventoryMovementUser | null;

  order: AdminInventoryMovementOrder | null;
};

// ============================================================
// INVENTORY DETAIL
// ============================================================

export type AdminInventoryDetail =
  AdminInventoryItem & {
    movements: AdminInventoryMovement[];
  };

// ============================================================
// INVENTORY DETAIL RESPONSE
// ============================================================

export type AdminInventoryDetailResponse = {
  success: boolean;
  data: AdminInventoryDetail;
};
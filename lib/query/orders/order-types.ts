// ============================================================
// ORDER TYPES
// ============================================================

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type PaymentMethod =
  | "paystack"
  | "cash_on_delivery";

// ============================================================
// PAGINATION
// ============================================================

export type OrderPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ============================================================
// CUSTOMER ORDER LIST ITEM
// GET /api/orders
// ============================================================

export type CustomerOrder = {
  id: string;
  orderNumber: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  subtotal: string;
  shippingFee: string;
  discount: string;
  total: string;

  itemCount: number;

  createdAt: string;
  updatedAt: string;
};

// ============================================================
// ORDER ITEM
// ============================================================

export type OrderItem = {
  id: string;

  orderId: string;

  productId: string | null;
  variantId: string | null;

  productName: string;
  productSku: string;

  variantSku: string | null;
  colorName: string | null;

  productImageUrl: string | null;

  quantity: number;

  unitPrice: string;
  totalPrice: string;

  createdAt: string;
};

// ============================================================
// PAYMENT
// ============================================================

export type OrderPayment = {
  id: string;

  provider: string;
  reference: string;

  amount: string;
  currency: string;

  status: string;

  paidAt: string | null;
  createdAt: string;

  updatedAt?: string;
};

// ============================================================
// CUSTOMER SINGLE ORDER
// GET /api/orders/[id]
// ============================================================

export type CustomerOrderDetails = {
  id: string;
  orderNumber: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  subtotal: string;
  shippingFee: string;
  discount: string;
  total: string;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
};

// ============================================================
// ADMIN CUSTOMER
// ============================================================

export type AdminOrderCustomer = {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

// ============================================================
// ADMIN ORDER LIST ITEM
// GET /api/admin/orders
// ============================================================

export type AdminOrder = {
  id: string;
  orderNumber: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  subtotal: string;
  shippingFee: string;
  discount: string;
  total: string;

  notes: string | null;

  createdAt: string;
  updatedAt: string;

  user: AdminOrderCustomer;
};

// ============================================================
// ADMIN SINGLE ORDER CUSTOMER
// ============================================================

export type AdminOrderCustomerDetails = {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
};

// ============================================================
// ADMIN SINGLE ORDER
// ============================================================

export type AdminOrderDetails = {
  order: {
    id: string;
    orderNumber: string;

    userId: string | null;

    status: OrderStatus;

    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;

    subtotal: string;
    shippingFee: string;
    discount: string;
    total: string;

    notes: string | null;

    createdAt: string;
    updatedAt: string;
  };

  customer: AdminOrderCustomerDetails;

  items: OrderItem[];

  payment: {
    id: string;
    provider: string;
    reference: string;
    amount: string;
    currency: string;
    status: string;
    gatewayResponse?: unknown;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

// ============================================================
// CUSTOMER ORDER LIST RESPONSE
// GET /api/orders
// ============================================================

export type CustomerOrdersResponse = {
  success: boolean;
  message: string;

  data: {
    orders: CustomerOrder[];
    pagination: OrderPagination;
  };
};

// ============================================================
// CUSTOMER SINGLE ORDER RESPONSE
// GET /api/orders/[id]
// ============================================================

export type CustomerOrderResponse = {
  success: boolean;
  message: string;

  data: {
    order: CustomerOrderDetails;
    items: OrderItem[];
    payment: OrderPayment | null;
  };
};

// ============================================================
// ADMIN ORDER LIST RESPONSE
// GET /api/admin/orders
// ============================================================

export type AdminOrdersResponse = {
  success: boolean;
  message: string;

  data: {
    orders: AdminOrder[];
    pagination: OrderPagination;
  };
};

// ============================================================
// ADMIN SINGLE ORDER RESPONSE
// GET /api/admin/orders/[id]
// ============================================================

export type AdminOrderResponse = {
  success: boolean;
  message: string;

  data: AdminOrderDetails;
};

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};

// ============================================================
// CUSTOMER ORDER FILTERS
// ============================================================

export type CustomerOrderQueryParams = {
  page?: number;
  limit?: number;
};

// ============================================================
// ADMIN ORDER FILTERS
// ============================================================

export type AdminOrderQueryParams = {
  page?: number;
  limit?: number;

  search?: string;

  status?: OrderStatus | "";

  paymentStatus?: PaymentStatus | "";

  paymentMethod?: PaymentMethod | "";
};
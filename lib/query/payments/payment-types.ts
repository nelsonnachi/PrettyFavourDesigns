// ============================================================
// PAYMENT STATUS
// ============================================================

export type AdminPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

// ============================================================
// PAYMENT METHOD
// ============================================================

export type AdminPaymentMethod =
  | "paystack"
  | "cash_on_delivery";

// ============================================================
// PAYMENT SORT
// ============================================================

export type AdminPaymentSort =
  | "newest"
  | "oldest"
  | "amount_asc"
  | "amount_desc";

// ============================================================
// SALES PERIOD
// ============================================================

export type AdminSalesPeriod = 7 | 30 | 90;

// ============================================================
// CUSTOMER
// ============================================================

export interface AdminPaymentCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  imageUrl: string | null;
}

// ============================================================
// PAYMENT ORDER
// ============================================================

export interface AdminPaymentOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: AdminPaymentStatus;
  paymentMethod: AdminPaymentMethod;
  subtotal: string;
  shippingFee: string;
  discount: string;
  total: string;
  createdAt: string;
  updatedAt: string;

  user: AdminPaymentCustomer | null;
}

// ============================================================
// PAYMENT
// ============================================================

export interface AdminPayment {
  id: string;
  orderId: string;
  provider: string;
  reference: string;
  amount: string;
  currency: string;
  status: AdminPaymentStatus;
  gatewayResponse: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;

  order: AdminPaymentOrder | null;
}

// ============================================================
// PAGINATION
// ============================================================

export interface AdminPaymentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================
// SALES SUMMARY
// ============================================================

export interface AdminSalesSummary {
  totalSales: string;

  period: AdminSalesPeriod;

  dailySales: Array<{
    date: string;
    label: string;
    sales: string;
  }>;
}

// ============================================================
// PAYMENT LIST RESPONSE
// ============================================================

export interface AdminPaymentsResponse {
  success: boolean;
  data: AdminPayment[];
  pagination: AdminPaymentPagination;
  summary: AdminSalesSummary;
}

// ============================================================
// PAYMENT ITEM
// ============================================================

export interface AdminPaymentOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  productSku: string;
  variantSku: string | null;
  colorName: string | null;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  createdAt: string;
}

// ============================================================
// SHIPPING ADDRESS
// ============================================================

export interface AdminPaymentShippingAddress {
  id: string;
  orderId: string;
  [key: string]: unknown;
}

// ============================================================
// REFUND
// ============================================================

export interface AdminPaymentRefund {
  id: string;
  paymentId: string;
  orderId: string;
  [key: string]: unknown;
}

// ============================================================
// PAYMENT DETAIL
// ============================================================

export interface AdminPaymentDetail
  extends Omit<AdminPayment, "order"> {
  order: (
    Omit<
      AdminPaymentOrder,
      "user"
    > & {
      checkoutIdempotencyKey: string;
      userId: string | null;
      notes: string | null;
      user: AdminPaymentCustomer | null;
      items: AdminPaymentOrderItem[];
      shippingAddress:
        | AdminPaymentShippingAddress
        | null;
    }
  ) | null;

  refunds: AdminPaymentRefund[];
}

// ============================================================
// PAYMENT DETAIL RESPONSE
// ============================================================

export interface AdminPaymentDetailResponse {
  success: boolean;
  data: AdminPaymentDetail;
}

// ============================================================
// PAYMENT FILTERS
// ============================================================

export interface AdminPaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminPaymentStatus;
  provider?: string;
  paymentMethod?: AdminPaymentMethod;
  sort?: AdminPaymentSort;
  period?: AdminSalesPeriod;
}
// ============================================================
// CHECKOUT TYPES
// ============================================================

// ============================================================
// PAYMENT METHOD
// ============================================================

export type PaymentMethod =
  | "paystack"
  | "cash_on_delivery";

// ============================================================
// ORDER STATUS
// ============================================================

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// ============================================================
// PAYMENT STATUS
// ============================================================

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

// ============================================================
// CHECKOUT REQUEST
// ============================================================

export type CheckoutRequest = {
  idempotencyKey: string;

  addressId: string;

  paymentMethod: PaymentMethod;

  notes?: string;
};

// ============================================================
// CHECKOUT PAYMENT
// ============================================================

export type CheckoutPayment = {
  id: string;

  provider: string;

  reference: string;

  amount: string;

  currency: string;

  status: PaymentStatus;
};

// ============================================================
// CHECKOUT ORDER
// ============================================================

export type CheckoutOrder = {
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

// ============================================================
// CHECKOUT RESPONSE
// ============================================================

export type CheckoutResponse = {
  success: boolean;

  message: string;

  data: {
    order: CheckoutOrder;

    payment: CheckoutPayment | null;

    alreadyCreated?: boolean;
  };
};

// ============================================================
// INITIALIZE PAYSTACK REQUEST
// ============================================================

export type InitializePaystackRequest = {
  orderId: string;
};

// ============================================================
// INITIALIZE PAYSTACK RESPONSE
// ============================================================

export type InitializePaystackResponse = {
  success: boolean;

  message: string;

  data: {
    paymentId: string;

    orderId: string;

    orderNumber: string;

    reference: string;

    authorizationUrl: string;

    accessCode: string;
  };
};

// ============================================================
// VERIFY PAYSTACK REQUEST
// ============================================================

export type VerifyPaystackRequest = {
  reference: string;
};

// ============================================================
// VERIFY PAYSTACK RESPONSE
// ============================================================

export type VerifyPaystackResponse = {
  success: boolean;

  message: string;

  data?: {
    paymentId: string;

    orderId: string;

    reference: string;

    status: PaymentStatus;

    orderStatus?: OrderStatus;

    paymentStatus?: PaymentStatus;

    paidAt?: string | null;

    paystackStatus?: string;

    alreadyCompleted?: boolean;

    alreadyReleased?: boolean;
  };
};
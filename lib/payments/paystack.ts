// ============================================================
// PAYSTACK TYPES
// ============================================================

type PaystackInitializeResponse = {
  status: boolean;
  message: string;

  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;

  data?: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    channel: string | null;
    gateway_response: string | null;
  };
};

// ============================================================
// PAYSTACK BASE URL
// ============================================================

const PAYSTACK_BASE_URL = "https://api.paystack.co";

// ============================================================
// GET PAYSTACK SECRET KEY
// ============================================================

function getPaystackSecretKey(): string {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured",
    );
  }

  return secretKey;
}

// ============================================================
// INITIALIZE TRANSACTION
// ============================================================

export async function initializePaystackTransaction(data: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const secretKey = getPaystackSecretKey();

  const amountInKobo = Math.round(data.amount * 100);

  if (!Number.isFinite(amountInKobo) || amountInKobo <= 0) {
    throw new Error("Invalid payment amount");
  }

  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/initialize`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: data.email,
        amount: amountInKobo,
        currency: "NGN",
        reference: data.reference,
        callback_url: data.callbackUrl,
        metadata: data.metadata,
      }),

      cache: "no-store",
    },
  );

  let result: PaystackInitializeResponse;

  try {
    result =
      (await response.json()) as PaystackInitializeResponse;
  } catch {
    throw new Error(
      "Invalid response received from Paystack",
    );
  }

  if (
    !response.ok ||
    !result.status ||
    !result.data
  ) {
    throw new Error(
      result.message ||
        "Failed to initialize Paystack transaction",
    );
  }

  return result.data;
}

// ============================================================
// VERIFY TRANSACTION
// ============================================================

export async function verifyPaystackTransaction(
  reference: string,
) {
  const secretKey = getPaystackSecretKey();

  const cleanReference = reference.trim();

  if (!cleanReference) {
    throw new Error("Payment reference is required");
  }

  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(
      cleanReference,
    )}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${secretKey}`,
      },

      cache: "no-store",
    },
  );

  let result: PaystackVerifyResponse;

  try {
    result =
      (await response.json()) as PaystackVerifyResponse;
  } catch {
    throw new Error(
      "Invalid response received from Paystack",
    );
  }

  if (
    !response.ok ||
    !result.status ||
    !result.data
  ) {
    throw new Error(
      result.message ||
        "Failed to verify Paystack transaction",
    );
  }

  return result.data;
}
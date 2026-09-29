import { NextRequest } from "next/server";

import { db } from "@/db/drizzle";
import { requireAdmin } from "@/lib/APIs/auth";
import { adminPaymentIdSchema } from "@/lib/validations/admin-payment";

export const runtime = "nodejs";

// ============================================================
// GET ADMIN PAYMENT DETAIL
// ============================================================

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // --------------------------------------------------------
    // ADMIN AUTH
    // --------------------------------------------------------

    await requireAdmin();

    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const { id } = await params;

    const parsed = adminPaymentIdSchema.safeParse({
      id,
    });

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid payment ID",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------------------------------
    // FETCH PAYMENT
    // --------------------------------------------------------

    const payment = await db.query.payments.findFirst({
      where: {
        id: parsed.data.id,
      },

      columns: {
        id: true,
        orderId: true,
        provider: true,
        reference: true,
        amount: true,
        currency: true,
        status: true,
        gatewayResponse: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true,
      },

      with: {
        order: {
          columns: {
            id: true,
            orderNumber: true,
            checkoutIdempotencyKey: true,
            userId: true,
            status: true,
            paymentStatus: true,
            paymentMethod: true,
            subtotal: true,
            shippingFee: true,
            discount: true,
            total: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
          },

          with: {
            user: {
              columns: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                imageUrl: true,
              },
            },

            items: {
              columns: {
                id: true,
                orderId: true,
                productId: true,
                variantId: true,
                productName: true,
                productSku: true,
                variantSku: true,
                colorName: true,
                productImageUrl: true,
                quantity: true,
                unitPrice: true,
                totalPrice: true,
                createdAt: true,
              },
            },

            shippingAddress: true,
          },
        },

        refunds: true,
      },
    });

    // --------------------------------------------------------
    // NOT FOUND
    // --------------------------------------------------------

    if (!payment) {
      return Response.json(
        {
          success: false,
          message: "Payment not found",
        },
        {
          status: 404,
        },
      );
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return Response.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("GET /api/admin/payments/[id] error:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch payment",
      },
      {
        status: 500,
      },
    );
  }
}

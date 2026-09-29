import { NextRequest } from "next/server";

import { db } from "@/db/drizzle";
import { requireAdmin } from "@/lib/APIs/auth";
import { adminPaymentFiltersSchema } from "@/lib/validations/admin-payment";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // ==========================================================
    // ADMIN AUTH
    // ==========================================================

    await requireAdmin();

    // ==========================================================
    // READ QUERY PARAMETERS
    // ==========================================================

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    // ==========================================================
    // VALIDATE QUERY PARAMETERS
    // ==========================================================

    const query = adminPaymentFiltersSchema.parse(searchParams);

    const offset = (query.page - 1) * query.limit;

    // ==========================================================
    // BUILD SEARCH FILTERS
    // ==========================================================

    const searchFilter = query.search
      ? {
          OR: [
            // Payment reference
            {
              reference: {
                ilike: `%${query.search}%`,
              },
            },

            // Order number
            {
              order: {
                orderNumber: {
                  ilike: `%${query.search}%`,
                },
              },
            },

            // Customer email
            {
              order: {
                user: {
                  email: {
                    ilike: `%${query.search}%`,
                  },
                },
              },
            },

            // Customer first name
            {
              order: {
                user: {
                  firstName: {
                    ilike: `%${query.search}%`,
                  },
                },
              },
            },

            // Customer last name
            {
              order: {
                user: {
                  lastName: {
                    ilike: `%${query.search}%`,
                  },
                },
              },
            },

            // Customer phone
            {
              order: {
                user: {
                  phone: {
                    ilike: `%${query.search}%`,
                  },
                },
              },
            },
          ],
        }
      : undefined;

    // ==========================================================
    // GET PAYMENTS
    // ==========================================================

    const rows = await db.query.payments.findMany({
      where: {
        AND: [
          // Payment status
          ...(query.status
            ? [
                {
                  status: query.status,
                },
              ]
            : []),

          // Payment provider
          ...(query.provider
            ? [
                {
                  provider: query.provider,
                },
              ]
            : []),

          // Order payment method
          ...(query.paymentMethod
            ? [
                {
                  order: {
                    paymentMethod: query.paymentMethod,
                  },
                },
              ]
            : []),

          // Search
          ...(searchFilter ? [searchFilter] : []),
        ],
      },

      // ========================================================
      // PAYMENT COLUMNS
      // ========================================================

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

      // ========================================================
      // ORDER RELATION
      // ========================================================

      with: {
        order: {
          columns: {
            id: true,
            orderNumber: true,
            status: true,
            paymentStatus: true,
            paymentMethod: true,
            subtotal: true,
            shippingFee: true,
            discount: true,
            total: true,
            createdAt: true,
            updatedAt: true,
          },

          // ====================================================
          // CUSTOMER RELATION
          // ====================================================

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
          },
        },
      },

      // ========================================================
      // SORTING
      // ========================================================

      orderBy: (payments, { asc, desc }) => {
        switch (query.sort) {
          case "oldest":
            return asc(payments.createdAt);

          case "amount_asc":
            return asc(payments.amount);

          case "amount_desc":
            return desc(payments.amount);

          case "newest":
          default:
            return desc(payments.createdAt);
        }
      },

      // ========================================================
      // PAGINATION
      // ========================================================

      limit: query.limit,
      offset,
    });

    // ==========================================================
    // GET TOTAL MATCHING PAYMENTS
    // ==========================================================
    //
    // We only need IDs here.
    // This keeps the count query simple and beginner-friendly.
    //
    // No db._
    // No as any
    // No manual joins
    //
    // ==========================================================

    const matchingPayments = await db.query.payments.findMany({
      where: {
        AND: [
          // Payment status
          ...(query.status
            ? [
                {
                  status: query.status,
                },
              ]
            : []),

          // Payment provider
          ...(query.provider
            ? [
                {
                  provider: query.provider,
                },
              ]
            : []),

          // Order payment method
          ...(query.paymentMethod
            ? [
                {
                  order: {
                    paymentMethod: query.paymentMethod,
                  },
                },
              ]
            : []),

          // Search
          ...(searchFilter ? [searchFilter] : []),
        ],
      },

      columns: {
        id: true,
      },
    });

    const total = matchingPayments.length;

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return Response.json({
      success: true,

      data: rows,

      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/payments error:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch payments",
      },
      {
        status: 500,
      },
    );
  }
}

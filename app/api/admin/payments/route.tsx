import { NextRequest } from "next/server";

import { db } from "@/db/drizzle";

import { requireAdmin } from "@/lib/APIs/auth";
import { adminPaymentFiltersSchema } from "@/lib/validations/admin-payment";

export const runtime = "nodejs";

type SalesPeriod = 7 | 30 | 90;

function getSalesPeriod(value: string | null): SalesPeriod {
  if (value === "30") {
    return 30;
  }

  if (value === "90") {
    return 90;
  }

  return 7;
}

function formatSalesLabel(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
}

function getNigeriaDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Africa/Lagos",
  }).format(date);
}

function getStartDate(period: SalesPeriod) {
  const now = new Date();

  const start = new Date(now);

  start.setDate(start.getDate() - (period - 1));

  start.setHours(0, 0, 0, 0);

  return start;
}

function createDateRange(period: SalesPeriod) {
  const dates: Date[] = [];

  const today = new Date();

  for (let index = period - 1; index >= 0; index--) {
    const date = new Date(today);

    date.setDate(date.getDate() - index);

    dates.push(date);
  }

  return dates;
}

function parseAmount(amount: string) {
  const value = Number(amount);

  return Number.isFinite(value) ? value : 0;
}

export async function GET(req: NextRequest) {
  try {
    // ========================================================
    // ADMIN AUTH
    // ========================================================

    await requireAdmin();

    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    const query = adminPaymentFiltersSchema.parse(searchParams);

    const period = getSalesPeriod(req.nextUrl.searchParams.get("period"));

    const offset = (query.page - 1) * query.limit;

    // ========================================================
    // BUILD PAYMENT FILTERS
    // ========================================================

    const searchFilter = query.search
      ? {
          OR: [
            {
              reference: {
                ilike: `%${query.search}%`,
              },
            },
            {
              order: {
                orderNumber: {
                  ilike: `%${query.search}%`,
                },
              },
            },
            {
              order: {
                user: {
                  email: {
                    ilike: `%${query.search}%`,
                  },
                },
              },
            },
            {
              order: {
                user: {
                  firstName: {
                    ilike: `%${query.search}%`,
                  },
                },
              },
            },
            {
              order: {
                user: {
                  lastName: {
                    ilike: `%${query.search}%`,
                  },
                },
              },
            },
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

    const paymentFilters = {
      AND: [
        ...(query.status
          ? [
              {
                status: query.status,
              },
            ]
          : []),

        ...(query.provider
          ? [
              {
                provider: query.provider,
              },
            ]
          : []),

        ...(query.paymentMethod
          ? [
              {
                order: {
                  paymentMethod: query.paymentMethod,
                },
              },
            ]
          : []),

        ...(searchFilter ? [searchFilter] : []),
      ],
    };

    // ========================================================
    // GET PAGINATED PAYMENTS
    // ========================================================

    const rows = await db.query.payments.findMany({
      where: paymentFilters,

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

      limit: query.limit,
      offset,
    });

    // ========================================================
    // GET TOTAL MATCHING PAYMENTS
    // ========================================================

    const matchingPayments = await db.query.payments.findMany({
      where: paymentFilters,

      columns: {
        id: true,
      },
    });

    const total = matchingPayments.length;

    // ========================================================
    // GET ALL PAID PAYMENTS
    //
    // This is separate from the paginated payment list.
    // Dashboard sales must not depend on page/limit/search.
    // ========================================================

    const paidPayments = await db.query.payments.findMany({
      where: {
        status: "paid",
      },

      columns: {
        amount: true,
        paidAt: true,
      },
    });

    // ========================================================
    // TOTAL SALES
    // ========================================================

    const totalSales = paidPayments.reduce(
      (total, payment) => total + parseAmount(payment.amount),
      0,
    );

    // ========================================================
    // DAILY SALES
    // ========================================================

    const startDate = getStartDate(period);

    const dailySalesMap = new Map<string, number>();

    for (const payment of paidPayments) {
      if (!payment.paidAt) {
        continue;
      }

      if (payment.paidAt < startDate) {
        continue;
      }

      const dateKey = getNigeriaDateKey(payment.paidAt);

      const current = dailySalesMap.get(dateKey) ?? 0;

      dailySalesMap.set(dateKey, current + parseAmount(payment.amount));
    }

    const dailySales = createDateRange(period).map((date) => {
      const dateKey = getNigeriaDateKey(date);

      return {
        date: dateKey,

        label: formatSalesLabel(date),

        sales: String(dailySalesMap.get(dateKey) ?? 0),
      };
    });

    // ========================================================
    // RESPONSE
    // ========================================================

    return Response.json({
      success: true,

      data: rows,

      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },

      summary: {
        totalSales: String(totalSales),

        period,

        dailySales,
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

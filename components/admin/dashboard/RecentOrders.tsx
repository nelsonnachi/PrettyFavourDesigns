"use client";

import { useAdminOrders } from "@/lib/query/orders/order-queries";


function getStatusClass(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-500/10 text-green-700";

    case "processing":
      return "bg-accent/10 text-accent";

    case "shipped":
      return "bg-secondary text-muted-foreground";

    case "cancelled":
      return "bg-red-500/10 text-red-700";

    case "pending":
      return "bg-muted text-muted-foreground";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "delivered":
      return "Delivered";

    case "processing":
      return "Processing";

    case "shipped":
      return "Shipped";

    case "cancelled":
      return "Cancelled";

    case "pending":
      return "Pending";

    default:
      return status;
  }
}

function getPaymentClass(paymentStatus: string) {
  switch (paymentStatus) {
    case "paid":
      return "bg-green-500/10 text-green-700";

    case "refunded":
      return "bg-red-500/10 text-red-700";

    case "partially_refunded":
      return "bg-accent/10 text-accent";

    case "failed":
      return "bg-red-500/10 text-red-700";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function getPaymentLabel(paymentStatus: string) {
  switch (paymentStatus) {
    case "paid":
      return "Paid";

    case "refunded":
      return "Refunded";

    case "partially_refunded":
      return "Partially Refunded";

    case "failed":
      return "Failed";

    case "pending":
      return "Pending";

    default:
      return paymentStatus;
  }
}

function formatCustomerName(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
) {
  const name = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || email || "Guest";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatCurrency(amount: string) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export function RecentOrders() {
  const { data, isLoading, isError } =
    useAdminOrders({
      page: 1,
      limit: 5,
    });

  const orders = data?.data.orders ?? [];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">
          Recent Orders
        </h2>

        <a
          href="/admin/orders"
          className="text-xs text-accent hover:underline"
        >
          View all →
        </a>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 font-medium">
                Order ID
              </th>

              <th className="pb-3 font-medium">
                Customer
              </th>

              <th className="pb-3 font-medium">
                Date
              </th>

              <th className="pb-3 font-medium">
                Amount
              </th>

              <th className="pb-3 font-medium">
                Payment
              </th>

              <th className="pb-3 font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Loading recent orders...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Unable to load recent orders.
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-4 text-sm font-medium">
                    {order.orderNumber}
                  </td>

                  <td className="py-4 text-sm">
                    {formatCustomerName(
                      order.user.firstName,
                      order.user.lastName,
                      order.user.email,
                    )}
                  </td>

                  <td className="py-4 text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="py-4 text-sm font-medium">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${getPaymentClass(
                        order.paymentStatus,
                      )}`}
                    >
                      {getPaymentLabel(
                        order.paymentStatus,
                      )}
                    </span>
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                        order.status,
                      )}`}
                    >
                      {getStatusLabel(
                        order.status,
                      )}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import Link from "next/link";
import {
  ArrowUpRight,
  Package,
} from "lucide-react";
import { AdminUserOrder } from "@/lib/query/customer/admin-user-types";



type CustomerOrdersProps = {
  orders: AdminUserOrder[];
};

export function CustomerOrders({
  orders,
}: CustomerOrdersProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-semibold">
            Orders
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Customer order history.
          </p>
        </div>

        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          text="This customer has no orders yet."
        />
      ) : (
        <div className="divide-y divide-border">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  #{order.orderNumber}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(
                    order.createdAt,
                  ).toLocaleDateString(
                    "en-NG",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                  {order.status}
                </span>

                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                  {order.paymentStatus}
                </span>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({
  icon: Icon,
  text,
}: {
  icon: typeof Package;
  text: string;
}) {
  return (
    <div className="p-10 text-center">
      <Icon className="mx-auto h-8 w-8 text-muted-foreground/50" />
      <p className="mt-3 text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
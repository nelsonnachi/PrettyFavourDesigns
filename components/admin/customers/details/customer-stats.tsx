import { AdminUserDetails } from "@/lib/query/customer/admin-user-types";
import {
  Heart,
  MessageSquare,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";


type CustomerStatsProps = {
  customer: AdminUserDetails;
};

export function CustomerStats({
  customer,
}: CustomerStatsProps) {
  const stats = [
    {
      label: "Orders",
      value: customer.orders.length,
      icon: Package,
    },
    {
      label: "Cart items",
      value:
        customer.cart?.items.length ?? 0,
      icon: ShoppingCart,
    },
    {
      label: "Wishlist",
      value: customer.wishlistItems.length,
      icon: Heart,
    },
    {
      label: "Ratings",
      value: customer.ratings.length,
      icon: Star,
    },
    {
      label: "Messages",
      value: customer.contactMessages.length,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>

              <span className="text-2xl font-bold">
                {stat.value}
              </span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
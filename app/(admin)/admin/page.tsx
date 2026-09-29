import {
  Box,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";

import { StatCard } from "@/components/admin/dashboard/StatCard";
import { SalesOverview } from "@/components/admin/dashboard/SalesOverview";
import { OrderStatusChart } from "@/components/admin/dashboard/OrderStatusChart";
import { TopProducts } from "@/components/admin/dashboard/TopProducts";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { LowStockAlert } from "@/components/admin/dashboard/LowStockAlert";

const stats = [
  {
    title: "Total Sales",
    value: "₦2,482,500",
    change: "12%",
    icon: Wallet,
  },
  {
    title: "Orders",
    value: "48",
    change: "8%",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    value: "24",
    change: "4%",
    icon: Box,
  },
  {
    title: "Customers",
    value: "36",
    change: "15%",
    icon: Users,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-7">
      {/* Heading */}
      <section>
        <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
          Good morning, Admin
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your store today.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </section>

      {/* Dashboard */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <SalesOverview />

          <RecentOrders />
        </div>

        <div className="space-y-6">
          <OrderStatusChart />

          <TopProducts />

          <LowStockAlert />
        </div>
      </section>
    </div>
  );
}
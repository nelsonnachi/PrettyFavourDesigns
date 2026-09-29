"use client";

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

import { useAdminOrders } from "@/lib/query/orders/order-queries";
import { useAdminProducts } from "@/lib/query/products/product-queries";

export default function AdminDashboardPage() {
  // ==========================================================
  // ORDERS
  // ==========================================================

  const ordersQuery = useAdminOrders({
    page: 1,
    limit: 1,
  });

  const totalOrders =
    ordersQuery.data?.data.pagination.total ?? 0;

  // ==========================================================
  // PRODUCTS
  // ==========================================================

  const productsQuery = useAdminProducts({
    page: 1,
    limit: 1,
  });

  const totalProducts =
    productsQuery.data?.pagination.total ?? 0;

  // ==========================================================
  // DASHBOARD STATS
  // ==========================================================

  const stats = [
    {
      title: "Total Sales",
      value: "₦2,482,500",
      icon: Wallet,
    },
    {
      title: "Orders",
      value: ordersQuery.isLoading
        ? "..."
        : ordersQuery.isError
          ? "—"
          : totalOrders.toLocaleString("en-NG"),
      icon: ShoppingBag,
    },
    {
      title: "Products",
      value: productsQuery.isLoading
        ? "..."
        : productsQuery.isError
          ? "—"
          : totalProducts.toLocaleString("en-NG"),
      icon: Box,
    },
    {
      title: "Customers",
      value: "36",
      icon: Users,
    },
  ];

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
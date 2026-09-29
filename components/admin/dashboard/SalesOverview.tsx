"use client";

import { useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminSales } from "@/lib/query/payments/payment-queries";

import type { AdminSalesPeriod } from "@/lib/query/payments/payment-types";

function formatCurrency(value: number) {
  return `₦${new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;
}

function formatFullCurrency(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export function SalesOverview() {
  const [period, setPeriod] = useState<AdminSalesPeriod>(7);

  const salesQuery = useAdminSales(period);

  const dailySales = salesQuery.data?.summary.dailySales ?? [];

  const chartData = dailySales.map((item) => ({
    day: item.label,

    sales: Number(item.sales),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif text-xl">Sales Overview</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your store's revenue for the last {period} days.
          </p>
        </div>

        <select
          value={period}
          onChange={(event) =>
            setPeriod(Number(event.target.value) as AdminSalesPeriod)
          }
          className="h-9 rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring/10"
        >
          <option value={7}>Last 7 days</option>

          <option value={30}>Last 30 days</option>

          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* ====================================================== */}
      {/* CHART */}
      {/* ====================================================== */}

      <div className="mt-6 h-[320px] w-full">
        {salesQuery.isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading sales...
          </div>
        ) : salesQuery.isError ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Unable to load sales data.
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No sales data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--accent)"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="100%"
                    stopColor="var(--accent)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
                dy={10}
                interval={period === 90 ? 9 : period === 30 ? 4 : 0}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
                tickFormatter={formatCurrency}
                width={65}
              />

              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                }}
                labelStyle={{
                  color: "var(--foreground)",
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  formatFullCurrency(Number(value)),
                  "Sales",
                ]}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--accent)"
                strokeWidth={2.5}
                fill="url(#salesGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Sep 18", sales: 150000 },
  { day: "Sep 19", sales: 390000 },
  { day: "Sep 20", sales: 280000 },
  { day: "Sep 21", sales: 510000 },
  { day: "Sep 22", sales: 420000 },
  { day: "Sep 23", sales: 590000 },
  { day: "Sep 24", sales: 820000 },
];

function formatCurrency(value: number) {
  return `₦${new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;
}

export function SalesOverview() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif text-xl">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your store's revenue for the last 7 days.
          </p>
        </div>

        <select
          defaultValue="7"
          className="h-9 rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring/10"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="salesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
              formatter={(value) => [
                `₦${Number(value).toLocaleString("en-NG")}`,
                "Sales",
              ]}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="var(--accent)"
              strokeWidth={2.5}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
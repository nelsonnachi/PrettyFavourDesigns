"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useAdminOrders } from "@/lib/query/orders/order-queries";

const colors = [
  "var(--accent)",
  "#f2a36f",
  "var(--secondary)",
  "var(--primary)",
  "#94a3b8",
];

export function OrderStatusChart() {
  const deliveredQuery = useAdminOrders({
    page: 1,
    limit: 1,
    status: "delivered",
  });

  const processingQuery = useAdminOrders({
    page: 1,
    limit: 1,
    status: "processing",
  });

  const shippedQuery = useAdminOrders({
    page: 1,
    limit: 1,
    status: "shipped",
  });

  const cancelledQuery = useAdminOrders({
    page: 1,
    limit: 1,
    status: "cancelled",
  });

  const pendingQuery = useAdminOrders({
    page: 1,
    limit: 1,
    status: "pending",
  });

  const data = [
    {
      name: "Delivered",
      value:
        deliveredQuery.data?.data.pagination.total ?? 0,
    },
    {
      name: "Processing",
      value:
        processingQuery.data?.data.pagination.total ?? 0,
    },
    {
      name: "Shipped",
      value:
        shippedQuery.data?.data.pagination.total ?? 0,
    },
    {
      name: "Cancelled",
      value:
        cancelledQuery.data?.data.pagination.total ?? 0,
    },
    {
      name: "Pending",
      value:
        pendingQuery.data?.data.pagination.total ?? 0,
    },
  ];

  const isLoading =
    deliveredQuery.isLoading ||
    processingQuery.isLoading ||
    shippedQuery.isLoading ||
    cancelledQuery.isLoading ||
    pendingQuery.isLoading;

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-serif text-xl">
        Order Status
      </h2>

      <div className="relative mx-auto mt-5 h-[190px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={colors[index]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-2xl">
            {isLoading ? "..." : total.toLocaleString()}
          </span>

          <span className="text-[11px] text-muted-foreground">
            Total Orders
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: colors[index],
              }}
            />

            <span className="flex-1 text-muted-foreground">
              {item.name}
            </span>

            <span className="font-medium">
              {isLoading
                ? "..."
                : item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
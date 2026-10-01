"use client";

import {
  BadgePercent,
  CheckCircle2,
  Clock3,
  TicketPercent,
} from "lucide-react";

interface DiscountStatsProps {
  total: number;
  active: number;
  scheduled: number;
  totalUsage: number;
}

export function DiscountStats({
  total,
  active,
  scheduled,
  totalUsage,
}: DiscountStatsProps) {
  const stats = [
    {
      label: "Total Discounts",
      value: total,
      icon: BadgePercent,
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle2,
    },
    {
      label: "Scheduled",
      value: scheduled,
      icon: Clock3,
    },
    {
      label: "Total Uses",
      value: totalUsage,
      icon: TicketPercent,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6f665f]">{stat.label}</p>

                <p className="mt-2 text-2xl font-semibold text-[#211b17]">
                  {stat.value.toLocaleString()}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f1ebe2]">
                <Icon className="h-5 w-5 text-[#e85d22]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
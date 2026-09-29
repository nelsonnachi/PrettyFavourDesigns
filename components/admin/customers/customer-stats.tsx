import {
  Users,
  UserCheck,
} from "lucide-react";

type CustomerStatsProps = {
  total: number;
  visible: number;
};

export function CustomerStats({
  total,
  visible,
}: CustomerStatsProps) {
  const stats = [
    {
      label: "Total customers",
      value: total,
      icon: Users,
      description: "Customers matching your filters",
    },
    {
      label: "Showing",
      value: visible,
      icon: UserCheck,
      description: "Customers on this page",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {stat.value.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
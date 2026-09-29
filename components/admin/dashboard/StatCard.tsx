import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  description?: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  description = "vs. last 7 days",
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        {title}
      </p>

      <div className="mt-1 flex items-end justify-between gap-3">
        <h2 className="font-serif text-3xl tracking-tight">
          {value}
        </h2>

        <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
          <ArrowUpRight size={13} />
          {change}
        </span>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
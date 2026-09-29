import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
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

      <h2 className="mt-1 font-serif text-3xl tracking-tight">
        {value}
      </h2>
    </div>
  );
}
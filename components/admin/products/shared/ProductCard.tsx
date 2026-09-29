import type { ReactNode } from "react";

interface ProductCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ProductCard({
  title,
  description,
  children,
  action,
  className = "",
}: ProductCardProps) {
  return (
    <section
      className={`rounded-2xl border bg-card shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AdminButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function AdminButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: AdminButtonProps) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-border bg-card text-foreground hover:bg-secondary",
    ghost:
      "text-muted-foreground hover:bg-secondary hover:text-foreground",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };

  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg",
        "font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring/20",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
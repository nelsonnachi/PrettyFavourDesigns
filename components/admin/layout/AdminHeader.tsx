"use client";

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden max-w-[430px] flex-1 md:block">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="search"
            placeholder="Search orders, products, customers..."
            className="h-11 w-full rounded-lg border border-input bg-card pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/10"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <Bell size={19} />

            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-accent" />
          </button>

          <div className="h-7 w-px bg-border" />

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-secondary"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium">
              A
            </div>

            <span className="hidden text-sm font-medium sm:block">
              Admin
            </span>

            <ChevronDown
              size={16}
              className="hidden text-muted-foreground sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
"use client";

import { UserButton } from "@clerk/nextjs";

import {
  Bell,
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
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card lg:hidden"
          aria-label="Open navigation"
        >
          <Menu
            size={20}
            strokeWidth={1.8}
          />
        </button>

        {/* Search */}
        <div className="relative hidden max-w-[430px] flex-1 md:block">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.8}
          />

          <input
            type="search"
            placeholder="Search orders, products, customers..."
            className="h-11 w-full rounded-lg border border-input bg-card pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/10"
          />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
          >
            <Bell
              size={19}
              strokeWidth={1.8}
            />

            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-accent" />
          </button>

          <div className="h-7 w-px bg-border" />

          {/* Clerk account */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
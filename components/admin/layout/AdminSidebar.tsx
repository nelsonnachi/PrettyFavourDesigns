"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { adminNavigation } from "./admin-navigation";
import { useAdminUnreadContactMessageCount } from "@/lib/query/contact-messages/contact-message-queries";


export function AdminSidebar() {
  const pathname = usePathname();

  const {
    data: unreadCount = 0,
  } =
    useAdminUnreadContactMessageCount();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-24 items-center px-7">
        <Link href="/admin">
          <div className="font-serif text-[25px] tracking-[0.18em]">
            SHOPPFD
          </div>

          <div className="-mt-1 text-center text-[7px] font-medium tracking-[0.35em] text-muted-foreground">
            BAGS · AFRICA
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {adminNavigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const showUnreadBadge =
              item.href === "/admin/messages" &&
              unreadCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group flex h-11 items-center gap-3 rounded-lg px-4 text-sm transition-colors",
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                ].join(" ")}
              >
                <Icon
                  size={18}
                  strokeWidth={
                    active ? 2.2 : 1.8
                  }
                />

                <span className="flex-1">
                  {item.label}
                </span>

                {showUnreadBadge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-accent-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Admin */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium">
            A
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              Admin
            </p>

            <p className="truncate text-xs text-muted-foreground">
              Super Admin
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut
            size={18}
            strokeWidth={1.8}
          />
          Logout
        </button>
      </div>
    </aside>
  );
}
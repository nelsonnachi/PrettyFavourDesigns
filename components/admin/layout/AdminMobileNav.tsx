"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";

import { adminNavigation } from "./admin-navigation";
import { useAdminUnreadContactMessageCount } from "@/lib/query/contact-messages/contact-message-queries";


interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function AdminMobileNav({
  open,
  onClose,
}: AdminMobileNavProps) {
  const pathname = usePathname();

  const {
    data: unreadCount = 0,
  } =
    useAdminUnreadContactMessageCount();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-[280px] flex-col border-r border-border bg-card shadow-xl">
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <Link
            href="/admin"
            onClick={onClose}
          >
            <div className="font-serif text-[23px] tracking-[0.18em]">
              SHOPPFD
            </div>

            <div className="-mt-1 text-center text-[7px] font-medium tracking-[0.35em] text-muted-foreground">
              BAGS · AFRICA
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(
                      item.href,
                    );

              const showUnreadBadge =
                item.href === "/admin/messages" &&
                unreadCount > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
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
    </div>
  );
}
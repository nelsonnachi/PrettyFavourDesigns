"use client";

import {
  UserButton,
  useUser,
} from "@clerk/nextjs";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowLeft,
} from "lucide-react";

import { adminNavigation } from "./admin-navigation";

import {
  useAdminUnreadContactMessageCount,
} from "@/lib/query/contact-messages/contact-message-queries";

export function AdminSidebar() {
  const pathname = usePathname();

  const {
    user,
    isLoaded,
  } = useUser();

  const {
    data: unreadCount = 0,
  } = useAdminUnreadContactMessageCount();

  const fullName = [
    user?.firstName,
    user?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const displayName =
    fullName ||
    user?.username ||
    "Admin";

  const email =
    user?.primaryEmailAddress
      ?.emailAddress || "";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:flex lg:flex-col">
      {/* ================================================== */}
      {/* LOGO */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* BACK TO STOREFRONT */}
      {/* ================================================== */}

      <div className="px-6 pb-3">
        <Link
          href="/"
          className="group flex h-10 items-center gap-2.5 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />

          <span>
            Back to Store
          </span>
        </Link>
      </div>

      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
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
              item.href ===
                "/admin/messages" &&
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
                {/* Icon */}
                <Icon
                  size={18}
                  strokeWidth={
                    active
                      ? 2.2
                      : 1.8
                  }
                />

                {/* Label */}
                <span className="flex-1">
                  {item.label}
                </span>

                {/* Unread messages */}
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

      {/* ================================================== */}
      {/* ADMIN ACCOUNT */}
      {/* ================================================== */}

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-3">
          {/* Clerk avatar */}
          {isLoaded && user ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "size-9",
                },
              }}
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
              A
            </div>
          )}

          {/* User information */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {displayName}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {email ||
                "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
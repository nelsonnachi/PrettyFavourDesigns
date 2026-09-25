"use client";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { MobileNav } from "@/components/(storefront)/mobile-nav";
import { useCart } from "@/lib/query/cart/cart-queries";

const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function StorefrontHeader() {
  const { data } = useCart();

  const cartItemCount = data?.data.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-[#faf7f1]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          href="/"
          className="group flex flex-col leading-none"
          aria-label="SHOPPFD Home"
        >
          <span className="font-serif text-[25px] font-semibold tracking-[0.12em] text-[#211b17]">
            SHOPPFD
          </span>

          <span className="mt-[2px] text-center text-[8px] font-medium uppercase tracking-[0.28em] text-[#756a60]">
            Bags · Aesthetics
          </span>
        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-[11px] font-medium uppercase tracking-[0.08em] text-[#3d352f] transition-colors hover:text-[#e85d22]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="flex items-center gap-1">
          {/* Search */}

          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22] sm:inline-flex"
          >
            <Search
              className="size-[17px]"
              strokeWidth={1.6}
            />
          </Link>

          {/* Account */}

          <Link
            href="/account"
            aria-label="Account"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22] sm:inline-flex"
          >
            <UserRound
              className="size-[17px]"
              strokeWidth={1.6}
            />
          </Link>

          {/* Shopping Cart */}

          <Link
            href="/cart"
            aria-label={`Shopping cart with ${cartItemCount} items`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22]"
          >
            <ShoppingBag
              className="size-[18px]"
              strokeWidth={1.6}
            />

            {/* Cart count */}

            {cartItemCount > 0 && (
              <span className="absolute right-[2px] top-[1px] flex size-[14px] items-center justify-center rounded-full bg-[#e85d22] text-[8px] font-semibold text-white">
                {cartItemCount > 99
                  ? "99+"
                  : cartItemCount}
              </span>
            )}
          </Link>

          {/* Mobile navigation */}

          <MobileNav navigation={navigation} />
        </div>
      </div>
    </header>
  );
}
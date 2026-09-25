"use client";

import Link from "next/link";
import { Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";

import { MobileNav } from "@/components/(storefront)/mobile-nav";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  function handleSearchSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      window.location.href = "/shop";
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.set("search", trimmedSearch);

    window.location.href = `/shop?${searchParams.toString()}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-[#faf7f1]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* =====================================================
            LOGO
        ====================================================== */}

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

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

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

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        <div className="flex items-center gap-1">
          {/* ===================================================
              SEARCH
          ==================================================== */}

          {searchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden items-center sm:flex"
            >
              <div className="flex h-9 items-center border border-[#e6ddd1] bg-white/80">
                <Search
                  className="ml-3 size-[16px] text-[#756a60]"
                  strokeWidth={1.6}
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search bags..."
                  autoFocus
                  className="h-full w-[180px] bg-transparent px-3 text-[12px] text-[#211b17] outline-none placeholder:text-[#9a9087]"
                />

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchOpen(false);
                  }}
                  aria-label="Close search"
                  className="mr-1 flex size-7 items-center justify-center text-[#756a60] transition-colors hover:text-[#e85d22]"
                >
                  <X
                    className="size-4"
                    strokeWidth={1.6}
                  />
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22] sm:inline-flex"
            >
              <Search
                className="size-[17px]"
                strokeWidth={1.6}
              />
            </button>
          )}

          {/* ===================================================
              ACCOUNT
          ==================================================== */}

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

          {/* ===================================================
              SHOPPING CART
          ==================================================== */}

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22]"
          >
            <ShoppingBag
              className="size-[18px]"
              strokeWidth={1.6}
            />

            {/* Cart count */}
            <span className="absolute right-[2px] top-[1px] flex size-[14px] items-center justify-center rounded-full bg-[#e85d22] text-[8px] font-semibold text-white">
              0
            </span>
          </Link>

          {/* ===================================================
              MOBILE NAVIGATION
          ==================================================== */}

          <MobileNav navigation={navigation} />
        </div>
      </div>
    </header>
  );
}
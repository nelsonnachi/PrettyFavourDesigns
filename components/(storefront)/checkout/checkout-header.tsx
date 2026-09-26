"use client";

import Link from "next/link";

import { ArrowLeft, ShoppingBag } from "lucide-react";

export function CheckoutHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <div>
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            SHOPPFD
          </Link>

          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Secure checkout
          </p>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <ShoppingBag className="h-4 w-4" />

          <span className="hidden text-sm sm:inline">
            Checkout
          </span>
        </div>
      </div>
    </header>
  );
}
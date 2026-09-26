"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

import { CartItem } from "@/components/(storefront)/cart/cart-item";
import { useCart } from "@/lib/query/cart/cart-queries";

export default function CartPage() {
  const { data, isLoading, isError, refetch } = useCart();

  const cart = data?.data;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <main className="bg-background text-[#211b17]">
        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="animate-pulse">
            <div className="h-3 w-20 bg-[#eee6da]" />

            <div className="mt-5 h-12 w-48 bg-[#eee6da]" />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <div className="h-32 bg-[#eee6da]" />
                <div className="h-32 bg-[#eee6da]" />
                <div className="h-32 bg-[#eee6da]" />
              </div>

              <div className="h-72 bg-[#eee6da]" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (isError) {
    return (
      <main className="bg-background text-[#211b17]">
        <section className="mx-auto flex min-h-[60vh] max-w-[1440px] items-center justify-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="max-w-md text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e85d22]">
              Cart
            </p>

            <h1 className="mt-4 font-serif text-4xl tracking-[-0.03em]">
              We couldn&apos;t load your cart.
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#756a60]">
              Something went wrong while loading your cart. Please try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-7 inline-flex h-12 items-center justify-center bg-[#211b17] px-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#e85d22]"
            >
              Try again
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (!cart || cart.items.length === 0) {
    return (
      <main className="bg-background text-[#211b17]">
        <section className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="max-w-md text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#f3eee8]">
              <ShoppingBag
                className="size-7 text-[#756a60]"
                strokeWidth={1.3}
              />
            </div>

            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e85d22]">
              Your cart
            </p>

            <h1 className="mt-4 font-serif text-4xl tracking-[-0.03em] sm:text-5xl">
              Your cart is empty.
            </h1>

            <p className="mt-5 text-sm leading-7 text-[#756a60]">
              Looks like you haven&apos;t added anything to your cart yet.
              Explore our collection and find something beautiful.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex h-13 items-center justify-center gap-3 bg-[#211b17] px-8 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#e85d22]"
            >
              <span>Explore collection</span>

              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================================
  // CART
  // ==========================================================

  return (
    <main className="bg-background text-[#211b17]">
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e85d22]">
            SHOPPFD
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-serif text-5xl leading-none tracking-[-0.04em] sm:text-6xl">
              Your Cart
            </h1>

            <p className="text-sm text-[#756a60]">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          CART CONTENT
      ====================================================== */}

      <section>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
            {/* =================================================
                CART ITEMS
            ================================================= */}

            <div>
              <div className="border-t border-border">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#211b17] transition-colors hover:text-[#e85d22]"
              >
                <ArrowLeft className="size-3.5" strokeWidth={1.5} />

                <span>Continue shopping</span>
              </Link>
            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <aside className="h-fit bg-[#f3eee8] p-6 sm:p-8 lg:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#756a60]">
                Order summary
              </p>

              <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em]">
                Your order
              </h2>

              <div className="mt-8 space-y-4 border-b border-[#211b17]/10 pb-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#756a60]">Items</span>

                  <span className="font-medium">{cart.totalItems}</span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#756a60]">Subtotal</span>

                  <span className="font-medium">
                    ₦{Number(cart.subtotal).toLocaleString("en-NG")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#756a60]">Delivery</span>

                  <span className="text-[11px] uppercase tracking-[0.08em] text-[#756a60]">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 py-6">
                <span className="font-serif text-xl">Total</span>

                <span className="text-lg font-semibold">
                  ₦{Number(cart.subtotal).toLocaleString("en-NG")}
                </span>
              </div>

              <Link
                href="/checkout"
                prefetch={false}
                className="group flex h-14 w-full items-center justify-center gap-3 bg-[#211b17] px-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#e85d22]"
              >
                <span>Proceed to checkout</span>

                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>

              <p className="mt-4 text-center text-[10px] leading-5 text-[#756a60]">
                Shipping fees and available payment methods will be shown at
                checkout.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

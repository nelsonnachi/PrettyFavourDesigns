"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  X,
} from "lucide-react";

import { CartDrawerItem } from "@/components/(storefront)/cart/cart-drawer-item";
import { useCart } from "@/lib/query/cart/cart-queries";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCart();

  const cart = data?.data;

  // ==========================================================
  // CLOSE WITH ESCAPE KEY
  // ==========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, onClose]);

  // ==========================================================
  // PREVENT BODY SCROLL WHILE DRAWER IS OPEN
  // ==========================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [open]);

  // ==========================================================
  // CART COUNT
  // ==========================================================

  const itemCount = cart?.totalItems ?? 0;

  return (
    <>
      {/* ======================================================
          BACKDROP
      ====================================================== */}

      <button
        type="button"
        aria-label="Close shopping cart"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className={`fixed inset-0 z-[60] bg-[#211b17]/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* ======================================================
          CART DRAWER
      ====================================================== */}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-[480px] flex-col bg-[#faf7f1] text-[#211b17] shadow-2xl transition-transform duration-300 ease-out ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-5 sm:px-7">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#e85d22]">
              SHOPPFD
            </p>

            <div className="mt-1 flex items-center gap-2">
              <h2 className="font-serif text-2xl tracking-[-0.03em]">
                Your Cart
              </h2>

              {!isLoading && (
                <span className="text-[10px] text-[#756a60]">
                  ({itemCount})
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex size-10 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22]"
          >
            <X
              className="size-5"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* ==================================================
              LOADING
          ================================================== */}

          {isLoading && (
            <div className="px-5 sm:px-7">
              <div className="animate-pulse">
                <div className="flex gap-4 border-b border-border py-5">
                  <div className="size-[88px] shrink-0 bg-[#eee6da]" />

                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-[#eee6da]" />

                    <div className="h-3 w-1/3 bg-[#eee6da]" />

                    <div className="h-4 w-1/4 bg-[#eee6da]" />

                    <div className="h-8 w-24 bg-[#eee6da]" />
                  </div>
                </div>

                <div className="flex gap-4 border-b border-border py-5">
                  <div className="size-[88px] shrink-0 bg-[#eee6da]" />

                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-[#eee6da]" />

                    <div className="h-3 w-1/3 bg-[#eee6da]" />

                    <div className="h-4 w-1/4 bg-[#eee6da]" />

                    <div className="h-8 w-24 bg-[#eee6da]" />
                  </div>
                </div>

                <div className="flex gap-4 border-b border-border py-5">
                  <div className="size-[88px] shrink-0 bg-[#eee6da]" />

                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-[#eee6da]" />

                    <div className="h-3 w-1/3 bg-[#eee6da]" />

                    <div className="h-4 w-1/4 bg-[#eee6da]" />

                    <div className="h-8 w-24 bg-[#eee6da]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!isLoading && isError && (
            <div className="flex min-h-[60vh] items-center justify-center px-6">
              <div className="max-w-sm text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e85d22]">
                  Cart
                </p>

                <h3 className="mt-3 font-serif text-3xl tracking-[-0.03em]">
                  We couldn&apos;t load your cart.
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#756a60]">
                  Something went wrong while loading
                  your cart. Please try again.
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-6 inline-flex h-11 items-center justify-center bg-[#211b17] px-6 text-[9px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#e85d22]"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              EMPTY CART
          ================================================== */}

          {!isLoading &&
            !isError &&
            (!cart ||
              cart.items.length === 0) && (
              <div className="flex min-h-[60vh] items-center justify-center px-6">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#f3eee8]">
                    <ShoppingBag
                      className="size-6 text-[#756a60]"
                      strokeWidth={1.3}
                    />
                  </div>

                  <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#e85d22]">
                    Your cart
                  </p>

                  <h3 className="mt-3 font-serif text-3xl tracking-[-0.03em]">
                    Your cart is empty.
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-[#756a60]">
                    Explore our collection and find
                    something beautiful for your next
                    look.
                  </p>

                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-7 inline-flex h-12 items-center justify-center gap-3 bg-[#211b17] px-7 text-[9px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#e85d22]"
                  >
                    <span>Continue shopping</span>

                    <ArrowRight
                      className="size-4"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>
            )}

          {/* ==================================================
              CART ITEMS
          ================================================== */}

          {!isLoading &&
            !isError &&
            cart &&
            cart.items.length > 0 && (
              <div className="px-5 sm:px-7">
                <div className="border-t border-border">
                  {cart.items.map((item) => (
                    <CartDrawerItem
                      key={item.id}
                      item={item}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        {!isLoading &&
          !isError &&
          cart &&
          cart.items.length > 0 && (
            <div className="shrink-0 border-t border-border bg-[#faf7f1] px-5 py-5 sm:px-7 sm:py-6">
              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#756a60]">
                    Items
                  </span>

                  <span className="font-medium">
                    {itemCount}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#756a60]">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    ₦
                    {Number(
                      cart.subtotal,
                    ).toLocaleString("en-NG")}
                  </span>
                </div>
              </div>

              {/* =================================================
                  CHECKOUT
              ================================================= */}

              <Link
                href="/checkout"
                onClick={onClose}
                className="group mt-5 flex h-13 w-full items-center justify-center gap-3 bg-[#211b17] px-6 text-[9px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#e85d22]"
              >
                <span>Proceed to checkout</span>

                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>

              {/* =================================================
                  VIEW CART
              ================================================= */}

              <Link
                href="/cart"
                onClick={onClose}
                className="mt-3 flex h-11 w-full items-center justify-center border border-[#211b17]/20 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#211b17] transition-colors hover:border-[#e85d22] hover:text-[#e85d22]"
              >
                View full cart
              </Link>

              {/* =================================================
                  SHIPPING NOTE
              ================================================= */}

              <p className="mt-3 text-center text-[9px] leading-5 text-[#756a60]">
                Shipping fees and payment options are
                calculated at checkout.
              </p>
            </div>
          )}
      </aside>
    </>
  );
}
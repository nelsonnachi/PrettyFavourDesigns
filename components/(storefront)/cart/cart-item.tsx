"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "@/lib/query/cart/cart-types";

import {
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/lib/query/cart/cart-queries";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const updateCartItemMutation = useUpdateCartItem();

  const removeCartItemMutation = useRemoveCartItem();

  const price = Number(item.product.price);

  const isUpdating = updateCartItemMutation.isPending;

  const isRemoving = removeCartItemMutation.isPending;

  const isBusy = isUpdating || isRemoving;

  // ==========================================================
  // DECREASE QUANTITY
  // ==========================================================

  function handleDecrease() {
    if (item.quantity <= 1 || isBusy) {
      return;
    }

    updateCartItemMutation.mutate({
      id: item.id,
      quantity: item.quantity - 1,
    });
  }

  // ==========================================================
  // INCREASE QUANTITY
  // ==========================================================

  function handleIncrease() {
    if (isBusy) {
      return;
    }

    if (
      item.quantity >=
      item.variant.availableStock
    ) {
      return;
    }

    updateCartItemMutation.mutate({
      id: item.id,
      quantity: item.quantity + 1,
    });
  }

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  function handleRemove() {
    if (isBusy) {
      return;
    }

    removeCartItemMutation.mutate(item.id);
  }

  return (
    <article className="flex gap-4 border-b border-border py-6 sm:gap-6">
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <Link
        href={`/products/${item.product.slug}`}
        className="relative block size-24 shrink-0 overflow-hidden bg-[#f3eee8] sm:size-32"
      >
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.1em] text-[#756a60]">
            No image
          </div>
        )}
      </Link>

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/products/${item.product.slug}`}
              className="group"
            >
              <h2 className="font-serif text-[18px] font-medium leading-tight tracking-[-0.02em] text-[#211b17] transition-colors duration-200 group-hover:text-[#e85d22] sm:text-[20px]">
                {item.product.name}
              </h2>
            </Link>

            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#756a60]">
              {item.product.sku}
            </p>
          </div>

          {/* =================================================
              REMOVE
          ================================================= */}

          <button
            type="button"
            onClick={handleRemove}
            disabled={isBusy}
            aria-label={`Remove ${item.product.name} from cart`}
            className="flex size-8 shrink-0 items-center justify-center text-[#756a60] transition-colors hover:text-[#e85d22] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2
              className="size-4"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* =====================================================
            COLOR
        ===================================================== */}

        <div className="mt-3 flex items-center gap-2">
          <span
            className="size-3 rounded-full border border-[#211b17]/15"
            style={{
              backgroundColor:
                item.variant.color.hexCode ??
                "#d6cec4",
            }}
            aria-hidden="true"
          />

          <span className="text-[11px] text-[#756a60]">
            {item.variant.color.name}
          </span>
        </div>

        {/* =====================================================
            PRICE
        ===================================================== */}

        <p className="mt-2 text-[13px] font-semibold text-[#211b17]">
          ₦{price.toLocaleString("en-NG")}
        </p>

        {/* =====================================================
            QUANTITY + SUBTOTAL
        ===================================================== */}

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          {/* ===================================================
              QUANTITY
          =================================================== */}

          <div className="flex h-9 items-center border border-border">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={
                isBusy ||
                item.quantity <= 1
              }
              aria-label="Decrease quantity"
              className="flex h-full w-9 items-center justify-center text-[#211b17] transition-colors hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus
                className="size-3.5"
                strokeWidth={1.5}
              />
            </button>

            <span className="flex h-full min-w-9 items-center justify-center border-x border-border px-2 text-[11px] font-medium">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={
                isBusy ||
                item.quantity >=
                  item.variant.availableStock
              }
              aria-label="Increase quantity"
              className="flex h-full w-9 items-center justify-center text-[#211b17] transition-colors hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus
                className="size-3.5"
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* ===================================================
              SUBTOTAL
          =================================================== */}

          <p className="text-right text-[13px] font-semibold text-[#211b17]">
            ₦
            {Number(item.subtotal).toLocaleString(
              "en-NG",
            )}
          </p>
        </div>
      </div>
    </article>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";

import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "@/lib/query/cart/cart-types";

import {
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/lib/query/cart/cart-queries";

type CartDrawerItemProps = {
  item: CartItemType;
};

export function CartDrawerItem({
  item,
}: CartDrawerItemProps) {
  // ==========================================================
  // MUTATIONS
  // ==========================================================

  const updateCartItemMutation =
    useUpdateCartItem();

  const removeCartItemMutation =
    useRemoveCartItem();

  // ==========================================================
  // PRICE
  // ==========================================================

  const price = Number(item.product.price);

  // ==========================================================
  // STOCK
  // ==========================================================

  const availableStock =
    item.variant.availableStock;

  // ==========================================================
  // MUTATION STATES
  // ==========================================================

  const isUpdating =
    updateCartItemMutation.isPending;

  const isRemoving =
    removeCartItemMutation.isPending;

  const isBusy =
    isUpdating || isRemoving;

  // ==========================================================
  // DECREASE QUANTITY
  // ==========================================================

  function handleDecrease() {
    if (isBusy) {
      return;
    }

    if (item.quantity <= 1) {
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

    if (availableStock <= 0) {
      return;
    }

    if (item.quantity >= availableStock) {
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

  // ==========================================================
  // ERROR
  // ==========================================================

  const mutationError =
    updateCartItemMutation.error ??
    removeCartItemMutation.error;

  return (
    <article className="border-b border-border py-5">
      <div className="flex gap-4">
        {/* ====================================================
            PRODUCT IMAGE
        ==================================================== */}

        <Link
          href={`/products/${item.product.slug}`}
          className="relative block size-[88px] shrink-0 overflow-hidden bg-[#f3eee8]"
        >
          {item.product.imageUrl ? (
            <Image
              src={item.product.imageUrl}
              alt={item.product.name}
              fill
              sizes="88px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-2 text-center text-[9px] uppercase tracking-[0.08em] text-[#756a60]">
              No image
            </div>
          )}
        </Link>

        {/* ====================================================
            PRODUCT DETAILS
        ==================================================== */}

        <div className="min-w-0 flex-1">
          {/* ==================================================
              NAME + REMOVE
          ================================================== */}

          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/products/${item.product.slug}`}
              className="min-w-0"
            >
              <h3 className="line-clamp-2 font-serif text-[17px] font-medium leading-tight tracking-[-0.02em] text-[#211b17] transition-colors hover:text-[#e85d22]">
                {item.product.name}
              </h3>
            </Link>

            <button
              type="button"
              onClick={handleRemove}
              disabled={isBusy}
              aria-label={`Remove ${item.product.name} from cart`}
              className="flex size-7 shrink-0 items-center justify-center text-[#756a60] transition-colors hover:text-[#e85d22] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2
                className="size-3.5"
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* ==================================================
              COLOR
          ================================================== */}

          <div className="mt-2 flex items-center gap-2">
            <span
              className="size-2.5 rounded-full border border-[#211b17]/15"
              style={{
                backgroundColor:
                  item.variant.color.hexCode ??
                  "#d6cec4",
              }}
              aria-hidden="true"
            />

            <span className="text-[10px] text-[#756a60]">
              {item.variant.color.name}
            </span>
          </div>

          {/* ==================================================
              PRICE
          ================================================== */}

          <p className="mt-2 text-[12px] font-semibold text-[#211b17]">
            ₦{price.toLocaleString("en-NG")}
          </p>

          {/* ==================================================
              QUANTITY + SUBTOTAL
          ================================================== */}

          <div className="mt-3 flex items-center justify-between gap-3">
            {/* =================================================
                QUANTITY
            ================================================= */}

            <div className="flex h-8 items-center border border-border">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={
                  isBusy ||
                  item.quantity <= 1
                }
                aria-label={`Decrease ${item.product.name} quantity`}
                className="flex h-full w-8 items-center justify-center text-[#211b17] transition-colors hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus
                  className="size-3"
                  strokeWidth={1.5}
                />
              </button>

              <span className="flex h-full min-w-8 items-center justify-center border-x border-border px-2 text-[10px] font-medium text-[#211b17]">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                disabled={
                  isBusy ||
                  availableStock <= 0 ||
                  item.quantity >= availableStock
                }
                aria-label={`Increase ${item.product.name} quantity`}
                className="flex h-full w-8 items-center justify-center text-[#211b17] transition-colors hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus
                  className="size-3"
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* =================================================
                SUBTOTAL
            ================================================= */}

            <p className="text-right text-[12px] font-semibold text-[#211b17]">
              ₦
              {Number(
                item.subtotal,
              ).toLocaleString("en-NG")}
            </p>
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {mutationError && (
            <p className="mt-2 text-[10px] leading-4 text-[#e85d22]">
              {mutationError.message ||
                "Unable to update your cart."}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
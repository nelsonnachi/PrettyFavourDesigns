"use client";

import { Address } from "@/lib/query/addresses/address-types";
import { Check } from "lucide-react";


type CheckoutAddressCardProps = {
  address: Address;
  selected: boolean;
  onSelect: () => void;
};

export function CheckoutAddressCard({
  address,
  selected,
  onSelect,
}: CheckoutAddressCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-accent bg-accent/5"
          : "border-border bg-card hover:border-accent/40"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* ================================================== */}
        {/* RADIO */}
        {/* ================================================== */}

        <span
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? "border-accent bg-accent text-white"
              : "border-muted-foreground/40"
          }`}
        >
          {selected && (
            <Check className="h-3 w-3" />
          )}
        </span>

        {/* ================================================== */}
        {/* ADDRESS */}
        {/* ================================================== */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">
              {address.firstName} {address.lastName}
            </p>

            {address.isDefault && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Default
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {address.addressLine1}
            {address.addressLine2
              ? `, ${address.addressLine2}`
              : ""}
            <br />

            {address.city}, {address.state}
            <br />

            {address.country}
            {address.postalCode
              ? `, ${address.postalCode}`
              : ""}
          </p>

          <p className="mt-3 text-sm text-foreground">
            {address.phone}
          </p>
        </div>
      </div>
    </button>
  );
}
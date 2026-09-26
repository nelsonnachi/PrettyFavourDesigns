"use client";

import { useEffect, useState } from "react";

import { MapPin, Plus } from "lucide-react";
import { useAddresses } from "@/lib/query/addresses/use-addresses";
import { AddAddressForm } from "./add-address-form";
import { CheckoutAddressCard } from "./checkout-address-card";



type CheckoutAddressSectionProps = {
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
};

export function CheckoutAddressSection({
  selectedAddressId,
  onSelectAddress,
}: CheckoutAddressSectionProps) {
  const {
    data: addresses,
    isLoading,
    isError,
  } = useAddresses();

  const [showAddAddress, setShowAddAddress] =
    useState(false);

  useEffect(() => {
    if (!selectedAddressId && addresses?.length) {
      const defaultAddress =
        addresses.find(
          (address) => address.isDefault,
        ) ?? addresses[0];

      onSelectAddress(defaultAddress.id);
    }
  }, [
    addresses,
    selectedAddressId,
    onSelectAddress,
  ]);

  function handleAddressCreated(
    addressId: string,
  ) {
    onSelectAddress(addressId);

    setShowAddAddress(false);
  }

  return (
    <section>
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MapPin className="h-4 w-4" />
            </span>

            <h2 className="text-xl font-semibold tracking-tight">
              Shipping address
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Where should we deliver your order?
          </p>
        </div>

        {!showAddAddress && (
          <button
            type="button"
            onClick={() => setShowAddAddress(true)}
            className="flex shrink-0 items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            <Plus className="h-4 w-4" />

            <span className="hidden sm:inline">
              Add address
            </span>

            <span className="sm:hidden">
              Add
            </span>
          </button>
        )}
      </div>

      {/* ================================================== */}
      {/* ADD ADDRESS FORM */}
      {/* ================================================== */}

      {showAddAddress ? (
        <AddAddressForm
          onCancel={() => setShowAddAddress(false)}
          onCreated={handleAddressCreated}
        />
      ) : (
        <>
          {/* ================================================== */}
          {/* LOADING */}
          {/* ================================================== */}

          {isLoading && (
            <div className="space-y-4">
              <div className="h-32 animate-pulse rounded-2xl bg-muted" />

              <div className="h-32 animate-pulse rounded-2xl bg-muted" />
            </div>
          )}

          {/* ================================================== */}
          {/* ERROR */}
          {/* ================================================== */}

          {isError && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
              <p className="text-sm text-destructive">
                We could not load your saved addresses.
              </p>

              <button
                type="button"
                onClick={() => setShowAddAddress(true)}
                className="mt-3 text-sm font-medium text-accent underline underline-offset-4"
              >
                Add a new address
              </button>
            </div>
          )}

          {/* ================================================== */}
          {/* EMPTY */}
          {/* ================================================== */}

          {!isLoading &&
            !isError &&
            addresses &&
            addresses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />

                <h3 className="mt-4 font-medium">
                  No shipping address
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Add a shipping address to continue.
                </p>

                <button
                  type="button"
                  onClick={() => setShowAddAddress(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />

                  Add address
                </button>
              </div>
            )}

          {/* ================================================== */}
          {/* ADDRESS LIST */}
          {/* ================================================== */}

          {!isLoading &&
            !isError &&
            addresses &&
            addresses.length > 0 && (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <CheckoutAddressCard
                    key={address.id}
                    address={address}
                    selected={
                      selectedAddressId === address.id
                    }
                    onSelect={() =>
                      onSelectAddress(address.id)
                    }
                  />
                ))}
              </div>
            )}
        </>
      )}
    </section>
  );
}
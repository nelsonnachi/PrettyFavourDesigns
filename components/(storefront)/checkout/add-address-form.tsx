"use client";

import { FormEvent, useState } from "react";

import { Loader2, X } from "lucide-react";
import { useCreateAddress } from "@/lib/query/addresses/use-addresses";



type AddAddressFormProps = {
  onCancel: () => void;
  onCreated: (addressId: string) => void;
};

export function AddAddressForm({
  onCancel,
  onCreated,
}: AddAddressFormProps) {
  const createAddressMutation =
    useCreateAddress();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [addressLine1, setAddressLine1] =
    useState("");

  const [addressLine2, setAddressLine2] =
    useState("");

  const [city, setCity] =
    useState("");

  const [state, setState] =
    useState("");

  const [country, setCountry] =
    useState("Nigeria");

  const [postalCode, setPostalCode] =
    useState("");

  const [isDefault, setIsDefault] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      const address =
        await createAddressMutation.mutateAsync({
          firstName,
          lastName,
          phone,
          addressLine1,
          addressLine2:
            addressLine2 || undefined,
          city,
          state,
          country,
          postalCode:
            postalCode || undefined,
          isDefault,
        });

      onCreated(address.id);
    } catch {
      // apiClient / React Query
      // already provides the mutation error.
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            Add shipping address
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter the address where you want your order delivered.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ================================================== */}
      {/* FIELDS */}
      {/* ================================================== */}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* FIRST NAME */}

        <div>
          <label
            htmlFor="checkout-first-name"
            className="mb-2 block text-sm font-medium"
          >
            First name
          </label>

          <input
            id="checkout-first-name"
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
            placeholder="First name"
          />
        </div>

        {/* LAST NAME */}

        <div>
          <label
            htmlFor="checkout-last-name"
            className="mb-2 block text-sm font-medium"
          >
            Last name
          </label>

          <input
            id="checkout-last-name"
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
            placeholder="Last name"
          />
        </div>

        {/* PHONE */}

        <div className="sm:col-span-2">
          <label
            htmlFor="checkout-phone"
            className="mb-2 block text-sm font-medium"
          >
            Phone number
          </label>

          <input
            id="checkout-phone"
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
            placeholder="08012345678"
          />
        </div>

        {/* ADDRESS */}

        <div className="sm:col-span-2">
          <label
            htmlFor="checkout-address"
            className="mb-2 block text-sm font-medium"
          >
            Address
          </label>

          <input
            id="checkout-address"
            value={addressLine1}
            onChange={(event) =>
              setAddressLine1(event.target.value)
            }
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
            placeholder="Street address"
          />
        </div>

        {/* ADDRESS LINE 2 */}

        <div className="sm:col-span-2">
          <label
            htmlFor="checkout-address-2"
            className="mb-2 block text-sm font-medium"
          >
            Apartment, suite, etc.
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </label>

          <input
            id="checkout-address-2"
            value={addressLine2}
            onChange={(event) =>
              setAddressLine2(event.target.value)
            }
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
            placeholder="Apartment, suite, unit"
          />
        </div>

        {/* CITY */}

        <div>
          <label
            htmlFor="checkout-city"
            className="mb-2 block text-sm font-medium"
          >
            City
          </label>

          <input
            id="checkout-city"
            value={city}
            onChange={(event) =>
              setCity(event.target.value)
            }
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
            placeholder="City"
          />
        </div>

        {/* STATE */}

        <div>
          <label
            htmlFor="checkout-state"
            className="mb-2 block text-sm font-medium"
          >
            State
          </label>

          <input
            id="checkout-state"
            value={state}
            onChange={(event) =>
              setState(event.target.value)
            }
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
            placeholder="State"
          />
        </div>

        {/* COUNTRY */}

        <div>
          <label
            htmlFor="checkout-country"
            className="mb-2 block text-sm font-medium"
          >
            Country
          </label>

          <input
            id="checkout-country"
            value={country}
            onChange={(event) =>
              setCountry(event.target.value)
            }
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
          />
        </div>

        {/* POSTAL CODE */}

        <div>
          <label
            htmlFor="checkout-postal-code"
            className="mb-2 block text-sm font-medium"
          >
            Postal code
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </label>

          <input
            id="checkout-postal-code"
            value={postalCode}
            onChange={(event) =>
              setPostalCode(event.target.value)
            }
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-accent"
            placeholder="Postal code"
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* DEFAULT */}
      {/* ================================================== */}

      <label className="mt-5 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(event) =>
            setIsDefault(event.target.checked)
          }
          className="h-4 w-4 rounded border-border accent-accent"
        />

        <span className="text-sm text-muted-foreground">
          Save this as my default address
        </span>
      </label>

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {createAddressMutation.isError && (
        <p className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {createAddressMutation.error instanceof Error
            ? createAddressMutation.error.message
            : "Unable to create address. Please check your information and try again."}
        </p>
      )}

      {/* ================================================== */}
      {/* ACTIONS */}
      {/* ================================================== */}

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={
            createAddressMutation.isPending
          }
          className="h-12 rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            createAddressMutation.isPending
          }
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createAddressMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {createAddressMutation.isPending
            ? "Saving..."
            : "Save address"}
        </button>
      </div>
    </form>
  );
}
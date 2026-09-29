import { AdminUserAddress } from "@/lib/query/customer/admin-user-types";
import {
  MapPin,
} from "lucide-react";

type CustomerAddressesProps = {
  addresses: AdminUserAddress[];
};

export function CustomerAddresses({
  addresses,
}: CustomerAddressesProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="font-semibold">
          Addresses
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Saved customer addresses.
        </p>
      </div>

      {addresses.length === 0 ? (
        <div className="p-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground/50" />

          <p className="mt-3 text-sm text-muted-foreground">
            No saved addresses.
          </p>
        </div>
      ) : (
        <div className="space-y-3 p-5">
          {addresses.map((address, index) => {
            const value = (key: string) =>
              typeof address[key] === "string"
                ? address[key]
                : "";

            const parts = [
              value("address"),
              value("street"),
              value("city"),
              value("state"),
              value("country"),
              value("postalCode"),
              value("zipCode"),
            ].filter(Boolean);

            return (
              <div
                key={address.id || index}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {value("label") ||
                        `Address ${index + 1}`}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {parts.length > 0
                        ? parts.join(", ")
                        : "Address details unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
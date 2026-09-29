import { AdminUserCart } from "@/lib/query/customer/admin-user-types";
import {
  ShoppingCart,
} from "lucide-react";

type CustomerCartProps = {
  cart: AdminUserCart;
};

export function CustomerCart({
  cart,
}: CustomerCartProps) {
  const items = cart?.items ?? [];

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-semibold">
            Current cart
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Products currently in the customer's cart.
          </p>
        </div>

        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
      </div>

      {items.length === 0 ? (
        <div className="p-10 text-center">
          <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground/50" />

          <p className="mt-3 text-sm text-muted-foreground">
            The cart is empty.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {item.product.name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Variant: {item.variant.id}
                </p>
              </div>

              <div className="shrink-0 rounded-lg bg-muted px-3 py-1.5 text-sm font-semibold">
                × {item.quantity}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
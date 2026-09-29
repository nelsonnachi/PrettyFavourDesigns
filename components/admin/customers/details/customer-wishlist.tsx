import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { AdminUserWishlistItem } from "@/lib/query/customer/admin-user-types";

type CustomerWishlistProps = {
  wishlistItems: AdminUserWishlistItem[];
};

export function CustomerWishlist({
  wishlistItems,
}: CustomerWishlistProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-semibold">
            Wishlist
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Products saved by this customer.
          </p>
        </div>

        <Heart className="h-5 w-5 text-muted-foreground" />
      </div>

      {wishlistItems.length === 0 ? (
        <div className="p-10 text-center">
          <Heart className="mx-auto h-8 w-8 text-muted-foreground/50" />

          <p className="mt-3 text-sm text-muted-foreground">
            Wishlist is empty.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {wishlistItems.map(
            (item, index) => {
              const product =
                item.product;

              return (
                <div
                  key={
                    typeof item.id ===
                    "string"
                      ? item.id
                      : index
                  }
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {product?.name ||
                        "Product"}
                    </p>
                  </div>

                  {product?.id && (
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}
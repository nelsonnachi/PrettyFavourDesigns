import { AdminUserRating } from "@/lib/query/customer/admin-user-types";
import {
  Star,
} from "lucide-react";



type CustomerRatingsProps = {
  ratings: AdminUserRating[];
};

export function CustomerRatings({
  ratings,
}: CustomerRatingsProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-semibold">
            Ratings & reviews
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Products this customer has reviewed.
          </p>
        </div>

        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          {ratings.length}
        </span>
      </div>

      {ratings.length === 0 ? (
        <div className="p-10 text-center">
          <Star className="mx-auto h-8 w-8 text-muted-foreground/50" />

          <p className="mt-3 text-sm text-muted-foreground">
            No ratings yet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {ratings.map((rating, index) => {
            const product =
              rating.product;

            const ratingValue =
              typeof rating.rating ===
              "number"
                ? rating.rating
                : typeof rating.score ===
                    "number"
                  ? rating.score
                  : null;

            return (
              <div
                key={
                  typeof rating.id ===
                  "string"
                    ? rating.id
                    : index
                }
                className="p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      {product?.name ||
                        "Product"}
                    </p>

                    {typeof rating.comment ===
                      "string" && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {rating.comment}
                      </p>
                    )}
                  </div>

                  {ratingValue !== null && (
                    <div className="flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1.5 text-sm font-semibold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {ratingValue}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
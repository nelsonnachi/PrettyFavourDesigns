import {
  Boxes,
} from "lucide-react";

type CustomerInventoryProps = {
  movements: unknown[];
};

export function CustomerInventory({
  movements,
}: CustomerInventoryProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-semibold">
            Inventory activity
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Inventory movements associated with this customer.
          </p>
        </div>

        <Boxes className="h-5 w-5 text-muted-foreground" />
      </div>

      {movements.length === 0 ? (
        <div className="p-10 text-center">
          <Boxes className="mx-auto h-8 w-8 text-muted-foreground/50" />

          <p className="mt-3 text-sm text-muted-foreground">
            No inventory activity.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {movements.map(
            (movement, index) => {
              const item =
                typeof movement ===
                  "object" &&
                movement !== null
                  ? (movement as Record<
                      string,
                      unknown
                    >)
                  : {};

              return (
                <div
                  key={
                    typeof item.id ===
                    "string"
                      ? item.id
                      : index
                  }
                  className="p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">
                        {typeof item.type ===
                        "string"
                          ? item.type
                          : "Inventory movement"}
                      </p>

                      {typeof item.quantity ===
                        "number" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Quantity:{" "}
                          {item.quantity}
                        </p>
                      )}
                    </div>

                    {typeof item.createdAt ===
                      "string" && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(
                          item.createdAt,
                        ).toLocaleDateString(
                          "en-NG",
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}
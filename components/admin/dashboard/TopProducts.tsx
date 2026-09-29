const products = [
  {
    name: "Classic Tote Bag",
    price: "₦80,000",
    sold: 142,
  },
  {
    name: "Crossbody Bag",
    price: "₦65,000",
    sold: 98,
  },
  {
    name: "Shoulder Bag",
    price: "₦75,000",
    sold: 76,
  },
  {
    name: "Clutch Bag",
    price: "₦55,000",
    sold: 64,
  },
];

export function TopProducts() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">
          Top Products
        </h2>

        <a
          href="/admin/products"
          className="text-xs text-accent hover:underline"
        >
          View all →
        </a>
      </div>

      <div className="mt-5 space-y-4">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="h-14 w-14 shrink-0 rounded-lg bg-secondary" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {product.name}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {product.price}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${Math.min(
                        (product.sold / 150) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <span className="text-[10px] text-muted-foreground">
                  {product.sold} sold
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
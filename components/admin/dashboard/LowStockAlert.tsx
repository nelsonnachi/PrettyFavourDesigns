const products = [
  {
    name: "Clutch Bag",
    stock: 2,
  },
  {
    name: "Shoulder Bag",
    stock: 3,
  },
  {
    name: "Crossbody Bag",
    stock: 5,
  },
];

export function LowStockAlert() {
  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">
          Low Stock Alert
        </h2>

        <a
          href="/admin/inventory"
          className="text-xs text-accent hover:underline"
        >
          View all →
        </a>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        These products are running low.
      </p>

      <div className="mt-5 space-y-4">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium">
                {product.name}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {product.stock} left
              </p>
            </div>

            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent">
              Low
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
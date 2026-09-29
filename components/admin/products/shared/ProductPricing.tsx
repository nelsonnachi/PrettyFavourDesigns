"use client";

interface ProductPricingProps {
  price: string;
  compareAtPrice: string;
  costPrice: string;

  onPriceChange: (value: string) => void;
  onCompareAtPriceChange: (value: string) => void;
  onCostPriceChange: (value: string) => void;
}

const inputClassName =
  "h-11 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15";

function PriceInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        ₦
      </span>

      <input
        id={id}
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  );
}

export function ProductPricing({
  price,
  compareAtPrice,
  costPrice,
  onPriceChange,
  onCompareAtPriceChange,
  onCostPriceChange,
}: ProductPricingProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="product-price" className="text-sm font-medium">
          Selling price <span className="text-accent">*</span>
        </label>

        <PriceInput
          id="product-price"
          value={price}
          onChange={onPriceChange}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="product-compare-price"
          className="text-sm font-medium"
        >
          Compare-at price
        </label>

        <PriceInput
          id="product-compare-price"
          value={compareAtPrice}
          onChange={onCompareAtPriceChange}
          placeholder="Optional"
        />

        <p className="text-xs text-muted-foreground">
          Used to show the original price when a product is discounted.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="product-cost-price"
          className="text-sm font-medium"
        >
          Cost price
        </label>

        <PriceInput
          id="product-cost-price"
          value={costPrice}
          onChange={onCostPriceChange}
          placeholder="Optional"
        />

        <p className="text-xs text-muted-foreground">
          Your internal product cost. Customers won't see this.
        </p>
      </div>
    </div>
  );
}
"use client";

interface ProductLabelsProps {
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;

  onFeaturedChange: (value: boolean) => void;
  onNewArrivalChange: (value: boolean) => void;
  onBestSellerChange: (value: boolean) => void;
}

function LabelCheckbox({
  id,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border bg-background p-4 transition hover:bg-muted/50"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 accent-[var(--accent)]"
      />

      <span className="min-w-0">
        <span className="block text-sm font-medium">{title}</span>

        <span className="mt-0.5 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
    </label>
  );
}

export function ProductLabels({
  isFeatured,
  isNewArrival,
  isBestSeller,
  onFeaturedChange,
  onNewArrivalChange,
  onBestSellerChange,
}: ProductLabelsProps) {
  return (
    <div className="space-y-3">
      <LabelCheckbox
        id="product-featured"
        title="Featured product"
        description="Show this product in featured sections."
        checked={isFeatured}
        onChange={onFeaturedChange}
      />

      <LabelCheckbox
        id="product-new-arrival"
        title="New arrival"
        description="Mark this product as a recent arrival."
        checked={isNewArrival}
        onChange={onNewArrivalChange}
      />

      <LabelCheckbox
        id="product-best-seller"
        title="Best seller"
        description="Mark this product as a best seller."
        checked={isBestSeller}
        onChange={onBestSellerChange}
      />
    </div>
  );
}
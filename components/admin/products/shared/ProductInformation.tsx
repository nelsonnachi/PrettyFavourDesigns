"use client";

interface ProductInformationProps {
  name: string;
  slug: string;
  sku: string;
  description: string;

  onNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const inputClassName =
  "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15";

export function ProductInformation({
  name,
  slug,
  sku,
  description,
  onNameChange,
  onSlugChange,
  onSkuChange,
  onDescriptionChange,
}: ProductInformationProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="product-name"
            className="text-sm font-medium"
          >
            Product name
          </label>

          <input
            id="product-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="e.g. Classic Leather Bag"
            maxLength={200}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="product-sku"
            className="text-sm font-medium"
          >
            Product SKU
          </label>

          <input
            id="product-sku"
            value={sku}
            onChange={(event) => onSkuChange(event.target.value)}
            placeholder="e.g. BAG-001"
            maxLength={100}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="product-slug"
          className="text-sm font-medium"
        >
          Slug
        </label>

        <input
          id="product-slug"
          value={slug}
          onChange={(event) => onSlugChange(event.target.value)}
          placeholder="classic-leather-bag"
          maxLength={250}
          className={inputClassName}
        />

        <p className="text-xs text-muted-foreground">
          Used in the product URL.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="product-description"
          className="text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="product-description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Describe the product..."
          rows={8}
          maxLength={10000}
          className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
        />

        <div className="flex justify-end text-xs text-muted-foreground">
          {description.length}/10000
        </div>
      </div>
    </div>
  );
}
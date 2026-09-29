"use client";

interface ProductSEOProps {
  metaTitle: string;
  metaDescription: string;

  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
}

export function ProductSEO({
  metaTitle,
  metaDescription,
  onMetaTitleChange,
  onMetaDescriptionChange,
}: ProductSEOProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="product-meta-title"
          className="text-sm font-medium"
        >
          Meta title
        </label>

        <input
          id="product-meta-title"
          value={metaTitle}
          onChange={(event) => onMetaTitleChange(event.target.value)}
          maxLength={200}
          placeholder="SEO title for this product"
          className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
        />

        <div className="flex justify-end text-xs text-muted-foreground">
          {metaTitle.length}/200
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="product-meta-description"
          className="text-sm font-medium"
        >
          Meta description
        </label>

        <textarea
          id="product-meta-description"
          value={metaDescription}
          onChange={(event) =>
            onMetaDescriptionChange(event.target.value)
          }
          maxLength={500}
          rows={5}
          placeholder="Short description for search engines"
          className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
        />

        <div className="flex justify-end text-xs text-muted-foreground">
          {metaDescription.length}/500
        </div>
      </div>
    </div>
  );
}
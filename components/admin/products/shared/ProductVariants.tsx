"use client";

import { AlertCircle, Plus, Trash2 } from "lucide-react";

import { useColors } from "@/lib/query/colors/color-queries";

import { ProductCard } from "./ProductCard";
import type { ProductVariantDraft } from "./product-form-types";

interface ProductVariantsProps {
  variants: ProductVariantDraft[];

  onAdd: () => void;
  onUpdate: (
    id: string,
    updates: Partial<ProductVariantDraft>,
  ) => void;
  onRemove: (id: string) => void;
}

export function ProductVariants({
  variants,
  onAdd,
  onUpdate,
  onRemove,
}: ProductVariantsProps) {
  const colorsQuery = useColors();

  const colors = colorsQuery.data ?? [];

  const duplicateColorIds = new Set(
    variants
      .map((variant) => variant.colorId)
      .filter(Boolean)
      .filter(
        (id, index, all) => all.indexOf(id) !== index,
      ),
  );

  return (
    <ProductCard
      title="Product variants"
      description="Set the color, SKU and inventory for each product variant."
      action={
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="size-3.5" />
          Add variant
        </button>
      }
    >
      <div className="space-y-4">
        {colorsQuery.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Unable to load colors.
          </div>
        )}

        {colorsQuery.isLoading && (
          <div className="rounded-xl border bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
            Loading colors...
          </div>
        )}

        {variants.map((variant, index) => {
          const selectedByOtherVariants = new Set(
            variants
              .filter((item) => item.id !== variant.id)
              .map((item) => item.colorId)
              .filter(Boolean),
          );

          const reservedExceedsStock =
            Number(variant.reservedStock || 0) >
            Number(variant.stock || 0);

          const duplicateColor = duplicateColorIds.has(
            variant.colorId,
          );

          return (
            <div
              key={variant.id}
              className={`rounded-2xl border p-4 ${
                duplicateColor || reservedExceedsStock
                  ? "border-red-300 bg-red-50/40"
                  : "bg-background"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Variant {index + 1}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Inventory is managed per color.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(variant.id)}
                  disabled={variants.length === 1}
                  className="inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Remove variant"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <label
                    htmlFor={`variant-color-${variant.id}`}
                    className="text-xs font-medium"
                  >
                    Color
                  </label>

                  <select
                    id={`variant-color-${variant.id}`}
                    value={variant.colorId}
                    onChange={(event) =>
                      onUpdate(variant.id, {
                        colorId: event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                  >
                    <option value="">Select color</option>

                    {colors.map((color) => (
                      <option
                        key={color.id}
                        value={color.id}
                        disabled={selectedByOtherVariants.has(
                          color.id,
                        )}
                      >
                        {color.name}
                      </option>
                    ))}
                  </select>

                  {duplicateColor && (
                    <p className="text-xs text-red-600">
                      This color is already used.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`variant-sku-${variant.id}`}
                    className="text-xs font-medium"
                  >
                    Variant SKU
                  </label>

                  <input
                    id={`variant-sku-${variant.id}`}
                    value={variant.sku}
                    onChange={(event) =>
                      onUpdate(variant.id, {
                        sku: event.target.value,
                      })
                    }
                    placeholder="e.g. BAG-BLK"
                    className="h-10 w-full rounded-lg border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`variant-stock-${variant.id}`}
                    className="text-xs font-medium"
                  >
                    Stock
                  </label>

                  <input
                    id={`variant-stock-${variant.id}`}
                    type="number"
                    min="0"
                    step="1"
                    value={variant.stock}
                    onChange={(event) =>
                      onUpdate(variant.id, {
                        stock: event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`variant-reserved-${variant.id}`}
                    className="text-xs font-medium"
                  >
                    Reserved
                  </label>

                  <input
                    id={`variant-reserved-${variant.id}`}
                    type="number"
                    min="0"
                    step="1"
                    value={variant.reservedStock}
                    onChange={(event) =>
                      onUpdate(variant.id, {
                        reservedStock: event.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                  />
                </div>
              </div>

              {reservedExceedsStock && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
                  <AlertCircle className="size-3.5" />
                  Reserved stock cannot be greater than stock.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ProductCard>
  );
}
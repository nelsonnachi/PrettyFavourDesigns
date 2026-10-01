"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api/client";

export interface DiscountFormData {
  name: string;
  description: string;
  code: string;
  type: "percentage" | "fixed";
  value: string;
  appliesTo: "order" | "products" | "categories";
  productIds: string[];
  categoryIds: string[];
  eligibility: "all" | "specific_customers";
  customerIds: string[];
  minimumPurchaseAmount: string;
  maximumDiscountAmount: string;
  minimumQuantity: string;
  usageLimit: string;
  usageLimitPerCustomer: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
}

interface DiscountFormProps {
  mode: "create" | "edit";
  discountId?: string;
  initialValues?: Partial<DiscountFormData>;
}

function getDefaultValues(): DiscountFormData {
  const now = new Date();

  const localNow = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  return {
    name: "",
    description: "",
    code: "",
    type: "percentage",
    value: "",
    appliesTo: "order",
    productIds: [],
    categoryIds: [],
    eligibility: "all",
    customerIds: [],
    minimumPurchaseAmount: "",
    maximumDiscountAmount: "",
    minimumQuantity: "",
    usageLimit: "",
    usageLimitPerCustomer: "",
    isActive: true,
    startsAt: localNow,
    endsAt: "",
  };
}

function toLocalDateTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);
}

function toIso(value: string) {
  return new Date(value).toISOString();
}

function cleanNumber(value: string) {
  if (!value.trim()) return undefined;

  return Number(value);
}

function idsToText(ids: string[]) {
  return ids.join("\n");
}

function textToIds(value: string) {
  return value
    .split(/[\n,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function DiscountForm({
  mode,
  discountId,
  initialValues,
}: DiscountFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<DiscountFormData>(() => ({
    ...getDefaultValues(),
    ...initialValues,
    startsAt: initialValues?.startsAt
      ? toLocalDateTime(initialValues.startsAt)
      : getDefaultValues().startsAt,
    endsAt: initialValues?.endsAt
      ? toLocalDateTime(initialValues.endsAt)
      : "",
  }));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof DiscountFormData>(
    key: K,
    value: DiscountFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!form.name.trim()) {
      setError("Discount name is required.");
      return;
    }

    if (!form.code.trim()) {
      setError("Discount code is required.");
      return;
    }

    const value = Number(form.value);

    if (!value || value <= 0) {
      setError("Discount value must be greater than 0.");
      return;
    }

    if (form.type === "percentage" && value > 100) {
      setError("A percentage discount cannot be more than 100.");
      return;
    }

    if (!form.startsAt) {
      setError("Start date is required.");
      return;
    }

    if (
      form.endsAt &&
      new Date(form.endsAt) <= new Date(form.startsAt)
    ) {
      setError("End date must be after the start date.");
      return;
    }

    if (
      form.appliesTo === "products" &&
      form.productIds.length === 0
    ) {
      setError("Add at least one product ID.");
      return;
    }

    if (
      form.appliesTo === "categories" &&
      form.categoryIds.length === 0
    ) {
      setError("Add at least one category ID.");
      return;
    }

    if (
      form.eligibility === "specific_customers" &&
      form.customerIds.length === 0
    ) {
      setError("Add at least one customer ID.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value,

        appliesTo: form.appliesTo,

        productIds:
          form.appliesTo === "products"
            ? form.productIds
            : [],

        categoryIds:
          form.appliesTo === "categories"
            ? form.categoryIds
            : [],

        eligibility: form.eligibility,

        customerIds:
          form.eligibility === "specific_customers"
            ? form.customerIds
            : [],

        minimumPurchaseAmount: cleanNumber(
          form.minimumPurchaseAmount,
        ),

        maximumDiscountAmount: cleanNumber(
          form.maximumDiscountAmount,
        ),

        minimumQuantity: cleanNumber(form.minimumQuantity),

        usageLimit: cleanNumber(form.usageLimit),

        usageLimitPerCustomer: cleanNumber(
          form.usageLimitPerCustomer,
        ),

        isActive: form.isActive,

        startsAt: toIso(form.startsAt),

        endsAt: form.endsAt
          ? toIso(form.endsAt)
          : undefined,
      };

      if (mode === "create") {
        await apiClient("/api/admin/discounts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        if (!discountId) {
          throw new Error("Discount ID is missing.");
        }

        await apiClient(
          `/api/admin/discounts/${discountId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
        );
      }

      router.push("/admin/discounts");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save discount.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* TOP ACTIONS */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/discounts")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6f665f] hover:text-[#211b17]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to discounts
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#e85d22] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#d94f17] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create discount"
              : "Save changes"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* BASIC INFORMATION */}
      <section className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="border-b border-[#e6ddd1] px-6 py-5">
          <h2 className="font-semibold text-[#211b17]">
            Basic information
          </h2>

          <p className="mt-1 text-sm text-[#6f665f]">
            Give your discount a name and customer-facing code.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Discount name
            </label>

            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Summer Sale"
              className="admin-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Discount code
            </label>

            <input
              value={form.code}
              onChange={(e) =>
                update("code", e.target.value.toUpperCase())
              }
              placeholder="SUMMER20"
              className="admin-input font-mono uppercase"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                update("description", e.target.value)
              }
              rows={3}
              placeholder="20% off selected products..."
              className="admin-input resize-none"
            />
          </div>
        </div>
      </section>

      {/* DISCOUNT VALUE */}
      <section className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="border-b border-[#e6ddd1] px-6 py-5">
          <h2 className="font-semibold text-[#211b17]">
            Discount value
          </h2>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Discount type
            </label>

            <select
              value={form.type}
              onChange={(e) =>
                update(
                  "type",
                  e.target.value as DiscountFormData["type"],
                )
              }
              className="admin-input"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Value
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.value}
                onChange={(e) =>
                  update("value", e.target.value)
                }
                placeholder="20"
                className="admin-input pr-12"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#8a8078]">
                {form.type === "percentage" ? "%" : "₦"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* APPLIES TO */}
      <section className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="border-b border-[#e6ddd1] px-6 py-5">
          <h2 className="font-semibold text-[#211b17]">
            Where should this discount apply?
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <select
            value={form.appliesTo}
            onChange={(e) =>
              update(
                "appliesTo",
                e.target.value as DiscountFormData["appliesTo"],
              )
            }
            className="admin-input"
          >
            <option value="order">Entire order</option>
            <option value="products">Specific products</option>
            <option value="categories">Specific categories</option>
          </select>

          {form.appliesTo === "products" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#211b17]">
                Product IDs
              </label>

              <textarea
                rows={5}
                value={idsToText(form.productIds)}
                onChange={(e) =>
                  update(
                    "productIds",
                    textToIds(e.target.value),
                  )
                }
                placeholder="One product UUID per line"
                className="admin-input resize-none font-mono text-xs"
              />

              <p className="mt-2 text-xs text-[#8a8078]">
                Enter one product UUID per line.
              </p>
            </div>
          )}

          {form.appliesTo === "categories" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#211b17]">
                Category IDs
              </label>

              <textarea
                rows={5}
                value={idsToText(form.categoryIds)}
                onChange={(e) =>
                  update(
                    "categoryIds",
                    textToIds(e.target.value),
                  )
                }
                placeholder="One category UUID per line"
                className="admin-input resize-none font-mono text-xs"
              />

              <p className="mt-2 text-xs text-[#8a8078]">
                Enter one category UUID per line.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="border-b border-[#e6ddd1] px-6 py-5">
          <h2 className="font-semibold text-[#211b17]">
            Customer eligibility
          </h2>
        </div>

        <div className="space-y-5 p-6">
          <select
            value={form.eligibility}
            onChange={(e) =>
              update(
                "eligibility",
                e.target.value as DiscountFormData["eligibility"],
              )
            }
            className="admin-input"
          >
            <option value="all">All customers</option>
            <option value="specific_customers">
              Specific customers
            </option>
          </select>

          {form.eligibility === "specific_customers" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#211b17]">
                Customer IDs
              </label>

              <textarea
                rows={5}
                value={idsToText(form.customerIds)}
                onChange={(e) =>
                  update(
                    "customerIds",
                    textToIds(e.target.value),
                  )
                }
                placeholder="One customer UUID per line"
                className="admin-input resize-none font-mono text-xs"
              />

              <p className="mt-2 text-xs text-[#8a8078]">
                Enter one customer UUID per line.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="border-b border-[#e6ddd1] px-6 py-5">
          <h2 className="font-semibold text-[#211b17]">
            Conditions
          </h2>

          <p className="mt-1 text-sm text-[#6f665f]">
            Optional requirements customers must meet.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Minimum purchase
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.minimumPurchaseAmount}
              onChange={(e) =>
                update(
                  "minimumPurchaseAmount",
                  e.target.value,
                )
              }
              placeholder="0"
              className="admin-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Maximum discount
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.maximumDiscountAmount}
              onChange={(e) =>
                update(
                  "maximumDiscountAmount",
                  e.target.value,
                )
              }
              placeholder="Optional"
              className="admin-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Minimum quantity
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={form.minimumQuantity}
              onChange={(e) =>
                update("minimumQuantity", e.target.value)
              }
              placeholder="Optional"
              className="admin-input"
            />
          </div>
        </div>
      </section>

      {/* USAGE */}
      <section className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="border-b border-[#e6ddd1] px-6 py-5">
          <h2 className="font-semibold text-[#211b17]">
            Usage limits
          </h2>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Total usage limit
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={form.usageLimit}
              onChange={(e) =>
                update("usageLimit", e.target.value)
              }
              placeholder="Unlimited"
              className="admin-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Usage limit per customer
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={form.usageLimitPerCustomer}
              onChange={(e) =>
                update(
                  "usageLimitPerCustomer",
                  e.target.value,
                )
              }
              placeholder="Unlimited"
              className="admin-input"
            />
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="border-b border-[#e6ddd1] px-6 py-5">
          <h2 className="font-semibold text-[#211b17]">
            Schedule
          </h2>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Starts at
            </label>

            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) =>
                update("startsAt", e.target.value)
              }
              className="admin-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#211b17]">
              Ends at
            </label>

            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) =>
                update("endsAt", e.target.value)
              }
              className="admin-input"
            />
          </div>
        </div>
      </section>

      {/* STATUS */}
      <section className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="flex items-center justify-between gap-5 px-6 py-5">
          <div>
            <h2 className="font-semibold text-[#211b17]">
              Discount status
            </h2>

            <p className="mt-1 text-sm text-[#6f665f]">
              Customers can only use active discounts.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={form.isActive}
            onClick={() =>
              update("isActive", !form.isActive)
            }
            className={`relative h-6 w-11 rounded-full transition ${
              form.isActive
                ? "bg-[#e85d22]"
                : "bg-[#d6cec5]"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                form.isActive
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* BOTTOM ACTIONS */}
      <div className="flex justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/discounts")}
          disabled={saving}
          className="rounded-lg border border-[#e6ddd1] bg-[#fffdf9] px-5 py-2.5 text-sm font-medium text-[#211b17] hover:bg-[#f1ebe2]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#e85d22] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#d94f17] disabled:opacity-60"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving..."
            : mode === "create"
              ? "Create discount"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
"use client";

import {
  Copy,
  Edit3,
  MoreHorizontal,
  Power,
  Trash2,
} from "lucide-react";

import { DiscountStatusBadge } from "./discount-status-badge";

export interface AdminDiscount {
  id: string;
  name: string;
  description: string | null;
  code: string;
  type: "percentage" | "fixed";
  value: string;
  appliesTo: "order" | "products" | "categories";
  eligibility: "all" | "specific_customers";
  minimumPurchaseAmount: string | null;
  maximumDiscountAmount: string | null;
  minimumQuantity: number | null;
  usageLimit: number | null;
  usageLimitPerCustomer: number | null;
  usageCount: number;
  isActive: boolean;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DiscountTableProps {
  discounts: AdminDiscount[];
  onEdit: (discount: AdminDiscount) => void;
  onToggle: (discount: AdminDiscount) => void;
  onDelete: (discount: AdminDiscount) => void;
}

function formatDiscount(discount: AdminDiscount) {
  if (discount.type === "percentage") {
    return `${discount.value}%`;
  }

  return `₦${Number(discount.value).toLocaleString("en-NG")}`;
}

function formatAppliesTo(value: AdminDiscount["appliesTo"]) {
  switch (value) {
    case "products":
      return "Products";

    case "categories":
      return "Categories";

    default:
      return "Entire order";
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function DiscountTable({
  discounts,
  onEdit,
  onToggle,
  onDelete,
}: DiscountTableProps) {
  if (discounts.length === 0) {
    return (
      <div className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9] px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1ebe2]">
          <MoreHorizontal className="h-5 w-5 text-[#6f665f]" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-[#211b17]">
          No discounts found
        </h3>

        <p className="mt-1 text-sm text-[#6f665f]">
          Create your first discount code to start offering promotions.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b border-[#e6ddd1] bg-[#f1ebe2]">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6f665f]">
                Discount
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6f665f]">
                Code
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6f665f]">
                Value
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6f665f]">
                Applies To
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6f665f]">
                Usage
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6f665f]">
                Ends
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6f665f]">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#6f665f]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e6ddd1]">
            {discounts.map((discount) => (
              <tr
                key={discount.id}
                className="transition hover:bg-[#faf7f1]"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-[#211b17]">
                      {discount.name}
                    </p>

                    {discount.description && (
                      <p className="mt-1 max-w-[250px] truncate text-xs text-[#6f665f]">
                        {discount.description}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(discount.code)
                    }
                    className="group inline-flex items-center gap-2 rounded-md bg-[#f1ebe2] px-2.5 py-1.5 font-mono text-sm font-medium text-[#211b17] transition hover:bg-[#eee6da]"
                    title="Copy discount code"
                  >
                    {discount.code}

                    <Copy className="h-3.5 w-3.5 text-[#8a8078] transition group-hover:text-[#e85d22]" />
                  </button>
                </td>

                <td className="px-5 py-4">
                  <span className="font-semibold text-[#e85d22]">
                    {formatDiscount(discount)}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-[#514941]">
                  {formatAppliesTo(discount.appliesTo)}
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm text-[#211b17]">
                    {discount.usageCount.toLocaleString()}
                  </span>

                  <span className="text-sm text-[#8a8078]">
                    {" "}
                    /{" "}
                    {discount.usageLimit
                      ? discount.usageLimit.toLocaleString()
                      : "∞"}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-[#514941]">
                  {formatDate(discount.endsAt)}
                </td>

                <td className="px-5 py-4">
                  <DiscountStatusBadge
                    isActive={discount.isActive}
                    startsAt={discount.startsAt}
                    endsAt={discount.endsAt}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(discount)}
                      className="rounded-lg p-2 text-[#6f665f] transition hover:bg-[#f1ebe2] hover:text-[#211b17]"
                      title="Edit discount"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggle(discount)}
                      className="rounded-lg p-2 text-[#6f665f] transition hover:bg-[#f1ebe2] hover:text-[#211b17]"
                      title={
                        discount.isActive
                          ? "Deactivate discount"
                          : "Activate discount"
                      }
                    >
                      <Power className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(discount)}
                      className="rounded-lg p-2 text-[#6f665f] transition hover:bg-red-50 hover:text-red-600"
                      title="Delete discount"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
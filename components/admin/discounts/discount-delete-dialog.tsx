"use client";

import { AlertTriangle, X } from "lucide-react";

import type { AdminDiscount } from "./discount-table";

interface DiscountDeleteDialogProps {
  discount: AdminDiscount | null;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DiscountDeleteDialog({
  discount,
  open,
  loading = false,
  onClose,
  onConfirm,
}: DiscountDeleteDialogProps) {
  if (!open || !discount) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6ddd1] px-6 py-4">
          <h2 className="font-semibold text-[#211b17]">
            Delete discount
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#6f665f] hover:bg-[#f1ebe2]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h3 className="font-medium text-[#211b17]">
                Delete "{discount.name}"?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6f665f]">
                This action permanently removes the discount. If this
                discount has already been used, your API will prevent
                deletion and require you to deactivate it instead.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#e6ddd1] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[#e6ddd1] px-4 py-2 text-sm font-medium text-[#211b17] hover:bg-[#f1ebe2]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete discount"}
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { useDeleteColor } from "@/lib/query/colors/color-queries";
import { Color } from "@/lib/query/colors/color-types";


interface ColorDeleteDialogProps {
  color: Color;
  children: React.ReactNode;
}

export function ColorDeleteDialog({
  color,
  children,
}: ColorDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const deleteColor = useDeleteColor();

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  }

  async function handleDelete() {
    setError("");

    try {
      await deleteColor.mutateAsync(color.id);

      setOpen(false);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <>
      <span
        className="inline-flex"
        onClick={() => setOpen(true)}
      >
        {children}
      </span>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close delete dialog"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Dialog */}

          <div
            role="alertdialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] shadow-2xl"
          >
            {/* Header */}

            <div className="flex items-start justify-between px-6 pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#211b17]">
                    Delete color?
                  </h2>

                  <p className="mt-1 text-sm text-[#211b17]/55">
                    You are about to delete{" "}
                    <span className="font-medium text-[#211b17]">
                      {color.name}
                    </span>
                    .
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-[#211b17]/50 hover:bg-[#f1ebe2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}

            <div className="px-6 py-5">
              <div className="rounded-lg border border-[#e6ddd1] bg-[#faf7f1] p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full border border-[#e6ddd1]"
                    style={{
                      backgroundColor:
                        color.hexCode ?? "#e6ddd1",
                    }}
                  />

                  <div>
                    <p className="text-sm font-medium text-[#211b17]">
                      {color.name}
                    </p>

                    <p className="text-xs text-[#211b17]/50">
                      {color.hexCode?.toUpperCase() ??
                        "No hex code"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#211b17]/60">
                If this color is already being used by a product
                variant, it will be <strong>deactivated</strong>{" "}
                instead of permanently deleted.
              </p>

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}

            <div className="flex items-center justify-end gap-3 border-t border-[#e6ddd1] px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={deleteColor.isPending}
                className="h-10 rounded-lg border border-[#e6ddd1] bg-[#fffdf9] px-4 text-sm font-medium text-[#211b17] transition hover:bg-[#f1ebe2] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteColor.isPending}
                className="inline-flex h-10 min-w-[100px] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteColor.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {deleteColor.isPending
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
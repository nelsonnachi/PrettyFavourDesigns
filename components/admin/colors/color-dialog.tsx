"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useAdminColor, useCreateColor, useUpdateColor } from "@/lib/query/colors/color-queries";
import { CreateColorInput, UpdateColorInput } from "@/lib/query/colors/color-types";
import { ColorForm } from "./color-form";


interface ColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colorId: string | null;
}

export function ColorDialog({
  open,
  onOpenChange,
  colorId,
}: ColorDialogProps) {
  const isEditing = Boolean(colorId);

  const {
    data: color,
    isLoading: isLoadingColor,
    isError: isColorError,
  } = useAdminColor(colorId ?? "");

  const createColor = useCreateColor();
  const updateColor = useUpdateColor();

  const [name, setName] = useState("");
  const [hexCode, setHexCode] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!colorId) {
      setName("");
      setHexCode("");
      setIsActive(true);
      setFormError("");
      return;
    }

    if (color) {
      setName(color.name);
      setHexCode(color.hexCode ?? "");
      setIsActive(color.isActive);
      setFormError("");
    }
  }, [open, colorId, color]);

  if (!open) {
    return null;
  }

  const isPending =
    createColor.isPending || updateColor.isPending;

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  }

  async function handleSubmit() {
    setFormError("");

    const trimmedName = name.trim();
    const trimmedHex = hexCode.trim();

    if (trimmedName.length < 2) {
      setFormError("Color name must be at least 2 characters.");
      return;
    }

    if (trimmedName.length > 50) {
      setFormError("Color name is too long.");
      return;
    }

    if (trimmedHex && !/^#[0-9A-Fa-f]{6}$/.test(trimmedHex)) {
      setFormError("Please enter a valid hex color such as #E85D22.");
      return;
    }

    try {
      if (isEditing && colorId) {
        const data: UpdateColorInput = {
          name: trimmedName,
          hexCode: trimmedHex || undefined,
          isActive,
        };

        await updateColor.mutateAsync({
          id: colorId,
          data,
        });
      } else {
        const data: CreateColorInput = {
          name: trimmedName,
          hexCode: trimmedHex || undefined,
          isActive,
        };

        await createColor.mutateAsync(data);
      }

      onOpenChange(false);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}

      <button
        type="button"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-black/40"
      />

      {/* Dialog */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="color-dialog-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#e6ddd1] bg-[#fffdf9] shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b border-[#e6ddd1] px-6 py-5">
          <div>
            <h2
              id="color-dialog-title"
              className="text-lg font-semibold text-[#211b17]"
            >
              {isEditing ? "Edit Color" : "Add Color"}
            </h2>

            <p className="mt-1 text-sm text-[#211b17]/55">
              {isEditing
                ? "Update this product color."
                : "Add a color for your products."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-[#211b17]/50 transition hover:bg-[#f1ebe2] hover:text-[#211b17]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}

        <div className="px-6 py-6">
          {isEditing && isLoadingColor ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#e85d22]" />
            </div>
          ) : isEditing && isColorError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Unable to load this color.
            </div>
          ) : (
            <ColorForm
              name={name}
              hexCode={hexCode}
              isActive={isActive}
              error={formError}
              isPending={isPending}
              isEditing={isEditing}
              onNameChange={setName}
              onHexCodeChange={setHexCode}
              onActiveChange={setIsActive}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
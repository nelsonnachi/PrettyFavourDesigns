"use client";

import { Loader2 } from "lucide-react";

interface ColorFormProps {
  name: string;
  hexCode: string;
  isActive: boolean;
  error: string;
  isPending: boolean;
  isEditing: boolean;

  onNameChange: (value: string) => void;
  onHexCodeChange: (value: string) => void;
  onActiveChange: (value: boolean) => void;

  onSubmit: () => void;
  onCancel: () => void;
}

export function ColorForm({
  name,
  hexCode,
  isActive,
  error,
  isPending,
  isEditing,
  onNameChange,
  onHexCodeChange,
  onActiveChange,
  onSubmit,
  onCancel,
}: ColorFormProps) {
  return (
    <div className="space-y-5">
      {/* =====================================================
          NAME
      ===================================================== */}

      <div>
        <label
          htmlFor="color-name"
          className="mb-2 block text-sm font-medium text-[#211b17]"
        >
          Color name
        </label>

        <input
          id="color-name"
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="e.g. Black"
          maxLength={50}
          disabled={isPending}
          className="h-11 w-full rounded-lg border border-[#e6ddd1] bg-[#faf7f1] px-3 text-sm text-[#211b17] outline-none transition placeholder:text-[#211b17]/35 focus:border-[#e85d22] focus:ring-2 focus:ring-[#e85d22]/10 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* =====================================================
          HEX COLOR
      ===================================================== */}

      <div>
        <label
          htmlFor="color-hex"
          className="mb-2 block text-sm font-medium text-[#211b17]"
        >
          Hex color
        </label>

        <div className="flex gap-3">
          <div
            className="h-11 w-11 shrink-0 rounded-lg border border-[#e6ddd1]"
            style={{
              backgroundColor:
                /^#[0-9A-Fa-f]{6}$/.test(hexCode)
                  ? hexCode
                  : "#e6ddd1",
            }}
          />

          <input
            id="color-hex"
            type="text"
            value={hexCode}
            onChange={(event) =>
              onHexCodeChange(event.target.value)
            }
            placeholder="#000000"
            maxLength={7}
            disabled={isPending}
            className="h-11 flex-1 rounded-lg border border-[#e6ddd1] bg-[#faf7f1] px-3 text-sm font-mono text-[#211b17] uppercase outline-none transition placeholder:normal-case placeholder:text-[#211b17]/35 focus:border-[#e85d22] focus:ring-2 focus:ring-[#e85d22]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <p className="mt-2 text-xs text-[#211b17]/45">
          Use a six-digit hex value, for example #211B17.
        </p>
      </div>

      {/* =====================================================
          ACTIVE
      ===================================================== */}

      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#e6ddd1] bg-[#faf7f1] p-4">
        <div>
          <p className="text-sm font-medium text-[#211b17]">
            Active color
          </p>

          <p className="mt-1 text-xs text-[#211b17]/50">
            Active colors can be selected for product variants.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => onActiveChange(!isActive)}
          disabled={isPending}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            isActive ? "bg-[#e85d22]" : "bg-[#d6cec3]"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
              isActive ? "left-6" : "left-1"
            }`}
          />
        </button>
      </label>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="flex items-center justify-end gap-3 border-t border-[#e6ddd1] pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="h-10 rounded-lg border border-[#e6ddd1] bg-[#fffdf9] px-4 text-sm font-medium text-[#211b17] transition hover:bg-[#f1ebe2] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="inline-flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-lg bg-[#211b17] px-4 text-sm font-medium text-white transition hover:bg-[#211b17]/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {isPending
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Color"}
        </button>
      </div>
    </div>
  );
}
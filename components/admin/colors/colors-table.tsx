"use client";

import { Color } from "@/lib/query/colors/color-types";
import {
  Edit3,
  MoreHorizontal,
  Palette,
  Plus,
  Trash2,
} from "lucide-react";
import { ColorStatusBadge } from "./olor-status-badge";
import { ColorDeleteDialog } from "./color-delete-dialog";


interface ColorsTableProps {
  colors: Color[];
  hasSearch: boolean;
  onCreate: () => void;
  onEdit: (id: string) => void;
}

export function ColorsTable({
  colors,
  hasSearch,
  onCreate,
  onEdit,
}: ColorsTableProps) {
  if (colors.length === 0) {
    return (
      <div className="rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1ebe2]">
            <Palette className="h-6 w-6 text-[#211b17]/50" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-[#211b17]">
            {hasSearch ? "No colors found" : "No colors yet"}
          </h3>

          <p className="mt-2 max-w-sm text-sm text-[#211b17]/60">
            {hasSearch
              ? "Try changing your search or status filter."
              : "Create your first product color to get started."}
          </p>

          {!hasSearch && (
            <button
              type="button"
              onClick={onCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#211b17] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#211b17]/90"
            >
              <Plus className="h-4 w-4" />
              Add Color
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#e6ddd1] bg-[#fffdf9]">
      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e6ddd1] bg-[#f1ebe2]/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#211b17]/55">
                Color
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#211b17]/55">
                Hex Code
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#211b17]/55">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#211b17]/55">
                Created
              </th>

              <th className="w-[100px] px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#211b17]/55">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {colors.map((color) => (
              <ColorRow
                key={color.id}
                color={color}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="divide-y divide-[#e6ddd1] md:hidden">
        {colors.map((color) => (
          <ColorMobileCard
            key={color.id}
            color={color}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DESKTOP ROW
// ============================================================

function ColorRow({
  color,
  onEdit,
}: {
  color: Color;
  onEdit: (id: string) => void;
}) {
  return (
    <tr className="border-b border-[#e6ddd1] last:border-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <ColorSwatch color={color} />

          <div>
            <p className="font-medium text-[#211b17]">{color.name}</p>

            <p className="text-xs text-[#211b17]/45">
              ID: {color.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        {color.hexCode ? (
          <code className="rounded-md bg-[#f1ebe2] px-2 py-1 text-xs text-[#211b17]">
            {color.hexCode.toUpperCase()}
          </code>
        ) : (
          <span className="text-sm text-[#211b17]/40">Not set</span>
        )}
      </td>

      <td className="px-5 py-4">
        <ColorStatusBadge isActive={color.isActive} />
      </td>

      <td className="px-5 py-4 text-sm text-[#211b17]/60">
        {formatDate(color.createdAt)}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(color.id)}
            className="rounded-lg p-2 text-[#211b17]/60 transition hover:bg-[#f1ebe2] hover:text-[#211b17]"
            aria-label={`Edit ${color.name}`}
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <ColorDeleteDialog color={color}>
            <button
              type="button"
              className="rounded-lg p-2 text-[#211b17]/60 transition hover:bg-red-50 hover:text-red-600"
              aria-label={`Delete ${color.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </ColorDeleteDialog>
        </div>
      </td>
    </tr>
  );
}

// ============================================================
// MOBILE CARD
// ============================================================

function ColorMobileCard({
  color,
  onEdit,
}: {
  color: Color;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <ColorSwatch color={color} />

          <div className="min-w-0">
            <p className="truncate font-medium text-[#211b17]">
              {color.name}
            </p>

            <p className="mt-1 text-xs text-[#211b17]/50">
              {color.hexCode?.toUpperCase() ?? "No hex code"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(color.id)}
            className="rounded-lg p-2 text-[#211b17]/60 hover:bg-[#f1ebe2]"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <ColorDeleteDialog color={color}>
            <button
              type="button"
              className="rounded-lg p-2 text-[#211b17]/60 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </ColorDeleteDialog>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <ColorStatusBadge isActive={color.isActive} />

        <span className="text-xs text-[#211b17]/50">
          {formatDate(color.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// COLOR SWATCH
// ============================================================

function ColorSwatch({ color }: { color: Color }) {
  const hasHex = Boolean(color.hexCode);

  return (
    <div
      className="h-10 w-10 shrink-0 rounded-full border border-[#e6ddd1] shadow-sm"
      style={{
        backgroundColor: hasHex ? color.hexCode! : "#e6ddd1",
      }}
      title={color.hexCode ?? "No hex code"}
    />
  );
}

// ============================================================
// DATE
// ============================================================

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
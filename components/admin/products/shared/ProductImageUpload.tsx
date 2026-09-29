"use client";

import { ImagePlus } from "lucide-react";

interface ProductImageUploadProps {
  onFilesSelected: (files: File[]) => void;
}

export function ProductImageUpload({
  onFilesSelected,
}: ProductImageUploadProps) {
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      onFilesSelected(files);
    }

    event.target.value = "";
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-background px-6 py-10 text-center transition hover:bg-muted/40">
      <input
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleChange}
      />

      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <ImagePlus className="size-5 text-muted-foreground" />
      </span>

      <span className="mt-4 text-sm font-medium">
        Add product images
      </span>

      <span className="mt-1 max-w-sm text-xs text-muted-foreground">
        Click to choose images from your computer. You can add multiple
        images at once.
      </span>
    </label>
  );
}
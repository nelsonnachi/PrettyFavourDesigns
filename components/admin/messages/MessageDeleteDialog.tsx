"use client";

import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

interface MessageDeleteDialogProps {
  open: boolean;
  messageName?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function MessageDeleteDialog({
  open,
  messageName,
  isDeleting,
  onClose,
  onConfirm,
}: MessageDeleteDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={
          isDeleting
            ? undefined
            : onClose
        }
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-message-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="delete-message-title"
              className="text-lg font-semibold tracking-tight"
            >
              Delete message?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This will permanently remove this
              message
              {messageName
                ? ` from ${messageName}`
                : ""}{" "}
              from your inbox. This action cannot
              be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 border-t bg-muted/20 p-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center rounded-xl border bg-card px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete message
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { FormEvent, useState } from "react";

import { Check, Loader2, X } from "lucide-react";

type CheckoutDiscountCodeProps = {
  // The code the customer applied (null = none yet)
  appliedCode: string | null;

  // true while the server is checking the code
  isChecking: boolean;

  // Error from the server, e.g. "Invalid discount code"
  errorMessage: string;

  onApply: (code: string) => void;
  onRemove: () => void;
};

export function CheckoutDiscountCode({
  appliedCode,
  isChecking,
  errorMessage,
  onApply,
  onRemove,
}: CheckoutDiscountCodeProps) {
  // What the customer is typing in the box
  const [inputValue, setInputValue] = useState("");

  // The code is applied when it was checked and there is no error
  const isApplied =
    Boolean(appliedCode) && !isChecking && !errorMessage;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const code = inputValue.trim().toUpperCase();

    if (!code) return;

    onApply(code);
  }

  function handleRemove() {
    setInputValue("");

    onRemove();
  }

  // ============================================================
  // CODE IS APPLIED
  // ============================================================

  if (isApplied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-accent bg-accent/5 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-accent" />

          <span className="truncate text-sm font-medium">
            {appliedCode}
          </span>

          <span className="text-xs text-muted-foreground">applied</span>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
    );
  }

  // ============================================================
  // INPUT BOX
  // ============================================================

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          maxLength={30}
          placeholder="Discount code"
          aria-label="Discount code"
          className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 text-sm uppercase outline-none transition placeholder:normal-case focus:border-accent"
        />

        <button
          type="submit"
          disabled={isChecking || !inputValue.trim()}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </button>
      </form>

      {errorMessage && (
        <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface AdminSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function AdminSearch({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}: AdminSearchProps) {
  const [internalValue, setInternalValue] = useState("");

  const searchValue = value ?? internalValue;

  function handleChange(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  }

  return (
    <div className={`relative ${className}`}>
      <Search
        size={17}
        strokeWidth={1.8}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <input
        type="search"
        value={searchValue}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="
          h-10 w-full rounded-lg
          border border-input
          bg-card
          pl-10 pr-10
          text-sm
          outline-none
          placeholder:text-muted-foreground
          focus:border-ring
          focus:ring-2
          focus:ring-ring/10
        "
      />

      {searchValue && (
        <button
          type="button"
          onClick={() => handleChange("")}
          className="
            absolute right-3 top-1/2
            flex -translate-y-1/2
            items-center justify-center
            text-muted-foreground
            hover:text-foreground
          "
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
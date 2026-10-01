"use client";

export function CheckoutProgress() {
  return (
    <section className="min-w-0 overflow-hidden border-b border-border bg-secondary/30">
      <div className="mx-auto min-w-0 max-w-[1440px] px-4 py-4 sm:px-8 sm:py-5 lg:px-12">
        <div className="flex min-w-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] sm:gap-3 sm:tracking-[0.16em]">
          {/* ================================================== */}
          {/* INFORMATION */}
          {/* ================================================== */}

          <div className="flex min-w-0 shrink-0 items-center gap-2 text-accent">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
              1
            </span>

            <span className="hidden sm:inline">
              Information
            </span>

            <span className="sm:hidden">
              Info
            </span>
          </div>

          {/* ================================================== */}
          {/* SEPARATOR */}
          {/* ================================================== */}

          <div className="h-px min-w-3 flex-1 bg-border sm:min-w-4 sm:max-w-16" />

          {/* ================================================== */}
          {/* PAYMENT */}
          {/* ================================================== */}

          <div className="flex min-w-0 shrink-0 items-center gap-2 text-muted-foreground">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background">
              2
            </span>

            <span className="hidden sm:inline">
              Payment
            </span>

            <span className="sm:hidden">
              Pay
            </span>
          </div>

          {/* ================================================== */}
          {/* SECOND SEPARATOR */}
          {/* ================================================== */}

          <div className="hidden h-px w-16 bg-border sm:block" />

          {/* ================================================== */}
          {/* CONFIRMATION */}
          {/* ================================================== */}

          <div className="hidden shrink-0 items-center gap-2 text-muted-foreground sm:flex">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background">
              3
            </span>

            <span>
              Confirmation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
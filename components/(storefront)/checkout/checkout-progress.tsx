"use client";

export function CheckoutProgress() {
  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em]">
          <div className="flex items-center gap-2 text-accent">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white">
              1
            </span>

            <span>Information</span>
          </div>

          <div className="h-px w-8 bg-border sm:w-16" />

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border">
              2
            </span>

            <span>Payment</span>
          </div>

          <div className="h-px w-8 bg-border sm:w-16" />

          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border">
              3
            </span>

            <span className="hidden sm:inline">
              Confirmation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
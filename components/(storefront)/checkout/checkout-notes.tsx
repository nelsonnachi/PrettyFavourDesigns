"use client";

type CheckoutNotesProps = {
  notes: string;
  onNotesChange: (value: string) => void;
};

export function CheckoutNotes({
  notes,
  onNotesChange,
}: CheckoutNotesProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">
          Order notes
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Add any special instructions for your order.
        </p>
      </div>

      <textarea
        value={notes}
        onChange={(event) =>
          onNotesChange(event.target.value)
        }
        maxLength={1000}
        rows={5}
        placeholder="Anything we should know about your order?"
        className="w-full resize-none rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none transition focus:border-accent"
      />

      <div className="mt-2 text-right text-xs text-muted-foreground">
        {notes.length}/1000
      </div>
    </section>
  );
}
import Link from "next/link";

export function AboutCta() {
  return (
    <section className="border-t border-border bg-[#f3eee8]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 text-center sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Be part of the story
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight tracking-[-0.03em] text-[#211b17] sm:text-5xl lg:text-6xl">
          Your next everyday favourite might be waiting.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#756a60] sm:text-base sm:leading-8">
          Discover the collection and find something designed to move
          naturally with your life.
        </p>

        <Link
          href="/shop"
          className="mt-9 inline-flex h-14 items-center justify-center bg-[#211b17] px-8 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#e85d22]"
        >
          Shop the collection
        </Link>
      </div>
    </section>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#211b17] text-white">
      <div className="mx-auto grid max-w-[1440px] lg:min-h-[680px] lg:grid-cols-2">
        {/* CONTENT */}
        <div className="flex items-center px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#e85d22]">
              Our story
            </p>

            <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              More than a bag.
              <br />
              A story worth carrying.
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              We started with a simple idea: everyday essentials should
              feel considered, beautiful, and made to become part of
              your story.
            </p>

            <Link
              href="/shop"
              className="mt-9 inline-flex h-12 items-center justify-center bg-white px-7 text-xs font-semibold uppercase tracking-[0.15em] text-[#211b17] transition hover:bg-[#e85d22] hover:text-white"
            >
              Explore the collection
            </Link>
          </div>
        </div>

        {/* IMAGE */}
        <div className="relative min-h-[480px] lg:min-h-full">
          <Image
            src="/images/banners/about1.png"
            alt="Our collection"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
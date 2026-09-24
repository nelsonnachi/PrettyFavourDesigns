import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BrandStory() {
  return (
    <section
      aria-labelledby="brand-story-heading"
      className="relative isolate overflow-hidden bg-[#211b17]"
    >
      {/* =====================================================
          BACKGROUND IMAGE + OVERLAYS
      ===================================================== */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/banners/story-banner.png"
          alt="Woman carrying a SHOPPFD handcrafted bag"
          fill
          sizes="100vw"
          className="object-cover object-[30%_center] sm:object-[25%_center] lg:object-left"
        />

        {/* Mobile: dark gradient from the bottom so text sits on solid ground */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211b17] from-[35%] via-[#211b17]/30 to-[#211b17]/10 lg:hidden" />

        {/* Desktop: dark gradient from the right, image stays visible on the left */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#211b17]/10 via-[#211b17]/30 via-[55%] to-[#211b17] lg:block" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative mx-auto flex min-h-[480px] max-w-360 items-end px-5 py-10 sm:min-h-[520px] sm:px-8 sm:py-12 lg:min-h-[440px] lg:items-center lg:px-10 lg:py-16">
        <div className="w-full max-w-[400px] lg:ml-auto lg:mr-[12%] lg:max-w-[420px]">
          {/* =================================================
              EYEBROW
          ================================================= */}
          <div className="mb-3 flex items-center gap-3 sm:mb-4">
            <span className="h-px w-6 bg-[#e85d22] sm:w-8" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#e85d22] sm:text-[10px] sm:tracking-[0.3em]">
              SHOPPFD
            </p>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}
          <h2
            id="brand-story-heading"
            className="font-serif text-[30px] font-medium leading-[1.05] tracking-[-0.02em] text-[#faf7f1] sm:text-[36px] lg:text-[42px]"
          >
            More Than Just Bags
            <br />
            <span className="italic text-[#e85d22]">
              It&apos;s a Story
            </span>
          </h2>

          {/* =================================================
              DESCRIPTION
          ================================================= */}
          <p className="mt-4 text-[12px] leading-[1.7] text-[#d8cdbf] sm:mt-5 sm:text-[13px]">
            SHOPPFD is an artisan brand built on passion, creativity and a
            love for handmade craftsmanship. We believe every bag should make
            you feel confident, beautiful and uniquely you.
          </p>

          {/* =================================================
              CTA
          ================================================= */}
          <Link
            href="/about"
            className="group mt-6 inline-flex items-center gap-3 border border-[#faf7f1]/40 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#faf7f1] transition-all duration-300 hover:border-[#e85d22] hover:bg-[#e85d22] sm:mt-7 sm:px-6 sm:py-3.5 sm:text-[10px]"
          >
            <span>Learn More</span>

            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
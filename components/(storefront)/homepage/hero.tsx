import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function StorefrontHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f4e3d0]">
      {/* =====================================================
          BACKGROUND IMAGE + OVERLAYS
      ===================================================== */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero/heroimage.png"
          alt="SHOPPFD handcrafted bag"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[76%_center] sm:object-[72%_center] lg:object-center"
        />

        {/* =================================================
            MOBILE DARK OVERLAY
            Image remains visible at the top.
            Darkness increases toward the bottom.
        ================================================= */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent lg:hidden" />

        {/* =================================================
            DESKTOP OVERLAY
            Keep the desktop layout as a cream fade.
        ================================================= */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#f4e3d0]/95 via-[#f4e3d0]/40 to-transparent lg:block" />

        {/* =================================================
            BOTTOM FADE
        ================================================= */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent lg:from-[#faf7f1]/35" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative mx-auto flex min-h-155 max-w-360 items-start px-5 pt-30 pb-16 sm:min-h-162 sm:px-8 sm:pt-24 md:min-h-170 md:pt-28 lg:min-h-162 lg:items-center lg:px-10 lg:py-24">
        <div className="relative z-10 w-full max-w-[340px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[590px]">
          {/* =================================================
              EYEBROW
          ================================================= */}
          <div className="mb-4 flex items-center gap-3 sm:mb-5 lg:mb-5">
            <span className="h-px w-6 bg-[#e85d22] sm:w-8 lg:w-9" />

            <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#faf7f1] lg:text-[#6d5141] sm:text-[9px] sm:tracking-[0.3em] lg:text-[12px] lg:tracking-[0.32em]">
              Handcrafted Bags
            </p>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}
          <h1 className="max-w-[340px] font-serif text-[60px] font-medium leading-[0.91] tracking-[-0.035em] text-[#faf7f1] lg:text-[#211b17] sm:max-w-[470px] sm:text-[56px] md:text-[68px] lg:max-w-[580px] lg:text-[105px] lg:leading-[0.9] lg:tracking-[-0.025em]">
            Timeless Bags
            <br />
            for Every{" "}
            <span className="relative inline-block italic text-[#e85d22]">
              You
            </span>
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}
          <p className="mt-5 max-w-[310px] text-[14px] leading-[1.7] text-[#faf7f1]/90 lg:text-[#413a36] sm:mt-6 sm:max-w-[420px] sm:text-[12px] sm:leading-6 md:text-[13px] lg:mt-7 lg:max-w-[600px] lg:text-[15px]">
            At SHOPPFD, we create beautifully crafted bags that blend style,
            functionality and tradition. Each piece is thoughtfully designed to
            tell a story — yours.
          </p>

          {/* =================================================
              CTA
          ================================================= */}
          <div className="mt-6 sm:mt-7 lg:mt-8">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-[#e85d22] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm transition-all duration-300 hover:bg-[#c94e1c] hover:shadow-lg sm:px-6 sm:py-3.5 sm:text-[10px] lg:px-6 lg:py-3.5"
            >
              <span>Shop Collection</span>

              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE DECORATIVE ACCENT
      ===================================================== */}
      <div className="pointer-events-none absolute right-10 top-[72%] flex -rotate-[8deg] items-center gap-1.5 font-serif text-[18px] italic leading-[0.9] text-[#faf7f1]/95 sm:right-10 sm:text-[22px] lg:hidden">
        <Sparkles className="size-4 shrink-0" strokeWidth={1.6} />

        <span>
          <span className="block">Handmade</span>
          <span className="block">with love ♡</span>
        </span>
      </div>

      {/* =====================================================
          DESKTOP DECORATIVE ACCENT
      ===================================================== */}
      <div className="pointer-events-none absolute right-[40%] top-[30%] hidden -rotate-[7deg] items-center gap-3 font-serif text-[30px] italic leading-[0.9] text-[#e85d22]/90 lg:flex">
        <Sparkles className="size-7 shrink-0" strokeWidth={1.4} />

        <span>
          <span className="block">Handmade</span>
          <span className="block">with love ♡</span>
        </span>
      </div>
    </section>
  );
}

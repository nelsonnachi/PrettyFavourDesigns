import Image from "next/image";

export function WhereWeAre() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
        {/* IMAGE */}
        <div className="relative min-h-[480px] lg:min-h-[620px]">
          <Image
            src="/images/products/brownxyz.png"
            alt="Our brand"
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex items-center px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Where we are today
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#211b17] sm:text-5xl">
              From a small idea to a growing community.
            </h2>

            <p className="mt-7 text-sm leading-8 text-[#756a60] sm:text-base">
              Today, our brand continues to grow from our roots in
              Nigeria, connecting with customers who appreciate
              thoughtful products, dependable quality, and effortless
              style.
            </p>

            <p className="mt-5 text-sm leading-8 text-[#756a60] sm:text-base">
              We are proud of where we started, but we are even more
              excited about where we are going. Every customer, every
              order, and every piece that leaves our hands becomes part
              of that journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
const journey = [
  {
    year: "The beginning",
    title: "An idea becomes a brand",
    description:
      "We began with a simple ambition: to make everyday products that combine practical function with a strong sense of style.",
  },
  {
    year: "The first collection",
    title: "Finding our identity",
    description:
      "Our early collections helped define what we stand for — clean silhouettes, thoughtful details, and pieces made for everyday life.",
  },
  {
    year: "Today",
    title: "Growing with our community",
    description:
      "What started small continues to grow through the people who shop with us, recommend us, and make our products part of their everyday lives.",
  },
  {
    year: "What comes next",
    title: "Building something bigger",
    description:
      "We are continuing to expand our collection, improve the experience around it, and build a brand that can grow with the people who believe in it.",
  },
];

export function OurJourney() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* LABEL */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Our journey
            </p>
          </div>

          {/* TIMELINE */}
          <div className="max-w-4xl">
            {journey.map((item, index) => (
              <div
                key={item.year}
                className={`grid gap-5 py-8 sm:grid-cols-[150px_1fr] sm:gap-10 ${
                  index !== 0
                    ? "border-t border-border"
                    : "pt-0"
                }`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e85d22]">
                    {item.year}
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-2xl text-[#211b17] sm:text-3xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#756a60] sm:text-base sm:leading-8">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
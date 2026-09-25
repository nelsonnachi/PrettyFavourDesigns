export function BrandStory() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-20">
          {/* LABEL */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Where it began
            </p>
          </div>

          {/* STORY */}
          <div>
            <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] text-[#211b17] sm:text-5xl">
              It started with a simple belief.
            </h2>

            <div className="mt-8 space-y-6 text-sm leading-8 text-[#756a60] sm:text-base">
              <p>
                Great design does not have to be complicated. It should
                simply make everyday life feel a little better.
              </p>

              <p>
                Our journey began with a desire to create pieces that
                could move effortlessly through real life — from busy
                mornings and workdays to weekends, dinners, journeys,
                and everything in between.
              </p>

              <p>
                What began as a small idea grew into a brand built around
                thoughtful design, dependable quality, and a deep
                appreciation for the people who choose to carry our
                products.
              </p>

              <p>
                Today, that original idea still guides everything we do.
                We are not interested in creating products simply to
                fill a shelf. We want to create pieces that earn a place
                in your everyday life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
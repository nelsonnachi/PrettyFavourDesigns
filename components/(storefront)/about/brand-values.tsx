const values = [
  {
    number: "01",
    title: "Thoughtful design",
    description:
      "Every detail has a purpose. We believe beautiful design should also make everyday life easier.",
  },
  {
    number: "02",
    title: "Quality that lasts",
    description:
      "We look beyond the first impression and focus on products designed to remain useful, relevant, and dependable.",
  },
  {
    number: "03",
    title: "Everyday confidence",
    description:
      "The right piece should not compete with your life. It should complement it and make you feel ready for what comes next.",
  },
  {
    number: "04",
    title: "People first",
    description:
      "Our customers are at the centre of the brand. Every collection begins and ends with the people who use it.",
  },
];

export function BrandValues() {
  return (
    <section className="bg-[#f3eee8]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        {/* HEADER */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            What we believe
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#211b17] sm:text-5xl">
            Built around the things that matter.
          </h2>

          <p className="mt-6 text-sm leading-7 text-[#756a60] sm:text-base sm:leading-8">
            Our values are more than words on a page. They shape the
            products we choose, the experience we create, and the
            relationship we build with our customers.
          </p>
        </div>

        {/* VALUES */}
        <div className="mt-14 grid border-t border-[#211b17]/10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.number}
              className="border-b border-[#211b17]/10 px-0 py-8 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0"
            >
              <span className="text-xs font-medium text-[#e85d22]">
                {value.number}
              </span>

              <h3 className="mt-6 font-serif text-2xl text-[#211b17]">
                {value.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#756a60]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
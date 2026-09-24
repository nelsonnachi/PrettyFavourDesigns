import {
  Leaf,
  HandHeart,
  Truck,
  Heart,
  LucideIcon,
} from "lucide-react";

type Highlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const highlights: Highlight[] = [
  {
    title: "Premium Materials",
    description: "Only the best, for lasting.",
    icon: Leaf,
  },
  {
    title: "Handcrafted",
    description: "By skilled artisans.",
    icon: HandHeart,
  },
  {
    title: "Fast & Reliable Delivery",
    description: "Across Nigeria.",
    icon: Truck,
  },
  {
    title: "Made with Love",
    description: "You deserve it.",
    icon: Heart,
  },
];

export function Highlights() {
  return (
    <section
      aria-label="SHOPPFD benefits"
      className="border-b border-[#e6ddd1] bg-[#fffdf9]"
    >
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={[
                  "flex items-center gap-3 py-5 sm:py-6 lg:justify-center lg:gap-4 lg:py-7",
                  "lg:border-r lg:border-[#e6ddd1]",
                  index === 0
                    ? "border-r border-b border-[#e6ddd1] lg:border-l-0 lg:border-b-0"
                    : "",
                  index === 1
                    ? "border-b border-[#e6ddd1] lg:border-b-0"
                    : "",
                  index === 2
                    ? "border-r border-[#e6ddd1] lg:border-b-0"
                    : "",
                ].join(" ")}
              >
                {/* Icon */}
                <div className="flex size-9 shrink-0 items-center justify-center sm:size-10">
                  <Icon
                    className="size-[22px] text-[#211b17] sm:size-5"
                    strokeWidth={1.25}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h3 className="font-sans text-[9px] font-semibold uppercase tracking-[0.06em] text-[#211b17] sm:text-[10px] lg:text-[9px]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[8px] leading-[1.4] text-[#756a60] sm:text-[9px] lg:text-[8px]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
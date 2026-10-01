import Image from "next/image";
import { Star } from "lucide-react";

/*
 * For now this comes from dummy data.
 *
 * Later this will come from your reviews/testimonials table.
 */
const testimonials = [
  {
    id: 1,
    name: "Mrs Eberechi",
    location: "Abuja, Nigeria",
    avatarUrl: "/images/testimonials/avatar.jpg",
    rating: 5,
    quote:
      "I started with a lunch bag for my kids... Now I am hooked. The quality of the handbags, my backpack and the kids school bag is unmatched. The hand work and detailing are solid. I will always come back.",
  },
  {
    id: 2,
    name: "Sophia Naza",
    location: "Abuja, Nigeria",
    avatarUrl: "/images/testimonials/avatar.jpg",
    rating: 5,
    quote:
      "I got my bag. I love the design and the quality looks strong as well. Thank you so much Shoppfd for my bag, I really like it.",
  },
  {
    id: 3,
    name: "Chidinma Eze",
    location: "Port Harcourt, Nigeria",
    avatarUrl: "/images/testimonials/avatar.jpg",
    rating: 4,
    quote:
      "If you would still remember the bag i got from you some time ago. It's really lovely. And i'm still using it. Funny how you actually told me the bag would last me for a long time. And it eventually did. It's very strong",
  },
];

export function HappyClients() {
  return (
    <section
      aria-labelledby="happy-clients-heading"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-360 px-5 py-12 sm:px-8 sm:py-14 md:py-16 lg:px-10 lg:py-18">
        {/* Section header */}
        <div className="mb-7 sm:mb-8 lg:mb-9">
          <h2
            id="our-collection-heading"
            className="font-serif text-[34px] font-medium leading-none tracking-[-0.025em] text-[#211b17] sm:text-[38px] lg:text-[42px]"
          >
            Happy Clients
          </h2>

          <p className="mt-3 max-w-[470px] text-[12px] leading-[1.7] text-[#756a60] sm:text-[13px]">
            Real words from people carrying a SHOPPFD bag every day.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex flex-col border border-border bg-card px-6 py-7"
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={
                      index < testimonial.rating
                        ? "size-3.5 fill-accent text-accent"
                        : "size-3.5 fill-transparent text-border"
                    }
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-[13px] leading-[1.7] text-card-foreground">
                "{testimonial.quote}"
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-card-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

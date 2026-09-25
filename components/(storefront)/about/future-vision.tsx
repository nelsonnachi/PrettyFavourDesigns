"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export function FutureVision() {
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setStatus("loading");

    // TODO: Replace with your actual newsletter subscription request.
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  }

  return (
    <section className="bg-[#211b17] text-white">
      {/* ======================================================
          FUTURE VISION
      ====================================================== */}

      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          {/* LABEL */}

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e85d22]">
            The future
          </p>

          {/* HEADING */}

          <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            We are building a brand
            <br />
            made to go further.
          </h2>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-white/65 sm:text-base sm:leading-8">
            Our vision is to build a modern African brand with a
            global perspective — one that creates products people are
            proud to own, carry, gift, and keep.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/65 sm:text-base sm:leading-8">
            As we grow, we will continue to explore new collections,
            better materials, stronger experiences, and new ways to
            bring our products to more people.
          </p>
        </div>

        {/* ======================================================
            JOIN OUR JOURNEY
        ====================================================== */}

        <div className="mt-20 border-t border-white/10 pt-10 sm:mt-24 sm:pt-12 lg:mt-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            {/* COPY */}

            <div className="max-w-[460px]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#e85d22] sm:text-[10px] sm:tracking-[0.3em]">
                SHOPPFD
              </p>

              <h3 className="mt-2 font-serif text-[28px] font-medium leading-[1.05] tracking-[-0.02em] text-white sm:text-[32px] lg:text-[36px]">
                Join our journey.
              </h3>

              <p className="mt-4 text-[12px] leading-[1.8] text-white/60 sm:text-[13px]">
                Be the first to know about new collections, exclusive
                offers, and the stories behind what we create.
              </p>
            </div>

            {/* SUBSCRIBE FORM */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="w-full max-w-[520px]"
            >
              <label
                htmlFor="newsletter-email"
                className="sr-only"
              >
                Email address
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email address"
                  className="h-14 w-full border border-white/15 bg-white px-4 text-[12px] text-black outline-none transition-colors duration-200 placeholder:text-black/45 focus:border-[#e85d22] sm:text-[13px]"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 bg-[#e85d22] px-7 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white hover:text-[#211b17] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[10px]"
                >
                  <span>
                    {status === "loading"
                      ? "Subscribing..."
                      : "Subscribe"}
                  </span>

                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.8}
                  />
                </button>
              </div>

              {status === "success" && (
                <p
                  role="status"
                  className="mt-3 text-[11px] text-[#e85d22]"
                >
                  Thanks for subscribing — welcome to the journey.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
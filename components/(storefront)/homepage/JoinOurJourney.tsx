"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export function JoinOurJourney() {
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) return;

    setStatus("loading");

    // TODO: Replace with your actual newsletter subscription request.
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  }

  return (
    <section
      aria-labelledby="join-journey-heading"
      className="border-t border-[#e85d22]/30 bg-[#e85d22]"
    >
      <div className="mx-auto flex max-w-360 flex-col gap-6 px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-14">
        {/* Copy */}
        <div className="max-w-[420px]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white sm:text-[10px] sm:tracking-[0.3em]">
            SHOPPFD
          </p>

          <h2
            id="join-journey-heading"
            className="mt-2 font-serif text-[26px] font-medium leading-[1.05] tracking-[-0.02em] text-white sm:text-[30px] lg:text-[32px]"
          >
            Join Our Journey
          </h2>

          <p className="mt-3 text-[12px] leading-[1.7] text-white sm:text-[13px]">
            Be the first to know about new collections, exclusive offers and
            behind-the-scenes stories.
          </p>
        </div>

        {/* Subscribe form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex w-full max-w-[440px] flex-col gap-3 sm:flex-row lg:w-auto"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>

          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            className="w-full border border-[#faf7f1]/20 bg-white px-4 py-3 text-[12px] text-black placeholder:text-black outline-none transition-colors duration-200 focus:border-black sm:text-[13px]"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="group inline-flex shrink-0 items-center justify-center gap-2 bg-black px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-[10px]"
          >
            <span>
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </span>

            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.8}
            />
          </button>
        </form>
      </div>

      {status === "success" && (
        <p
          role="status"
          className="px-5 pb-6 text-[11px] text-[#e85d22] sm:px-8 lg:px-10"
        >
          Thanks for subscribing — welcome to the journey.
        </p>
      )}
    </section>
  );
}
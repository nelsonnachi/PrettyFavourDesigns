"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export function GetInTouch() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setStatus("loading");
    setErrorMessage("");

    try {
      /*
       * Temporary submission.
       *
       * This will later be replaced with
       * your real TanStack Query mutation
       * connected to your contact API.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700),
      );

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <main className="bg-background text-[#211b17]">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[520px] overflow-hidden bg-[#211b17]">
        {/* Background Image */}

        <Image
          src="/images/banners/getintouch.png"
          alt="Shoppfd"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Warm dark overlay */}

        <div className="absolute inset-0 bg-[#211b17]/30" />

        {/* Subtle gradient */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#211b17]/85 via-[#211b17]/55 to-[#211b17]/30" />

        {/* Hero Content */}

        <div className="relative mx-auto flex min-h-[520px] max-w-[1440px] items-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
          <div className="max-w-4xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e85d22]">
              Get in touch
            </p>

            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              Let&apos;s start a
              <br />
              conversation.
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Whether you have a question about a product,
              need help with an order, or simply want to
              say hello, we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTACT CONTENT
      ====================================================== */}

      <section>
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Contact us
              </p>

              <h2 className="mt-5 max-w-md font-serif text-4xl leading-[1] tracking-[-0.03em] sm:text-5xl">
                We&apos;re here to help.
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#756a60] sm:text-base sm:leading-8">
                Our team is always happy to help with
                questions about our products, orders,
                deliveries, or anything else you&apos;d like
                to know about Shoppfd.
              </p>

              {/* =============================================
                  CONTACT DETAILS
              ============================================== */}

              <div className="mt-10 border-t border-border">
                {/* EMAIL */}

                <div className="flex gap-5 border-b border-border py-6">
                  <div className="flex size-11 shrink-0 items-center justify-center border border-border">
                    <Mail
                      className="size-4"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756a60]">
                      Email
                    </p>

                    <a
                      href="mailto:hello@shoppfd.com"
                      className="mt-2 block text-sm font-medium text-[#211b17] transition-colors hover:text-accent"
                    >
                      hello@shoppfd.com
                    </a>
                  </div>
                </div>

                {/* PHONE */}

                <div className="flex gap-5 border-b border-border py-6">
                  <div className="flex size-11 shrink-0 items-center justify-center border border-border">
                    <Phone
                      className="size-4"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756a60]">
                      Phone
                    </p>

                    <a
                      href="tel:+2340000000000"
                      className="mt-2 block text-sm font-medium text-[#211b17] transition-colors hover:text-accent"
                    >
                      +234 000 000 0000
                    </a>
                  </div>
                </div>

                {/* LOCATION */}

                <div className="flex gap-5 py-6">
                  <div className="flex size-11 shrink-0 items-center justify-center border border-border">
                    <MapPin
                      className="size-4"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756a60]">
                      Based in
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#211b17]">
                      Nigeria
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  RESPONSE NOTE
              ============================================== */}

              <div className="mt-8 bg-[#f3eee8] p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#211b17]">
                  We&apos;ll get back to you
                </p>

                <p className="mt-3 text-sm leading-7 text-[#756a60]">
                  Send us a message and our team will get
                  back to you as soon as possible.
                </p>
              </div>
            </div>

            {/* =================================================
                CONTACT FORM
            ================================================= */}

            <div>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Send a message
                </p>

                <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] sm:text-4xl">
                  How can we help?
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
              >
                {/* ===========================================
                    NAME + EMAIL
                ============================================ */}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#211b17]"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="mt-3 h-14 w-full border border-border bg-transparent px-4 text-sm text-[#211b17] outline-none transition-colors placeholder:text-[#9a9087] focus:border-[#211b17]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#211b17]"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-3 h-14 w-full border border-border bg-transparent px-4 text-sm text-[#211b17] outline-none transition-colors placeholder:text-[#9a9087] focus:border-[#211b17]"
                    />
                  </div>
                </div>

                {/* ===========================================
                    PHONE + SUBJECT
                ============================================ */}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#211b17]"
                    >
                      Phone
                      <span className="ml-1 font-normal text-[#9a9087]">
                        Optional
                      </span>
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                      className="mt-3 h-14 w-full border border-border bg-transparent px-4 text-sm text-[#211b17] outline-none transition-colors placeholder:text-[#9a9087] focus:border-[#211b17]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#211b17]"
                    >
                      Subject
                      <span className="ml-1 font-normal text-[#9a9087]">
                        Optional
                      </span>
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="mt-3 h-14 w-full border border-border bg-transparent px-4 text-sm text-[#211b17] outline-none transition-colors placeholder:text-[#9a9087] focus:border-[#211b17]"
                    />
                  </div>
                </div>

                {/* ===========================================
                    MESSAGE
                ============================================ */}

                <div>
                  <label
                    htmlFor="message"
                    className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#211b17]"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows={8}
                    className="mt-3 w-full resize-none border border-border bg-transparent px-4 py-4 text-sm leading-7 text-[#211b17] outline-none transition-colors placeholder:text-[#9a9087] focus:border-[#211b17]"
                  />

                  <div className="mt-2 flex justify-end">
                    <span className="text-[10px] text-[#9a9087]">
                      {formData.message.length}/5000
                    </span>
                  </div>
                </div>

                {/* ===========================================
                    ERROR
                ============================================ */}

                {status === "error" && (
                  <div
                    role="alert"
                    className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* ===========================================
                    SUCCESS
                ============================================ */}

                {status === "success" && (
                  <div
                    role="status"
                    className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                  >
                    Thank you for reaching out. Your
                    message has been received.
                  </div>
                )}

                {/* ===========================================
                    SUBMIT
                ============================================ */}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group flex h-14 w-full items-center justify-center gap-3 bg-[#211b17] px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#e85d22] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {status === "loading"
                      ? "Sending..."
                      : "Send message"}
                  </span>

                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </button>

                <p className="text-center text-[10px] leading-5 text-[#9a9087]">
                  By submitting this form, you agree to
                  allow Shoppfd to contact you regarding
                  your enquiry.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          BRAND CLOSING SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#211b17] text-white">
        {/* Background Image */}

        <Image
          src="/images/banners/thankyouimage.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-[#211b17]/75" />

        {/* Content */}

        <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e85d22]">
                Shoppfd
              </p>
            </div>

            <div className="max-w-4xl">
              <h2 className="font-serif text-4xl leading-[1] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                Good products start with
                <br className="hidden sm:block" />
                good conversations.
              </h2>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                We believe building a great brand is about
                listening, learning, and creating things that
                genuinely make people&apos;s everyday lives
                better.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
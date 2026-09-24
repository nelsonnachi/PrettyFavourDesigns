import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "#",
    icon: FaFacebookF,
  },
  {
    label: "X",
    href: "#",
    icon: FaXTwitter,
  },
  {
    label: "TikTok",
    href: "#",
    icon: FaTiktok,
  },
];

export function StorefrontFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#211c18] text-[#faf7f1]">
      {/* Decorative background text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-1/2 hidden -translate-x-1/2 select-none whitespace-nowrap font-serif text-[16vw] font-semibold leading-none tracking-[-0.06em] text-white/[0.025] lg:block"
      >
        SHOPPFD
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Main Footer */}
        <div className="grid gap-14 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-16 lg:py-20">
          {/* Brand */}
          <div className="max-w-md">
            <Link
              href="/"
              className="group inline-flex flex-col leading-none"
            >
              <span className="font-serif text-[34px] font-semibold tracking-[0.08em] transition-colors duration-300 group-hover:text-[#e85d22]">
                SHOPPFD
              </span>

              <span className="mt-2 text-[7px] uppercase tracking-[0.38em] text-[#a99d91]">
                Bags · Aesthetics
              </span>
            </Link>

            <p className="mt-7 max-w-sm text-[13px] leading-6 text-[#a99d91]">
              Curated bags and timeless aesthetics for those who appreciate
              beautiful things.
            </p>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-full border border-white/10 text-[#b8ada2] transition-all duration-300 hover:border-[#e85d22] hover:bg-[#e85d22] hover:text-white"
                  >
                    <Icon className="size-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#faf7f1]">
                {group.title}
              </h3>

              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-[12px] text-[#a99d91] transition-colors duration-200 hover:text-white"
                    >
                      <span>{link.label}</span>

                      <span className="ml-2 translate-x-[-4px] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#faf7f1]">
              Stay in the loop
            </h3>

            <p className="mb-5 max-w-xs text-[12px] leading-5 text-[#a99d91]">
              Join our list for new arrivals, exclusive pieces and occasional
              inspiration.
            </p>

            <form className="flex max-w-sm border-b border-white/20 pb-2">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-[#756a60]"
              />

              <button
                type="submit"
                className="ml-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#faf7f1] transition-colors hover:text-[#e85d22]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Brand Statement */}
        <div className="border-b border-white/[0.08] py-8 text-center">
          <p className="font-serif text-[22px] italic tracking-wide text-[#d8cec4] sm:text-[28px]">
            Carry something beautiful.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 py-6 text-[9px] uppercase tracking-[0.12em] text-[#756a60] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SHOPPFD. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#faf7f1]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-[#faf7f1]"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="transition-colors hover:text-[#faf7f1]"
            >
              Cookies
            </Link>
          </div>

          <p className="text-[#8a7e73]">
            BUILT by StoryBuiltAfrica
          </p>
        </div>
      </div>
    </footer>
  );
}
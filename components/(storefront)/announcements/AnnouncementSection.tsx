"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnnouncementCard } from "@/components/(storefront)/announcements/AnnouncementCard";
import { useAnnouncement } from "@/lib/query/announcements/announcements-api";

const DEFAULT_DESCRIPTION =  "Discover the latest news, updates, and special moments from SHOPPFD.";

const DESCRIPTIONS: Partial<Record<string, string>> = {
  sale: "Discover our latest offers and enjoy something special from SHOPPFD.",
  event: "Stay connected with what is happening at SHOPPFD.",
  class: "Learn more about our latest class and upcoming opportunities.",
};

export function AnnouncementSection() {
  const { data: announcement } = useAnnouncement();

  if (!announcement) return null;

  const { type, title, ctaText, ctaUrl } = announcement;

  return (
    <section aria-labelledby="announcement-heading" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-7 sm:mb-8 lg:mb-9">
          <h2
            id="announcement-heading"
            className="font-serif text-[34px] font-medium leading-none tracking-[-0.025em] text-[#211b17] sm:text-[38px] lg:text-[42px]"
          >
            {title || "Latest Announcement"}
          </h2>

          <p className="mt-3 max-w-[470px] text-[12px] leading-[1.7] text-[#756a60] sm:text-[13px]">
            {DESCRIPTIONS[type] ?? DEFAULT_DESCRIPTION}
          </p>

          {ctaText && ctaUrl && (
            <Link
              href={ctaUrl}
              className="group mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#211b17] transition-colors duration-200 hover:text-[#e85d22] sm:text-[11px]"
            >
              {ctaText}

              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.6}
              />
            </Link>
          )}
        </div>

        <AnnouncementCard announcement={announcement} />
      </div>
    </section>
  );
}
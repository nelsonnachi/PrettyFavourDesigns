"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { AnnouncementCard } from "@/components/(storefront)/announcements/AnnouncementCard";
import { useAnnouncement } from "@/lib/query/announcements/announcements-api";

export function AnnouncementSection() {
  const {
    data: announcement,
    isLoading,
  } = useAnnouncement();

  if (isLoading || !announcement) {
    return null;
  }

  return (
    <section
      aria-labelledby="announcement-heading"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* ================================================== */}
        {/* SECTION INTRO */}
        {/* ================================================== */}

        <div className="mb-7 sm:mb-8 lg:mb-9">
          <h2
            id="announcement-heading"
            className="font-serif text-[34px] font-medium leading-none tracking-[-0.025em] text-[#211b17] sm:text-[38px] lg:text-[42px]"
          >
            {announcement.title || "Latest Announcement"}
          </h2>

          <p className="mt-3 max-w-[470px] text-[12px] leading-[1.7] text-[#756a60] sm:text-[13px]">
            {announcement.type === "sale"
              ? "Discover our latest offers and enjoy something special from SHOPPFD."
              : announcement.type === "event"
                ? "Stay connected with what is happening at SHOPPFD."
                : announcement.type === "class"
                  ? "Learn more about our latest class and upcoming opportunities."
                  : "Discover the latest news, updates, and special moments from SHOPPFD."}
          </p>

          {announcement.ctaText &&
            announcement.ctaUrl && (
              <Link
                href={announcement.ctaUrl}
                className="group mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#211b17] transition-colors duration-200 hover:text-[#e85d22] sm:text-[11px]"
              >
                <span>{announcement.ctaText}</span>

                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.6}
                />
              </Link>
            )}
        </div>

        {/* ================================================== */}
        {/* ANNOUNCEMENT IMAGE */}
        {/* ================================================== */}

        <AnnouncementCard
          announcement={announcement}
        />
      </div>
    </section>
  );
}
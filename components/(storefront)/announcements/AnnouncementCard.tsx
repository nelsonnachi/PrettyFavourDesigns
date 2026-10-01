import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PublicAnnouncement } from "@/lib/query/announcements/announcements-types";

interface AnnouncementCardProps {
  announcement: PublicAnnouncement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { type, title, imageUrl, ctaText, ctaUrl } = announcement;

  return (
    <div className="group relative isolate overflow-hidden rounded-2xl bg-[#211b17]">
      <div className="relative aspect-[16/8] min-h-[420px] w-full overflow-hidden sm:aspect-[16/7] lg:min-h-[520px]">
        <img
          src={imageUrl}
          alt={title || "SHOPPFD announcement"}
          className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />

        {/* Side overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-3xl p-6 sm:p-10 lg:p-14 xl:p-16">
            <span className="inline-flex rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-md sm:text-[11px]">
              {type}
            </span>

            {title && (
              <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-[1.05] text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                {title}
              </h2>
            )}

            {ctaText && ctaUrl && (
              <div className="mt-6">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#211b17] transition-all duration-200 hover:bg-[#e85d22] hover:text-white"
                >
                  {ctaText}

                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
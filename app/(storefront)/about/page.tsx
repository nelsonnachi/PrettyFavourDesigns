import { AboutHero } from "@/components/(storefront)/about/about-hero";
import { BrandStory } from "@/components/(storefront)/about/brand-story";
import { BrandValues } from "@/components/(storefront)/about/brand-values";
import { OurJourney } from "@/components/(storefront)/about/our-journey";
import { WhereWeAre } from "@/components/(storefront)/about/where-we-are";
import { FutureVision } from "@/components/(storefront)/about/future-vision";
import { AboutCta } from "@/components/(storefront)/about/about-cta";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <BrandStory />
      <BrandValues />
      <OurJourney />
      <WhereWeAre />
      <FutureVision />
      <AboutCta />
    </main>
  );
}
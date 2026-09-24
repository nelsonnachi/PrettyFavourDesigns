import { BrandStory } from "@/components/(storefront)/homepage/BrandStory";
import { OurCollection } from "@/components/(storefront)/homepage/Collection";
import { HappyClients } from "@/components/(storefront)/homepage/HappyClients";
import { StorefrontHero } from "@/components/(storefront)/homepage/hero";
import { Highlights } from "@/components/(storefront)/homepage/Highlights";
import { JoinOurJourney } from "@/components/(storefront)/homepage/JoinOurJourney";

export default function HomePage() {
  return (
    <main>
      {/* Hero section */}
      <StorefrontHero />

      {/* Trust */}
      <Highlights />

      {/* Our Collection */}
      <OurCollection />

      {/* Our Story */}
      <BrandStory />

      {/* Happy Client */}
      <HappyClients />

      {/* Our Journey */}
      <JoinOurJourney />
    </main>
  );
}

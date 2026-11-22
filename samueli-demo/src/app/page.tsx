import { pageMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import { Benefits, CategoryShortcuts, CollectionCards, Favorites, StreetwearBanner } from "@/components/home/Sections";
import RevealScope from "@/components/RevealScope";
import { publicAssetPath } from "@/lib/site-config";

export const metadata = pageMetadata("Veshje për meshkuj – Koleksioni i ri", "Xhaketa dimërore, kostume sportive, bluza, atlete dhe aksesorë për meshkuj. Shiko kategoritë dhe masat te Samueli Fashion.", "/", publicAssetPath("/images/hero/campaign-background-1936.webp"));

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShortcuts />
      <RevealScope>
        <Favorites />
        <StreetwearBanner />
        <CollectionCards />
        <Benefits />
      </RevealScope>
    </>
  );
}

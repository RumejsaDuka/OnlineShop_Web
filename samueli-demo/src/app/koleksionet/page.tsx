import { pageMetadata } from "@/lib/seo";
import { photography } from "@/lib/photography";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import RevealScope from "@/components/RevealScope";
import { CollectionCards } from "@/components/home/Sections";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = pageMetadata("Kategoritë e veshjeve për meshkuj", "Shiko xhaketa, kostume sportive, bluza, atlete dhe aksesorë për meshkuj. Zgjidh kategorinë që kërkon.", "/koleksionet");

export default function Page() {
  return (
    <RevealScope>
      <PageHero
        title="Koleksionet"
        intro="Zgjidh kategorinë: xhaketa, kostume sportive, bluza, atlete dhe aksesorë."
        image={photography.winterPuffer}
      />
      <div className="wrap mt-5">
        <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Koleksionet" }]} />
      </div>
      <div className="mt-6 md:mt-8">
        <CollectionCards withHead={false} />
      </div>
      <div className="wrap mt-3 grid gap-3 md:mt-4 md:grid-cols-2 md:gap-4 lg:gap-5">
        <Link href="/kategoria/aksesore" className="group flex items-center justify-between rounded-[18px] bg-surface px-6 py-6 hover:bg-[#e9e9eb]" data-reveal="fade">
          <span>
            <span className="block text-[18px] font-bold">Aksesorë</span>
            <span className="text-[14px] text-mute">Kapele dhe aksesorë për meshkuj</span>
          </span>
          <ArrowRight aria-hidden className="arrow-nudge size-5" />
        </Link>
        <Link href="/kategoria/te-gjitha" className="group flex items-center justify-between rounded-[18px] bg-ink px-6 py-6 text-white" data-reveal="fade">
          <span>
            <span className="block text-[18px] font-bold">Të gjitha produktet</span>
            <span className="text-[14px] text-white/70">Shiko produktet sipas kategorisë</span>
          </span>
          <ArrowRight aria-hidden className="arrow-nudge size-5" />
        </Link>
      </div>
    </RevealScope>
  );
}

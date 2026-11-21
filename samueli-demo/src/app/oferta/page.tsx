import { pageMetadata } from "@/lib/seo";
import { photography } from "@/lib/photography";
import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import RevealScope from "@/components/RevealScope";
import { OffersView } from "@/components/views";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = pageMetadata("Oferta për veshje dhe atlete për meshkuj", "Shiko produktet me çmim të ulur: xhaketa, kostume sportive dhe atlete për meshkuj.", "/oferta");

export default function Page() {
  return (
    <RevealScope>
      <PageHero title="Oferta" intro="Produkte me çmim të ulur." image={photography.puffer} />
      <div className="wrap mt-5">
        <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Oferta" }]} />
      </div>
      <div className="wrap mt-6 md:mt-8">
        <Suspense fallback={<div className="skeleton h-[400px] rounded-[22px]" />}>
          <OffersView />
        </Suspense>
      </div>
    </RevealScope>
  );
}

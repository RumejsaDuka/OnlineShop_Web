import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/views";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = pageMetadata("Kërko produkte", "Kërko xhaketa, kostume sportive, bluza dhe atlete sipas emrit ose kategorisë.", "/kerko");

export default function Page() {
  return (
    <div className="wrap mt-6 md:mt-10">
      <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Kërko" }]} />
      <h1 className="h-page mb-6 mt-4">Kërko</h1>
      <Suspense fallback={<div className="skeleton h-12 max-w-[640px] rounded-full" />}>
        <SearchView />
      </Suspense>
    </div>
  );
}

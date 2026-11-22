import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { AccountView } from "@/components/views";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = pageMetadata("Llogaria", "Shiko shportën dhe produktet e ruajtura. Hyrja në llogari nuk është aktive në faqen provë.", "/llogaria");

export default function Page() {
  return (
    <div className="wrap mt-6 md:mt-10">
      <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Llogaria ime" }]} />
      <h1 className="h-page mb-6 mt-4">Llogaria ime</h1>
      <AccountView />
    </div>
  );
}

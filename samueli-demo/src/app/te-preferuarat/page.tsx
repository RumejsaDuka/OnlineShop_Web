import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { WishlistView } from "@/components/views";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = pageMetadata("Produktet e ruajtura", "Shiko produktet që ke ruajtur te Samueli Fashion në këtë pajisje.", "/te-preferuarat");

export default function Page() {
  return (
    <div className="wrap mt-6 md:mt-10">
      <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Të preferuarat" }]} />
      <h1 className="h-page mb-6 mt-4">Të preferuarat</h1>
      <WishlistView />
    </div>
  );
}

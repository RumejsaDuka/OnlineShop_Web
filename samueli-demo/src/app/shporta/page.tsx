import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import CartPage from "@/components/cart/CartPage";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = pageMetadata("Shporta", "Shiko produktet, masat, sasitë dhe çmimet në shportë.", "/shporta");

export default function Page() {
  return (
    <div className="wrap mt-6 md:mt-10">
      <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Shporta" }]} />
      <h1 className="h-page mt-4">Shporta</h1>
      <CartPage />
    </div>
  );
}

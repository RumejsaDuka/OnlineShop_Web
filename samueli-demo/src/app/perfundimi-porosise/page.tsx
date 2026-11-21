import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import CheckoutForm from "@/components/cart/CheckoutForm";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = pageMetadata("Përfundimi i porosisë", "Kontrollo produktet dhe plotëso të dhënat e dërgesës në formularin provë. Nuk kryhen porosi ose pagesa.", "/perfundimi-porosise");

export default function Page() {
  return (
    <div className="wrap mt-6 md:mt-10">
      <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Shporta", href: "/shporta" }, { label: "Arka" }]} />
      <h1 className="h-page mt-4">Përfundimi i porosisë</h1>
      <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full bg-red/10 px-4 py-2 text-[13px] font-bold text-red" role="note">
        Faqe provë. Nuk kryhen porosi ose pagesa.
      </p>
      <CheckoutForm />
    </div>
  );
}

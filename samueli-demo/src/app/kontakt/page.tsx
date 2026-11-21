import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import RevealScope from "@/components/RevealScope";
import { ContactForm } from "@/components/views";
import { Breadcrumbs, DemoNote } from "@/components/ui";
import { contact } from "@/lib/data";

export const metadata: Metadata = pageMetadata("Kontakt", "Kontakto Samueli Fashion me telefon ose email për produktet, masat dhe disponueshmërinë.", "/kontakt");

export default function Page() {
  return (
    <RevealScope>
      <PageHero title="Kontakt" intro="Na kontakto për produktet, masat dhe disponueshmërinë." />
      <div className="wrap mt-5">
        <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Kontakt" }]} />
      </div>
      <div className="wrap mt-8 grid items-start gap-8 md:mt-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="space-y-4">
          <a href={contact.phoneHref} className="flex items-center gap-4 rounded-[22px] bg-off p-6 hover:bg-surface" data-reveal="fade">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white">
              <Phone aria-hidden className="size-5 text-red" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[13px] text-mute">Telefon</span>
              <span className="block text-[18px] font-bold">{contact.phone}</span>
            </span>
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-4 rounded-[22px] bg-off p-6 hover:bg-surface" data-reveal="fade">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white">
              <Mail aria-hidden className="size-5 text-red" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] text-mute">Email</span>
              <span className="block break-all text-[18px] font-bold">{contact.email}</span>
            </span>
          </a>
          <DemoNote>Për adresën dhe orarin, kontakto dyqanin.</DemoNote>
        </div>
        <ContactForm />
      </div>
    </RevealScope>
  );
}

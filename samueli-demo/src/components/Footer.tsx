import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { categories, contact } from "@/lib/data";
import { Logo } from "./ui";

export default function Footer() {
  const info = [
    { href: "/koleksionet", label: "Koleksionet" },
    { href: "/oferta", label: "Oferta" },
    { href: "/rreth-nesh", label: "Rreth nesh" },
    { href: "/kontakt", label: "Kontakt" },
  ];
  const account = [
    { href: "/llogaria", label: "Llogaria ime" },
    { href: "/te-preferuarat", label: "Të preferuarat" },
    { href: "/shporta", label: "Shporta" },
  ];
  return (
    <footer className="mt-20 bg-ink text-white md:mt-28">
      <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-2 md:py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 md:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="SAMUELI FASHION — Kreu" className="inline-block">
            <Logo tone="white" className="h-9" />
          </Link>
          <p className="mt-5 max-w-[30ch] text-[14px] leading-relaxed text-white/60">
            Veshje për meshkuj: xhaketa, kostume sportive, bluza, atlete dhe aksesorë.
          </p>
        </div>

        <FooterCol title="Kategoritë" links={categories.map((c) => ({ href: `/kategoria/${c.slug}`, label: c.label }))} />
        <FooterCol title="Informacion" links={info} />
        <FooterCol title="Llogaria" links={account} />

        <div className="col-span-2 md:col-span-1">
          <h2 className="kicker text-white/45">Kontakt</h2>
          <ul className="mt-4 space-y-1 text-[14px]">
            <li>
              <a href={contact.phoneHref} className="flex min-h-10 items-center gap-2.5 text-white/85 hover:text-white">
                <Phone aria-hidden className="size-4 text-red" strokeWidth={1.75} /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex min-h-10 items-center gap-2.5 break-all text-white/85 hover:text-white">
                <Mail aria-hidden className="size-4 shrink-0 text-red" strokeWidth={1.75} /> {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 pb-[max(20px,env(safe-area-inset-bottom))] text-[12px] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SAMUELI FASHION</p>
          <p>Faqe provë. Nuk pranon porosi ose pagesa.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="kicker text-white/45">{title}</h2>
      <ul className="mt-4 space-y-0.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-9 items-center text-[14px] text-white/80 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

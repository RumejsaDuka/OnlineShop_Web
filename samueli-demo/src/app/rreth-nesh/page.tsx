import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Ruler, Shirt, Store } from "lucide-react";
import PageHero from "@/components/PageHero";
import RevealScope from "@/components/RevealScope";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = pageMetadata("Rreth Samueli Fashion", "Samueli Fashion është dyqan veshjesh për meshkuj. Shiko dyqanin dhe na kontakto për produktet dhe masat.", "/rreth-nesh");

const points = [
  { icon: Store, title: "Dyqan fizik", text: "Veshjet mund t’i shohësh dhe t’i provosh në dyqan." },
  { icon: Shirt, title: "Veshje për çdo ditë", text: "Xhaketa, kostume sportive, bluza, atlete dhe aksesorë." },
  { icon: Ruler, title: "Ndihmë për masat", text: "Na shkruaj për matjet dhe masat." },
];

export default function Page() {
  return (
    <RevealScope>
      <PageHero title="Rreth nesh" intro="Dyqan veshjesh për meshkuj." />
      <div className="wrap mt-5">
        <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Rreth nesh" }]} />
      </div>
      <section className="wrap mt-8 grid items-center gap-8 md:mt-12 md:grid-cols-2 lg:gap-14">
        <figure data-reveal="fade">
          {/* The only documentary photograph on the site: the real storefront, unaltered. */}
          <div className="relative aspect-[567/535] overflow-hidden rounded-[22px] bg-surface">
            <Image
              src="/images/store/samueli_store_front.webp"
              alt="Fasada e dyqanit SAMUELI FASHION"
              fill
              sizes="(min-width: 768px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-[13px] text-mute">Fotografi reale e dyqanit SAMUELI FASHION.</figcaption>
        </figure>
        <div>
          <h2 className="h-section" data-reveal="mask">
            <span className="mask-line">
              <span>Kush jemi?</span>
            </span>
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink/80" data-reveal="fade">
            SAMUELI FASHION është dyqan veshjesh për meshkuj. Këtu gjeni xhaketa, kostume sportive, bluza, atlete dhe aksesorë.
          </p>
          <p className="mt-3 text-[16px] leading-relaxed text-ink/80" data-reveal="fade">
            Na vizito në dyqan ose na kontakto për produktet dhe masat.
          </p>
          <div className="mt-6" data-reveal="fade">
            <Link href="/kontakt" className="btn btn-dark">
              Na kontakto
            </Link>
          </div>
        </div>
      </section>
      <section aria-label="Çfarë ofrojmë" className="wrap mt-14 md:mt-20">
        <ul className="grid gap-4 md:grid-cols-3">
          {points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-[22px] bg-off p-6" data-reveal="fade">
              <Icon aria-hidden className="size-6" strokeWidth={1.5} />
              <p className="mt-4 text-[16px] font-bold">{title}</p>
              <p className="mt-1 text-[14px] text-mute">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </RevealScope>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, MessageCircle, Ruler, ShoppingBag, Store } from "lucide-react";
import { categories, favoriteSlugs, getProduct, type Product } from "@/lib/data";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { photography } from "@/lib/photography";
import { publicAssetPath } from "@/lib/site-config";
import ProductCard from "../ProductCard";
import { SectionHead } from "../ui";

/* ---------------- Category shortcuts (entirely below the hero) ---------------- */
export function CategoryShortcuts() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo("[data-cat]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .7, ease: "power3.out", stagger: .1, delay: .55, clearProps: "transform" });
    });
    return () => mm.revert();
  }, { scope: ref });
  return (
    <section ref={ref} aria-label="Kategoritë" className="py-4 md:py-6">
      <ul className="campaign-container home-category-list">
        {categories.map((c) => (
          <li key={c.slug} data-cat data-intro className="min-w-0">
            <Link href={`/kategoria/${c.slug}`} className="home-category-link group flex h-full flex-col items-center justify-center rounded-[14px] bg-surface px-1 py-2 lg:flex-row lg:gap-4 lg:px-4">
              <span className="relative h-12 w-full shrink-0 lg:h-16 lg:w-16">
                <Image src={c.slug === "bluza" ? publicAssetPath("/images/shortcuts/black-tee.webp") : c.thumb.replace('/studio/', '/shortcuts/')} alt="" fill sizes="(min-width: 1024px) 64px, 16vw" className="zoom-img object-contain" />
              </span>
              <span className="home-category-label flex min-h-7 items-center text-center font-bold leading-[1.08] lg:min-h-0 lg:flex-1 lg:text-left">{c.label}</span>
              <ArrowRight aria-hidden className="arrow-nudge hidden size-5 shrink-0 lg:block" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Të Preferuarat ---------------- */
export function Favorites() {
  const items = favoriteSlugs.map((s) => getProduct(s)).filter(Boolean) as Product[];
  return (
    <section aria-labelledby="fav-title" className="wrap">
      <SectionHead id="fav-title" title="Të Preferuarat" href="/kategoria/te-gjitha" />
      <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4 lg:gap-5">
        {items.map((p) => (
          <li key={p.slug} data-reveal="fade">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Kostume sportive campaign banner ---------------- */
export function StreetwearBanner() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-parallax]",
          { yPercent: -7 },
          { yPercent: 7, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section ref={ref} aria-labelledby="street-title" className="wrap mt-16 md:mt-24">
      <div className="studio-editorial relative isolate flex h-[440px] items-end overflow-hidden rounded-[22px] text-white md:h-[340px] md:items-center lg:h-[380px]">
        <div className="absolute inset-0 -z-10 md:left-[34%]">
          <div data-parallax className="absolute -inset-y-[9%] inset-x-0">
            <Image
              src={photography.stripedTracksuit}
              alt="Kostum sportiv i zi me vija të bardha në mëngë"
              fill
              sizes="(min-width: 768px) 66vw, 100vw"
              className="object-contain object-[75%_15%] pb-24 md:object-center md:p-5"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/5 md:bg-none" />
        </div>
        <div className="w-full p-6 md:max-w-[46%] md:p-10 lg:p-14">
          <p className="kicker flex items-center gap-3 text-white/85" data-reveal="fade">
            <span aria-hidden className="h-px w-8 bg-red" />
            Kostume sportive
          </p>
          <h2 id="street-title" className="mt-3 text-[clamp(30px,3.6vw,52px)] font-extrabold leading-[1.02] tracking-[-0.03em]" data-reveal="mask">
            <span className="mask-line">
              <span>Kostume sportive</span>
            </span>
            <span className="mask-line">
              <span className="text-red">për meshkuj</span>
            </span>
          </h2>
          <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-white/80" data-reveal="fade">
            Sete me bluzë dhe pantallona. Me kapuç ose me zinxhir.
          </p>
          <div className="mt-6" data-reveal="fade">
            <Link href="/kategoria/kostume-sportive" className="btn btn-light group">
              Shiko Kostumet <ArrowRight aria-hidden className="arrow-nudge size-4" strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Koleksionet ---------------- */
export function CollectionCards({ withHead = true }: { withHead?: boolean }) {
  const list = categories.filter((c) => c.slug !== "aksesore");
  return (
    <section aria-labelledby={withHead ? "coll-title" : undefined} aria-label={withHead ? undefined : "Koleksionet"} className="wrap">
      {withHead && <SectionHead id="coll-title" title="Koleksionet" href="/koleksionet" className="mt-16 md:mt-24" />}
      <ul className={`grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:gap-5 ${withHead ? "mt-6 md:mt-8" : ""}`}>
        {list.map((c) => (
          <li key={c.slug} data-reveal="fade">
            <Link href={`/kategoria/${c.slug}`} className="studio-editorial group relative block aspect-[3/4] overflow-hidden rounded-[18px] text-white">
              <Image src={c.image} alt="" fill sizes="(min-width: 768px) 24vw, 48vw" className="zoom-img object-contain px-3 pb-[24%] pt-4" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 md:inset-x-5 md:bottom-5">
                <span>
                  <span className="block text-[17px] font-bold leading-tight md:text-[22px]">{c.label}</span>
                  <span className="mt-1 hidden text-[13px] text-white/75 md:block">{c.intro}</span>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink md:size-10">
                  <ArrowRight aria-hidden className="arrow-nudge size-4" strokeWidth={2.25} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Benefits (confirmable, neutral claims only) ---------------- */
export function Benefits() {
  const items = [
    { icon: Store, title: "Dyqan fizik", text: "Shiko dhe provo veshjet në dyqan." },
    { icon: ShoppingBag, title: "Porosi online", text: "Zgjidh produktin, ngjyrën dhe masën." },
    { icon: Ruler, title: "Ndihmë për masat", text: "Na shkruaj për matjet." },
    { icon: MessageCircle, title: "Dërgesa", text: "Na pyet për afatin dhe koston." },
  ];
  return (
    <section aria-label="Pse SAMUELI FASHION" className="wrap mt-16 md:mt-24">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-7 rounded-[22px] bg-off px-5 py-7 md:grid-cols-4 md:px-8 md:py-9">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4" data-reveal="fade">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] md:size-12">
              <Icon aria-hidden className="size-5" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[14px] font-bold md:text-[15px]">{title}</span>
              <span className="block text-[13px] leading-snug text-mute">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

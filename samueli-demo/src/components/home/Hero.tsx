"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { publicAssetPath } from "@/lib/site-config";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      gsap.set(q("[data-intro]"), { visibility: "visible" });
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(q("[data-photo]"), { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 1.4 }, 0)
        .fromTo(q(".mask-line > span"), { yPercent: 115 }, { yPercent: 0, duration: .9, stagger: .1 }, .25)
        .fromTo(q("[data-copy]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .6 }, .5)
        .fromTo(q("[data-cta]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .6 }, .65);
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} aria-labelledby="hero-title" className="collection-hero relative isolate overflow-hidden bg-[#f1f1f2] text-ink">
      <div data-intro data-photo className="collection-hero-photo absolute inset-0 -z-20">
        <picture>
          <img src={publicAssetPath("/images/hero/campaign-background-1936.webp")} srcSet={`${publicAssetPath("/images/hero/campaign-background-768.webp")} 768w, ${publicAssetPath("/images/hero/campaign-background-1200.webp")} 1200w, ${publicAssetPath("/images/hero/campaign-background-1600.webp")} 1600w, ${publicAssetPath("/images/hero/campaign-background-1936.webp")} 1936w`} sizes="(min-width: 1024px) 100vw, 1600px" alt="Model me xhaketë të zezë dimri pranë një ndërtese prej betoni." width={1936} height={544} fetchPriority="high" loading="eager" decoding="async" className="collection-hero-image" />
        </picture>
      </div>
      <div className="campaign-container collection-hero-grid">
        <div className="collection-hero-title">
          <p data-intro data-copy className="collection-hero-kicker">Veshje për meshkuj <span aria-hidden /></p>
          <h1 id="hero-title" data-intro className="collection-hero-heading font-extrabold leading-[1.08] tracking-[-.04em]">
            <span className="mask-line"><span>Koleksioni</span></span>
            <span className="mask-line text-red"><span>i ri</span></span>
          </h1>
        </div>
        <div className="collection-hero-details">
          <p data-intro data-copy className="collection-hero-description">Xhaketa, kostume sportive, bluza dhe atlete.</p>
          <div data-intro data-cta className="mt-5 lg:mt-6">
              <Link href="/kategoria/te-gjitha" className="btn btn-dark group gap-4 ring-1 ring-inset ring-white/20 lg:min-h-[52px] lg:px-7 lg:text-[16px]">
              Shiko koleksionin <ArrowRight aria-hidden className="arrow-nudge size-5" strokeWidth={1.75} />
            </Link>
          </div>
          <ul data-intro data-copy className="collection-hero-categories" aria-label="Kategoritë e koleksionit">
            {categories.filter(category => category.slug !== "kostume-sportive").map(category => (
              <li key={category.slug}><Link href={`/kategoria/${category.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-ink/10 bg-white/70 px-3 text-[12px] font-medium transition-colors hover:border-ink/30 hover:bg-white lg:text-[13px]">{category.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

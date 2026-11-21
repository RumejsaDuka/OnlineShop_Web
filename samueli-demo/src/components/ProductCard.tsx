"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { discountPct, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Price } from "./ui";

export default function ProductCard({ product: p, priority = false, sizes }: { product: Product; priority?: boolean; sizes?: string }) {
  const { isWished, toggleWish, ready } = useStore();
  const wished = ready && isWished(p.slug);
  const alt = p.images[1];
  const pct = discountPct(p);
  const fit = (light: boolean) => (light ? "object-contain p-2 md:p-3" : "object-cover");
  const imgSizes = sizes ?? "(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw";

  return (
    <article className="pcard group relative flex h-full flex-col overflow-hidden rounded-[18px] bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={p.images[0]}
          alt={p.alt}
          fill
          priority={priority}
          sizes={imgSizes}
          className={`pcard-img pcard-main ${alt ? "has-alt" : ""} ${fit(p.light)}`}
        />
        {alt && (
          // A closer crop of this same garment preserves its identity on hover.
          <Image src={alt} alt="" aria-hidden fill sizes={imgSizes} className={`pcard-img pcard-alt ${fit(p.light)}`} />
        )}
        {pct > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red px-2.5 py-1 text-[12px] font-bold leading-none text-white md:left-4 md:top-4">
            −{pct}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-2 md:px-5 md:pb-5">
        <h3 className="text-[15px] font-medium leading-snug md:text-[16px]">
          <Link href={`/produkt/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {p.name}
          </Link>
        </h3>
        <Price product={p} />
      </div>
      <button
        type="button"
        onClick={() => toggleWish(p.slug)}
        aria-pressed={wished}
        aria-label={wished ? `Hiq ${p.name} nga të preferuarat` : `Ruaj ${p.name} te të preferuarat`}
        className={`absolute right-2 top-2 z-10 grid size-11 place-items-center rounded-full transition-colors md:right-3 md:top-3 ${
          p.light ? "hover:bg-white/70" : "bg-white/85 backdrop-blur-sm hover:bg-white"
        }`}
      >
        <Heart
          aria-hidden
          className={`size-[22px] transition-transform duration-300 ${wished ? "scale-110 fill-red text-red" : "text-ink"}`}
          strokeWidth={1.75}
        />
      </button>
    </article>
  );
}

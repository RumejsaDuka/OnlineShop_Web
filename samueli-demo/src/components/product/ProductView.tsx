"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, ChevronDown, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { categoryLabel, discountPct, formatPrice, subLabel, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Price } from "../ui";

export default function ProductView({ product: p }: { product: Product }) {
  const { addToCart, openDrawer, notify, toggleWish, isWished, ready } = useStore();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [open, setOpen] = useState<string | null>("pershkrimi");
  const sizesRef = useRef<HTMLFieldSetElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const startX = useRef<number | null>(null);
  const wished = ready && isWished(p.slug);
  const pct = discountPct(p);

  // Sticky mobile buy bar appears once the main button scrolls out of view
  useEffect(() => {
    const check = () => {
      const el = addRef.current;
      if (el) setBarVisible(el.getBoundingClientRect().bottom < 0);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const add = () => {
    if (!size) {
      setError(true);
      sizesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      sizesRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
      return;
    }
    addToCart(p.slug, size, qty);
    notify(`${p.name} (${size}) u shtua në shportë`);
    openDrawer("cart");
  };

  const many = p.images.length > 1;
  const go = (i: number) => setImg((i + p.images.length) % p.images.length);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 xl:gap-16">
        {/* Gallery */}
        <div className={`grid gap-3 ${many ? "md:grid-cols-[84px_1fr] md:gap-4" : ""}`}>
          <div
            className="relative aspect-square touch-pan-y overflow-hidden rounded-[22px] bg-card md:order-2"
            onPointerDown={(e) => (startX.current = e.clientX)}
            onPointerUp={(e) => {
              if (startX.current === null || !many) return;
              const dx = e.clientX - startX.current;
              startX.current = null;
              if (Math.abs(dx) > 40) go(img + (dx < 0 ? 1 : -1));
            }}
          >
            {p.images.map((src, i) => {
              const light = p.light;
              return (
                <Image
                  key={src}
                  src={src}
                  alt={i === 0 ? p.alt : `${p.name} — detaj i materialit dhe punimit`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  aria-hidden={i !== img}
                  className={`transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${
                    light ? "object-contain p-4 md:p-6" : "object-cover"
                  } ${i === img ? "opacity-100" : "opacity-0"}`}
                />
              );
            })}
            {pct > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-red px-3 py-1.5 text-[13px] font-bold leading-none text-white">−{pct}%</span>
            )}
            <button
              type="button"
              onClick={() => toggleWish(p.slug)}
              aria-pressed={wished}
              aria-label={wished ? "Hiq nga të preferuarat" : "Ruaj te të preferuarat"}
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white/80 backdrop-blur hover:bg-white"
            >
              <Heart aria-hidden className={`size-[22px] ${wished ? "fill-red text-red" : ""}`} strokeWidth={1.75} />
            </button>
            {many && (
              <p className="absolute bottom-3 right-4 rounded-full bg-white/85 px-2.5 py-1 text-[12px] font-semibold tabular-nums md:hidden">
                {img + 1} / {p.images.length}
              </p>
            )}
          </div>
          {many && (
            <ul className="no-scrollbar flex gap-2 overflow-x-auto md:order-1 md:flex-col md:gap-3" aria-label="Fotot e produktit">
              {p.images.map((src, i) => (
                <li key={src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setImg(i)}
                    aria-label={`Shfaq foton ${i + 1}`}
                    aria-current={i === img}
                    className={`relative block size-[72px] overflow-hidden rounded-xl bg-card ring-2 transition md:size-[84px] ${
                      i === img ? "ring-ink" : "ring-transparent hover:ring-line"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="84px" className={p.light ? "object-contain p-1.5" : "object-cover"} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="kicker text-mute">
            {categoryLabel(p.category)} · {subLabel(p.category, p.sub)}
          </p>
          <h1 className="mt-2 text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.08] tracking-[-0.02em]">{p.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Price product={p} size="lg" />
            {pct > 0 && <span className="rounded-full bg-red/10 px-2.5 py-1 text-[12px] font-bold text-red">Kursimi {formatPrice(p.compareAt! - p.price)}</span>}
          </div>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink/75">{p.description}</p>

          <div className="mt-6 border-t border-line pt-6">
            <p className="text-[14px] font-bold">
              Ngjyra: <span className="font-medium text-mute">{p.color.name}</span>
            </p>
            <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Ngjyra">
              <span
                role="radio"
                aria-checked="true"
                aria-label={p.color.name}
                tabIndex={0}
                className="grid size-10 place-items-center rounded-full ring-2 ring-ink ring-offset-2"
              >
                <span className="size-8 rounded-full border border-black/15" style={{ background: p.color.hex }} />
              </span>
            </div>
          </div>

          <fieldset ref={sizesRef} className="mt-6" aria-describedby={error ? "size-error" : undefined}>
            <legend className="flex w-full items-center justify-between text-[14px] font-bold">
              <span>
                Masa: <span className="font-medium text-mute">{size ?? "zgjidh një masë"}</span>
              </span>
            </legend>
            <div className={`mt-3 flex flex-wrap gap-2 ${error ? "motion-safe:animate-[nudge_.4s_ease]" : ""}`} role="radiogroup" aria-label="Masa" aria-invalid={error}>
              {p.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={size === s}
                  onClick={() => {
                    setSize(s);
                    setError(false);
                  }}
                  className={`grid h-12 min-w-[52px] place-items-center rounded-xl border px-3 text-[14px] font-bold transition-colors ${
                    size === s ? "border-ink bg-ink text-white" : error ? "border-red/60 bg-white" : "border-line bg-white hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && (
              <p id="size-error" role="alert" className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-red">
                <AlertCircle aria-hidden className="size-4" /> Zgjidh masën para se ta shtosh në shportë.
              </p>
            )}
          </fieldset>

          <div className="mt-6 flex flex-wrap items-stretch gap-3">
            <div className="inline-flex items-center rounded-xl border border-line" role="group" aria-label="Sasia">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Zvogëlo sasinë" className="grid size-12 place-items-center disabled:opacity-35">
                <Minus aria-hidden className="size-4" />
              </button>
              <span className="w-8 text-center text-[15px] font-bold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} disabled={qty >= 9} aria-label="Rrit sasinë" className="grid size-12 place-items-center disabled:opacity-35">
                <Plus aria-hidden className="size-4" />
              </button>
            </div>
            <button ref={addRef} type="button" onClick={add} className="btn btn-dark min-h-12 flex-1">
              <ShoppingBag aria-hidden className="size-[18px]" strokeWidth={2} /> Shto në Shportë
            </button>
            <button
              type="button"
              onClick={() => toggleWish(p.slug)}
              aria-pressed={wished}
              aria-label={wished ? "Hiq nga të preferuarat" : "Ruaj te të preferuarat"}
              className="grid size-12 place-items-center rounded-xl border border-line hover:border-ink"
            >
              <Heart aria-hidden className={`size-5 ${wished ? "fill-red text-red" : ""}`} strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-8 divide-y divide-line border-y border-line">
            <Disclosure id="pershkrimi" title="Përshkrimi" open={open} setOpen={setOpen}>
              <p>{p.description}</p>
              <p className="mt-2 text-mute">Kategoria: {categoryLabel(p.category)} · Masat: {p.sizes.join(", ")}</p>
            </Disclosure>
            <Disclosure id="dergesa" title="Dërgesa dhe kthimet" open={open} setOpen={setOpen}>
              <p>
                Kushtet e dërgesës dhe të kthimit konfirmohen drejtpërdrejt nga dyqani.{" "}
                <Link href="/kontakt" className="font-semibold underline underline-offset-4">
                  Na kontakto
                </Link>{" "}
                për detaje.
              </p>
            </Disclosure>
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-mute">Faqe provë: fotografitë dhe çmimet janë shembuj.</p>
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
          barVisible ? "translate-y-0" : "translate-y-full"
        }`}
        inert={!barVisible}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold">{p.name}</p>
            <p className="text-[13px] text-mute">
              <span className={`font-bold ${p.compareAt ? "text-red" : "text-ink"}`}>{formatPrice(p.price)}</span> · {size ? `Masa ${size}` : "Zgjidh masën"}
            </p>
          </div>
          <button type="button" onClick={add} className="btn btn-dark min-h-12 shrink-0 px-5">
            Shto në Shportë
          </button>
        </div>
      </div>
    </>
  );
}

function Disclosure({
  id,
  title,
  open,
  setOpen,
  children,
}: {
  id: string;
  title: string;
  open: string | null;
  setOpen: (v: string | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`disc-${id}`}
        onClick={() => setOpen(isOpen ? null : id)}
        className="flex min-h-14 w-full items-center justify-between text-left text-[15px] font-bold"
      >
        {title}
        <ChevronDown aria-hidden className={`size-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div id={`disc-${id}`} className="accordion-body" data-open={isOpen || undefined} inert={!isOpen}>
        <div>
          <div className="pb-5 text-[14px] leading-relaxed text-ink/80">{children}</div>
        </div>
      </div>
    </div>
  );
}

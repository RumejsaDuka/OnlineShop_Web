"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { categories, formatPrice, searchProducts } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const close = () => setSearchOpen(false);
  useDialog(searchOpen, panel, close);

  useEffect(() => {
    if (!searchOpen) setQ("");
  }, [searchOpen]);

  const results = searchProducts(q).slice(0, 4);

  return (
    <div className="drawer fixed inset-0 z-[85]" data-open={searchOpen || undefined} inert={!searchOpen}>
      <div className="drawer-scrim absolute inset-0 bg-black/40" onClick={close} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Kërko produkte"
        className="search-panel absolute inset-x-0 top-0 max-h-[90dvh] overflow-y-auto bg-white pt-[env(safe-area-inset-top)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]"
      >
        <div className="wrap max-w-[960px] py-5 md:py-8">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (!q.trim()) return;
              router.push(`/kerko?q=${encodeURIComponent(q.trim())}`);
              close();
            }}
            className="flex items-center gap-2 border-b-2 border-ink pb-2"
          >
            <Search aria-hidden className="size-6 shrink-0" strokeWidth={1.75} />
            <label htmlFor="site-search" className="sr-only">
              Kërko
            </label>
            <input
              id="site-search"
              data-autofocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Kërko xhaketa, atlete, bluza…"
              className="min-h-12 flex-1 bg-transparent text-[18px] font-medium outline-none placeholder:text-mute md:text-[22px]"
            />
            <button type="button" onClick={close} aria-label="Mbyll kërkimin" className="grid size-11 place-items-center rounded-full hover:bg-surface">
              <X aria-hidden className="size-6" strokeWidth={1.75} />
            </button>
          </form>

          {q.trim() ? (
            <div className="mt-5" aria-live="polite">
              {results.length ? (
                <>
                  <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {results.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/produkt/${p.slug}`} onClick={close} className="group block">
                          <span className="relative block aspect-square overflow-hidden rounded-xl bg-card">
                            <Image
                              src={p.images[0]}
                              alt=""
                              fill
                              sizes="200px"
                              className={`zoom-img ${p.light ? "object-contain p-2" : "object-cover"}`}
                            />
                          </span>
                          <span className="mt-2 block text-[14px] font-semibold">{p.name}</span>
                          <span className="text-[13px] text-mute">{formatPrice(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/kerko?q=${encodeURIComponent(q.trim())}`);
                      close();
                    }}
                    className="group mt-5 inline-flex items-center gap-2 text-[14px] font-bold"
                  >
                    Shiko të gjitha rezultatet <ArrowRight aria-hidden className="arrow-nudge size-4" />
                  </button>
                </>
              ) : (
                <p className="text-[15px] text-mute">Asnjë produkt për “{q.trim()}”. Provo “xhaketë” ose “atlete”.</p>
              )}
            </div>
          ) : (
            <div className="mt-5">
              <p className="kicker text-mute">Kategoritë</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/kategoria/${c.slug}`}
                      onClick={close}
                      className="inline-flex min-h-10 items-center rounded-full bg-surface px-4 text-[14px] font-semibold hover:bg-ink hover:text-white"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

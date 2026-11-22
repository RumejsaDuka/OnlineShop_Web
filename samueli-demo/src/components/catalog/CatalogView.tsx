"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ALL_SLUG, categories, categoryLabel, getCategory, productsIn, subLabel, type Product } from "@/lib/data";
import { useDialog } from "@/lib/useDialog";
import ProductCard from "../ProductCard";

type SortKey = "te-rejat" | "cmimi-rritur" | "cmimi-zbritur" | "zbritje";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "te-rejat", label: "Më të rejat" },
  { key: "cmimi-rritur", label: "Çmimi: nga më i ulëti" },
  { key: "cmimi-zbritur", label: "Çmimi: nga më i larti" },
  { key: "zbritje", label: "Në ofertë fillimisht" },
];
const PAGE = 6;

type Filters = { groups: string[]; sizes: string[]; colors: string[]; price: [number, number] };

export default function CatalogView({ slug }: { slug: string }) {
  const params = useSearchParams();
  const isAll = slug === ALL_SLUG;
  const base = useMemo(() => productsIn(slug), [slug]);
  const bounds = useMemo<[number, number]>(
    () => (base.length ? [Math.floor(Math.min(...base.map((p) => p.price))), Math.ceil(Math.max(...base.map((p) => p.price)))] : [0, 0]),
    [base],
  );
  const lloji = params.get("lloji");
  const empty: Filters = { groups: [], sizes: [], colors: [], price: bounds };
  const [f, setF] = useState<Filters>({ ...empty, groups: lloji ? [lloji] : [] });
  const [sort, setSort] = useState<SortKey>("te-rejat");
  const [shown, setShown] = useState(PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [drawer, setDrawer] = useState(false);

  // Follow ?lloji= when the mega-menu links to another subcategory of the same page
  useEffect(() => {
    setF((prev) => ({ ...prev, groups: lloji ? [lloji] : [] }));
    setShown(PAGE);
  }, [lloji]);

  const groupOf = (p: Product) => (isAll ? p.category : p.sub);
  const groupOptions = isAll
    ? categories.filter((c) => productsIn(c.slug).length).map((c) => ({ value: c.slug, label: c.label }))
    : (getCategory(slug)?.subs ?? []).map((s) => ({ value: s.slug, label: s.label }));
  const sizeOptions = useMemo(() => {
    const all = Array.from(new Set(base.flatMap((p) => p.sizes)));
    const order = ["S", "M", "L", "XL", "XXL"];
    return all.sort((a, b) => (order.indexOf(a) + 1 || 100 + Number(a)) - (order.indexOf(b) + 1 || 100 + Number(b)));
  }, [base]);
  const colorOptions = useMemo(() => {
    const m = new Map<string, string>();
    base.forEach((p) => m.set(p.color.name, p.color.hex));
    return Array.from(m, ([name, hex]) => ({ name, hex }));
  }, [base]);

  const list = useMemo(() => {
    const out = base.filter(
      (p) =>
        (!f.groups.length || f.groups.includes(groupOf(p))) &&
        (!f.sizes.length || f.sizes.some((s) => p.sizes.includes(s))) &&
        (!f.colors.length || f.colors.includes(p.color.name)) &&
        p.price >= f.price[0] &&
        p.price <= f.price[1],
    );
    const sorted = [...out];
    if (sort === "te-rejat") sorted.sort((a, b) => a.order - b.order);
    if (sort === "cmimi-rritur") sorted.sort((a, b) => a.price - b.price);
    if (sort === "cmimi-zbritur") sorted.sort((a, b) => b.price - a.price);
    if (sort === "zbritje") sorted.sort((a, b) => Number(!!b.compareAt) - Number(!!a.compareAt) || a.order - b.order);
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, f, sort]);

  const activeCount = f.groups.length + f.sizes.length + f.colors.length + (f.price[0] !== bounds[0] || f.price[1] !== bounds[1] ? 1 : 0);
  const reset = () => {
    setF(empty);
    setShown(PAGE);
  };
  const toggle = (key: "groups" | "sizes" | "colors", v: string) => {
    setF((prev) => ({ ...prev, [key]: prev[key].includes(v) ? prev[key].filter((x) => x !== v) : [...prev[key], v] }));
    setShown(PAGE);
  };
  const visible = list.slice(0, shown);
  const gridKey = JSON.stringify([f, sort]);

  const panel = (
    <FilterPanel
      isAll={isAll}
      f={f}
      setF={setF}
      bounds={bounds}
      toggle={toggle}
      groupOptions={groupOptions}
      sizeOptions={sizeOptions}
      colorOptions={colorOptions}
      reset={reset}
      activeCount={activeCount}
    />
  );

  if (!base.length) {
    return (
      <div className="rounded-[22px] bg-off px-6 py-14 text-center md:py-20">
        <p className="text-[20px] font-extrabold">Ende pa produkte në këtë kategori</p>
        <p className="mx-auto mt-2 max-w-[44ch] text-[15px] text-mute">
          Nuk ka ende produkte të listuara për {categoryLabel(slug).toLowerCase()}. Na kontakto për disponueshmërinë.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/kontakt" className="btn btn-dark">
            Na kontakto
          </Link>
          <Link href={`/kategoria/${ALL_SLUG}`} className="btn btn-outline">
            Shiko të gjitha produktet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr] xl:gap-12">
      <aside aria-label="Filtrat" className="hidden lg:block">
        <div className="sticky top-[calc(var(--nav-h-compact)+24px)]">{panel}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-mute" aria-live="polite">
            <span className="font-bold text-ink">{list.length}</span> {list.length === 1 ? "produkt" : "produkte"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[14px] font-semibold lg:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal aria-hidden className="size-4" /> Filtro{activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-red text-[11px] text-white">{activeCount}</span>}
            </button>
            <label className="relative">
              <span className="sr-only">Rendit sipas</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="min-h-11 cursor-pointer appearance-none rounded-full border border-line bg-white pl-4 pr-9 text-[14px] font-semibold"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    Rendit: {s.label}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </label>
          </div>
        </div>

        {activeCount > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Filtrat aktivë">
            {f.groups.map((g) => (
              <Chip key={`g${g}`} label={isAll ? categoryLabel(g) : subLabel(slug, g)} onRemove={() => toggle("groups", g)} />
            ))}
            {f.sizes.map((s) => (
              <Chip key={`s${s}`} label={`Masa ${s}`} onRemove={() => toggle("sizes", s)} />
            ))}
            {f.colors.map((c) => (
              <Chip key={`c${c}`} label={c} onRemove={() => toggle("colors", c)} />
            ))}
            {(f.price[0] !== bounds[0] || f.price[1] !== bounds[1]) && (
              <Chip label={`€${f.price[0]} – €${f.price[1]}`} onRemove={() => setF((p) => ({ ...p, price: bounds }))} />
            )}
            <li>
              <button type="button" onClick={reset} className="min-h-9 px-2 text-[13px] font-bold text-red underline-offset-4 hover:underline">
                Pastro të gjitha
              </button>
            </li>
          </ul>
        )}

        {list.length ? (
          <>
            <ul key={gridKey} className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:gap-5">
              {visible.map((p, i) => (
                <li key={p.slug} className="card-in" style={{ animationDelay: `${(i % PAGE) * 45}ms` }}>
                  <ProductCard product={p} priority={i < 3} sizes="(min-width: 1280px) 26vw, (min-width: 768px) 30vw, 48vw" />
                </li>
              ))}
              {loadingMore &&
                Array.from({ length: Math.min(PAGE, list.length - shown) }).map((_, i) => (
                  <li key={`sk${i}`} aria-hidden className="overflow-hidden rounded-[18px] bg-card">
                    <div className="skeleton aspect-[4/3]" />
                    <div className="space-y-2 p-4">
                      <div className="skeleton h-4 w-3/4 rounded" />
                      <div className="skeleton h-4 w-1/3 rounded" />
                    </div>
                  </li>
                ))}
            </ul>
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-[13px] text-mute">
                Po shihni {Math.min(shown, list.length)} nga {list.length}
              </p>
              {shown < list.length && (
                <button
                  type="button"
                  disabled={loadingMore}
                  aria-busy={loadingMore}
                  onClick={() => {
                    setLoadingMore(true);
                    window.setTimeout(() => {
                      setShown((s) => s + PAGE);
                      setLoadingMore(false);
                    }, 350);
                  }}
                  className="btn btn-outline min-w-[220px]"
                >
                  {loadingMore ? "Duke ngarkuar…" : "Shfaq më shumë"}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="mt-5 rounded-[22px] bg-off px-6 py-14 text-center">
            <p className="text-[18px] font-extrabold">Asnjë produkt nuk përputhet me filtrat</p>
            <p className="mt-2 text-[14px] text-mute">Provo të heqësh disa filtra ose të ndryshosh çmimin.</p>
            <button type="button" onClick={reset} className="btn btn-dark mt-6">
              Pastro filtrat
            </button>
          </div>
        )}
      </div>

      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} count={list.length}>
        {panel}
      </FilterDrawer>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Hiq filtrin ${label}`}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-surface pl-3.5 pr-2.5 text-[13px] font-semibold hover:bg-ink hover:text-white"
      >
        {label} <X aria-hidden className="size-3.5" strokeWidth={2.5} />
      </button>
    </li>
  );
}

function FilterPanel({
  isAll,
  f,
  setF,
  bounds,
  toggle,
  groupOptions,
  sizeOptions,
  colorOptions,
  reset,
  activeCount,
}: {
  isAll: boolean;
  f: Filters;
  setF: React.Dispatch<React.SetStateAction<Filters>>;
  bounds: [number, number];
  toggle: (key: "groups" | "sizes" | "colors", v: string) => void;
  groupOptions: { value: string; label: string }[];
  sizeOptions: string[];
  colorOptions: { name: string; hex: string }[];
  reset: () => void;
  activeCount: number;
}) {
  const span = Math.max(1, bounds[1] - bounds[0]);
  const lo = ((f.price[0] - bounds[0]) / span) * 100;
  const hi = ((f.price[1] - bounds[0]) / span) * 100;
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <p className="text-[17px] font-extrabold">Filtro</p>
        {activeCount > 0 && (
          <button type="button" onClick={reset} className="min-h-9 text-[13px] font-bold text-red">
            Pastro
          </button>
        )}
      </div>

      {groupOptions.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-[14px] font-bold">{isAll ? "Kategoria" : "Lloji"}</legend>
          <ul>
            {groupOptions.map((o) => (
              <li key={o.value}>
                <label className="flex min-h-10 cursor-pointer items-center gap-3 text-[14px]">
                  <input
                    type="checkbox"
                    checked={f.groups.includes(o.value)}
                    onChange={() => toggle("groups", o.value)}
                    className="size-[18px] cursor-pointer rounded accent-[var(--color-ink)]"
                  />
                  {o.label}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-3 text-[14px] font-bold">Masa</legend>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((s) => {
            const on = f.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggle("sizes", s)}
                className={`grid h-10 min-w-11 place-items-center rounded-lg border px-2 text-[13px] font-bold transition-colors ${
                  on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-[14px] font-bold">Ngjyra</legend>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((c) => {
            const on = f.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={on}
                onClick={() => toggle("colors", c.name)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border pl-1.5 pr-3 text-[13px] font-semibold transition-colors ${
                  on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
                }`}
              >
                <span aria-hidden className="size-6 rounded-full border border-black/15" style={{ background: c.hex }} />
                {c.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-[14px] font-bold">Çmimi</legend>
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line" />
          <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-red" style={{ left: `${lo}%`, right: `${100 - hi}%` }} />
          <input
            type="range"
            className="range"
            min={bounds[0]}
            max={bounds[1]}
            value={f.price[0]}
            aria-label="Çmimi minimal"
            onChange={(e) => setF((p) => ({ ...p, price: [Math.min(Number(e.target.value), p.price[1]), p.price[1]] }))}
          />
          <input
            type="range"
            className="range"
            min={bounds[0]}
            max={bounds[1]}
            value={f.price[1]}
            aria-label="Çmimi maksimal"
            onChange={(e) => setF((p) => ({ ...p, price: [p.price[0], Math.max(Number(e.target.value), p.price[0])] }))}
          />
        </div>
        <p className="mt-2 flex justify-between text-[13px] font-semibold tabular-nums text-mute">
          <span>€{f.price[0]}</span>
          <span>€{f.price[1]}</span>
        </p>
      </fieldset>
    </div>
  );
}

function FilterDrawer({ open, onClose, count, children }: { open: boolean; onClose: () => void; count: number; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useDialog(open, ref, onClose);
  return (
    <div className="drawer fixed inset-0 z-[90] lg:hidden" data-open={open || undefined} inert={!open}>
      <div className="drawer-scrim absolute inset-0 bg-black/45" onClick={onClose} aria-hidden />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Filtrat"
        tabIndex={-1}
        data-side="right"
        className="drawer-panel absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col bg-white outline-none"
      >
        <div className="flex h-16 shrink-0 items-center justify-end border-b border-line px-2 pt-[env(safe-area-inset-top)]">
          <button type="button" onClick={onClose} aria-label="Mbyll filtrat" data-autofocus className="grid size-11 place-items-center rounded-full hover:bg-surface">
            <X aria-hidden className="size-6" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
        <div className="shrink-0 border-t border-line px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
          <button type="button" onClick={onClose} className="btn btn-dark w-full">
            Shfaq {count} {count === 1 ? "produkt" : "produkte"}
          </button>
        </div>
      </aside>
    </div>
  );
}

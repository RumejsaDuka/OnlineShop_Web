"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Search, CheckCircle2, ShoppingBag, User } from "lucide-react";
import { categories, discounted, getProduct, productsIn, searchProducts, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";
import { DemoNote } from "./ui";

const grid = "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5";

/* ---------------- Oferta ---------------- */
export function OffersView() {
  const params = useSearchParams();
  const router = useRouter();
  const all = discounted();
  const cats = categories.filter((c) => discounted(productsIn(c.slug)).length);
  const active = params.get("kategoria");
  const list = active ? all.filter((p) => p.category === active) : all;
  return (
    <>
      <ul className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)]" aria-label="Filtro ofertat sipas kategorisë">
        {[{ slug: "", label: "Të gjitha" }, ...cats].map((c) => {
          const on = (active ?? "") === c.slug;
          return (
            <li key={c.slug || "all"} className="shrink-0">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => router.replace(c.slug ? `/oferta?kategoria=${c.slug}` : "/oferta", { scroll: false })}
                className={`min-h-10 rounded-full px-4 text-[14px] font-semibold transition-colors ${on ? "bg-ink text-white" : "bg-surface hover:bg-[#e6e6e8]"}`}
              >
                {c.label}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-[14px] text-mute">
        {list.length} {list.length === 1 ? "produkt" : "produkte"} me çmim të ulur.
      </p>
      {list.length ? (
        <ul className={`mt-5 ${grid}`}>
          {list.map((p, i) => (
            <li key={p.slug} className="card-in" style={{ animationDelay: `${i * 50}ms` }}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-[22px] bg-off px-6 py-12 text-center text-[15px] text-mute">Nuk ka oferta në këtë kategori.</p>
      )}
      <DemoNote className="mt-8">Faqe provë: çmimet dhe uljet janë shembuj.</DemoNote>
    </>
  );
}

/* ---------------- Kërko ---------------- */
export function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const [value, setValue] = useState(q);
  useEffect(() => setValue(q), [q]);
  const results = searchProducts(q);
  return (
    <>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/kerko?q=${encodeURIComponent(value.trim())}`, { scroll: false });
        }}
        className="flex max-w-[640px] items-center gap-2 rounded-full border border-line bg-white pl-4 pr-1.5 focus-within:border-ink"
      >
        <Search aria-hidden className="size-5 shrink-0 text-mute" />
        <label htmlFor="search-page" className="sr-only">
          Kërko produkte
        </label>
        <input
          id="search-page"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Kërko xhaketa, atlete, bluza…"
          className="min-h-12 flex-1 bg-transparent text-[16px] outline-none"
        />
        <button type="submit" className="btn btn-dark min-h-10 px-5">
          Kërko
        </button>
      </form>
      {q ? (
        <>
          <p className="mt-6 text-[14px] text-mute" aria-live="polite">
            {results.length} {results.length === 1 ? "rezultat" : "rezultate"} për “<span className="font-semibold text-ink">{q}</span>”
          </p>
          {results.length ? (
            <ul className={`mt-5 ${grid}`}>
              {results.map((p, i) => (
                <li key={p.slug} className="card-in" style={{ animationDelay: `${i * 45}ms` }}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyBlock title="Asnjë rezultat" text="Provo “xhaketë”, “kostum” ose “atlete”." />
          )}
        </>
      ) : (
        <p className="mt-6 text-[15px] text-mute">Shkruaj emrin e produktit ose kategorisë.</p>
      )}
    </>
  );
}

/* ---------------- Të preferuarat ---------------- */
export function WishlistView() {
  const { wishlist, ready } = useStore();
  if (!ready) return <div className="skeleton h-[320px] rounded-[22px]" />;
  const items = wishlist.map((s) => getProduct(s)).filter(Boolean) as Product[];
  if (!items.length)
    return (
      <EmptyBlock
        icon={<Heart aria-hidden className="size-7" strokeWidth={1.5} />}
        title="Nuk ke produkte të ruajtura"
        text="Prek zemrën te një produkt për ta ruajtur. Lista ruhet në këtë pajisje."
        cta={{ href: "/kategoria/te-gjitha", label: "Shiko produktet" }}
      />
    );
  return (
    <>
      <p className="text-[14px] text-mute">Të ruajtura në këtë pajisje: {items.length}</p>
      <ul className={`mt-5 ${grid}`}>
        {items.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------- Llogaria (demo) ---------------- */
export function AccountView() {
  const { cartCount, wishlist, ready } = useStore();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-[22px] border border-line p-6 md:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-surface">
          <User aria-hidden className="size-6" strokeWidth={1.5} />
        </span>
        <h2 className="mt-4 text-[20px] font-extrabold">Hyrja në llogari nuk është aktive</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-mute">
          Në këtë faqe provë mund të shohësh shportën dhe produktet e ruajtura.
        </p>
        <DemoNote className="mt-5">Për pyetje, na kontakto.</DemoNote>
        <Link href="/kontakt" className="btn btn-dark mt-5">
          Na kontakto
        </Link>
      </div>
      <div className="grid gap-4">
        <Link href="/te-preferuarat" className="group flex items-center gap-4 rounded-[22px] bg-off p-6 hover:bg-surface">
          <span className="grid size-12 place-items-center rounded-full bg-white">
            <Heart aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          <span className="flex-1">
            <span className="block text-[16px] font-bold">Të preferuarat</span>
            <span className="text-[14px] text-mute">Të ruajtura në këtë pajisje: {ready ? wishlist.length : 0}</span>
          </span>
        </Link>
        <Link href="/shporta" className="group flex items-center gap-4 rounded-[22px] bg-off p-6 hover:bg-surface">
          <span className="grid size-12 place-items-center rounded-full bg-white">
            <ShoppingBag aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          <span className="flex-1">
            <span className="block text-[16px] font-bold">Shporta</span>
            <span className="text-[14px] text-mute">Në shportë: {ready ? cartCount : 0}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ---------------- Kontakt form (demo, sends nothing) ---------------- */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  if (sent)
    return (
      <div className="rounded-[22px] bg-off p-8 text-center" role="status">
        <CheckCircle2 aria-hidden className="mx-auto size-10" strokeWidth={1.5} />
        <p className="mt-3 text-[18px] font-extrabold">Mesazhi nuk u dërgua</p>
        <p className="mt-1 text-[14px] text-mute">Ky formular është për provë. Na kontakto me telefon ose email.</p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-outline mt-5">
          Shkruaj përsëri
        </button>
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const er: Record<string, string> = {};
        if (String(fd.get("emri") ?? "").trim().length < 2) er.emri = "Shkruaj emrin.";
        if (String(fd.get("mesazhi") ?? "").trim().length < 5) er.mesazhi = "Shkruaj mesazhin.";
        setErr(er);
        if (Object.keys(er).length) {
          document.getElementById(`ct-${Object.keys(er)[0]}`)?.focus();
          return;
        }
        setSent(true); // no network request
      }}
      className="grid gap-4 rounded-[22px] border border-line p-6 md:p-8"
    >
      <p className="text-[18px] font-extrabold">Na shkruani</p>
      <div>
        <label htmlFor="ct-emri" className="mb-1.5 block text-[13px] font-bold">
          Emri
        </label>
        <input id="ct-emri" name="emri" className="field" autoComplete="off" aria-invalid={!!err.emri} aria-describedby={err.emri ? "ct-emri-err" : undefined} />
        {err.emri && (
          <p id="ct-emri-err" className="mt-1 text-[13px] font-semibold text-red">
            {err.emri}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="ct-mesazhi" className="mb-1.5 block text-[13px] font-bold">
          Mesazhi
        </label>
        <textarea
          id="ct-mesazhi"
          name="mesazhi"
          rows={5}
          className="field resize-y"
          aria-invalid={!!err.mesazhi}
          aria-describedby={err.mesazhi ? "ct-mesazhi-err" : undefined}
        />
        {err.mesazhi && (
          <p id="ct-mesazhi-err" className="mt-1 text-[13px] font-semibold text-red">
            {err.mesazhi}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-dark">
        Dërgo (provë)
      </button>
      <p className="text-[12px] text-mute">Formular provë. Mesazhi nuk dërgohet.</p>
    </form>
  );
}

function EmptyBlock({ title, text, icon, cta }: { title: string; text: string; icon?: React.ReactNode; cta?: { href: string; label: string } }) {
  return (
    <div className="mt-6 rounded-[22px] bg-off px-6 py-14 text-center">
      {icon && <span className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-white">{icon}</span>}
      <p className="text-[19px] font-extrabold">{title}</p>
      <p className="mx-auto mt-2 max-w-[46ch] text-[15px] text-mute">{text}</p>
      {cta && (
        <Link href={cta.href} className="btn btn-dark mt-6">
          {cta.label}
        </Link>
      )}
    </div>
  );
}

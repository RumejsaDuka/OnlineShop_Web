"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { ALBANIAN_CITIES, formatPrice } from "@/lib/data";
import { productOf, useStore } from "@/lib/store";
import { Summary } from "./CartPage";

type Field = "emri" | "mbiemri" | "telefoni" | "email" | "qyteti" | "adresa";
const LABELS: Record<Field, string> = {
  emri: "Emri",
  mbiemri: "Mbiemri",
  telefoni: "Telefoni",
  email: "Email (opsional)",
  qyteti: "Qyteti",
  adresa: "Adresa",
};

function validate(v: Record<Field, string>) {
  const e: Partial<Record<Field, string>> = {};
  if (v.emri.trim().length < 2) e.emri = "Shkruaj emrin.";
  if (v.mbiemri.trim().length < 2) e.mbiemri = "Shkruaj mbiemrin.";
  if (!/^\+?[0-9\s]{8,15}$/.test(v.telefoni.trim())) e.telefoni = "Shkruaj një numër telefoni të vlefshëm.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Shkruaj një adresë emaili të vlefshme.";
  if (!v.qyteti) e.qyteti = "Zgjidh qytetin.";
  if (v.adresa.trim().length < 5) e.adresa = "Shkruaj adresën.";
  return e;
}

/**
 * DEMO checkout. Validation runs locally; nothing is sent anywhere, no order
 * is created and no payment is taken. Entered data stays in component state.
 */
export default function CheckoutForm() {
  const { cart, ready, clearCart } = useStore();
  const [v, setV] = useState<Record<Field, string>>({ emri: "", mbiemri: "", telefoni: "", email: "", qyteti: "", adresa: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState(false);

  if (!ready) return <div className="skeleton mt-8 h-[420px] rounded-[22px]" />;

  if (done) {
    return (
      <div className="mx-auto mt-10 max-w-[560px] rounded-[22px] bg-off px-6 py-12 text-center" role="status">
        <CheckCircle2 aria-hidden className="mx-auto size-12 text-ink" strokeWidth={1.5} />
        <p className="mt-4 text-[22px] font-extrabold">Nuk u krijua porosi</p>
        <p className="mt-2 text-[15px] text-mute">
          Formulari u plotësua për provë. Të dhënat nuk u dërguan dhe nuk u krye pagesë.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              clearCart();
            }}
            className="btn btn-outline"
          >
            Pastro shportën
          </button>
          <Link href="/" className="btn btn-dark">
            Kthehu në kryefaqe
          </Link>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="mt-8 rounded-[22px] bg-off px-6 py-14 text-center">
        <p className="text-[20px] font-extrabold">Shporta është bosh</p>
        <p className="mt-2 text-[15px] text-mute">Shtoni produkte para se të vazhdoni te arka.</p>
        <Link href="/kategoria/te-gjitha" className="btn btn-dark mt-6">
          Shiko produktet
        </Link>
      </div>
    );
  }

  const field = (k: Field, type = "text", extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`co-${k}`} className="mb-1.5 block text-[13px] font-bold">
        {LABELS[k]}
      </label>
      <input
        id={`co-${k}`}
        type={type}
        value={v[k]}
        onChange={(e) => {
          setV((s) => ({ ...s, [k]: e.target.value }));
          if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
        }}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `co-${k}-err` : undefined}
        className="field"
        {...extra}
      />
      {errors[k] && (
        <p id={`co-${k}-err`} className="mt-1 text-[13px] font-semibold text-red">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const er = validate(v);
        setErrors(er);
        const first = Object.keys(er)[0];
        if (first) {
          document.getElementById(`co-${first}`)?.focus();
          return;
        }
        // No network request — demo only.
        setDone(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_400px] xl:gap-12"
    >
      <div className="space-y-8">
        <fieldset>
          <legend className="text-[18px] font-extrabold">Të dhënat e dërgesës</legend>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {field("emri", "text", { autoComplete: "off" })}
            {field("mbiemri", "text", { autoComplete: "off" })}
            {field("telefoni", "tel", { inputMode: "tel", autoComplete: "off", placeholder: "+355 6X XXX XXXX" })}
            {field("email", "email", { autoComplete: "off" })}
            <div>
              <label htmlFor="co-qyteti" className="mb-1.5 block text-[13px] font-bold">
                {LABELS.qyteti}
              </label>
              <select
                id="co-qyteti"
                value={v.qyteti}
                onChange={(e) => {
                  setV((s) => ({ ...s, qyteti: e.target.value }));
                  setErrors((er) => ({ ...er, qyteti: undefined }));
                }}
                aria-invalid={!!errors.qyteti}
                aria-describedby={errors.qyteti ? "co-qyteti-err" : undefined}
                className="field cursor-pointer"
              >
                <option value="">Zgjidh qytetin…</option>
                {ALBANIAN_CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.qyteti && (
                <p id="co-qyteti-err" className="mt-1 text-[13px] font-semibold text-red">
                  {errors.qyteti}
                </p>
              )}
            </div>
            {field("adresa", "text", { autoComplete: "off" })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[18px] font-extrabold">Pagesa</legend>
          <label className="mt-4 flex items-start gap-3 rounded-xl border border-ink p-4">
            <input type="radio" name="pay" defaultChecked className="mt-1 size-[18px] accent-[var(--color-ink)]" />
            <span>
              <span className="block text-[15px] font-bold">Pagesë në dorëzim (provë)</span>
              <span className="block text-[13px] text-mute">Mënyrën e pagesës e konfirmon dyqani. Kjo faqe nuk merr pagesa.</span>
            </span>
          </label>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-[calc(var(--nav-h-compact)+24px)]">
        <ul className="mb-4 space-y-3 rounded-[22px] border border-line p-4">
          {cart.map((l) => {
            const p = productOf(l.slug);
            return (
              <li key={l.key} className="flex items-center gap-3 text-[14px]">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-card">
                  <Image src={p.images[0]} alt={p.alt} fill sizes="56px" className={p.light ? "object-contain p-1 mix-blend-darken" : "object-cover"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{p.name}</span>
                  <span className="text-[12px] text-mute">
                    {l.size} · × {l.qty}
                  </span>
                </span>
                <span className="font-bold tabular-nums">{formatPrice(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <Summary
          cta={
            <button type="submit" className="btn btn-red mt-6 w-full">
              <Lock aria-hidden className="size-4" /> Përfundo porosinë (provë)
            </button>
          }
        />
      </div>
    </form>
  );
}

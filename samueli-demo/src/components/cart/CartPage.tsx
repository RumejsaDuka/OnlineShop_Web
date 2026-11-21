"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useStore } from "@/lib/store";
import CartLineItem from "../CartLineItem";
import { DemoNote } from "../ui";

export function Summary({ cta }: { cta?: React.ReactNode }) {
  const { subtotal, savings, cartCount } = useStore();
  return (
    <div className="rounded-[22px] bg-off p-6 md:p-7">
      <h2 className="text-[18px] font-extrabold">Përmbledhja</h2>
      <dl className="mt-4 space-y-2.5 text-[14px]">
        <div className="flex justify-between">
          <dt className="text-mute">
            Artikuj ({cartCount})
          </dt>
          <dd className="font-semibold tabular-nums">{formatPrice(subtotal + savings)}</dd>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-red">
            <dt>Ulje</dt>
            <dd className="font-semibold tabular-nums">−{formatPrice(savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-mute">Transporti</dt>
          <dd className="text-mute">Konfirmohet nga dyqani</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-[17px]">
          <dt className="font-extrabold">Nëntotali</dt>
          <dd className="font-extrabold tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      {cta}
    </div>
  );
}

export default function CartPage() {
  const { cart, ready, clearCart } = useStore();

  if (!ready) return <div className="skeleton mt-8 h-[320px] rounded-[22px]" aria-label="Duke ngarkuar shportën" />;

  if (!cart.length) {
    return (
      <div className="mt-8 rounded-[22px] bg-off px-6 py-16 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-white">
          <ShoppingBag aria-hidden className="size-7" strokeWidth={1.5} />
        </span>
        <p className="mt-5 text-[20px] font-extrabold">Shporta është bosh</p>
        <p className="mt-2 text-[15px] text-mute">Shto një produkt për ta parë këtu.</p>
        <Link href="/kategoria/te-gjitha" className="btn btn-dark mt-6">
          Vazhdo blerjet
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_380px] xl:gap-12">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {cart.map((l) => (
            <CartLineItem key={l.key} line={l} />
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/kategoria/te-gjitha" className="group inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold">
            <ArrowRight aria-hidden className="size-4 rotate-180" /> Vazhdo blerjet
          </Link>
          <button type="button" onClick={clearCart} className="min-h-11 text-[14px] font-semibold text-mute hover:text-red">
            Pastro shportën
          </button>
        </div>
      </div>
      <div className="lg:sticky lg:top-[calc(var(--nav-h-compact)+24px)]">
        <Summary
          cta={
            <Link href="/perfundimi-porosise" className="btn btn-red group mt-6 w-full">
              Vazhdo te arka <ArrowRight aria-hidden className="arrow-nudge size-4" />
            </Link>
          }
        />
        <DemoNote className="mt-4">Faqe provë: çmimet janë shembuj. Nuk kryhen porosi.</DemoNote>
      </div>
    </div>
  );
}

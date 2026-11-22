"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Check, ShoppingBag, X } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import CartLineItem from "./CartLineItem";

export function CartDrawer() {
  const { drawer, closeDrawer, cart, cartCount, subtotal, savings } = useStore();
  const open = drawer === "cart";
  const panel = useRef<HTMLElement>(null);
  useDialog(open, panel, closeDrawer);

  return (
    <div className="drawer fixed inset-0 z-[90]" data-open={open || undefined} inert={!open}>
      <div className="drawer-scrim absolute inset-0 bg-black/45" onClick={closeDrawer} aria-hidden />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        data-side="right"
        className="drawer-panel absolute inset-y-0 right-0 flex w-[min(92vw,440px)] flex-col bg-white shadow-[-20px_0_60px_-30px_rgba(0,0,0,0.4)] outline-none"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line pl-5 pr-2 pt-[env(safe-area-inset-top)]">
          <h2 id="cart-title" className="text-[17px] font-extrabold">
            Shporta {cartCount > 0 && <span className="font-semibold text-mute">({cartCount})</span>}
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="Mbyll shportën" data-autofocus className="grid size-11 place-items-center rounded-full hover:bg-surface">
            <X aria-hidden className="size-6" strokeWidth={1.75} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-surface">
              <ShoppingBag aria-hidden className="size-7" strokeWidth={1.5} />
            </span>
            <p className="text-[17px] font-bold">Shporta është bosh</p>
            <p className="text-[14px] text-mute">Shto një produkt për ta parë këtu.</p>
            <Link href="/kategoria/te-gjitha" onClick={closeDrawer} className="btn btn-dark mt-2">
              Vazhdo blerjet
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-5">
              {cart.map((l) => (
                <CartLineItem key={l.key} line={l} compact onNavigate={closeDrawer} />
              ))}
            </ul>
            <div className="shrink-0 border-t border-line px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
              <dl className="space-y-1.5 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-mute">Nëntotali</dt>
                  <dd className="font-bold tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-red">
                    <dt>Kursimi</dt>
                    <dd className="font-bold tabular-nums">−{formatPrice(savings)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-mute">Transporti</dt>
                  <dd className="text-mute">Konfirmohet nga dyqani</dd>
                </div>
              </dl>
              <div className="mt-4 grid gap-2">
                <Link href="/perfundimi-porosise" onClick={closeDrawer} className="btn btn-red group w-full">
                  Vazhdo te arka <ArrowRight aria-hidden className="arrow-nudge size-4" />
                </Link>
                <Link href="/shporta" onClick={closeDrawer} className="btn btn-outline w-full">
                  Shiko shportën
                </Link>
              </div>
              <p className="mt-3 text-center text-[12px] text-mute">Faqe provë: produktet dhe çmimet janë shembuj.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function Toast() {
  const { toast } = useStore();
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-[calc(92px+env(safe-area-inset-bottom))] z-[100] md:bottom-8 flex justify-center px-4">
      {toast && (
        <p
          key={toast.id}
          className="flex items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white shadow-xl motion-safe:animate-[toast-in_.4s_cubic-bezier(.16,1,.3,1)]"
        >
          <Check aria-hidden className="size-4 text-red" strokeWidth={3} />
          {toast.text}
        </p>
      )}
    </div>
  );
}

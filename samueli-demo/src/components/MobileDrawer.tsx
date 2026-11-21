"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Heart, Info, Mail, Phone, ShoppingBag, User, X } from "lucide-react";
import { navItems } from "@/lib/nav";
import { contact } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useDialog } from "@/lib/useDialog";
import { Logo } from "./ui";

export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { ready, cartCount, wishlist } = useStore();
  useDialog(open, panel, onClose);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  let row = 0;
  const r = () => ({ "data-row": true, style: { "--i": row++ } as React.CSSProperties });

  const utility = [
    { href: "/llogaria", label: "Llogaria ime", icon: User },
    { href: "/te-preferuarat", label: `Të preferuarat${ready && wishlist.length ? ` (${wishlist.length})` : ""}`, icon: Heart },
    { href: "/shporta", label: `Shporta${ready && cartCount ? ` (${cartCount})` : ""}`, icon: ShoppingBag },
    { href: "/rreth-nesh", label: "Rreth nesh", icon: Info },
    { href: "/kontakt", label: "Kontakt", icon: Mail },
  ];

  return (
    <div className="drawer fixed inset-0 z-[80] lg:hidden" data-open={open || undefined} inert={!open}>
      <div className="drawer-scrim absolute inset-0 bg-black/45" onClick={onClose} aria-hidden />
      <aside
        id="mobile-drawer"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menyja kryesore"
        tabIndex={-1}
        className="drawer-panel absolute inset-y-0 left-0 flex w-[min(88vw,400px)] flex-col bg-white shadow-[20px_0_60px_-30px_rgba(0,0,0,0.4)] outline-none"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line pl-5 pr-2 pt-[env(safe-area-inset-top)]">
          <Link href="/" onClick={onClose} aria-label="SAMUELI FASHION — Kreu">
            <Logo className="h-[24px]" />
          </Link>
          <button type="button" onClick={onClose} aria-label="Mbyll menunë" data-autofocus className="grid size-11 place-items-center rounded-full hover:bg-surface">
            <X aria-hidden className="size-6" strokeWidth={1.75} />
          </button>
        </div>

        <nav aria-label="Kategoritë" className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
          <ul className="py-2">
            {navItems.map((item) => {
              const isOpen = expanded === item.key;
              if (!item.menu) {
                return (
                  <li key={item.key} {...r()}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex min-h-[52px] items-center text-[18px] font-semibold ${item.accent ? "text-red" : "text-ink"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.key} {...r()}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`acc-${item.key}`}
                    onClick={() => setExpanded(isOpen ? null : item.key)}
                    className="flex min-h-[52px] w-full items-center justify-between text-left text-[18px] font-semibold"
                  >
                    {item.label}
                    <ChevronDown aria-hidden className={`size-5 text-ink/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div id={`acc-${item.key}`} className="accordion-body" data-open={isOpen || undefined} inert={!isOpen}>
                    <div>
                      <ul className="mb-2 border-l-2 border-red/80 pl-4">
                        {item.menu.subs.map((s) => (
                          <li key={s.href}>
                            <Link href={s.href} onClick={onClose} className="flex min-h-11 items-center text-[15px] text-ink/75">
                              {s.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href={item.href} onClick={onClose} className="flex min-h-11 items-center gap-2 text-[15px] font-bold text-red">
                            Shiko të gjitha <ArrowRight aria-hidden className="size-4" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <ul className="mt-2 rounded-2xl bg-off p-2">
            {utility.map(({ href, label, icon: Icon }) => (
              <li key={href} {...r()}>
                <Link href={href} onClick={onClose} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium hover:bg-white">
                  <Icon aria-hidden className="size-5 text-ink/70" strokeWidth={1.75} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-line px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))] text-[13px] text-mute">
          <a href={contact.phoneHref} className="flex min-h-11 items-center gap-2 font-semibold text-ink">
            <Phone aria-hidden className="size-4" strokeWidth={1.75} /> {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="flex min-h-9 items-center gap-2">
            <Mail aria-hidden className="size-4" strokeWidth={1.75} /> {contact.email}
          </a>
        </div>
      </aside>
    </div>
  );
}

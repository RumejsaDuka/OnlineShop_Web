"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Heart, Menu, Ruler, Search, ShoppingBag, Truck, Undo2, User } from "lucide-react";
import { navItems, type NavItem } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { CountBadge, Logo } from "./ui";
import MobileDrawer from "./MobileDrawer";
import SearchOverlay from "./SearchOverlay";
import { shopNotices } from "@/lib/shop-copy";

const OPEN_DELAY = 80; // hover intent: ignore pointers just passing over the nav
const CLOSE_DELAY = 200; // grace period to travel from trigger to panel

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, ready, openDrawer, setSearchOpen } = useStore();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef<string>("mouse");
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});

  // Compact header after a small scroll. The spacer in the layout never changes
  // height, so compacting cannot shift the page.
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes menus
  useEffect(() => {
    setOpen(null);
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [pathname, setSearchOpen]);

  const clear = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  const hoverOpen = (key: string | null) => {
    clear();
    if (key === null) return setOpen(null);
    // first open waits for intent; moving between items switches immediately
    if (open === null) timer.current = window.setTimeout(() => setOpen(key), OPEN_DELAY);
    else setOpen(key);
  };
  const hoverClose = () => {
    clear();
    timer.current = window.setTimeout(() => setOpen(null), CLOSE_DELAY);
  };
  useEffect(() => clear, []);

  const closeAndFocus = useCallback((key: string | null) => {
    setOpen(null);
    if (key && shellRef.current?.contains(document.activeElement)) triggers.current[key]?.focus();
  }, []);

  // Escape + outside click while a mega-menu is open
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!shellRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAndFocus(open);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeAndFocus]);

  const isMouse = (e: React.PointerEvent) => e.pointerType !== "touch";
  const isCurrent = (item: NavItem) => pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-50" data-compact={compact || undefined}>
        <div className="info-strip hidden items-center justify-center lg:flex bg-ink text-white" aria-label="Informacion për blerjet">
          <ul className="hidden w-full max-w-[960px] items-center justify-between px-6 text-[11px] lg:flex xl:text-[12px]">
            {shopNotices.map((item, index) => {
              const Icon = [Truck, Undo2, Ruler][index];
              return <li key={item.title} className="flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap border-white/25 last:border-0 lg:border-r"><Icon aria-hidden className="size-[18px]" strokeWidth={1.5} />{item.title}</li>;
            })}
          </ul>
        </div>
        <div
          ref={shellRef}
          className="nav-shell relative border-b border-line bg-white"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(null);
          }}
        >
          <div className="nav-row campaign-container grid grid-cols-[1fr_auto_1fr] items-center lg:grid-cols-[auto_1fr_auto] lg:gap-6">
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Hap menunë"
                aria-expanded={drawerOpen}
                aria-controls="mobile-drawer"
                className="-ml-2.5 grid size-11 place-items-center rounded-full hover:bg-surface"
              >
                <Menu aria-hidden className="size-6" strokeWidth={1.75} />
              </button>
            </div>

            <Link href="/" aria-label="SAMUELI FASHION — Kreu" className="justify-self-center lg:justify-self-start">
              <Logo priority className="nav-logo" />
            </Link>

            {/* Desktop links */}
            <ul className="hidden h-full items-stretch justify-center gap-[clamp(10px,2vw,36px)] lg:flex" onPointerLeave={(e) => isMouse(e) && hoverClose()}>
              {navItems.map((item) => (
                <li
                  key={item.key}
                  className="nav-item flex items-center"
                  data-active={open === item.key || isCurrent(item) || undefined}
                  onPointerEnter={(e) => isMouse(e) && hoverOpen(item.menu ? item.key : null)}
                >
                  <Link
                    href={item.href}
                    className={`nav-link whitespace-nowrap py-2 text-[15px] font-semibold xl:text-[16px] ${
                      item.accent || open === item.key ? "text-red" : "text-ink hover:text-red"
                    } transition-colors`}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onPointerDown={(e) => (pointerType.current = e.pointerType)}
                    onClick={(e) => {
                      // Touch: first tap reveals the menu, second tap follows the link
                      if (item.menu && pointerType.current === "touch" && open !== item.key) {
                        e.preventDefault();
                        setOpen(item.key);
                        return;
                      }
                      setOpen(null);
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.menu && (
                    <button
                      type="button"
                      ref={(el) => {
                        triggers.current[item.key] = el;
                      }}
                      aria-expanded={open === item.key}
                      aria-controls={`mega-${item.key}`}
                      aria-label={`${open === item.key ? "Mbyll" : "Hap"} nënkategoritë e ${item.label}`}
                      onClick={() => setOpen((o) => (o === item.key ? null : item.key))}
                      onKeyDown={(e) => {
                        const intoPanel = e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey && open === item.key);
                        if (intoPanel) {
                          // Panel sits after the nav in the DOM — move focus into it explicitly
                          e.preventDefault();
                          setOpen(item.key);
                          window.setTimeout(() => document.querySelector<HTMLElement>(`#mega-${item.key} a`)?.focus(), 30);
                        }
                      }}
                      className={`nav-chevron -mr-1 ml-0.5 grid size-6 place-items-center rounded-full transition-[color,opacity] hover:bg-surface ${
                        open === item.key ? "text-red" : "text-ink/70"
                      }`}
                    >
                      <ChevronDown
                        aria-hidden
                        className={`size-4 transition-transform duration-300 ${open === item.key ? "rotate-180" : ""}`}
                        strokeWidth={2}
                      />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="-mr-2.5 flex items-center justify-end gap-0.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Kërko"
                className="grid size-11 place-items-center rounded-full hover:bg-surface"
              >
                <Search aria-hidden className="size-[22px]" strokeWidth={1.75} />
              </button>
              <Link href="/llogaria" aria-label="Llogaria ime" className="hidden size-11 place-items-center rounded-full hover:bg-surface lg:grid">
                <User aria-hidden className="size-[22px]" strokeWidth={1.75} />
              </Link>
              <Link
                href="/te-preferuarat"
                aria-label={`Të preferuarat${ready && wishlist.length ? ` (${wishlist.length})` : ""}`}
                className="relative hidden size-11 place-items-center rounded-full hover:bg-surface lg:grid"
              >
                <Heart aria-hidden className="size-[22px]" strokeWidth={1.75} />
                <CountBadge count={ready ? wishlist.length : 0} className="right-0.5 top-1" />
              </Link>
              <button
                type="button"
                onClick={() => openDrawer("cart")}
                aria-label={`Shporta${ready && cartCount ? ` (${cartCount} artikuj)` : ""}`}
                className="relative grid size-11 place-items-center rounded-full hover:bg-surface"
              >
                <ShoppingBag aria-hidden className="size-[22px]" strokeWidth={1.75} />
                <CountBadge count={ready ? cartCount : 0} className="right-0.5 top-1" />
              </button>
            </div>
          </div>

          {/* Mega-menus: positioned under the nav row, inside the header (never clipped) */}
          <div className="absolute inset-x-0 top-full hidden h-0 lg:block">
            {navItems.map((item) =>
              item.menu ? (
                <MegaPanel
                  key={item.key}
                  item={item}
                  open={open === item.key}
                  onEnter={(e) => isMouse(e) && clear()}
                  onLeave={(e) => isMouse(e) && hoverClose()}
                  onNavigate={() => setOpen(null)}
                />
              ) : null,
            )}
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchOverlay />
    </>
  );
}

function MegaPanel({
  item,
  open,
  onEnter,
  onLeave,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onEnter: (e: React.PointerEvent) => void;
  onLeave: (e: React.PointerEvent) => void;
  onNavigate: () => void;
}) {
  const menu = item.menu!;
  return (
    <div
      id={`mega-${item.key}`}
      className="mega absolute left-1/2 top-0 w-[min(1180px,calc(100%-2*var(--gutter)))] -translate-x-1/2 pt-3"
      data-open={open || undefined}
      inert={!open}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a"));
        const trigger = document.querySelector<HTMLElement>(`[aria-controls="mega-${item.key}"]`);
        if (e.shiftKey && document.activeElement === links[0]) {
          e.preventDefault();
          trigger?.focus();
        } else if (!e.shiftKey && document.activeElement === links[links.length - 1]) {
          // Leave the panel to the next top-level link, as if the panel sat right after its trigger
          e.preventDefault();
          onNavigate();
          (trigger?.closest("li")?.nextElementSibling?.querySelector<HTMLElement>("a") ?? trigger)?.focus();
        }
      }}
    >
      <div className="grid grid-cols-[210px_1fr] gap-7 rounded-[20px] bg-white p-6 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.35)] ring-1 ring-black/5 xl:grid-cols-[240px_1fr] xl:p-7">
        <div className="border-r border-line pr-6">
          <p className="text-[22px] font-extrabold tracking-[-0.01em]">{menu.title}</p>
          <ul className="mt-3">
            {menu.subs.map((s, i) => (
              <li key={s.href} data-sub style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={s.href}
                  onClick={onNavigate}
                  className="group flex min-h-11 items-center justify-between rounded-lg text-[15px] font-medium text-ink/85 hover:text-red"
                >
                  {s.label}
                  <ChevronRight aria-hidden className="arrow-nudge size-4 opacity-60" />
                </Link>
              </li>
            ))}
            <li data-sub style={{ "--i": menu.subs.length } as React.CSSProperties} className="mt-2 border-t border-line pt-2">
              <Link href={item.href} onClick={onNavigate} className="group flex min-h-11 items-center gap-2 text-[15px] font-bold text-red">
                Shiko të gjitha
                <ArrowRight aria-hidden className="arrow-nudge size-4" />
              </Link>
            </li>
          </ul>
        </div>
        <ul className="grid grid-cols-3 gap-4">
          {menu.tiles.map((t, i) => (
            <li key={t.href} data-tile style={{ "--i": i } as React.CSSProperties} className="h-full">
              <Link
                href={t.href}
                onClick={onNavigate}
                className="group relative block h-full min-h-[200px] overflow-hidden rounded-[14px] studio-editorial text-white"
              >
                <Image src={t.image} alt="" fill sizes="300px" className="zoom-img object-contain px-4 pb-16 pt-3" />
                
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <span>
                    <span className="block text-[19px] font-bold leading-tight">{t.title}</span>
                    {t.caption && <span className="mt-0.5 block text-[13px] text-white/80">{t.caption}</span>}
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:translate-x-0.5">
                    <ArrowRight aria-hidden className="size-4" strokeWidth={2.25} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

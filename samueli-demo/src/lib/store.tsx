"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getProduct, type Product } from "./data";

export type CartLine = { key: string; slug: string; size: string; qty: number };
export type DrawerTab = "cart" | "wishlist";

type Store = {
  ready: boolean;
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  savings: number;
  addToCart: (slug: string, size?: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;

  drawer: DrawerTab | null;
  openDrawer: (tab: DrawerTab) => void;
  closeDrawer: () => void;

  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;

  toast: { id: number; text: string } | null;
  notify: (text: string) => void;
};

const Ctx = createContext<Store | null>(null);
const CART_KEY = "samueli-demo-cart-v2";
const WISH_KEY = "samueli-demo-wishlist-v2";
const MAX_QTY = 9;

export const productOf = (slug: string): Product => getProduct(slug)!;
export const defaultSize = (p: Product) => (p.sizes.includes("M") ? "M" : p.sizes[Math.floor(p.sizes.length / 2)]);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / storage blocked — demo keeps working in memory */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<DrawerTab | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<Store["toast"]>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate persisted demo state after mount (avoids SSR mismatches)
  useEffect(() => {
    const c = read<CartLine[]>(CART_KEY, []).filter((l) => getProduct(l.slug));
    const w = read<string[]>(WISH_KEY, []).filter((s) => getProduct(s));
    setCart(c);
    setWishlist(w);
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) write(CART_KEY, cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) write(WISH_KEY, wishlist);
  }, [wishlist, ready]);

  const notify = useCallback((text: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const addToCart = useCallback((slug: string, size?: string, qty = 1) => {
    const p = productOf(slug);
    const chosen = size ?? defaultSize(p);
    const key = `${slug}__${chosen}`;
    setCart((prev) => {
      const hit = prev.find((l) => l.key === key);
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l));
      return [...prev, { key, slug, size: chosen, qty: Math.min(qty, MAX_QTY) }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, MAX_QTY) } : l)),
    );
  }, []);

  const removeLine = useCallback((key: string) => setCart((prev) => prev.filter((l) => l.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback(
    (slug: string) => {
      const on = wishlist.includes(slug);
      notify(on ? "U hoq nga të preferuarat" : "U ruajt te të preferuarat");
      setWishlist((prev) => (on ? prev.filter((s) => s !== slug) : [...prev, slug]));
    },
    [notify, wishlist],
  );

  const value = useMemo<Store>(() => {
    let cartCount = 0;
    let subtotal = 0;
    let savings = 0;
    for (const l of cart) {
      const p = productOf(l.slug);
      cartCount += l.qty;
      subtotal += l.qty * p.price;
      if (p.compareAt) savings += l.qty * (p.compareAt - p.price);
    }
    // round to cents to avoid float drift in the UI
    subtotal = Math.round(subtotal * 100) / 100;
    savings = Math.round(savings * 100) / 100;
    return {
      ready,
      cart,
      cartCount,
      subtotal,
      savings,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      wishlist,
      toggleWish,
      isWished: (s) => wishlist.includes(s),
      drawer,
      openDrawer: (tab) => setDrawer(tab),
      closeDrawer: () => setDrawer(null),
      searchOpen,
      setSearchOpen,
      toast,
      notify,
    };
  }, [ready, cart, wishlist, drawer, searchOpen, toast, addToCart, setQty, removeLine, clearCart, toggleWish, notify]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

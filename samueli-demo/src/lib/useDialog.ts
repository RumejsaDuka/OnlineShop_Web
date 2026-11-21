"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

let locks = 0;
function lockScroll(on: boolean) {
  locks = Math.max(0, locks + (on ? 1 : -1));
  document.documentElement.style.overflow = locks > 0 ? "hidden" : "";
}

/**
 * Modal behaviour for drawers/overlays: Escape to close, Tab focus trap,
 * scroll lock, initial focus and focus restore on close.
 */
export function useDialog(open: boolean, panel: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const restoreTo = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    lockScroll(true);

    const focusFirst = window.setTimeout(() => {
      const el = panel.current;
      if (!el) return;
      const preferred = el.querySelector<HTMLElement>("[data-autofocus]");
      (preferred ?? el.querySelector<HTMLElement>(FOCUSABLE) ?? el).focus({ preventScroll: true });
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      const target = restoreTo.current;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    };
  }, [open, panel]);
}

"use client";

import { useRef } from "react";
import { useReveal } from "@/lib/useReveal";

/** Wraps a page/section so its [data-reveal] children animate in on scroll. */
export default function RevealScope({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

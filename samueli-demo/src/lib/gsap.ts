"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
  // Dev-only handle for inspecting/fast-forwarding timelines in tooling.
  if (process.env.NODE_ENV !== "production") (window as unknown as { __gsap: typeof gsap }).__gsap = gsap;
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED = "(prefers-reduced-motion: reduce)";

export { gsap, ScrollTrigger, useGSAP };

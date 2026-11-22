"use client";

import { gsap, useGSAP, MOTION_OK } from "./gsap";

/**
 * Section-level reveal: [data-reveal="mask"] headings slide up through their
 * mask-line; [data-reveal="fade"] items rise softly. One ScrollTrigger per element,
 * fired once. Nothing is hidden when motion is reduced or JS is unavailable.
 */
export function useReveal(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        q("[data-reveal='mask']").forEach((el: Element) => {
          gsap.fromTo(
            el.querySelectorAll(".mask-line > span"),
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: 1.05,
              ease: "power4.out",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );
        });
        q("[data-reveal='fade']").forEach((el: Element) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 90%", once: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}

"use client";

// Entrance plumbing shared by the hero options. The page as written is the final, still page.
// Under no-preference the stylesheet hides the [data-a] parts until the script marks the hero
// live, and shows them by itself after 1.8 s if the script is late (no-JS readers too). If that
// fallback has already run, the entrance is skipped, so nothing disappears and plays again.
import type { RefObject } from "react";
import { EASE, MOVE, gsap, useMotion } from "../demo/motion";

export { EASE, MOVE, gsap };
export const FINE = "(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 900px)";

type Q = (selector: string) => Element[];

export function useHero(
  scope: RefObject<HTMLElement | null>,
  intro: (q: Q, el: HTMLElement) => void | (() => void),
  more?: (mm: gsap.MatchMedia, q: Q, el: HTMLElement) => void,
) {
  useMotion(scope, (mm, el) => {
    const first = el.querySelector("[data-a]");
    const fallback = first?.getAnimations?.()[0];
    const late = typeof fallback?.currentTime === "number" && fallback.currentTime > 1700;
    el.dataset.live = "";
    const q = gsap.utils.selector(el) as Q;
    mm.add(MOVE, () => {
      if (!late) return intro(q, el);
    });
    more?.(mm, q, el);
  });
}

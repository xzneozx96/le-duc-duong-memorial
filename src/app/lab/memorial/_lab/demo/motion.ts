"use client";

// GSAP for the demo. Every effect runs inside gsap.matchMedia(scope): the moving branch only
// under prefers-reduced-motion: no-preference, and everything is reverted when the component
// unmounts (React runs effects twice in development). The script sets every hidden start
// state itself, so without the script, or with reduced motion, the page reads complete.
import { useEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;
function register() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export { gsap, ScrollTrigger, SplitText };

/** The moving branch. The still branch is the page as written. */
export const MOVE = "(prefers-reduced-motion: no-preference)";
export const MOVE_WIDE = "(prefers-reduced-motion: no-preference) and (min-width: 900px)";

/** Arrivals decelerate; scrubs stay linear so the page follows the hand. */
export const EASE = { enter: "expo.out", soft: "power3.out", roll: "power3.inOut" };

export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia, el: HTMLElement) => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    register();
    const mm = gsap.matchMedia(el);
    setup(mm, el);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Opening a form, a longer entry or more photos changes the page's height: re-measure once. */
export function useRefreshOnResize(target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    register();
    let timer = 0;
    let last = el.offsetHeight;
    const ro = new ResizeObserver(() => {
      if (Math.abs(el.offsetHeight - last) < 2) return;
      last = el.offsetHeight;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
    });
    ro.observe(el);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [target]);
}

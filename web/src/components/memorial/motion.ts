"use client";

// GSAP for the page. Every effect runs inside gsap.matchMedia(scope): the moving branch only
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
  // debug hook: lets the headless frame-sampling scripts count the live triggers
  (window as unknown as { __st?: typeof ScrollTrigger }).__st = ScrollTrigger;
}

export { gsap, ScrollTrigger, SplitText };

/** The moving branch. The still branch is the page as written. */
export const MOVE = "(prefers-reduced-motion: no-preference)";
export const MOVE_WIDE = "(prefers-reduced-motion: no-preference) and (min-width: 900px)";

/** Arrivals decelerate; scrubs stay linear so the page follows the hand. */
export const EASE = { enter: "expo.out", soft: "power3.out", roll: "power3.inOut" };

/** `idle`: set the effect up once the browser is idle (or after `timeout` ms at the latest),
 *  so the triggers of sections below the fold are not measured in the same task as hydration,
 *  while the hero's opening is playing. Use it only for sections that start below the fold:
 *  their at-rest look is the page as written, so a late setup shows nothing changing. */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia, el: HTMLElement) => void,
  deps: DependencyList = [],
  { idle = false, timeout = 2500 }: { idle?: boolean; timeout?: number } = {},
) {
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    register();
    let mm: gsap.MatchMedia | undefined;
    const start = () => {
      mm = gsap.matchMedia(el);
      setup(mm, el);
    };
    if (!idle) {
      start();
      return () => mm?.revert();
    }
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = ric(start, { timeout });
    return () => {
      cic(handle);
      mm?.revert();
    };
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

"use client";

// The page's GSAP helpers (matchMedia scope, reduced-motion branch) plus Flip for the guestbook.
// Every moving effect lives in the MOVE branch; the still branch is the page as written.
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export { EASE, MOVE, MOVE_WIDE, useMotion, useRefreshOnResize } from "@/components/memorial/motion";

let done = false;
export function registerBook() {
  if (done) return;
  gsap.registerPlugin(Flip, ScrollTrigger, SplitText);
  done = true;
}
if (typeof window !== "undefined") registerBook();

export { gsap, Flip, ScrollTrigger, SplitText };

/** True when the reader has not asked for less motion. */
export const moving = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

/** Scroll an element into view, smoothly only when motion is welcome. */
export function bringIntoView(el: Element | null, block: ScrollLogicalPosition = "start") {
  if (!el) return;
  el.scrollIntoView({ block, behavior: moving() ? "smooth" : "auto" });
}

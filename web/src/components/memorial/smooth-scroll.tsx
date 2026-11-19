"use client";

// Smooth wheel scrolling (Lenis) for the whole page, driven by GSAP's ticker so ScrollTrigger
// stays in step. Touch keeps the phone's own scrolling (syncTouch off), anchor links glide, and
// with reduced motion Lenis is never started. When a popup or the letter sheet locks the page
// (overflow: hidden on <html>), Lenis stops; scrollable popups carry data-lenis-prevent.
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./motion";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const html = document.documentElement;
    const sync = () => (html.style.overflow === "hidden" ? lenis.stop() : lenis.start());
    const watch = new MutationObserver(sync);
    watch.observe(html, { attributes: true, attributeFilter: ["style"] });

    return () => {
      watch.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}

"use client";

// E2 · Sương sớm Moritzburg. A group photo of his students (the owner's pick), graded into a
// sepia mist that melts into the page's off-white, with his whole portrait in front of it.
//
// The one authored moment, a focus pull: the page opens on him, already in focus, in front of
// a room that is still out of focus. Then the focus travels past him to the generations of
// students behind him, while his name and the lines beneath it arrive almost at once. On scroll the room goes soft
// again and the morning mist rises from below and closes over him, so the hero ends in the
// same off-white as the timeline that follows: no edge, the page simply continues.
//
// The opening is CSS keyframes (e2.css), not script: it starts with the first paint, runs on
// the compositor while the page hydrates, and ends complete even if the script never runs.
// Only the scroll hand-over is GSAP, on wrapper elements the keyframes never touch.
import { useEffect, useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { classes } from "../cls";
import { MOVE, gsap, useMotion } from "../demo/motion";
import { Backdrop, Dates, HERO, NameWords, Next, Portrait, Root, ScrollCue, Titles } from "./e-shared";
import "./e2.css";

const s = classes("he2");
// The text entrances, added to the page once the web fonts are ready (see e2.css). They are a
// separate style element rather than an attribute, so nothing React rendered is changed
// before hydration.
// A calm order, one thing after another with overlap: the portrait (e2.css), then "Nhà giáo",
// the name word by word, then dates, line and button. Ease-out quint, about 1 s each; all done
// by about 2.3 s.
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const GO_CSS = `@media (prefers-reduced-motion: no-preference){
html .he2-hon{animation:he2-follow 1s ${EASE_OUT} .35s backwards}
html .he2-word{animation:he2-follow 1.1s ${EASE_OUT} .55s backwards}
html .he2-name>.he2-word:nth-of-type(2){animation-delay:.68s}
html .he2-name>.he2-word:nth-of-type(3){animation-delay:.81s}
html .he2-rest{animation:he2-follow 1s ${EASE_OUT} 1.05s backwards}
html .he2-rest:nth-of-type(2){animation-delay:1.2s}
html .he2-rest:nth-of-type(3){animation-delay:1.35s}}`;
function addGoCss() {
  if (document.getElementById("he2-go")) return;
  const st = document.createElement("style");
  st.id = "he2-go";
  st.textContent = GO_CSS;
  document.head.appendChild(st);
}
// Runs in the page head while the page is parsed, before hydration.
const GO = `(function(){var go=function(){if(document.getElementById("he2-go"))return;var s=document.createElement("style");s.id="he2-go";s.textContent=${JSON.stringify(GO_CSS)};document.head.appendChild(s)};if(!document.fonts||!document.fonts.ready){go();return}Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,500)})]).then(go)})();`;
const PHOTO = { wide: "/lab/hero/e2-thanhxuan-2-wide.webp", tall: "/lab/hero/e2-thanhxuan-2-tall.webp" };

/** In the demo page the block below the hero is the real page, so `withNext` is off and the
 *  button points at the timeline. */
export function OptionE2({ withNext = true, cueHref }: { withNext?: boolean; cueHref?: string } = {}) {
  const ref = useRef<HTMLElement>(null);
  // The head script, sent once with the server render.
  const sent = useRef(false);
  useServerInsertedHTML(() => {
    if (sent.current) return null;
    sent.current = true;
    return <script dangerouslySetInnerHTML={{ __html: GO }} />;
  });
  // A client-side visit has no server render, so the head script never ran: let the text go.
  useEffect(addGoCss, []);
  useMotion(ref, (mm, el) => {
    mm.add(MOVE, () => {
      const q = gsap.utils.selector(el);
      // Scrubbed straight to the scroll position: the page's smooth scrolling (Lenis) already
      // turns a wheel's steps into one glide, and a second catch-up here would only lag.
      gsap
        .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(q("[data-stage]"), { yPercent: 12 }, 0)
        .to(q("[data-focus]"), { opacity: 0, ease: "power1.in" }, 0)
        .to(q("[data-figure]"), { yPercent: 7 }, 0)
        .to(q("[data-plate]"), { y: () => -0.12 * el.offsetHeight, opacity: 0, ease: "power1.in" }, 0)
        // the mist: a tall paper gradient that rises by transform alone (no repaint)
        .to(q("[data-rise]"), { yPercent: -100 }, 0);
    });
  });

  return (
    <Root className={s.root}>
      <header ref={ref} className={s.hero}>
        <div className={s.stage} data-stage>
          <div className={s.settle}>
            {/* the room out of focus: the same photograph, blurred once and never re-drawn */}
            <Backdrop wide={PHOTO.wide} tall={PHOTO.tall} className={`${s.bg} ${s.soft}`} imgClassName={s.bgImg} />
            {/* the room in focus, faded in over it */}
            <div className={s.focus} data-focus>
              <Backdrop wide={PHOTO.wide} tall={PHOTO.tall} className={`${s.bg} ${s.sharp}`} imgClassName={s.bgImg} />
            </div>
          </div>
        </div>
        <div className={s.ground} aria-hidden />
        <div className={s.col}>
          <div className={s.figure} data-figure>
            <Portrait className={s.portrait} />
          </div>
          <div className={s.plate} data-plate>
            <h1 className={s.title}>
              <span className={s.honMask}>
                <span className={s.hon}>{HERO.honorific}</span>
              </span>{" "}
              <span className={s.name}>
                <NameWords wordClass={s.word} />
              </span>
            </h1>
            <div className={s.rest}>
              <Dates className={s.dates} />
            </div>
            <div className={s.rest}>
              <Titles className={s.line} />
            </div>
            <div className={s.rest}>
              <ScrollCue className={s.cue} href={cueHref} />
            </div>
          </div>
        </div>
        <div className={s.rise} aria-hidden data-rise />
      </header>
      {withNext && <Next tone="light" />}
    </Root>
  );
}

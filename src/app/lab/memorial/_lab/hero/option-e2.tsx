"use client";

// E2 · Sương sớm Moritzburg. A group photo of his students (the owner's pick), graded into a
// sepia mist that melts into the page's off-white, with his whole portrait in front of it.
//
// The one authored moment, a focus pull: the page opens on him, already in focus, in front of
// a room that is still out of focus. Then the focus travels past him to the generations of
// students behind him, and his name rises into place beneath. On scroll the room goes soft
// again and the hero dims to the warm dark of the films, like the cut to the next reel.
//
// The opening is CSS keyframes (e2.css), not script: it starts with the first paint, runs on
// the compositor while the page hydrates, and ends complete even if the script never runs.
// Only the scroll hand-over is GSAP, on wrapper elements the keyframes never touch.
import { useRef } from "react";
import { classes } from "../cls";
import { MOVE, gsap, useMotion } from "../demo/motion";
import { Backdrop, Dates, HERO, NameWords, Next, Portrait, Root, ScrollCue, Titles } from "./e-shared";
import "./e2.css";

const s = classes("he2");
const PHOTO = { wide: "/lab/hero/e2-thanhxuan-2-wide.webp", tall: "/lab/hero/e2-thanhxuan-2-tall.webp" };

/** In the demo page the block below the hero is the real page, so `withNext` is off and the
 *  button points at the films. */
export function OptionE2({ withNext = true, cueHref }: { withNext?: boolean; cueHref?: string } = {}) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, el) => {
    mm.add(MOVE, () => {
      const q = gsap.utils.selector(el);
      // Scrubbed with a short catch-up, so a wheel's steps arrive as one glide.
      gsap
        .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 } })
        .to(q("[data-stage]"), { yPercent: 12 }, 0)
        .to(q("[data-focus]"), { opacity: 0, ease: "power1.in" }, 0)
        .to(q("[data-figure]"), { yPercent: 7 }, 0)
        .to(q("[data-plate]"), { y: () => -0.12 * el.offsetHeight, opacity: 0, ease: "power1.in" }, 0)
        .to(q("[data-dusk]"), { opacity: 1, ease: "power2.in" }, 0);
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
                <NameWords wordClass={s.word} maskClass={s.mask} />
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
        <div className={s.dusk} aria-hidden data-dusk />
      </header>
      {withNext && <Next tone="light" />}
    </Root>
  );
}

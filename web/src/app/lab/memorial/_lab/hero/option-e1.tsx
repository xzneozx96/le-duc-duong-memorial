"use client";

// E1 · Khuê Văn Các. The pavilion of the Temple of Literature in Hà Nội, the old emblem of
// learning and of honouring teachers, in a 1915 autochrome graded to warm sepia. He stands in
// front of it on the right; his name is set in the courtyard on the left. The film pans slowly
// across the courtyard on arrival; on scroll the courtyard sinks behind him and the page goes dark.
import { useRef } from "react";
import { classes } from "../cls";
import { EASE, MOVE, gsap, useMotion } from "../demo/motion";
import { Backdrop, Dates, HERO, NameWords, Next, Portrait, Root, ScrollCue, Titles } from "./e-shared";
import "./e1.css";

const s = classes("he1");

export function OptionE1() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, el) => {
    mm.add(MOVE, () => {
      const bg = el.querySelector("[data-bg]");
      const tl = gsap.timeline({ defaults: { ease: EASE.enter } });
      tl.from(bg, { xPercent: -4, scale: 1.1, duration: 5.5, ease: "power2.out" }, 0)
        .from(el.querySelector("[data-veil]"), { autoAlpha: 1, duration: 1.6, ease: "power1.out" }, 0)
        .from("[data-portrait]", { yPercent: 6, autoAlpha: 0, duration: 2.2 }, 0.5)
        .from("[data-hon]", { y: 18, autoAlpha: 0, duration: 1.4 }, 1.1)
        .from("[data-word]", { y: 34, autoAlpha: 0, duration: 1.6, stagger: 0.14 }, 1.2)
        .from("[data-rest]", { y: 18, autoAlpha: 0, duration: 1.4, stagger: 0.12 }, 1.8);

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(bg, { yPercent: 14, ease: "none" }, 0)
        .to("[data-portrait]", { yPercent: -5, ease: "none" }, 0)
        .to(el.querySelector("[data-text]"), { y: -60, autoAlpha: 0, ease: "none" }, 0)
        .to(el.querySelector("[data-dusk]"), { autoAlpha: 1, ease: "none" }, 0);
    });
  });

  return (
    <Root className={s.root}>
      <header ref={ref} className={s.hero}>
        <div className={s.stage}>
          <Backdrop
            wide="/lab/hero/e1-vanmieu-wide.webp"
            tall="/lab/hero/e1-vanmieu-tall.webp"
            className={s.bg}
            imgClassName={s.bgImg}
          />
          <div className={s.grade} aria-hidden />
          <div className={s.veil} aria-hidden data-veil />
          <div className={s.figure}>
            <Portrait className={s.portrait} />
          </div>
          <div className={s.dusk} aria-hidden data-dusk />
        </div>
        <div className={s.text} data-text>
          <h1 className={s.title}>
            <span className={s.hon} data-hon>
              {HERO.honorific}
            </span>
            {" "}
            <span className={s.name}>
              <NameWords wordClass={s.word} />
            </span>
          </h1>
          <div data-rest>
            <Dates className={s.dates} />
          </div>
          <div data-rest>
            <Titles className={s.line} />
          </div>
          <div data-rest>
            <ScrollCue className={s.cue} />
          </div>
        </div>
      </header>
      <Next tone="dark" />
    </Root>
  );
}

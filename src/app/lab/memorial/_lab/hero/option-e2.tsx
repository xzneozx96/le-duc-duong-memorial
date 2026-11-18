"use client";

// E2 · Sương sớm Moritzburg. A group photo from his own collection (the owner's pick), graded
// into a sepia mist that melts into the page's off-white. He stands in the middle of the
// mist, frontal and calm, and his name is set beneath him like the plate under a portrait.
// The mist clears on arrival to show the group; on scroll it closes again over him.
import { useRef } from "react";
import { classes } from "../cls";
import { EASE, MOVE, gsap, useMotion } from "../demo/motion";
import { Backdrop, Dates, HERO, NameWords, Next, Portrait, Root, ScrollCue, Titles } from "./e-shared";
import "./e2.css";

const s = classes("he2");

export function OptionE2() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, el) => {
    mm.add(MOVE, () => {
      const bg = el.querySelector("[data-bg]");
      const mist = el.querySelector("[data-mist]");
      gsap
        .timeline({ defaults: { ease: EASE.soft } })
        .from(mist, { autoAlpha: 1, duration: 4.2, ease: "power1.inOut" }, 0)
        .from(bg, { scale: 1.06, duration: 6, ease: "power2.out" }, 0)
        .from("[data-portrait]", { autoAlpha: 0, y: 24, filter: "blur(10px)", duration: 2.6, clearProps: "filter" }, 0.6)
        .from("[data-hon]", { autoAlpha: 0, y: 14, duration: 1.4 }, 1.6)
        .from("[data-word]", { autoAlpha: 0, y: 22, duration: 1.6, stagger: 0.16 }, 1.8)
        .from("[data-rest]", { autoAlpha: 0, y: 14, duration: 1.4, stagger: 0.14 }, 2.4);

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(mist, { autoAlpha: 1, ease: "none" }, 0)
        .to(bg, { yPercent: 10, ease: "none" }, 0)
        .to("[data-portrait]", { yPercent: -8, autoAlpha: 0.2, ease: "none" }, 0)
        .to(el.querySelector("[data-plate]"), { y: -40, ease: "none" }, 0);
    });
  });

  return (
    <Root className={s.root}>
      <header ref={ref} className={s.hero}>
        <Backdrop
          wide="/lab/hero/e2-thanhxuan-2-wide.webp"
          tall="/lab/hero/e2-thanhxuan-2-tall.webp"
          className={s.bg}
          imgClassName={s.bgImg}
        />
        <div className={s.ground} aria-hidden />
        <div className={s.mist} aria-hidden data-mist />
        <div className={s.col}>
          <div className={s.figure}>
            <Portrait className={s.portrait} />
          </div>
          <div className={s.plate} data-plate>
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
        </div>
      </header>
      <Next tone="light" />
    </Root>
  );
}

"use client";

// E4 · Giảng đường. An empty lecture hall after the last lesson, rows of worn wooden seats
// facing the board, graded down to warm dark. He stands at the front, where the teacher stands,
// his name above him on the wall where the lesson was written. The room's light comes up slowly
// on arrival; on scroll the view walks forward toward the board and he stays.
import { useRef } from "react";
import { classes } from "../cls";
import { MOVE, gsap, useMotion } from "../demo/motion";
import { Backdrop, Dates, HERO, NameWords, Next, Portrait, Root, ScrollCue, Titles } from "./e-shared";
import "./e4.css";

const s = classes("he4");

export function OptionE4() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, el) => {
    mm.add(MOVE, () => {
      const bg = el.querySelector("[data-bg]");
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from(el.querySelector("[data-dim]"), { autoAlpha: 1, duration: 3.2, ease: "power1.inOut" }, 0)
        .from(bg, { scale: 1.04, duration: 6 }, 0)
        .from("[data-portrait]", { autoAlpha: 0, duration: 2.4 }, 0.9)
        .from("[data-hon]", { autoAlpha: 0, duration: 1.6 }, 1.4)
        .from("[data-word]", { autoAlpha: 0, letterSpacing: "0.12em", duration: 2.4, stagger: 0.2, ease: "power3.out" }, 1.5)
        .from("[data-rest]", { autoAlpha: 0, y: 12, duration: 1.4, stagger: 0.14 }, 2.6);

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(bg, { scale: 1.22, transformOrigin: "50% 38%", ease: "none" }, 0)
        .to(el.querySelector("[data-title]"), { y: -70, autoAlpha: 0, ease: "none" }, 0)
        .to("[data-portrait]", { yPercent: -4, ease: "none" }, 0);
    });
  });

  return (
    <Root className={s.root}>
      <header ref={ref} className={s.hero}>
        <div className={s.stage}>
          <Backdrop
            wide="/lab/hero/e4-giangduong-wide.webp"
            tall="/lab/hero/e4-giangduong-tall.webp"
            className={s.bg}
            imgClassName={s.bgImg}
          />
          <div className={s.grade} aria-hidden />
          <div className={s.dim} aria-hidden data-dim />
        </div>
        <div className={s.title} data-title>
          <h1>
            <span className={s.hon} data-hon>
              {HERO.honorific}
            </span>
            {" "}
            <span className={s.name}>
              <NameWords wordClass={s.word} />
            </span>
          </h1>
        </div>
        <div className={s.figure}>
          <Portrait className={s.portrait} />
        </div>
        <div className={s.foot}>
          <div className={s.footL} data-rest>
            <Dates className={s.dates} />
          </div>
          <div data-rest>
            <Titles className={s.line} />
          </div>
          <div className={s.footR} data-rest>
            <ScrollCue className={s.cue} />
          </div>
        </div>
      </header>
      <Next tone="dark" />
    </Root>
  );
}

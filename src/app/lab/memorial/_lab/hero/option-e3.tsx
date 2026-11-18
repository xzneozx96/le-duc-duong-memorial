"use client";

// E3 · Bia đá. The corridor of the doctors' stelae at the Temple of Literature, where Hà Nội
// has kept the names of its scholars in stone for centuries. He stands in front of the stones;
// beside him his name is set one word to a line, like an inscription, and is cut into the page
// word by word on arrival. On scroll the corridor slowly recedes behind him.
import { useRef } from "react";
import { classes } from "../cls";
import { MOVE, gsap, useMotion } from "../demo/motion";
import { Backdrop, Dates, HERO, NameWords, Next, Portrait, Root, ScrollCue } from "./e-shared";
import "./e3.css";

const s = classes("he3");

export function OptionE3() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, el) => {
    mm.add(MOVE, () => {
      const bg = el.querySelector("[data-bg]");
      const panel = el.querySelector("[data-panel]");
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(panel, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.8, ease: "power3.inOut" }, 0)
        .from(bg, { scale: 1.14, duration: 3.2 }, 0)
        .from("[data-portrait]", { autoAlpha: 0, yPercent: 5, duration: 2 }, 1)
        .from("[data-hon]", { autoAlpha: 0, x: -12, duration: 1.2 }, 1.1)
        .from(
          "[data-word]",
          { clipPath: "inset(0% 100% 0% 0%)", duration: 1.3, ease: "power2.inOut", stagger: 0.5 },
          1.3,
        )
        .from("[data-rule]", { scaleX: 0, transformOrigin: "0 50%", duration: 1.4, ease: "power2.inOut" }, 2.6)
        .from("[data-rest]", { autoAlpha: 0, y: 14, duration: 1.2, stagger: 0.12 }, 3);

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(bg, { scale: 1.12, yPercent: 6, ease: "none" }, 0)
        .to("[data-portrait]", { yPercent: -6, ease: "none" }, 0)
        .to(el.querySelector("[data-text]"), { y: -50, ease: "none" }, 0);
    });
  });

  return (
    <Root className={s.root}>
      <header ref={ref} className={s.hero}>
        <div className={s.panel} data-panel>
          <Backdrop
            wide="/lab/hero/e3-bia-tall.webp"
            className={s.bg}
            imgClassName={s.bgImg}
          />
          <div className={s.shade} aria-hidden />
          <div className={s.figure}>
            <Portrait className={s.portrait} />
          </div>
        </div>
        <div className={s.text} data-text>
          <h1 className={s.title}>
            <span className={s.hon} data-hon>
              {HERO.honorific}
            </span>
            <span className={s.name}>
              <NameWords wordClass={s.word} />
            </span>
          </h1>
          <span className={s.rule} aria-hidden data-rule />
          <div data-rest>
            <Dates className={s.dates} />
          </div>
          <p className={s.line} data-rest>
            {HERO.line}
          </p>
          <div data-rest>
            <ScrollCue className={s.cue} />
          </div>
        </div>
      </header>
      <Next tone="light" />
    </Root>
  );
}

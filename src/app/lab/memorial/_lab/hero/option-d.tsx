"use client";

// Hero option D, "Một đời" (a whole life). His name very large, and under it one line of his
// photographs with his portrait in the middle: the black-and-white years to the left (Moritzburg,
// a class, the young man), the colour years to the right (the reunions in Germany), each smaller
// the further it is from today. It opens as a contact sheet of the same photos, which gathers into
// that line (GSAP Flip); the colour comes back into the later years as they settle.
import { useRef, type CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { Flip } from "gsap/Flip";
import { classes } from "../cls";
import { Below, Img, LabNote, Letters, Shell, hero, pics, type Pic } from "./shared";
import { EASE, gsap, useHero } from "./motion";
import "./d.css";

const s = classes("lhd");

type Item = { pic: Pic; k: number; side: "past" | "now" | "centre"; slot?: string };
// k is the height relative to the portrait; the outermost two only show on wide screens.
const items: Item[] = [
  { pic: pics.moritzburg3, k: 0.3, side: "past", slot: "outer" },
  { pic: pics.moritzburg1, k: 0.4, side: "past" },
  { pic: pics.thanhxuan2, k: 0.52, side: "past" },
  { pic: pics.young, k: 0.7, side: "past" },
  { pic: { ...pics.portrait, pos: "50% 22%" }, k: 1, side: "centre" },
  { pic: pics.germany14, k: 0.7, side: "now" },
  { pic: pics.germany4, k: 0.52, side: "now" },
  { pic: pics.germany1, k: 0.4, side: "now" },
  { pic: pics.germany7, k: 0.3, side: "now", slot: "outer" },
];

export function OptionD() {
  const root = useRef<HTMLElement>(null);

  useHero(
    root,
    (q, el) => {
      gsap.registerPlugin(Flip);
      const cards = q(`.${s.item}`);
      // 1. A contact sheet: every photo the same height, in grey, printed one after another.
      el.classList.add(s.sheet);
      let flip: gsap.core.Timeline | undefined;
      const tl = gsap
        .timeline({ defaults: { ease: EASE.enter } })
        .fromTo(cards, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.05)
        // 2. The sheet gathers into one line, with his portrait at the centre.
        .add(() => {
          const state = Flip.getState(cards);
          el.classList.remove(s.sheet);
          flip = Flip.from(state, { duration: 1.5, ease: "expo.inOut", stagger: { each: 0.025, from: "center" } });
        }, 1.15)
        // 3. Colour returns to the later years; the name rises; the rest follows.
        .fromTo(q(`.${s.now} img`), { filter: "grayscale(1)" }, { filter: "grayscale(0)", duration: 1.6, ease: "power2.out" }, 2.2)
        .fromTo(q(`.${s.centre} img`), { filter: "grayscale(1)" }, { filter: "grayscale(0)", duration: 1.6, ease: "power2.out" }, 2.0)
        .fromTo(q(`.${s.axis}`), { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "expo.inOut" }, 2.1)
        .fromTo(q(`.${s.honorific}`), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 1.9)
        .fromTo(q(`.${s.char}`), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.04 }, 1.95)
        .fromTo(q(`.${s.foot} > *`), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 2.5);
      return () => {
        tl.kill();
        flip?.kill();
        el.classList.remove(s.sheet);
      };
    },
    (mm, q, el) => {
      // Scrolling away, the line opens a little: the past to the left, the present to the right.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
          .to(q(`.${s.past}`), { x: (i: number, t: Element, all: Element[]) => -(all.length - i) * 14, ease: "none" }, 0)
          .to(q(`.${s.now}`), { x: (i: number) => (i + 1) * 14, ease: "none" }, 0)
          .to(q(`.${s.name}`), { yPercent: -14, ease: "none" }, 0);
      });
    },
  );

  return (
    <Shell prefix="lhd">
      <header ref={root} className={s.hero} data-hero>
        <h1 className={s.name}>
          <span className="lhx-srOnly">
            {hero.honorific} {hero.name}
          </span>
          <span className={s.honorific} aria-hidden data-a>
            {hero.honorific}
          </span>
          <span className={s.nameText} data-a>
            <Letters text={hero.name} charClass={s.char} />
          </span>
        </h1>

        <div className={s.row} data-a>
          <span className={s.axis} aria-hidden />
          {(["past", "centre", "now"] as const).map((side) => {
            const figs = items
              .map((it, i) => ({ it, i }))
              .filter(({ it }) => it.side === side)
              .map(({ it, i }) => (
                <figure
                  key={i}
                  className={`${s.item} ${s[it.side]} ${it.slot ? s[it.slot] : ""}`}
                  style={{ "--k": it.k } as CSSProperties}
                >
                  <Img pic={it.pic} alt={side === "centre" ? hero.portraitAlt : ""} eager={side === "centre"} />
                </figure>
              ));
            // the portrait sits in the middle column, so it stays centred whatever the sides hold
            return side === "centre" ? figs : (
              <div key={side} className={`${s.side} ${side === "past" ? s.sidePast : s.sideNow}`}>
                {figs}
              </div>
            );
          })}
        </div>

        <div className={s.foot} data-a>
          <p className={s.title}>{hero.title}</p>
          <p className={s.dates}>{hero.dates}</p>
          <nav className={s.nav} aria-label={hero.jumpLabel}>
            <a href={hero.jump.book.href} className={s.primary}>
              {hero.jump.book.label}
              <ArrowDown aria-hidden size={20} strokeWidth={2.25} />
            </a>
            <a href={hero.jump.film.href} className={s.link}>
              {hero.jump.film.label}
            </a>
            <a href={hero.jump.life.href} className={s.link}>
              {hero.jump.life.label}
            </a>
          </nav>
        </div>
      </header>

      <Below tone="dark" />

      <LabNote id="d" name="Một đời · a whole life">
        <p>
          <b>What it tries.</b> His name as the monument, set very large, and under it one line of his life in his
          own photographs with his portrait at the centre: the black-and-white years to the left (Moritzburg 1955,
          a class, the young man), the colour years to the right (reunions with his students in Germany), each
          smaller the further it is from today, running off both edges of the screen. It opens as a contact sheet of
          the same photos, which gathers into that line (GSAP Flip), and colour returns to the later years as they
          settle. Scrolling away, the line opens a little.
        </p>
        <p>
          <b>Trade-offs.</b> The most editorial and the one that tells the most of his story before a word is read;
          the most &quot;designed&quot; too, and the least intimate (his face is one image among nine). The opening
          plays for about three seconds before the name stands, longer than the others. On a phone the outer photos
          are cut by the screen edges, on purpose.
        </p>
      </LabNote>
    </Shell>
  );
}

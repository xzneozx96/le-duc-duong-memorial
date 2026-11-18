"use client";

// Hero option D3, "Dệt chữ" (woven into his name). D's line of his life set inside the name
// itself: his photographs stand between the words like words of their own, read top to bottom as
// the years go by, black and white in "Lê" and "Đức", colour after "Dương", and his portrait closes
// the block at the right. On arrival the photographs open up between the words, pushing them apart.
import { useRef } from "react";
import { classes } from "../cls";
import { Below, Foot, Img, LabNote, Shell, hero, pics, type Pic } from "./shared";
import { EASE, gsap, useHero } from "./motion";
import "./d3.css";

const s = classes("lhd3");

/** A photograph set in the line at cap height, sitting on the baseline like a word. */
function Slot({ pic, now }: { pic: Pic; now?: boolean }) {
  return (
    <span className={`${s.slot} ${now ? s.now : s.past}`} style={{ aspectRatio: `${pic.w} / ${pic.h}` }}>
      <Img pic={pic} />
    </span>
  );
}

function Word({ text }: { text: string }) {
  return (
    <span className={s.wordMask}>
      <span className={s.word}>{text}</span>
    </span>
  );
}

export function OptionD3() {
  const root = useRef<HTMLElement>(null);

  useHero(
    root,
    (q) => {
      const tl = gsap.timeline({ defaults: { ease: EASE.enter } });
      tl.fromTo(q(`.${s.honorific}`), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 0.1)
        .fromTo(q(`.${s.word}`), { yPercent: 105 }, { yPercent: 0, duration: 1.3, stagger: 0.16 }, 0.2);
      // the photographs open between the words in reading order, pushing the letters apart
      (q(`.${s.slot}`) as HTMLElement[]).forEach((slot, i) => {
        const w = slot.offsetWidth;
        const m = parseFloat(getComputedStyle(slot).marginLeft);
        tl.fromTo(
          slot,
          { width: 0, marginLeft: 0, marginRight: 0 },
          { width: w, marginLeft: m, marginRight: m, duration: 1.3, ease: "expo.inOut", clearProps: "width,marginLeft,marginRight" },
          0.9 + i * 0.16,
        ).fromTo(slot.querySelector("img"), { scale: 1.35 }, { scale: 1, duration: 1.6, clearProps: "transform" }, 0.9 + i * 0.16);
      });
      tl.fromTo(q(`.${s.now} img`), { filter: "grayscale(1)" }, { filter: "grayscale(0)", duration: 1.4, ease: "power2.out" }, 2.1)
        .fromTo(q(".lhx-foot > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 2.0);
    },
    (mm, q, el) => {
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 900px)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
          .to(q(`.${s.portrait}`), { yPercent: -8, ease: "none" }, 0)
          .to(q(`.${s.lines}`), { yPercent: 4, ease: "none" }, 0);
      });
    },
  );

  return (
    <Shell prefix="lhd3">
      <header ref={root} className={s.hero} data-hero>
        <div className={s.block}>
          <h1 className={s.name}>
            <span className="lhx-srOnly">
              {hero.honorific} {hero.name}
            </span>
            <span className={s.honorific} aria-hidden data-a>
              {hero.honorific}
            </span>
            <span className={s.lines} aria-hidden data-a>
              <span className={s.line}>
                <Slot pic={pics.moritzburg1} />
                <Slot pic={pics.moritzburg3} />
                <Word text="Lê" />
              </span>
              <span className={s.line}>
                <Slot pic={pics.thanhxuan2} />
                <Slot pic={pics.young} />
                <Word text="Đức" />
              </span>
              <span className={s.line}>
                <Word text="Dương" />
                <Slot pic={pics.germany14} now />
                <Slot pic={pics.germany4} now />
              </span>
            </span>
          </h1>
          <figure className={s.portrait}>
            <Img pic={{ ...pics.portrait, pos: "50% 22%" }} alt={hero.portraitAlt} eager />
          </figure>
        </div>

        <Foot />
      </header>

      <Below tone="dark" />

      <LabNote id="d3" name="Dệt chữ · woven into his name">
        <p>
          <b>What it tries.</b> D&apos;s line of his life moved inside the name itself. His photographs stand
          between the words at the height of the capitals, like words of their own, and read top to bottom as the
          years go by: Moritzburg 1955 before &quot;Lê&quot;, a class and the young man before &quot;Đức&quot;,
          colour reunions after &quot;Dương&quot;, and his portrait closing the block at the right, as tall as the
          three lines. On arrival the words rise, then the photographs open between them and push the letters
          apart; colour comes into the last line.
        </p>
        <p>
          <b>Trade-offs.</b> The most typographic and the most unexpected of the five; the name is still read in
          one go because photos sit only between words, never inside them, and every letter keeps its marks clear.
          The photos are small (the height of a capital), so they work as signs of his years more than as pictures
          to look at. Photo order would need the family&apos;s eye.
        </p>
        <p>
          <b>Recommendation.</b> Worth it if the family wants the name itself to carry his life; less so for very small phones, where the photos in the lines get small.
        </p>
      </LabNote>
    </Shell>
  );
}

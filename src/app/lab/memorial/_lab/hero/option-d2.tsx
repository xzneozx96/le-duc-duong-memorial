"use client";

// Hero option D2, "Quạt ảnh" (the fanned prints). D's line of his life, held like a hand of
// prints: the portrait in front, the earlier prints fanned out behind it to the left in grey, the
// later ones to the right in colour, each overlapping the next and tilting a little more. On
// arrival they fan out from behind his portrait; scrolling away, they gather back behind him.
import { useRef, type CSSProperties } from "react";
import { classes } from "../cls";
import { BigName, Below, Foot, Img, LabNote, Shell, hero, pics, type Pic } from "./shared";
import { EASE, gsap, useHero } from "./motion";
import "./d2.css";

const s = classes("lhd2");

const K = [0.74, 0.58, 0.46, 0.36];
type Card = { pic: Pic; k: number; x: number; y: number; r: number; d: number; side: "past" | "now" };

/** Fixed fan geometry in units of the portrait's height: each print tucks 24% under the last. */
function fan(list: Pic[], side: Card["side"]): Card[] {
  const sign = side === "past" ? -1 : 1;
  let outer = 0.4; // half the portrait's width (4:5)
  return list.map((pic, d) => {
    const k = K[d];
    const w = (k * pic.w) / pic.h;
    const inner = outer - 0.24 * w;
    const x = inner + w / 2;
    outer = inner + w;
    return { pic, k, d, side, x: sign * x, y: 0.016 * (d + 1) ** 2, r: sign * 2.8 * (d + 1) };
  });
}
const cards = [
  ...fan([pics.young, pics.thanhxuan2, pics.moritzburg1, pics.moritzburg3], "past"),
  ...fan([pics.germany14, pics.germany4, pics.germany1, pics.germany7], "now"),
];

export function OptionD2() {
  const root = useRef<HTMLElement>(null);

  useHero(
    root,
    (q) => {
      const h = (q(`.${s.front}`)[0] as HTMLElement).offsetHeight;
      const els = q(`.${s.card}`) as HTMLElement[];
      const tl = gsap.timeline({ defaults: { ease: EASE.enter } });
      // the prints start squared up behind his portrait, then fan out, the nearest years first
      els.forEach((el) => {
        const c = cards[Number(el.dataset.i)];
        tl.fromTo(
          el,
          { x: -c.x * h, y: -c.y * h, rotation: -c.r, opacity: 0 },
          { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.7 },
          0.45 + c.d * 0.12,
        );
      });
      tl.fromTo(q(`.${s.now} img`), { filter: "grayscale(1)" }, { filter: "grayscale(0)", duration: 1.6, ease: "power2.out" }, 1.4)
        .fromTo(q(".lhx-honorific"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 0.2)
        .fromTo(q(".lhx-char"), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.04 }, 0.25)
        .fromTo(q(".lhx-foot > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 1.3);
    },
    (mm, q, el) => {
      // Scrolling away, the fan closes again behind him.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const front = q(`.${s.front}`)[0] as HTMLElement;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        });
        (q(`.${s.cardOut}`) as HTMLElement[]).forEach((w) => {
          const c = cards[Number(w.dataset.i)];
          tl.to(w, { x: () => -c.x * front.offsetHeight * 0.55, y: () => -c.y * front.offsetHeight * 0.55, rotation: -c.r * 0.55, ease: "none" }, 0);
        });
        tl.to(front, { scale: 0.94, ease: "none" }, 0);
      });
    },
  );

  return (
    <Shell prefix="lhd2">
      <header ref={root} className={s.hero} data-hero>
        <BigName />

        <div className={s.stage} data-a>
          {cards.map((c, i) => (
            <div
              key={i}
              className={`${s.cardOut} ${c.d === 3 ? s.outer : ""}`}
              data-i={i}
              style={
                {
                  "--x": c.x,
                  "--y": c.y,
                  "--r": c.r,
                  "--k": c.k,
                  zIndex: 10 - c.d,
                } as CSSProperties
              }
            >
              <div className={`${s.card} ${s[c.side]}`} data-i={i}>
                <div className={s.cardIn}>
                  <Img pic={c.pic} alt="" />
                </div>
              </div>
            </div>
          ))}
          <figure className={s.front}>
            <Img pic={{ ...pics.portrait, pos: "50% 22%" }} alt={hero.portraitAlt} eager />
          </figure>
        </div>

        <Foot />
      </header>

      <Below tone="dark" />

      <LabNote id="d2" name="Quạt ảnh · the fanned prints">
        <p>
          <b>What it tries.</b> D&apos;s line of his life held like a hand of prints. His portrait is the front
          print; the earlier years fan out behind it to the left in grey, the later years to the right in colour,
          each print tucked under the last and tilted a little more, so the line reads as something handled and
          kept rather than a gallery row. On arrival the prints fan out from behind his portrait, nearest years
          first, and colour comes into the later ones. Scrolling away, the fan closes again behind him. On a
          computer, a print lifts a little under the mouse.
        </p>
        <p>
          <b>Trade-offs.</b> Warmer and more tactile than D, still simple to read; the overlap hides part of each
          photo, so it shows his life as a whole more than any one moment. The tilt stays small on purpose (at most
          11°) so it never becomes a curve or a scattered collage.
        </p>
        <p>
          <b>Recommendation.</b> The strongest first screen of the five without any scrolling; my second choice after D4.
        </p>
      </LabNote>
    </Shell>
  );
}

"use client";

// Hero option D4, "Cuộn phim" (the reel). D's line of his life as one strip of film running across
// the screen, his portrait standing in the gate at the centre. The first screen is complete as it
// is: the earlier years in grey to the left, the later ones in colour to the right. Scrolling down
// winds the film back through the gate, and each earlier photograph, faded at first, comes back to
// its full tone as it passes him, until 1955 reaches the gate as the films section begins.
import { useRef } from "react";
import { classes } from "../cls";
import { BigName, Below, Foot, Img, LabNote, Shell, hero, pics, type Pic } from "./shared";
import { EASE, gsap, useHero } from "./motion";
import "./d4.css";

const s = classes("lhd4");

const past: Pic[] = [pics.moritzburg1, pics.moritzburg3, pics.young, pics.thanhxuan2, pics.thanhxuan1];
const now: Pic[] = [pics.germany14, pics.germany4, pics.germany1, pics.germany7, pics.germany12, pics.germany2];

function Frame({ pic, kind }: { pic: Pic; kind: "past" | "now" }) {
  return (
    <figure className={`${s.frame} ${s[kind]}`} style={{ aspectRatio: `${pic.w} / ${pic.h}` }} data-frame={kind}>
      <Img pic={pic} className={s.base} />
      {kind === "past" ? <Img pic={pic} className={s.colour} /> : null}
    </figure>
  );
}

export function OptionD4() {
  const root = useRef<HTMLElement>(null);

  useHero(
    root,
    (q) => {
      gsap
        .timeline({ defaults: { ease: EASE.enter } })
        .fromTo(q(".lhx-honorific"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 0.1)
        .fromTo(q(".lhx-char"), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.04 }, 0.15)
        // the film is threaded in from the right and runs to a stop with him in the gate
        .fromTo(q(`.${s.reel}`), { xPercent: 60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 2.2, ease: "power3.out" }, 0.2)
        .fromTo(q(`.${s.gate}`), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.2 }, 1.5)
        .fromTo(q(".lhx-foot > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 1.4);
    },
    (mm, q, el) => {
      // Scroll winds the film back: each faded earlier photograph comes back to full tone at the gate.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = q(`.${s.track}`)[0] as HTMLElement;
        const band = q(`.${s.band}`)[0] as HTMLElement;
        const frames = q(`[data-frame="past"]`) as HTMLElement[];
        // layout positions in the band (frames are positioned, so offsetLeft ignores every transform)
        const centre = (f: HTMLElement) => f.offsetLeft + f.offsetWidth / 2;
        const gate = () => band.offsetWidth / 2;
        const run = () => gate() - centre(frames[0]);
        const span = run();
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
        });
        tl.to(track, { x: run, duration: 1, ease: "none" }, 0);
        frames.forEach((f) => {
          const at = Math.min(0.94, Math.max(0, (gate() - centre(f)) / span - 0.08));
          tl.fromTo(f.querySelector(`.${s.colour}`), { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "none" }, at);
        });
      });
    },
  );

  return (
    <Shell prefix="lhd4">
      <header ref={root} className={s.hero} data-hero>
        <BigName />

        <div className={s.band} data-a>
          <div className={s.reel}>
            <div className={s.track}>
              <div className={`${s.side} ${s.sidePast}`}>
                {past.map((p) => (
                  <Frame key={p.src} pic={p} kind="past" />
                ))}
              </div>
              <figure className={`${s.frame} ${s.centre}`}>
                <Img pic={{ ...pics.portrait, pos: "50% 22%" }} alt={hero.portraitAlt} eager />
              </figure>
              <div className={`${s.side} ${s.sideNow}`}>
                {now.map((p) => (
                  <Frame key={p.src} pic={p} kind="now" />
                ))}
              </div>
            </div>
          </div>
          <div className={s.gate} aria-hidden />
        </div>

        <Foot />
      </header>

      <Below tone="dark" />

      <LabNote id="d4" name="Cuộn phim · the reel">
        <p>
          <b>What it tries.</b> D&apos;s line of his life as one strip of film on a dark band across the screen,
          his portrait standing in the gate at the centre, earlier years faded to the left and later years in
          colour to the right. The first screen is complete without scrolling. Scrolling down winds the film back
          through the gate, and each faded earlier photograph comes back to its full tone as it passes him (the
          archive prints to their warm black and white, the family photo to its colour), so the reader brings his
          past back into focus; when Moritzburg 1955 reaches the gate the dark band hands over to the films
          (&quot;Thước phim&quot;), where his own voice begins. On arrival the film is threaded in from the right.
        </p>
        <p>
          <b>Trade-offs.</b> The strongest scroll idea and the clearest link into the films; it depends on
          scrolling, so a reader who never scrolls sees D with a film border. Film sprocket holes are a familiar
          motif, kept small and quiet. Most of the archive photos are black and white, so the change is one of tone
          and contrast more than colour; it reads clearly at the gate but is gentle. With reduced motion the strip stands still.
        </p>
        <p>
          <b>Recommendation.</b> My pick of the five. The first screen is D, finished and calm; the scroll adds a meaning (bringing his past back into focus) and leads straight into his films.
        </p>
      </LabNote>
    </Shell>
  );
}

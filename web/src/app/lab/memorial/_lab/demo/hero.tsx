"use client";

// The first screen, set like the title page of a book about him: his portrait (cut from its
// studio backdrop) stands in a forest panel, and his name stands either side of it. On arrival
// the panel rises and he comes up into it (stylesheet, from the first paint), then the letters of
// his name leave the portrait outward and the hairline under the page draws (GSAP).
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { classes } from "../cls";
import { person, type Lang, type Strings } from "./content";
import { EASE, MOVE, gsap, useMotion } from "./motion";

const s = classes("lm");

/** The name is set letter by letter on the server, so the entrance needs no re-split. */
function Word({ text, className }: { text: string; className: string }) {
  const letters = Array.from(text.normalize("NFC"));
  return (
    <span className={className} aria-hidden>
      {letters.map((ch, i) => (
        <span key={i} className={s.char}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export function Hero({ lang, t }: { lang: Lang; t: Strings }) {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (mm, el) => {
    // The portrait's own entrance is in the stylesheet, so his face is there from the first paint.
    // The name, rule and words wait for the script for a moment and show by themselves after
    // 1.4 s; if the script is later than that, they are already there and do not play again.
    const late = performance.now() > 1300;
    el.dataset.live = "";
    mm.add(MOVE, () => {
      const q = gsap.utils.selector(el);
      if (!late) {
        const letter = { opacity: 0, yPercent: 26, filter: "blur(12px)" };
        const settled = { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1.5, ease: EASE.enter };
        // Timed from the page's start, so the letters follow the portrait whenever the script lands.
        gsap
          .timeline({ delay: Math.max(0, 0.8 - performance.now() / 1000) })
          .fromTo(q(`.${s.heroRule}`), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0)
          .fromTo(q(`.${s.nameA} .${s.char}`), letter, { ...settled, stagger: { each: 0.075, from: "end" } }, 0.15)
          .fromTo(q(`.${s.nameB} .${s.char}`), letter, { ...settled, stagger: { each: 0.075, from: "start" } }, 0.15)
          .fromTo(q("[data-intro]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: EASE.soft }, 0.6);
      }
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(q(`.${s.heroFigure} img`), { yPercent: 7, ease: "none" }, 0)
        .to(q(`.${s.nameA}`), { xPercent: -6, ease: "none" }, 0)
        .to(q(`.${s.nameB}`), { xPercent: 6, ease: "none" }, 0);
    });
  });

  return (
    <header ref={root} className={s.hero}>
      <h1 className={s.name} lang="vi">
        <span className={s.srOnly}>
          {t.honorific} {person.name}
        </span>
        <span className={s.honorific} aria-hidden data-intro>
          {t.honorific}
        </span>
        <Word text="Lê Đức" className={s.nameA} /> <Word text="Dương" className={s.nameB} />
      </h1>
      <p className={s.heroTitle} lang={lang} data-intro>
        {t.title}
      </p>

      <figure className={s.heroFigure}>
        <div className={s.panel} aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={person.portrait.src}
          width={person.portrait.w}
          height={person.portrait.h}
          alt={t.portraitAlt}
          loading="eager"
          fetchPriority="high"
        />
      </figure>
      <span className={s.heroRule} aria-hidden />

      <div className={s.heroFoot}>
        <p className={s.heroDates} data-intro>
          <span>{person.born}</span>
          <span aria-hidden className={s.heroDash} />
          <span>{person.died}</span>
        </p>
        <nav className={s.jumps} aria-label={t.jumpLabel} data-intro>
          <a href="#book" className={s.jumpMain}>
            {t.jump.book}
            <ArrowDown aria-hidden size={20} strokeWidth={2.25} />
          </a>
          <a href="#film">{t.jump.film}</a>
          <a href="#journey">{t.jump.journey}</a>
        </nav>
      </div>
    </header>
  );
}

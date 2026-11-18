"use client";

// The client demo of the memorial page, fourth look: a book of his life.
// A title page (his portrait breaking out of a forest panel, his name either side of his face),
// his own voice in the two films, his life as one line that fills as you read, and the Lưu bút,
// an open notebook in which the people who knew him keep writing. A lab route, not product code.
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Play, X } from "lucide-react";
import { classes } from "../cls";
import { OptionA as GuestBook } from "../book/a";
import { BookEmbed } from "../book/parts";
import "../book/book.css";
import { FAMILY_EMAIL, films, sourceLinks, ui, type Lang, type Strings } from "./content";
import { demoFontVars } from "./fonts";
import { Hero } from "./hero";
import { Journey } from "./journey";
import { EASE, MOVE, gsap, useMotion, useRefreshOnResize } from "./motion";
import { ViewerProvider } from "./viewer";
import "./memorial.css";

const s = classes("lm");

function Film({ index, lang, t, onPlay }: { index: number; lang: Lang; t: Strings; onPlay: (i: number, from: HTMLElement) => void }) {
  const film = films[index];
  return (
    <div className={s.film} data-index={index}>
      <button
        type="button"
        className={s.filmButton}
        aria-label={`${t.filmPlay}: ${film.title}`}
        aria-haspopup="dialog"
        onClick={(e) => onPlay(index, e.currentTarget)}
      >
        <span className={s.filmMask} data-film-mask>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={film.poster.src}
            width={film.poster.w}
            height={film.poster.h}
            alt=""
            loading="lazy"
            style={{ objectPosition: film.poster.pos }}
            data-film-img
          />
        </span>
        <span className={s.filmText}>
          <span className={s.filmMeta}>
            <span>{film.part[lang]}</span>
            <span>{film.date}</span>
          </span>
          <span className={s.filmTitle} lang={film.lang}>
            {film.title}
          </span>
          <span className={s.play}>
            <span className={s.playDisc}>
              <Play aria-hidden size={22} strokeWidth={2} fill="currentColor" />
            </span>
            {t.filmPlay}
          </span>
        </span>
      </button>
    </div>
  );
}

// The film plays in a popup over the page: a native modal dialog, so focus stays inside, Escape
// closes it and the page behind is inert. The YouTube frame only exists while the popup is open,
// so closing it stops the film. Clicking the dark backdrop closes it too.
function FilmDialog({ index, onClose }: { index: number | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const film = index === null ? null : films[index];
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (film && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!film && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [film]);

  return (
    <dialog
      ref={dialog}
      className={s.filmDialog}
      aria-label={film?.title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {film && (
        <div className={s.filmDialogBox}>
          <button type="button" className={s.filmClose} onClick={onClose} aria-label="Đóng" autoFocus>
            <X aria-hidden size={28} strokeWidth={2} />
          </button>
          <div className={s.filmPlayer}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0`}
              title={film.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
          <p className={s.filmDialogTitle} lang={film.lang}>
            {film.title}
          </p>
        </div>
      )}
    </dialog>
  );
}

function Films({ lang, t }: { lang: Lang; t: Strings }) {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const play = (i: number, from: HTMLElement) => {
    opener.current = from;
    setPlaying(i);
  };
  const close = () => {
    setPlaying(null);
    opener.current?.focus();
  };
  useMotion(root, (mm, el) => {
    mm.add(MOVE, () => {
      el.querySelectorAll<HTMLElement>("[data-film-mask]").forEach((mask, i) => {
        gsap.fromTo(
          mask,
          { clipPath: "inset(18% 12% 18% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            delay: i * 0.12,
            ease: EASE.enter,
            scrollTrigger: { trigger: mask.parentElement, start: "top 88%", once: true },
          },
        );
        const img = mask.querySelector("[data-film-img]");
        if (img)
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.14 },
            { yPercent: 6, scale: 1.14, ease: "none", scrollTrigger: { trigger: mask, start: "top bottom", end: "bottom top", scrub: true } },
          );
      });
    });
  });
  return (
    <section ref={root} id="film" className={s.films} aria-labelledby="film-h">
      <div className={s.wrap}>
        <div className={s.filmsHead}>
          <h2 id="film-h" className={s.h2}>
            {t.filmHeading}
          </h2>
          <p className={s.lede}>{t.filmLine}</p>
        </div>
        <div className={s.filmRow}>
          <Film index={0} lang={lang} t={t} onPlay={play} />
          <Film index={1} lang={lang} t={t} onPlay={play} />
        </div>
        <FilmDialog index={playing} onClose={close} />
      </div>
    </section>
  );
}

export function DemoPage() {
  // Vietnamese only for now; the German strings stay in content.ts for later.
  const lang: Lang = "vi";
  const t = ui[lang];
  const main = useRef<HTMLElement>(null);
  useRefreshOnResize(main);

  return (
    <div id="top" className={`${s.page} ${demoFontVars}`}>
      <ViewerProvider t={t.viewer}>

        <Hero lang={lang} t={t} />

        <main ref={main}>
          <Films lang={lang} t={t} />
          <Journey lang={lang} t={t} />
          {/* the approved Lưu bút: guestbook option A (envelope carousel, letters in a bottom sheet) */}
          <BookEmbed>
            <GuestBook />
          </BookEmbed>
        </main>

        <footer className={s.footer}>
          <div className={s.wrap}>
            <h2 className={s.footerHead}>{t.footerHeading}</h2>
            <ul className={s.sources}>
              {sourceLinks.map((href, i) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener">
                    <span>{t.sources[i]}</span>
                    <ArrowUpRight aria-hidden size={26} strokeWidth={1.75} />
                    <span className={s.srOnly}> {t.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className={s.footerEnd}>
              <p className={s.family}>{t.family(FAMILY_EMAIL)}</p>
              <div className={s.footerRow}>
                <a href="#top" className={s.toTop}>
                  <ArrowUp aria-hidden size={20} strokeWidth={2.25} />
                  {t.toTop}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </ViewerProvider>
    </div>
  );
}

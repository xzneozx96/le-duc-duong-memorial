"use client";

// The two 2020 interviews. Each card opens the film in a popup over the page (a native modal
// dialog); the YouTube frame exists only while the popup is open.
import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { classes } from "../cls";
import { films, type Lang, type Strings } from "./content";

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
      data-lenis-prevent
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

/** The two 2020 interviews, placed inside the 1988–2026 station: the year he told his story. */
export function Films({ lang, t }: { lang: Lang; t: Strings }) {
  const root = useRef<HTMLDivElement>(null);
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
  // No entrance of its own: the posters hold still for reading (clip-path reveals measured as
  // the main cause of scroll jank on phones).
  return (
    <div ref={root} id="film" className={s.filmsInline} role="group" aria-labelledby="film-h">
      <h4 id="film-h" className={s.filmsInlineHead} data-reveal>
        {t.filmHeading}
      </h4>
      <p className={s.story} data-reveal>
        {t.filmLine}
      </p>
      <div className={s.filmRow}>
        <Film index={0} lang={lang} t={t} onPlay={play} />
        <Film index={1} lang={lang} t={t} onPlay={play} />
      </div>
      <FilmDialog index={playing} onClose={close} />
    </div>
  );
}

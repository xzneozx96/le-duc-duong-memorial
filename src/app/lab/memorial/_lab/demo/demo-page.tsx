"use client";

// The client demo of the memorial page in direction B, the night train: every section of the
// one-page site, in Vietnamese and German, with sample texts. A lab route, not product code.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Play } from "lucide-react";
import { classes } from "../cls";
import { fontVars } from "../fonts";
import { LangSwitch } from "../parts";
import { Book } from "./book";
import {
  FAMILY_EMAIL,
  films,
  person,
  sourceLinks,
  ui,
  type Lang,
  type Strings,
} from "./content";
import { useDemoLang } from "./lang";
import { Timeline } from "./timeline";
import { ViewerProvider } from "./viewer";
import "./demo.css";

const s = classes("ld");

const FILM_DATES = ["06.09.2020", "13.09.2020"];
const FILM_LANGS = ["de", "en"];

function Film({ index, lang, t }: { index: number; lang: Lang; t: Strings }) {
  const film = films[index];
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (playing) frame.current?.focus();
  }, [playing]);

  if (playing) {
    return (
      <div className={s.film} data-playing>
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0`}
          title={film.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button
      type="button"
      className={s.film}
      aria-label={`${t.filmPlay}: ${film.title}`}
      onClick={() => setPlaying(true)}
    >
      <span className={s.filmTop}>
        <span className={s.filmPart}>{film.part[lang]}</span>
        <span className={s.filmDate}>{FILM_DATES[index]}</span>
      </span>
      <span className={s.filmTitle} lang={FILM_LANGS[index]}>
        {film.title}
      </span>
      <span className={s.play}>
        <Play aria-hidden size={22} strokeWidth={2} fill="currentColor" />
        {t.filmPlay}
      </span>
    </button>
  );
}

export function DemoPage() {
  const [lang, setLang] = useDemoLang();
  const t = ui[lang];

  return (
    <div id="top" className={`${s.page} ${fontVars}`}>
      <ViewerProvider t={t.viewer}>
        <aside className={s.labBar} aria-label="Lab">
          <p>{t.labBar}</p>
          <Link href="/lab/memorial">{t.labHome}</Link>
        </aside>

        <header className={s.header}>
          <div className={s.portraitWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={person.portrait.src}
              width={person.portrait.w}
              height={person.portrait.h}
              alt={person.name}
              loading="eager"
              fetchPriority="high"
              className={s.portrait}
            />
          </div>
          <div className={s.headText}>
            <LangSwitch
              lang={lang}
              onChange={setLang}
              className={s.langSwitch}
              activeClassName={s.langActive}
            />
            <p className={s.years}>{person.years}</p>
            <h1 className={s.name} lang="vi">
              <span>Lê Đức</span> <span>Dương</span>
            </h1>
            <p className={s.title} lang={lang}>
              {t.title}
            </p>
            <p className={s.intro}>{t.intro}</p>
            <nav className={s.jumps} aria-label={t.jumpLabel}>
              <a href="#film">{t.jump.film}</a>
              <a href="#journey">{t.jump.journey}</a>
              <a href="#book">{t.jump.book}</a>
            </nav>
          </div>
        </header>

        <main>
          <section id="film" className={s.films} aria-labelledby="film-h">
            <div className={s.filmsHead}>
              <h2 id="film-h" className={s.sectionHead}>
                {t.filmHeading}
              </h2>
              <p className={s.filmLine}>{t.filmLine}</p>
            </div>
            <div className={s.filmRow}>
              <Film index={0} lang={lang} t={t} />
              <Film index={1} lang={lang} t={t} />
            </div>
            <p className={s.note}>{t.filmNote}</p>
          </section>

          <Timeline lang={lang} t={t} />
          <Book t={t} />
        </main>

        <footer className={s.footer}>
          <div className={s.footerInner}>
            <h2 className={s.sectionHead}>{t.footerHeading}</h2>
            <ul className={s.sources}>
              {sourceLinks.map((href, i) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener">
                    <span>{t.sources[i]}</span>
                    <ArrowUpRight aria-hidden size={24} strokeWidth={2} />
                    <span className={s.srOnly}> {t.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className={s.footerEnd}>
            <p className={s.family}>{t.family(FAMILY_EMAIL)}</p>
            <div className={s.footerRow}>
              <LangSwitch
                lang={lang}
                onChange={setLang}
                className={s.langSwitch}
                activeClassName={s.langActive}
              />
              <a href="#top" className={s.toTop}>
                <ArrowUp aria-hidden size={24} strokeWidth={2} />
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

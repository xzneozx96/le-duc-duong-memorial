"use client";

// The client demo of the memorial page, third look (after the Farewell reference): Cormorant,
// Lora, warm off-whites and bronze. His portrait rises out of its own studio backdrop, and one
// bronze line then carries a small sun down the page between Việt Nam and Germany.
// A lab route, not product code.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpRight, Play } from "lucide-react";
import { classes } from "../cls";
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
import { demoFontVars } from "./fonts";
import { useDemoLang } from "./lang";
import { Timeline } from "./timeline";
import { ViewerProvider } from "./viewer";
import "./memorial.css";

const s = classes("lm");

const FILM_DATES = ["06.09.2020", "13.09.2020"];
const FILM_LANGS = ["de", "en"];
/** The word of the title that carries his name: Dương is the sun. */
const TITLE_WORD: Record<Lang, string> = { vi: "Dương", de: "Sonnenstrahl" };

function Title({ lang, text }: { lang: Lang; text: string }) {
  const word = TITLE_WORD[lang];
  const at = text.indexOf(word);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <em>{word}</em>
      {text.slice(at + word.length)}
    </>
  );
}

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
        <span>{film.part[lang]}</span>
        <span>{FILM_DATES[index]}</span>
      </span>
      <span className={s.filmTitle} lang={FILM_LANGS[index]}>
        {film.title}
      </span>
      <span className={s.play}>
        <span className={s.playDisc}>
          <Play aria-hidden size={20} strokeWidth={2} fill="currentColor" />
        </span>
        {t.filmPlay}
      </span>
    </button>
  );
}

export function DemoPage() {
  const [lang, setLang] = useDemoLang();
  const t = ui[lang];

  return (
    <div id="top" className={`${s.page} ${demoFontVars}`}>
      <ViewerProvider t={t.viewer}>
        <aside className={s.labBar} aria-label="Lab">
          <p>{t.labBar}</p>
          <Link href="/lab/memorial">{t.labHome}</Link>
        </aside>

        <header className={s.hero}>
          <div className={s.heroPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={person.portrait.src}
              width={person.portrait.w}
              height={person.portrait.h}
              alt={person.name}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className={s.heroInner}>
            <LangSwitch
              lang={lang}
              onChange={setLang}
              className={s.langSwitch}
              activeClassName={s.langActive}
            />
            <div className={s.heroText}>
              <p className={s.heroYears}>{person.years}</p>
              <h1 className={s.name} lang="vi">
                <span className={s.nameLine}>
                  <span>Lê Đức</span>
                </span>{" "}
                <span className={s.nameLine}>
                  <span>Dương</span>
                </span>
              </h1>
              <p className={s.heroTitle} lang={lang}>
                <Title lang={lang} text={t.title} />
              </p>
              <p className={s.intro}>{t.intro}</p>
              <nav className={s.jumps} aria-label={t.jumpLabel}>
                <a href="#book" className={s.jumpMain}>
                  {t.jump.book}
                  <ArrowDown aria-hidden size={20} strokeWidth={2.25} />
                </a>
                <a href="#film">{t.jump.film}</a>
                <a href="#journey">{t.jump.journey}</a>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <section id="film" className={s.films} aria-labelledby="film-h">
            <div className={s.wrap}>
              <div className={s.filmsHead}>
                <h2 id="film-h" className={s.h2}>
                  {t.filmHeading}
                </h2>
                <p className={s.lede}>{t.filmLine}</p>
              </div>
              <div className={s.filmRow}>
                <Film index={0} lang={lang} t={t} />
                <Film index={1} lang={lang} t={t} />
              </div>
              <p className={s.note}>{t.filmNote}</p>
            </div>
          </section>

          <Timeline lang={lang} t={t} />
          <Book t={t} />
        </main>

        <footer className={s.footer}>
          <div className={s.wrap}>
            <h2 className={s.footerHead}>{t.footerHeading}</h2>
            <ul className={s.sources}>
              {sourceLinks.map((href, i) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener">
                    <span>{t.sources[i]}</span>
                    <ArrowUpRight aria-hidden size={24} strokeWidth={1.75} />
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

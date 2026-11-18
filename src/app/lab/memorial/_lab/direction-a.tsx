"use client";

// Direction A, the family album (ux.md, Round 1). Paper, ink, oxblood plates, mounted prints with
// drawn photo corners, a double rail with sleepers, and a sticky album layout on wide screens.
import { entries, person, stations, ui, type Lang, type Photo } from "./content";
import { ClipFacade, EntryText, FILM_IDS, FilmFacade, LabBar, LangSwitch, Reach, useLang } from "./parts";
import "./a.css";
import { classes } from "./cls";
import { fontVars } from "./fonts";

const s = classes("la");

function Print({ photo, lang, large, eager }: { photo: Photo; lang: Lang; large?: boolean; eager?: boolean }) {
  return (
    <figure className={`${s.print} ${large ? s.printLarge : ""}`}>
      <div className={s.mount}>
        <span className={s.corner} data-c="tl" aria-hidden />
        <span className={s.corner} data-c="tr" aria-hidden />
        <span className={s.corner} data-c="bl" aria-hidden />
        <span className={s.corner} data-c="br" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} width={photo.w} height={photo.h} alt={photo.caption[lang]} loading={eager ? "eager" : "lazy"} />
      </div>
      <figcaption className={s.caption}>
        {photo.caption[lang]}
        {photo.credit && <span className={s.credit}>{photo.credit[lang]}</span>}
      </figcaption>
    </figure>
  );
}

function Rail() {
  return (
    <svg className={s.railSvg} aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id="a-sleepers" width="40" height="22" patternUnits="userSpaceOnUse">
          <rect x="6" y="8" width="28" height="5" rx="1" fill="#b9a993" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="40" height="100%" fill="url(#a-sleepers)" />
      <line x1="13" y1="0" x2="13" y2="100%" stroke="#4a3f36" strokeWidth="2.5" />
      <line x1="27" y1="0" x2="27" y2="100%" stroke="#4a3f36" strokeWidth="2.5" />
    </svg>
  );
}

export function DirectionA() {
  const [lang, setLang] = useLang();
  const t = ui[lang];
  return (
    <div className={`${s.page} ${fontVars}`}>
      <LabBar current="a" lang={lang} />

      <header className={s.header}>
        <div className={s.topRow}>
          <LangSwitch lang={lang} onChange={setLang} className={s.langSwitch} activeClassName={s.langActive} />
        </div>
        <div className={s.headerGrid}>
          <figure className={`${s.print} ${s.portrait}`}>
            <div className={s.mount}>
              <span className={s.corner} data-c="tl" aria-hidden />
              <span className={s.corner} data-c="tr" aria-hidden />
              <span className={s.corner} data-c="bl" aria-hidden />
              <span className={s.corner} data-c="br" aria-hidden />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={person.portrait.src} width={person.portrait.w} height={person.portrait.h} alt={person.name} loading="eager" fetchPriority="high" />
            </div>
          </figure>
          <div className={s.headText}>
            <h1 className={s.name} lang="vi">
              {person.name}
            </h1>
            <p className={s.years}>{person.years}</p>
            <p className={s.title} lang={lang}>
              {t.title}
            </p>
            <p className={s.intro}>{t.intro}</p>
            <nav className={s.jumps} aria-label={t.journeyHeading}>
              <a href="#a-film">{t.jump.film}</a>
              <a href="#a-journey">{t.jump.journey}</a>
              <a href="#a-book">{t.jump.book}</a>
            </nav>
          </div>
        </div>
      </header>

      <section id="a-film" className={s.films} aria-labelledby="a-film-h">
        <h2 id="a-film-h" className={s.sectionHead}>
          {t.filmHeading}
        </h2>
        <div className={s.filmRow}>
          {t.films.map((f, i) => (
            <FilmFacade key={f.title} id={FILM_IDS[i]} title={f.title} part={f.length} playLabel={t.play} className={s.film} />
          ))}
        </div>
        <p className={s.note}>{t.filmNote}</p>
      </section>

      <section id="a-journey" className={s.journey} aria-labelledby="a-journey-h">
        <h2 id="a-journey-h" className={s.sectionHead}>
          {t.journeyHeading}
        </h2>
        <ol className={s.stations}>
          {stations.map((st, si) => (
            <Reach key={st.id} as="li" className={`${s.station} ${si === stations.length - 1 ? s.stationLast : ""}`}>
              <div className={s.railCell}>
                <Rail />
                <span className={s.marker} aria-hidden />
              </div>
              <div className={s.stationText}>
                <div className={s.sticky}>
                  <p className={s.stationYears}>{st.years}</p>
                  <h3 className={s.board}>
                    <span lang="vi">{st.vi}</span>
                    <span lang="de">{st.de}</span>
                  </h3>
                  <p className={s.body}>{st.text[lang]}</p>
                </div>
              </div>
              <div className={s.prints}>
                {st.clip && (
                  <figure className={`${s.print} ${s.printLarge}`}>
                    <div className={s.mount}>
                      <ClipFacade
                        poster={st.clip.poster}
                        src={st.clip.src}
                        w={st.clip.w}
                        h={st.clip.h}
                        label={st.clip.button[lang]}
                        className={s.clipMedia}
                        buttonClassName={s.clipButton}
                      />
                    </div>
                    <figcaption className={s.caption}>{st.clip.caption[lang]}</figcaption>
                  </figure>
                )}
                {st.photos.slice(0, st.clip ? 3 : 5).map((p, i) => (
                  <Print key={p.src} photo={p} lang={lang} large={!st.clip && i === 0} />
                ))}
                {st.photos.length > (st.clip ? 3 : 5) && (
                  <button type="button" className={s.more}>
                    {t.morePhotos(st.photos.length - (st.clip ? 3 : 5) + 9)}
                  </button>
                )}
                {st.clip && (
                  <button type="button" className={s.more}>
                    {t.morePhotos(9)}
                  </button>
                )}
              </div>
            </Reach>
          ))}
        </ol>
      </section>

      <section id="a-book" className={s.book} aria-labelledby="a-book-h">
        <div className={s.bookInner}>
          <h2 id="a-book-h" className={s.bookHead}>
            {t.bookHeading}
          </h2>
          <p className={s.body}>{t.bookInvite}</p>
          <button type="button" className={s.primary}>
            {t.bookOpen}
          </button>
          <ol className={s.entries}>
            {entries.map((e) => (
              <li key={e.name} className={s.entry}>
                <EntryText paragraphs={e.paragraphs} lang={e.lang} pageLang={lang} clampAt={2} buttonClassName={s.textButton} />
                <p className={s.signature} lang={e.lang === "vi" ? "vi" : "de"}>
                  {e.name}
                </p>
                <p className={s.meta}>
                  {t.relation[e.relation]}
                  {"cls" in e && e.cls ? ` · ${e.cls}, ${e.year}` : ""} · {t.sentOn(e.date)}
                </p>
              </li>
            ))}
          </ol>
          <button type="button" className={s.secondary}>
            {t.moreEntries(20)}
          </button>
        </div>
      </section>
    </div>
  );
}

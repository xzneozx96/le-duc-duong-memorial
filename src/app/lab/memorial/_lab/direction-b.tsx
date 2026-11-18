"use client";

// Direction B, the night train (ux.md, Round 1). Near-black ground, warm light text, the archive
// photos as film frames edge to edge, white enamel signs hung from one rail, bright amber title.
import { entries, person, stations, ui, type Lang, type Photo } from "./content";
import { ClipFacade, EntryText, FILM_IDS, FilmFacade, LabBar, LangSwitch, Reach, useLang } from "./parts";
import "./b.css";
import { classes } from "./cls";
import { fontVars } from "./fonts";

const s = classes("lb");

function Frame({ photo, lang, lead }: { photo: Photo; lang: Lang; lead?: boolean }) {
  return (
    <figure className={lead ? s.lead : s.frame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} width={photo.w} height={photo.h} alt={photo.caption[lang]} loading="lazy" />
      <figcaption className={s.caption}>
        {photo.caption[lang]}
        {photo.credit && <span className={s.credit}>{photo.credit[lang]}</span>}
      </figcaption>
    </figure>
  );
}

export function DirectionB() {
  const [lang, setLang] = useLang();
  const t = ui[lang];
  return (
    <div className={`${s.page} ${fontVars}`}>
      <LabBar current="b" lang={lang} />

      <header className={s.header}>
        <div className={s.portraitWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={person.portrait.src} width={person.portrait.w} height={person.portrait.h} alt={person.name} loading="eager" fetchPriority="high" className={s.portrait} />
        </div>
        <div className={s.headText}>
          <LangSwitch lang={lang} onChange={setLang} className={s.langSwitch} activeClassName={s.langActive} />
          <p className={s.years}>{person.years}</p>
          <h1 className={s.name} lang="vi">
            {person.name}
          </h1>
          <p className={s.title} lang={lang}>
            {t.title}
          </p>
          <p className={s.intro}>{t.intro}</p>
          <nav className={s.jumps} aria-label={t.journeyHeading}>
            <a href="#b-film">{t.jump.film}</a>
            <a href="#b-journey">{t.jump.journey}</a>
            <a href="#b-book">{t.jump.book}</a>
          </nav>
        </div>
      </header>

      <section id="b-film" className={s.films} aria-labelledby="b-film-h">
        <h2 id="b-film-h" className={s.sectionHead}>
          {t.filmHeading}
        </h2>
        <div className={s.filmRow}>
          {t.films.map((f, i) => (
            <FilmFacade key={f.title} id={FILM_IDS[i]} title={f.title} part={f.length} playLabel={t.play} className={s.film} />
          ))}
        </div>
        <p className={s.note}>{t.filmNote}</p>
      </section>

      <section id="b-journey" className={s.journey} aria-labelledby="b-journey-h">
        <h2 id="b-journey-h" className={`${s.sectionHead} ${s.journeyHead}`}>
          {t.journeyHeading}
        </h2>
        {stations.map((st) => {
          const lead = st.photos[0];
          const rest = st.photos.slice(1);
          return (
            <Reach key={st.id} as="section" className={s.station}>
              <Frame photo={lead} lang={lang} lead />
              <div className={s.stopRow}>
                <div className={s.rail} aria-hidden>
                  <span className={s.bracket} />
                </div>
                <div className={s.stopText}>
                  <h3 className={s.sign}>
                    <span lang="vi">{st.vi}</span>
                    <span lang="de">{st.de}</span>
                  </h3>
                  <p className={s.stopYears}>{st.years}</p>
                  <p className={s.body}>{st.text[lang]}</p>
                  {st.clip && (
                    <figure className={s.clip}>
                      <ClipFacade
                        poster={st.clip.poster}
                        src={st.clip.src}
                        w={st.clip.w}
                        h={st.clip.h}
                        label={st.clip.button[lang]}
                        className={s.clipMedia}
                        buttonClassName={s.clipButton}
                      />
                      <figcaption className={s.caption}>{st.clip.caption[lang]}</figcaption>
                    </figure>
                  )}
                </div>
              </div>
              <div className={s.sheet}>
                {rest.map((p) => (
                  <Frame key={p.src} photo={p} lang={lang} />
                ))}
              </div>
              <div className={s.sheetMore}>
                <button type="button" className={s.ghost}>
                  {t.morePhotos(9)}
                </button>
              </div>
            </Reach>
          );
        })}
      </section>

      <section id="b-book" className={s.book} aria-labelledby="b-book-h">
        <div className={s.bookInner}>
          <h2 id="b-book-h" className={s.bookHead}>
            {t.bookHeading}
          </h2>
          <p className={s.body}>{t.bookInvite}</p>
          <button type="button" className={s.primary}>
            {t.bookOpen}
          </button>
          <ol className={s.entries}>
            {entries.map((e) => (
              <li key={e.name} className={s.entry}>
                <p className={s.who} lang={e.lang}>
                  {e.name}
                </p>
                <p className={s.meta}>
                  {t.relation[e.relation]}
                  {"cls" in e && e.cls ? ` · ${e.cls}, ${e.year}` : ""} · {t.sentOn(e.date)}
                </p>
                <EntryText paragraphs={e.paragraphs} lang={e.lang} pageLang={lang} clampAt={2} buttonClassName={s.textButton} />
              </li>
            ))}
          </ol>
          <button type="button" className={s.ghost}>
            {t.moreEntries(20)}
          </button>
        </div>
      </section>
    </div>
  );
}

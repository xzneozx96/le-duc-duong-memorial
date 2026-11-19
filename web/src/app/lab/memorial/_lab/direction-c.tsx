"use client";

// Direction C, Hà Nội daylight (ux.md, Round 1). White ground, a broad ochre rail with green discs,
// big grotesque type, colour photos large as magazine spreads, the Lưu bút on a deep green field.
import { entries, person, stations, ui, type Lang, type Photo } from "./content";
import { ClipFacade, EntryText, FILM_IDS, FilmFacade, LabBar, LangSwitch, Reach, useLang } from "./parts";
import "./c.css";
import { classes } from "./cls";
import { fontVars } from "./fonts";

const s = classes("lc");

function Pic({ photo, lang, className }: { photo: Photo; lang: Lang; className?: string }) {
  return (
    <figure className={`${s.pic} ${photo.archive ? s.archive : ""} ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} width={photo.w} height={photo.h} alt={photo.caption[lang]} loading="lazy" />
      <figcaption className={s.caption}>
        {photo.caption[lang]}
        {photo.credit && <span className={s.credit}>{photo.credit[lang]}</span>}
      </figcaption>
    </figure>
  );
}

export function DirectionC() {
  const [lang, setLang] = useLang();
  const t = ui[lang];
  return (
    <div className={`${s.page} ${fontVars}`}>
      <LabBar current="c" lang={lang} />

      <header className={s.header}>
        <div className={s.topRow}>
          <span className={s.kicker}>{t.jump.journey} · 1942–2026</span>
          <LangSwitch lang={lang} onChange={setLang} className={s.langSwitch} activeClassName={s.langActive} />
        </div>
        <div className={s.headGrid}>
          <div className={s.headText}>
            <h1 className={s.name} lang="vi">
              <span>Lê Đức</span> <span>Dương</span>
            </h1>
            <p className={s.title} lang={lang}>
              {t.title}
            </p>
            <p className={s.intro}>{t.intro}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={person.portrait.src} width={person.portrait.w} height={person.portrait.h} alt={person.name} loading="eager" fetchPriority="high" className={s.portrait} />
        </div>
      </header>
      <nav className={s.band} aria-label={t.journeyHeading}>
        <a href="#c-film">{t.jump.film}</a>
        <a href="#c-journey">{t.jump.journey}</a>
        <a href="#c-book">{t.jump.book}</a>
      </nav>

      <section id="c-film" className={s.films} aria-labelledby="c-film-h">
        <h2 id="c-film-h" className={s.sectionHead}>
          {t.filmHeading}
        </h2>
        <div className={s.filmRow}>
          {t.films.map((f, i) => (
            <FilmFacade key={f.title} id={FILM_IDS[i]} title={f.title} part={f.length} playLabel={t.play} className={s.film} />
          ))}
        </div>
        <p className={s.note}>{t.filmNote}</p>
      </section>

      <section id="c-journey" className={s.journey} aria-labelledby="c-journey-h">
        <h2 id="c-journey-h" className={s.sectionHead}>
          {t.journeyHeading}
        </h2>
        <div className={s.line}>
          {stations.map((st, si) => {
            const lead = st.photos[0];
            const rest = st.photos.slice(1, 4);
            return (
              <Reach key={st.id} as="section" className={`${s.spread} ${si % 2 ? s.flip : ""}`}>
                <div className={s.stop}>
                  <span className={s.disc} aria-hidden>
                    {st.years.slice(0, 4)}
                  </span>
                  <h3 className={s.stopName}>
                    <span lang="vi">{st.vi}</span>
                    <span lang="de">{st.de}</span>
                  </h3>
                </div>
                <div className={s.leadWrap}>
                  <Pic photo={lead} lang={lang} className={s.lead} />
                </div>
                <div className={s.text}>
                  <p className={s.years}>{st.years}</p>
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
                <div className={s.row}>
                  {rest.map((p) => (
                    <Pic key={p.src} photo={p} lang={lang} />
                  ))}
                </div>
                <div className={s.moreWrap}>
                  <button type="button" className={s.outline}>
                    {t.morePhotos(9)}
                  </button>
                </div>
              </Reach>
            );
          })}
        </div>
      </section>

      <section id="c-book" className={s.book} aria-labelledby="c-book-h">
        <div className={s.bookInner}>
          <h2 id="c-book-h" className={s.bookHead}>
            {t.bookHeading}
          </h2>
          <p className={s.bookInvite}>{t.bookInvite}</p>
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
          <button type="button" className={s.light}>
            {t.moreEntries(20)}
          </button>
        </div>
      </section>
    </div>
  );
}

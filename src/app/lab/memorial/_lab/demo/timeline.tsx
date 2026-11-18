"use client";

// The journey: a route map that weaves between his two homelands, then seven stations as
// chapters. Each chapter hangs an enamel sign (Vietnamese over German) from the line, with its
// years, a paragraph, and its photographs, which open the viewer.
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { Play } from "lucide-react";
import { classes } from "../cls";
import {
  stations,
  type Lang,
  type Photo,
  type Station,
  type Strings,
} from "./content";
import { useViewer, type ViewerPhoto } from "./viewer";

const s = classes("ld");

/** True once the element's top has passed the middle of the screen; it stays true. */
function useReached(ref: RefObject<HTMLElement | null>) {
  const [reached, setReached] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReached(true);
          io.disconnect();
        }
      },
      // The top margin counts everything above the screen as reached, for readers who jump down.
      { rootMargin: "100000px 0px -50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return reached;
}

function Frame({
  photo,
  lang,
  group,
  index,
  className,
  showCaption = true,
}: {
  photo: Photo;
  lang: Lang;
  group: ViewerPhoto[];
  index: number;
  className: string;
  showCaption?: boolean;
}) {
  const openViewer = useViewer();
  return (
    <figure className={className}>
      <button
        type="button"
        className={s.frameButton}
        aria-label={photo.caption[lang]}
        onClick={() => openViewer(group, index)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          width={photo.w}
          height={photo.h}
          alt=""
          loading="lazy"
          style={
            photo.pos ? ({ "--pos": photo.pos } as CSSProperties) : undefined
          }
        />
      </button>
      {showCaption && (
        <figcaption className={s.caption}>
          {photo.caption[lang]}
          {photo.credit && (
            <span className={s.credit}>{photo.credit[lang]}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function Clip({
  clip,
  lang,
  t,
}: {
  clip: NonNullable<Station["clip"]>;
  lang: Lang;
  t: Strings;
}) {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (playing) video.current?.focus();
  }, [playing]);
  return (
    <figure className={s.clip}>
      <div
        className={s.clipFrame}
        style={{ aspectRatio: `${clip.w} / ${clip.h}` }}
      >
        {playing ? (
          <video
            ref={video}
            src={clip.src}
            poster={clip.poster}
            width={clip.w}
            height={clip.h}
            controls
            autoPlay
            playsInline
            preload="none"
          />
        ) : (
          <button
            type="button"
            className={s.clipButton}
            onClick={() => setPlaying(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clip.poster}
              width={clip.w}
              height={clip.h}
              alt=""
              loading="lazy"
            />
            <span className={s.clipPill}>
              <Play aria-hidden size={22} strokeWidth={2} fill="currentColor" />
              {t.clipPlay}
            </span>
          </button>
        )}
      </div>
      <figcaption className={s.caption}>{clip.caption[lang]}</figcaption>
    </figure>
  );
}

const PHONE_FIRST = 3;
const WIDE_FIRST = 6;
const UNIT = 100;

/** The line map: Vietnam on one track, Germany on the other, the route crossing between them. */
function RouteMap({ lang, t }: { lang: Lang; t: Strings }) {
  const n = stations.length;
  const across = stations
    .map((st, i) => `${(i + 0.5) * UNIT},${st.land === "vn" ? 0 : UNIT}`)
    .join(" ");
  const down = stations
    .map((st, i) => `${st.land === "vn" ? 0 : UNIT},${(i + 0.5) * UNIT}`)
    .join(" ");
  return (
    <nav className={s.route} aria-label={t.journeyHeading}>
      <p className={s.routeLand} data-land="vn" aria-hidden>
        {t.lands.vn}
      </p>
      <p className={s.routeLand} data-land="de" aria-hidden>
        {t.lands.de}
      </p>
      <div className={s.routeBody}>
        <svg
          className={s.routeAcross}
          viewBox={`0 0 ${n * UNIT} ${UNIT}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            points={across}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <svg
          className={s.routeDown}
          viewBox={`0 0 ${UNIT} ${n * UNIT}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            points={down}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <ol className={s.routeStops}>
          {stations.map((st) => (
            <li key={st.id} data-land={st.land}>
              <a href={`#station-${st.id}`}>
                <span className={s.routeDot} aria-hidden />
                <span className={s.routeLabel}>
                  <span className={s.routeYears}>{st.years}</span>
                  <span className={s.routeName}>{st[lang]}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function Sheet({
  photos,
  kind,
  lang,
  t,
  group,
  offset,
}: {
  photos: Photo[];
  kind: "pair" | "wall";
  lang: Lang;
  t: Strings;
  group: ViewerPhoto[];
  offset: number;
}) {
  const [open, setOpen] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const after = useRef<"focus-new" | "show-toggle" | null>(null);
  const morePhone = photos.length - PHONE_FIRST;
  const moreWide = photos.length - WIDE_FIRST;

  useEffect(() => {
    const todo = after.current;
    after.current = null;
    if (todo === "focus-new") {
      const first = window.matchMedia("(min-width: 900px)").matches
        ? WIDE_FIRST
        : PHONE_FIRST;
      grid.current?.querySelectorAll("button")[first]?.focus();
    } else if (todo === "show-toggle") {
      toggle.current?.scrollIntoView({ block: "center" });
    }
  }, [open]);

  return (
    <div className={s.sheetWrap}>
      <div
        ref={grid}
        className={s.sheet}
        data-kind={kind}
        data-collapsed={!open || undefined}
      >
        {photos.map((p, i) => (
          <Frame
            key={p.src}
            photo={p}
            lang={lang}
            group={group}
            index={offset + i}
            className={s.frame}
          />
        ))}
      </div>
      {morePhone > 0 && (
        <div className={s.sheetMore} data-wide={moreWide > 0 || undefined}>
          <button
            ref={toggle}
            type="button"
            className={s.ghost}
            aria-expanded={open}
            onClick={() => {
              after.current = open ? "show-toggle" : "focus-new";
              setOpen(!open);
            }}
          >
            {open ? (
              t.fewerPhotos
            ) : (
              <>
                <span className={s.onlyPhone}>{t.morePhotos(morePhone)}</span>
                {moreWide > 0 && (
                  <span className={s.onlyWide}>{t.morePhotos(moreWide)}</span>
                )}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function StationBlock({
  st,
  index,
  lang,
  t,
}: {
  st: Station;
  index: number;
  lang: Lang;
  t: Strings;
}) {
  const sign = useRef<HTMLHeadingElement>(null);
  const reached = useReached(sign);
  const group = useMemo<ViewerPhoto[]>(
    () =>
      [
        ...(st.aside?.photos ?? []),
        ...(st.lead ? [st.lead.photo] : []),
        ...st.sheet,
      ].map((p) => ({
        src: p.src,
        w: p.w,
        h: p.h,
        caption: p.caption[lang],
        credit: p.credit?.[lang],
      })),
    [st, lang],
  );
  const asideCount = st.aside?.photos.length ?? 0;
  const hasMedia = Boolean(st.aside || st.clip);

  return (
    <section
      id={`station-${st.id}`}
      className={s.station}
      data-reached={reached || undefined}
      aria-labelledby={`sign-${st.id}`}
    >
      <div className={s.stationHead} data-media={hasMedia || undefined}>
        {/* where this stop lies on the line: stops behind, this stop, stops ahead */}
        <div className={s.strip} aria-hidden>
          {stations.map((other, i) => (
            <i
              key={other.id}
              data-at={i < index ? "past" : i === index ? "here" : "ahead"}
            />
          ))}
        </div>
        <div className={s.signCol}>
          <h3 ref={sign} id={`sign-${st.id}`} className={s.sign}>
            <span lang="vi">{st.vi}</span>
            <span lang="de">{st.de}</span>
          </h3>
          <p className={s.stopYears}>{st.years}</p>
          {hasMedia && <p className={s.story}>{st.text[lang]}</p>}
        </div>
        {/* A stop with its own small pictures or the clip keeps the story under the sign and
            gives them the other column; a stop without lets the story take that column. */}
        <div className={s.storyCol}>
          {!hasMedia && <p className={s.story}>{st.text[lang]}</p>}
          {st.aside && (
            <div className={s.aside} style={{ "--ar": st.aside.ratio, "--maxw": `${st.aside.maxW}px` } as CSSProperties}>
              <div className={s.asideRow}>
                {st.aside.photos.map((p, i) => (
                  <Frame key={p.src} photo={p} lang={lang} group={group} index={i} className={s.asideFigure} showCaption={!st.aside?.caption} />
                ))}
              </div>
              {st.aside.caption && <p className={s.caption}>{st.aside.caption[lang]}</p>}
            </div>
          )}
          {st.clip && <Clip clip={st.clip} lang={lang} t={t} />}
        </div>
      </div>
      {st.lead && (
        <div
          className={s.lead}
          style={
            {
              "--wide-ratio": st.lead.wideRatio,
              "--wide-pos": st.lead.widePos,
            } as CSSProperties
          }
        >
          <Frame
            photo={st.lead.photo}
            lang={lang}
            group={group}
            index={asideCount}
            className={s.leadFigure}
          />
        </div>
      )}
      {st.sheet.length > 0 && (
        <Sheet
          photos={st.sheet}
          kind={st.sheetKind ?? "wall"}
          lang={lang}
          t={t}
          group={group}
          offset={asideCount + (st.lead ? 1 : 0)}
        />
      )}
    </section>
  );
}

export function Timeline({ lang, t }: { lang: Lang; t: Strings }) {
  return (
    <section id="journey" className={s.journey} aria-labelledby="journey-h">
      <div className={s.journeyHead}>
        <h2 id="journey-h" className={s.sectionHead}>
          {t.journeyHeading}
        </h2>
        <RouteMap lang={lang} t={t} />
      </div>
      {stations.map((st, i) => (
        <StationBlock key={st.id} st={st} index={i} lang={lang} t={t} />
      ))}
    </section>
  );
}

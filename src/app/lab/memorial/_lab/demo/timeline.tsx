"use client";

// The journey: seven stations on one bronze line. Việt Nam keeps one side of the line and
// Germany the other, so the line crosses over each time he did. A small sun travels the line
// as the reader scrolls, and the part behind it stays drawn.
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

const s = classes("lm");

type Geometry = { w: number; h: number; d: string; ys: number[] };

/** How far before a station the line leaves its side for the other one. */
const CROSSING = 200;

/** Measures the station marks and returns the line through them. */
function useLine(body: RefObject<HTMLDivElement | null>) {
  const [geo, setGeo] = useState<Geometry | null>(null);
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const pts = Array.from(el.querySelectorAll<HTMLElement>("[data-node]")).map((n) => {
        const r = n.getBoundingClientRect();
        return {
          x: Math.round(r.left + r.width / 2 - box.left),
          y: Math.round(r.top + r.height / 2 - box.top),
        };
      });
      if (pts.length === 0) return;
      const w = Math.round(box.width);
      const h = Math.round(box.height);
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (a.x === b.x) {
          d += ` L${b.x} ${b.y}`;
        } else {
          const span = Math.min(CROSSING, (b.y - a.y) * 0.6);
          const from = b.y - span;
          d += ` L${a.x} ${from} C${a.x} ${from + span / 2} ${b.x} ${b.y - span / 2} ${b.x} ${b.y}`;
        }
      }
      d += ` L${pts[pts.length - 1].x} ${h}`;
      const ys = pts.map((p) => p.y);
      setGeo((old) => (old && old.d === d && old.w === w && old.h === h ? old : { w, h, d, ys }));
    };
    // The observer reports once when it starts, and again whenever the journey changes height.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [body]);
  return geo;
}

function Line({ body }: { body: RefObject<HTMLDivElement | null> }) {
  const geo = useLine(body);
  const drawn = useRef<SVGPathElement>(null);
  const sun = useRef<SVGCircleElement>(null);
  const furthest = useRef(0);

  useEffect(() => {
    const el = body.current;
    const path = drawn.current;
    if (!geo || !el || !path) return;
    const total = path.getTotalLength();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const marks = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
    const lengthAt = (y: number) => {
      let lo = 0;
      let hi = total;
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < y) lo = mid;
        else hi = mid;
      }
      return lo;
    };
    let frame = 0;
    const paint = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      const now = still ? geo.h : Math.min(geo.h, Math.max(0, window.innerHeight * 0.58 - top));
      // The line never retracts: what he has travelled stays.
      const tip = Math.max(furthest.current, now);
      furthest.current = tip;
      const length = tip >= geo.h ? total : lengthAt(tip);
      path.style.strokeDasharray = `${length} ${total}`;
      path.style.visibility = length > 0 ? "visible" : "hidden";
      const dot = sun.current;
      if (dot) {
        const p = path.getPointAtLength(length);
        dot.setAttribute("cx", String(p.x));
        dot.setAttribute("cy", String(p.y));
        dot.style.opacity = !still && length > 0 && length < total ? "1" : "0";
      }
      marks.forEach((mark, i) => {
        const reached = geo.ys[i] <= tip + 1;
        if ((mark.dataset.reached === "true") !== reached) {
          if (reached) mark.dataset.reached = "true";
          else delete mark.dataset.reached;
        }
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [geo, body]);

  if (!geo) return null;
  return (
    <svg
      className={s.line}
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      aria-hidden
    >
      <path className={s.lineAhead} d={geo.d} fill="none" />
      <path ref={drawn} className={s.lineDrawn} d={geo.d} fill="none" />
      <circle ref={sun} className={s.sun} r="7" />
    </svg>
  );
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
          style={photo.pos ? ({ "--pos": photo.pos } as CSSProperties) : undefined}
        />
      </button>
      {showCaption && (
        <figcaption className={s.caption}>
          {photo.caption[lang]}
          {photo.credit && <span className={s.credit}>{photo.credit[lang]}</span>}
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
      <div className={s.clipFrame} style={{ aspectRatio: `${clip.w} / ${clip.h}` }}>
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
          <button type="button" className={s.clipButton} onClick={() => setPlaying(true)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={clip.poster} width={clip.w} height={clip.h} alt="" loading="lazy" />
            <span className={s.clipPill}>
              <span className={s.playDisc}>
                <Play aria-hidden size={20} strokeWidth={2} fill="currentColor" />
              </span>
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
      const first = window.matchMedia("(min-width: 900px)").matches ? WIDE_FIRST : PHONE_FIRST;
      grid.current?.querySelectorAll("button")[first]?.focus();
    } else if (todo === "show-toggle") {
      toggle.current?.scrollIntoView({ block: "center" });
    }
  }, [open]);

  return (
    <div className={s.sheetWrap}>
      <div ref={grid} className={s.sheet} data-kind={kind} data-collapsed={!open || undefined}>
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
                {moreWide > 0 && <span className={s.onlyWide}>{t.morePhotos(moreWide)}</span>}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function StationBlock({ st, lang, t }: { st: Station; lang: Lang; t: Strings }) {
  const group = useMemo<ViewerPhoto[]>(
    () =>
      [...(st.aside?.photos ?? []), ...(st.lead ? [st.lead.photo] : []), ...st.sheet].map((p) => ({
        src: p.src,
        w: p.w,
        h: p.h,
        caption: p.caption[lang],
        credit: p.credit?.[lang],
      })),
    [st, lang],
  );
  const asideCount = st.aside?.photos.length ?? 0;

  return (
    <section
      id={`station-${st.id}`}
      className={s.station}
      data-land={st.land}
      aria-labelledby={`sign-${st.id}`}
    >
      <span className={s.node} data-node aria-hidden />
      <p className={s.stopYears}>
        <span className={s.stopLand}>{t.lands[st.land]}</span>
        {st.years}
      </p>
      <div className={s.stationHead}>
        <h3 id={`sign-${st.id}`} className={s.sign}>
          <span lang="vi">{st.vi}</span>
          <span lang="de">{st.de}</span>
        </h3>
        <p className={s.story}>{st.text[lang]}</p>
      </div>
      {(st.aside || st.clip) && (
        <div className={s.stationFace}>
          {st.aside && (
            <div
              className={s.aside}
              style={{ "--ar": st.aside.ratio, "--maxw": `${st.aside.maxW}px` } as CSSProperties}
            >
              <div className={s.asideRow}>
                {st.aside.photos.map((p, i) => (
                  <Frame
                    key={p.src}
                    photo={p}
                    lang={lang}
                    group={group}
                    index={i}
                    className={s.asideFigure}
                    showCaption={!st.aside?.caption}
                  />
                ))}
              </div>
              {st.aside.caption && <p className={s.caption}>{st.aside.caption[lang]}</p>}
            </div>
          )}
          {st.clip && <Clip clip={st.clip} lang={lang} t={t} />}
        </div>
      )}
      {st.lead && (
        <div
          className={s.lead}
          style={
            { "--wide-ratio": st.lead.wideRatio, "--wide-pos": st.lead.widePos } as CSSProperties
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
  const body = useRef<HTMLDivElement>(null);
  return (
    <section id="journey" className={s.journey} aria-labelledby="journey-h">
      <div className={s.wrap}>
        <div className={s.journeyHead}>
          <h2 id="journey-h" className={s.h2}>
            {t.journeyHeading}
          </h2>
          <p className={s.lands} aria-hidden>
            <span>{t.lands.vn}</span>
            <span>{t.lands.de}</span>
          </p>
        </div>
        <div ref={body} className={s.route}>
          <Line body={body} />
          <span className={s.origin} data-node aria-hidden />
          {stations.map((st) => (
            <StationBlock key={st.id} st={st} lang={lang} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

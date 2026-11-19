"use client";

// His life as one drawn line. Seven stations hang on a vertical rule; as the reader scrolls, a
// second line fills the rule from the top and each station's marker lights when the line
// reaches it. The years of the station in view stay beside the line and roll on from the last
// station when it arrives. Each station carries a small tag for its country. The line ends with
// the family's photo of him walking away down a tree-lined street, and comes to rest below it.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Play, MapPin } from "lucide-react";
import { classes } from "@/components/memorial/cls";
import { farewellPhoto, stations, type Lang, type Photo, type Station, type Strings } from "./content";
import { EASE, MOVE, ScrollTrigger, gsap, useMotion } from "./motion";
import { useViewer, type ViewerPhoto } from "./viewer";

const s = classes("lm");

/* ---------- photographs ---------- */

/** A photo that opens the viewer. Its mask opens when it arrives, and the print drifts a little
 * inside the mask while it passes (decoration only: the caption never moves). */
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
  className?: string;
  showCaption?: boolean;
}) {
  const openViewer = useViewer();
  return (
    <figure className={`${s.frame} ${className ?? ""}`} data-frame>
      <button
        type="button"
        className={s.frameButton}
        aria-label={photo.caption[lang] || (lang === "vi" ? "Mở ảnh" : "Foto öffnen")}
        onClick={() => openViewer(group, index)}
      >
        <span className={s.frameMask} data-mask>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            width={photo.w}
            height={photo.h}
            alt=""
            loading="lazy"
            data-drift
            style={photo.pos ? ({ "--pos": photo.pos } as CSSProperties) : undefined}
          />
        </span>
      </button>
      {showCaption && (photo.caption[lang] || photo.credit) && (
        <figcaption className={s.caption}>
          {photo.caption[lang]}
          {photo.credit && <span className={s.credit}>{photo.credit[lang]}</span>}
        </figcaption>
      )}
    </figure>
  );
}

function Clip({ clip, lang, t }: { clip: NonNullable<Station["clip"]>; lang: Lang; t: Strings }) {
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (playing) video.current?.focus();
  }, [playing]);
  return (
    <figure className={s.clip} data-reveal>
      <div className={s.clipFrame} style={{ aspectRatio: `${clip.w} / ${clip.h}` }} data-clip-frame>
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
      <figcaption className={s.caption}>
        {clip.caption[lang]}
        {clip.credit && <span className={s.credit}>{clip.credit[lang]}</span>}
      </figcaption>
    </figure>
  );
}

/* ---------- the year that rolls on from the last station ---------- */

function rollDigits(from: string, to: string) {
  return to.split("").map((d, i) => {
    const a = Number(from[i] ?? d);
    const b = Number(d);
    if (a === b) return [b];
    const seq: number[] = [];
    let n = a;
    // The last digit turns a full round more, like a counter.
    const extra = i === to.length - 1 ? 10 : 0;
    for (let k = 0; k <= ((b - a + 10) % 10) + extra; k++) {
      seq.push(n);
      n = (n + 1) % 10;
    }
    return seq;
  });
}

function Years({ range, from }: { range: string; from: string }) {
  const [start, end] = range.split("–");
  const cols = rollDigits(from, start);
  return (
    <p className={s.years}>
      <span className={s.srOnly}>{range}</span>
      <span className={s.odo} aria-hidden data-odo>
        {cols.map((seq, i) => (
          <span key={i} className={s.odoCol}>
            <span className={s.odoStrip} style={{ "--n": seq.length } as CSSProperties} data-n={seq.length}>
              {seq.map((n, k) => (
                <span key={k}>{n}</span>
              ))}
            </span>
          </span>
        ))}
      </span>
      {end && (
        <span className={s.yearsEnd} aria-hidden>
          – {end}
        </span>
      )}
    </p>
  );
}

/* ---------- the photographs of each station ---------- */

const GALLERY_FIRST = 6;

function Gallery({ photos, lang, t, group, offset }: { photos: Photo[]; lang: Lang; t: Strings; group: ViewerPhoto[]; offset: number }) {
  const [open, setOpen] = useState(false);
  const more = photos.length - GALLERY_FIRST;
  return (
    <div className={s.gallery}>
      <ul className={s.galleryGrid} data-collapsed={!open || undefined}>
        {photos.map((p, i) => (
          <li key={p.src} style={{ "--ar": `${p.w} / ${p.h}` } as CSSProperties}>
            <Frame photo={p} lang={lang} group={group} index={offset + i} />
          </li>
        ))}
      </ul>
      {more > 0 && (
        <div className={s.galleryMore}>
          <button type="button" className={s.ghost} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? t.fewerPhotos : t.morePhotos(more)}
          </button>
        </div>
      )}
    </div>
  );
}

function useGroup(st: Station, lang: Lang) {
  return useMemo<ViewerPhoto[]>(
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
}

function Media({ st, lang, t, group }: { st: Station; lang: Lang; t: Strings; group: ViewerPhoto[] }) {
  const asideCount = st.aside?.photos.length ?? 0;
  const sheetFrom = asideCount + (st.lead ? 1 : 0);
  const lead = st.lead && (
    <div className={s.lead} style={{ "--wide-ratio": st.lead.wideRatio, "--wide-pos": st.lead.widePos } as CSSProperties}>
      <Frame photo={st.lead.photo} lang={lang} group={group} index={asideCount} />
    </div>
  );

  if (st.id === "moritzburg") {
    return (
      <>
        {lead}
        <div className={s.collage}>
          {st.clip && <Clip clip={st.clip} lang={lang} t={t} />}
          {st.sheet.map((p, i) => (
            <Frame key={p.src} photo={p} lang={lang} group={group} index={sheetFrom + i} />
          ))}
        </div>
      </>
    );
  }
  if (st.id === "germany") {
    return (
      <>
        {lead}
        <Gallery photos={st.sheet} lang={lang} t={t} group={group} offset={sheetFrom} />
      </>
    );
  }
  if (st.aside) {
    return (
      <div
        className={s.aside}
        data-count={st.aside.photos.length}
        style={{ "--ar": st.aside.ratio, "--maxw": `${st.aside.maxW}px` } as CSSProperties}
      >
        <div className={s.asideRow}>
          {st.aside.photos.map((p, i) => (
            <Frame key={p.src} photo={p} lang={lang} group={group} index={i} showCaption={!st.aside?.caption} />
          ))}
        </div>
        {st.aside.caption && <p className={s.caption}>{st.aside.caption[lang]}</p>}
      </div>
    );
  }
  if (st.sheet.length > 0) {
    return (
      <div className={s.pair}>
        {st.sheet.map((p, i) => (
          <Frame key={p.src} photo={p} lang={lang} group={group} index={sheetFrom + i} />
        ))}
      </div>
    );
  }
  return null;
}

/* ---------- stations on the line ---------- */

function StationBlock({ st, prevYear, lang, t, extra }: { st: Station; prevYear: string; lang: Lang; t: Strings; extra?: ReactNode }) {
  const group = useGroup(st, lang);
  const start = st.years.split("–")[0];
  return (
    <section id={`station-${st.id}`} className={s.station} data-land={st.land} aria-labelledby={`sign-${st.id}`}>
      <div className={s.stationYears}>
        <Years range={st.years} from={prevYear || String(Number(start) - 12)} />
        <p className={s.tag} data-land={st.land}>
          {t.lands[st.land]}
        </p>
      </div>
      <span className={s.node} aria-hidden data-node />
      <div className={s.stationBody}>
        <h3 id={`sign-${st.id}`} className={s.place} data-reveal>
          <span lang={lang}>{st.chapter[lang]}</span>
          <span className={s.placeAlt} lang={lang}>
            <MapPin aria-hidden className={s.placeIcon} size={22} strokeWidth={1.75} />
            {lang === "vi" ? st.vi : st.de}
          </span>
        </h3>
        <p className={s.story} data-reveal>
          {st.text[lang]}
        </p>
        {st.pull && (
          <figure className={s.pull} data-reveal>
            <span className={s.pullMark} aria-hidden>
              “
            </span>
            <blockquote>
              <p>{st.pull[lang]}</p>
            </blockquote>
            <figcaption className={s.pullCite}>{t.pullCite}</figcaption>
          </figure>
        )}
        <Media st={st} lang={lang} t={t} group={group} />
        {extra}
        {st.next && (
          <p className={s.nextLine} lang={lang} data-reveal>
            {st.next[lang]}
          </p>
        )}
      </div>
    </section>
  );
}

/** The quiet ending: the title "Một ánh Dương còn mãi" and the photo of him walking away. */
function Farewell({ lang, t }: { lang: Lang; t: Strings }) {
  const group = useMemo<ViewerPhoto[]>(
    () => [{ src: farewellPhoto.src, w: farewellPhoto.w, h: farewellPhoto.h, caption: farewellPhoto.caption[lang] }],
    [lang],
  );
  return (
    <section id="station-farewell" className={`${s.station} ${s.farewell}`} data-land="de" aria-labelledby="sign-farewell">
      <div className={s.stationYears}>
        <Years range="2026" from="1988" />
      </div>
      <span className={s.node} aria-hidden data-node />
      <div className={s.stationBody}>
        <h3 id="sign-farewell" className={s.farewellLine} lang={lang} data-reveal>
          {t.title}
        </h3>
        <p className={s.farewellNote} data-reveal>
          {t.farewell.died} {t.farewell.funeral}
        </p>
        <Frame photo={farewellPhoto} lang={lang} group={group} index={0} className={s.farewellPhoto} />
      </div>
    </section>
  );
}

/** `films` goes into the 1988–2026 station, after its photos. */
export function Journey({ lang, t, films }: { lang: Lang; t: Strings; films?: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (mm, el) => {
    mm.add(MOVE, () => {
      const q = gsap.utils.selector(el);
      const line = q(`.${s.line}`)[0];
      // Markers are lit at rest (the still page); while the line moves they wait for it.
      el.dataset.moving = "";

      // The line fills as the reader goes; it follows the hand both ways.
      gsap.fromTo(
        q(`.${s.lineFill}`),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: line, start: "top 58%", end: "bottom 58%", scrub: 0.4 } },
      );

      // Each marker lights when the line reaches it.
      q("[data-node]").forEach((node) => {
        const station = node.closest<HTMLElement>(`.${s.station}`) ?? node;
        ScrollTrigger.create({
          trigger: node,
          start: "center 58%",
          onEnter: () => (station.dataset.reached = ""),
          onLeaveBack: () => delete station.dataset.reached,
        });
      });
      const end = q(`.${s.lineEnd}`)[0];
      if (end)
        gsap.from(end.querySelectorAll("p"), {
          opacity: 0,
          y: 24,
          duration: 1.4,
          ease: EASE.enter,
          stagger: 0.15,
          scrollTrigger: { trigger: end, start: "top 85%", once: true },
        });

      // Years roll on from the last station once, as the station arrives.
      q("[data-odo]").forEach((odo) => {
        const strips = Array.from(odo.querySelectorAll<HTMLElement>("[data-n]")).filter((x) => Number(x.dataset.n) > 1);
        if (!strips.length) return;
        // The stylesheet shows the last digit; the script starts the counter from the first.
        gsap.set(strips, { y: 0, yPercent: 0 });
        gsap.to(strips, {
          yPercent: (_, x: HTMLElement) => (-(Number(x.dataset.n) - 1) / Number(x.dataset.n)) * 100,
          duration: 1.8,
          ease: EASE.roll,
          stagger: 0.08,
          scrollTrigger: { trigger: odo, start: "top 82%", once: true },
        });
      });

      // Photographs: the mask opens once; the print drifts while it passes. The owner's chosen
      // look (restored as it was). Cheaper without looking different: the clip is cleared once
      // open, and a drifting print gets its own layer only while it is on screen, so the scrub
      // moves a texture instead of repainting the photograph.
      const layerWhileVisible = (img: HTMLElement) => (self: ScrollTrigger) => {
        img.style.willChange = self.isActive ? "transform" : "";
      };
      q("[data-frame]").forEach((fig) => {
        const mask = fig.querySelector<HTMLElement>("[data-mask]");
        const img = fig.querySelector<HTMLElement>("[data-drift]");
        if (!mask || !img) return;
        const last = fig.classList.contains(s.farewellPhoto);
        gsap.fromTo(
          mask,
          { clipPath: last ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: last ? 2.6 : 1.5,
            ease: last ? "power2.inOut" : "expo.inOut",
            clearProps: "clipPath",
            scrollTrigger: { trigger: fig, start: last ? "top 80%" : "top 90%", once: true },
          },
        );
        // Small originals are never enlarged, so they do not drift.
        if (fig.closest(`.${s.aside}`)) return;
        gsap.fromTo(
          img,
          { yPercent: -5, scale: 1.12 },
          {
            yPercent: 5,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true, onToggle: layerWhileVisible(img) },
          },
        );
      });

      // The Moritzburg clip opens like the photographs (once, from below).
      q("[data-clip-frame]").forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "expo.inOut",
            clearProps: "clipPath",
            scrollTrigger: { trigger: frame, start: "top 90%", once: true },
          },
        );
      });

      // The film posters (now inside the 1988–2026 station): the frame opens from its centre
      // once, and the poster drifts while it passes, as before.
      q("[data-film-mask]").forEach((mask, i) => {
        gsap.fromTo(
          mask,
          { clipPath: "inset(18% 12% 18% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            delay: i * 0.12,
            ease: EASE.enter,
            clearProps: "clipPath",
            scrollTrigger: { trigger: mask.parentElement, start: "top 88%", once: true },
          },
        );
        const img = mask.querySelector<HTMLElement>("[data-film-img]");
        if (img)
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.14 },
            {
              yPercent: 6,
              scale: 1.14,
              ease: "none",
              scrollTrigger: { trigger: mask, start: "top bottom", end: "bottom top", scrub: true, onToggle: layerWhileVisible(img) },
            },
          );
      });

      return () => {
        delete el.dataset.moving;
        q(`.${s.station}`).forEach((st) => delete st.dataset.reached);
      };
    });
  }, [], { idle: true });

  return (
    <section ref={root} id="journey" className={s.journey} aria-labelledby="journey-h">
      <div className={s.wrap}>
        <div className={s.journeyIntro}>
          <h2 id="journey-h" className={s.h2}>
            {t.journeyHeading}
          </h2>
          <p className={`${s.lede} ${s.journeyLede}`}>{t.journeyLine}</p>
        </div>
        <div className={s.line}>
          <div className={s.lineTrack} aria-hidden>
            <div className={s.lineFill} />
          </div>
          {stations.map((st, i) => (
            <StationBlock
              key={st.id}
              st={st}
              prevYear={i > 0 ? stations[i - 1].years.split("–")[0] : ""}
              lang={lang}
              t={t}
              extra={st.id === "germany" ? films : undefined}
            />
          ))}
          <Farewell lang={lang} t={t} />
        </div>
      </div>
    </section>
  );
}

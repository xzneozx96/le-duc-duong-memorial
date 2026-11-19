"use client";

// Behaviour shared by the three round-1 directions. Each direction styles these with its own
// class names, so the look stays in the direction's CSS module.
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Lang } from "./content";
import { ui } from "./content";

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("vi");
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return [lang, setLang];
}

export function LangSwitch({
  lang,
  onChange,
  className,
  activeClassName,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
  className?: string;
  activeClassName?: string;
}) {
  return (
    <div role="group" aria-label={ui[lang].langGroup} className={className}>
      {(["vi", "de"] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          className={lang === l ? activeClassName : undefined}
          onClick={() => onChange(l)}
        >
          {l === "vi" ? "Tiếng Việt" : "Deutsch"}
        </button>
      ))}
    </div>
  );
}

/** Lab chrome above each direction: which direction, links to the others, a sample note. */
export function LabBar({ current, lang }: { current: "a" | "b" | "c"; lang: Lang }) {
  const names = { a: "A · Album", b: "B · Tàu đêm / Nachtzug", c: "C · Hà Nội daylight" };
  return (
    <div
      style={{
        background: "#0f0e0d",
        color: "#f3efe8",
        fontFamily: "var(--font-be-vietnam-pro), system-ui, sans-serif",
        fontSize: 16,
        lineHeight: 1.4,
        padding: "8px 16px",
        display: "flex",
        flexWrap: "wrap",
        gap: "6px 18px",
        alignItems: "center",
      }}
    >
      <Link href="/lab/memorial" style={{ color: "#f3efe8", textDecoration: "underline" }}>
        Lab
      </Link>
      {(["a", "b", "c"] as const).map((d) =>
        d === current ? (
          <strong key={d}>{names[d]}</strong>
        ) : (
          <Link key={d} href={`/lab/memorial/${d}`} style={{ color: "#c9c2b6" }}>
            {names[d]}
          </Link>
        ),
      )}
      <span style={{ color: "#a8a094", marginLeft: "auto" }}>{ui[lang].sampleNote}</span>
    </div>
  );
}

/** A video that loads nothing until pressed (AC-9, AC-26). */
export function ClipFacade({
  poster,
  src,
  w,
  h,
  label,
  className,
  buttonClassName,
}: {
  poster: string;
  src: string;
  w: number;
  h: number;
  label: string;
  className?: string;
  buttonClassName?: string;
}) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <video className={className} src={src} width={w} height={h} controls autoPlay playsInline poster={poster} />
    );
  }
  return (
    <button type="button" className={buttonClassName} onClick={() => setPlaying(true)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} width={w} height={h} alt="" className={className} />
      <span data-play>
        <svg aria-hidden viewBox="0 0 24 24" width="22" height="22">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
        {label}
      </span>
    </button>
  );
}

/** A YouTube film shown as a plain panel; no request reaches YouTube before the press (AC-7). */
export function FilmFacade({
  id,
  title,
  part,
  playLabel,
  className,
}: {
  id: string;
  title: string;
  part: string;
  playLabel: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <div className={className} data-playing>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      </div>
    );
  }
  return (
    <button type="button" className={className} onClick={() => setPlaying(true)}>
      <span data-part>{part}</span>
      <span data-title lang="mul">
        {title}
      </span>
      <span data-play>
        <svg aria-hidden viewBox="0 0 24 24" width="22" height="22">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
        {playLabel}
      </span>
    </button>
  );
}

/** Text shown exactly as typed; long entries clamp with a read-all button. */
export function EntryText({
  paragraphs,
  lang,
  pageLang,
  clampClassName,
  buttonClassName,
  clampAt = 3,
}: {
  paragraphs: string[];
  lang: Lang;
  pageLang: Lang;
  clampClassName?: string;
  buttonClassName?: string;
  clampAt?: number;
}) {
  const [open, setOpen] = useState(false);
  const long = paragraphs.length > clampAt;
  const shown = open || !long ? paragraphs : paragraphs.slice(0, clampAt);
  return (
    <div lang={lang}>
      <div className={!open && long ? clampClassName : undefined}>
        {shown.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {long && (
        <button type="button" lang={pageLang} className={buttonClassName} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? ui[pageLang].collapse : ui[pageLang].readAll}
        </button>
      )}
    </div>
  );
}

/** Adds data-reached to an element once its middle crosses the middle of the screen. */
export function Reach({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLElement>(null);
  const [reached, setReached] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReached(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -45% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={className} data-reached={reached || undefined}>
      {children}
    </Tag>
  );
}

// Part I (06.09.2020) and part II (13.09.2020), per the life-story PDF, page 11.
export const FILM_IDS = ["K4gtri_cHB8", "otEfBuw2AoE"] as const;

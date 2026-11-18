"use client";

// Shared parts of hero options E1 to E4: the words, his cut-out portrait, a background that
// swaps to a tall crop on phones, the scroll cue and the first block below the hero.
// Each option sets its own composition and motion in option-e<n>.tsx and e<n>.css.
import { Fragment, useRef, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { classes } from "../cls";
import { EASE, MOVE, gsap, useMotion } from "../demo/motion";
import "./e-shared.css";

const s = classes("hes");

export const HERO = {
  honorific: "Nhà giáo",
  name: "Lê Đức Dương",
  born: "01.05.1942",
  died: "11.11.2026",
  /** what he is remembered for; his life story: almost every generation going to Germany then passed through his classes */
  legacy: "Người thầy của nhiều thế hệ lưu học sinh Việt Nam sang Đức, Trường Đại học Ngoại ngữ Hà Nội, 1970–1988.",
  portrait: { src: "/demo/portrait-cutout.webp", w: 1024, h: 1535, alt: "Chân dung Nhà giáo Lê Đức Dương" },
};

/** The line of what he is remembered for (the owner dropped the row of titles). */
export function Titles({ className }: { className?: string }) {
  return (
    <div className={`${s.titles} ${className ?? ""}`}>
      <p className={s.legacy}>{HERO.legacy}</p>
    </div>
  );
}

export function Root({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={`${s.root} ${className ?? ""}`}>{children}</div>;
}

/** The name split into words (never letters: the stacked Vietnamese marks must stay whole). */
export function NameWords({ wordClass }: { wordClass?: string }) {
  const words = HERO.name.normalize("NFC").split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={w}>
          <span className={wordClass} data-word>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function Dates({ className }: { className?: string }) {
  return (
    <p className={className}>
      <time dateTime="1942-05-01">{HERO.born}</time>
      <span aria-hidden> – </span>
      <span className={s.sr}> đến </span>
      <time dateTime="2026-11-11">{HERO.died}</time>
    </p>
  );
}

export function Portrait({ className }: { className?: string }) {
  const p = HERO.portrait;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={p.src}
      width={p.w}
      height={p.h}
      alt={p.alt}
      loading="eager"
      fetchPriority="high"
      data-portrait
    />
  );
}

/** A graded background photograph; the tall crop is used up to 700px wide. */
export function Backdrop({
  wide,
  tall,
  className,
  imgClassName,
}: {
  wide: string;
  tall?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <picture className={className} data-bg>
      {tall ? <source media="(max-width: 700px)" srcSet={tall} /> : null}
      <img className={imgClassName} src={wide} alt="" loading="eager" decoding="async" />
    </picture>
  );
}

export function ScrollCue({ className, href = "#cuoc-doi" }: { className?: string; href?: string }) {
  return (
    <a className={`${s.cue} ${className ?? ""}`} href={href} data-cue>
      <span>Cuộc đời của thầy</span>
      <ArrowDown aria-hidden size={22} strokeWidth={1.6} />
    </a>
  );
}

/** The first block below the hero, so each option shows how it hands over on scroll. */
export function Next({ tone }: { tone: "light" | "dark" }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, el) => {
    mm.add(MOVE, () => {
      gsap.from(el.querySelectorAll("[data-next]"), {
        y: 36,
        autoAlpha: 0,
        duration: 1.2,
        ease: EASE.soft,
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 78%" },
      });
    });
  });
  return (
    <section id="cuoc-doi" ref={ref} className={`${s.next} ${tone === "dark" ? s.dark : s.light}`}>
      <div className={s.nextIn}>
        <p className={s.eyebrow} data-next>
          Cuộc đời
        </p>
        <h2 className={s.h2} data-next>
          Từ Moritzburg đến giảng đường Thanh Xuân
        </h2>
        <p className={s.body} data-next>
          Năm 1955, thầy là một trong những em nhỏ Việt Nam được đưa sang nước Đức bằng tàu hoả và học ở
          Moritzburg. Từ năm 1970 đến 1988, thầy dạy tiếng Đức ở Thanh Xuân, Hà Nội, cho nhiều thế hệ sinh viên.
          Sau này, thầy sống giữa Việt Nam và nước Đức.
        </p>
        <ul className={s.links} data-next>
          <li>
            <a href="#cuoc-doi">Cuộc đời</a>
          </li>
          <li>
            <a href="#cuoc-doi">Thước phim</a>
          </li>
          <li>
            <a href="#cuoc-doi">Lưu bút</a>
          </li>
        </ul>
      </div>
    </section>
  );
}

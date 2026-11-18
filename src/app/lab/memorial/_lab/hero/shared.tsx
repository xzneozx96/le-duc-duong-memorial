// Shared pieces of the hero options (/lab/memorial/hero/a … e). A lab route, not product code.
// Every option uses the same words, the same jump targets and the same strip below the hero,
// so the options differ only in concept, composition and motion.
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { classes } from "../cls";
import { films } from "../demo/content";
import "./shared.css";

const s = classes("lhx");

export const hero = {
  honorific: "Nhà giáo",
  name: "Lê Đức Dương",
  title: "Một ánh Dương còn mãi",
  born: "01.05.1942",
  died: "11.11.2026",
  /** the exact form of the dates line, en dash with spaces */
  dates: "01.05.1942 – 11.11.2026",
  portraitAlt: "Chân dung Nhà giáo Lê Đức Dương",
  youngAlt: "Thầy Lê Đức Dương thời trẻ, ảnh chân dung cũ",
  jumpLabel: "Các phần của trang",
  jump: {
    book: { href: "#luu-but", label: "Lưu bút" },
    film: { href: "#thuoc-phim", label: "Thước phim" },
    life: { href: "#cuoc-doi", label: "Cuộc đời" },
  },
} as const;

export type Pic = { src: string; w: number; h: number; pos?: string };

/** The real photos the options use, with their pixel sizes (public/demo). */
export const pics = {
  portrait: { src: "/demo/portrait.jpg", w: 1024, h: 1535, pos: "50% 30%" },
  cutout: { src: "/demo/portrait-cutout.webp", w: 1024, h: 1535 },
  young: { src: "/demo/magdeburg-1-print.jpg", w: 820, h: 1168, pos: "50% 35%" },
  moritzburg1: { src: "/demo/moritzburg-1.jpg", w: 1532, h: 1021 },
  moritzburg3: { src: "/demo/moritzburg-3.jpg", w: 895, h: 680 },
  thanhxuan1: { src: "/demo/thanhxuan-1.jpg", w: 1024, h: 768 },
  thanhxuan2: { src: "/demo/thanhxuan-2.jpg", w: 720, h: 535 },
  germany1: { src: "/demo/germany-1.jpg", w: 1280, h: 960 },
  germany2: { src: "/demo/germany-2.jpg", w: 960, h: 642 },
  germany4: { src: "/demo/germany-4.jpg", w: 960, h: 1280, pos: "50% 40%" },
  germany7: { src: "/demo/germany-7.jpg", w: 960, h: 720 },
  germany9: { src: "/demo/germany-9.jpg", w: 1200, h: 1600, pos: "50% 30%" },
  germany12: { src: "/demo/germany-12.jpg", w: 1024, h: 768 },
  germany14: { src: "/demo/germany-14.jpg", w: 754, h: 960, pos: "50% 35%" },
  germany16: { src: "/demo/germany-16.jpg", w: 768, h: 1024 },
  farewell: { src: "/demo/farewell-walk.jpg", w: 1200, h: 1600 },
} satisfies Record<string, Pic>;

/** One plain <img>: lab routes show the originals as they are. */
export function Img({
  pic,
  alt = "",
  className,
  style,
  eager,
}: {
  pic: Pic;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={pic.src}
      width={pic.w}
      height={pic.h}
      alt={alt}
      className={className}
      style={{ objectPosition: pic.pos, ...style }}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
}

/**
 * A word set letter by letter for an entrance. The letters are aria-hidden; the caller keeps the
 * whole name readable (an sr-only copy in the h1). NFC first, so a Vietnamese letter and its
 * marks stay in one span.
 */
export function Letters({ text, className, charClass }: { text: string; className?: string; charClass: string }) {
  const words = text.normalize("NFC").split(" ");
  return (
    <span className={className} aria-hidden>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className={s.word}>
            {Array.from(w).map((ch, i) => (
              <span key={i} className={charClass}>
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/** The large name used by the D family: an sr-only whole name, the honorific, the letters. */
export function BigName({ className }: { className?: string }) {
  return (
    <h1 className={`${s.name} ${className ?? ""}`}>
      <span className={s.srOnly}>
        {hero.honorific} {hero.name}
      </span>
      <span className={s.honorific} aria-hidden data-a>
        {hero.honorific}
      </span>
      <span className={s.nameText} data-a>
        <Letters text={hero.name} charClass={s.char} />
      </span>
    </h1>
  );
}

/** Title, dates and the three links, in the shared style of the D family. */
export function Foot({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <div className={`${s.foot} ${dark ? s.footDark : ""} ${className ?? ""}`} data-a>
      <p className={s.title}>{hero.title}</p>
      <p className={s.dates}>{hero.dates}</p>
      <nav className={s.nav} aria-label={hero.jumpLabel}>
        <a href={hero.jump.book.href} className={s.primary}>
          {hero.jump.book.label}
          <ArrowDown aria-hidden size={20} strokeWidth={2.25} />
        </a>
        <a href={hero.jump.film.href} className={s.link}>
          {hero.jump.film.label}
        </a>
        <a href={hero.jump.life.href} className={s.link}>
          {hero.jump.life.label}
        </a>
      </nav>
    </div>
  );
}

/** The strip below the hero: the start of the films, then two stubs for the jump targets. */
export function Below({ tone, noLifeStub }: { tone: "paper" | "dark" | "mist"; noLifeStub?: boolean }) {
  return (
    <div className={`${s.below} ${s[tone]}`}>
      <section id="thuoc-phim" className={s.films} aria-labelledby="lhx-film-h">
        <div className={s.wrap}>
          <div className={s.filmsHead}>
            <h2 id="lhx-film-h" className={s.h2}>
              Thước phim cuộc đời
            </h2>
            <p className={s.lede}>
              Hai cuộc trò chuyện ghi lại năm 2020 trong podcast «Sống chung với Corona» của TS. Trương Hồng Quang, nơi
              thầy kể lại hành trình từ chuyến tàu năm 1955 đến những năm đứng lớp tiếng Đức.
            </p>
          </div>
          <div className={s.filmRow}>
            {films.map((f) => (
              <div key={f.id} className={s.film}>
                <Img pic={f.poster} className={s.filmImg} />
                <p className={s.filmMeta}>
                  <span>{f.part.vi}</span>
                  <span>{f.date}</span>
                </p>
                <p className={s.filmTitle} lang={f.lang}>
                  {f.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className={s.stubs}>
        <div className={s.wrap}>
          {noLifeStub ? (
            <p className={s.stub}>
              <strong id="luu-but">Lưu bút</strong> tiếp theo như ở <Link href="/lab/memorial/demo">trang demo</Link>.
            </p>
          ) : (
            <p id="cuoc-doi" className={s.stub}>
              <strong>Cuộc đời</strong> và <strong id="luu-but">Lưu bút</strong> tiếp theo như ở{" "}
              <Link href="/lab/memorial/demo">trang demo</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const order = ["d", "d2", "d3", "d4", "d5"] as const;
export type OptionId = (typeof order)[number];

/** The lab note under each option: what it tries, the trade-offs, and the way back. */
export function LabNote({
  id,
  name,
  children,
}: {
  id: OptionId;
  name: string;
  children: ReactNode;
}) {
  const i = order.indexOf(id);
  const prev = order[(i + order.length - 1) % order.length];
  const next = order[(i + 1) % order.length];
  return (
    <aside className={s.note} lang="en" aria-label="Lab note">
      <div className={s.wrap}>
        <p className={s.noteKicker}>Lab · hero option {id.toUpperCase()}</p>
        <h2 className={s.noteTitle}>{name}</h2>
        <div className={s.noteBody}>{children}</div>
        <nav className={s.noteNav} aria-label="Hero options">
          <Link href="/lab/memorial/hero">All hero options</Link>
          <Link href={`/lab/memorial/hero/${prev}`}>← Option {prev.toUpperCase()}</Link>
          <Link href={`/lab/memorial/hero/${next}`}>Option {next.toUpperCase()} →</Link>
        </nav>
      </div>
    </aside>
  );
}

/** The page shell every option uses: palette, faces (applied by the page), the capture anchor. */
export function Shell({ prefix, children }: { prefix: string; children: ReactNode }) {
  return (
    <div className={`${s.page} ${prefix}-page`} lang="vi">
      <span data-shot-top className={s.shotTop} aria-hidden />
      {children}
    </div>
  );
}

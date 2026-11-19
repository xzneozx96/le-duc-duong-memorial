"use client";

// Option D: Những năm tháng (the years beside him). The book is laid along his life, from the
// train to Germany in 1955 to 2026. Each letter hangs at the year its writer gave ("1978–1979"
// hangs at 1978), so the years he taught at Thanh Xuân fill with his students' names and the
// later years with colleagues and friends in Germany. A name opens its letter on the page below,
// the year set large above it. A new letter drops onto the line at its own year.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, PenLine } from "lucide-react";
import { classes } from "../cls";
import { firstYear, isTribute, metaLine, t, type Entry } from "./data";
import { MemoryForm } from "./form";
import { EASE, MOVE, bringIntoView, gsap, moving, useMotion } from "./motion";
import { LetterText, MoreButton, PhotoButtons, SentMark, StatusLine, useBook } from "./parts";
import "./d.css";

const s = classes("lbd");
const k = classes("lbk");

const FROM = 1955;
const TO = 2026;
const SPAN = TO - FROM;
// Mr. Ngạn gives no year field; his tribute says he joined the department in 1977.
const yearOf = (e: Entry) => (isTribute(e) ? 1977 : firstYear(e));
const pct = (y: number) => ((y - FROM) / SPAN) * 100;

const DECADES = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
// What the page already says about these years (the intro and the farewell lines).
const MARKS = [
  { year: 1955, label: "Sang Đức" },
  { year: 1970, label: "Dạy tiếng Đức ở Thanh Xuân" },
  { year: 1988, label: "Rời Thanh Xuân" },
  { year: 2026, label: "Thầy mất ngày 11.11.2026" },
];

type Placed = { e: Entry; year: number; lane: number; top: number };

/** Lanes on the wide line: a name goes in the lowest lane where it clears the one before it. */
function placeWide(list: { e: Entry; year: number }[], width = 1120) {
  const ends: number[] = [];
  return list.map(({ e, year }) => {
    const x = (pct(year) / 100) * width;
    const w = Math.min(280, e.name.length * 11 + 48);
    let lane = ends.findIndex((end) => end < x - 10);
    if (lane === -1) lane = ends.length;
    ends[lane] = x + w;
    return { e, year, lane, top: 0 };
  });
}

function Flag({
  p,
  open,
  onOpen,
  style,
}: {
  p: Placed;
  open: boolean;
  onOpen: () => void;
  style: CSSProperties;
}) {
  // near the right end of the line the name hangs to the left of its thread
  const flip = pct(p.year) > 72 || undefined;
  return (
    <li className={s.flag} style={style} data-flag={p.e.id} data-flip={flip}>
      <span className={s.thread} aria-hidden data-thread />
      <button type="button" className={s.flagButton} aria-current={open || undefined} onClick={onOpen} data-label>
        {p.e.justSent && <SentMark className={s.flagSent} />}
        <span className={s.flagName}>{p.e.name}</span>
        <span className={s.flagYear}>{isTribute(p.e) ? "1977, lời tri ân" : p.e.year}</span>
      </button>
    </li>
  );
}

export function OptionD() {
  const book = useBook();
  const [openId, setOpenId] = useState("tribute");
  const [writing, setWriting] = useState(false);
  const root = useRef<HTMLElement>(null);
  const page = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const writeButton = useRef<HTMLButtonElement>(null);
  const after = useRef<{ focus: "heading" | "write" | "line"; dropped?: string } | null>(null);

  const { dated, undated, order } = useMemo(() => {
    const withYear = book.all
      .map((e) => ({ e, year: yearOf(e) }))
      .filter((x): x is { e: Entry; year: number } => x.year !== null)
      .sort((a, b) => a.year - b.year);
    const without = book.all.filter((e) => yearOf(e) === null);
    return { dated: withYear, undated: without, order: [...withYear.map((x) => x.e), ...without] };
  }, [book.all]);
  const wide = useMemo(() => placeWide(dated), [dated]);
  const tallRows = useMemo(() => {
    const marks = MARKS.map((m) => ({ kind: "mark" as const, year: m.year, label: m.label, era: m.year >= 1970 && m.year < 1988 }));
    const flags = dated.map(({ e, year }) => ({ kind: "flag" as const, year, p: { e, year, lane: 0, top: 0 }, era: year >= 1970 && year < 1988 }));
    return [...marks, ...flags].sort((a, b) => a.year - b.year || (a.kind === "mark" ? -1 : 1));
  }, [dated]);
  const lanes = Math.max(1, ...wide.map((p) => p.lane + 1));

  const index = Math.max(0, order.findIndex((e) => e.id === openId));
  const entry = order[index];
  const prev = order[index - 1];
  const next = order[index + 1];
  const year = yearOf(entry);

  // Arrival: the line draws itself from 1955 to 2026, then the names rise at their years.
  useMotion(root, (mm, el) => {
    mm.add(MOVE, () => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: line.current, start: "top 75%", once: true } });
      tl.from(q(".lbd-axis"), { scaleX: 0, duration: 1.6, ease: EASE.roll })
        .from(q(".lbd-tall"), { clipPath: "inset(0 0 100% 0)", duration: 1.6, ease: EASE.roll, clearProps: "clipPath" }, 0)
        .from(q("[data-era]"), { opacity: 0, duration: 0.8 }, "-=0.6")
        .from(q("[data-thread]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, stagger: 0.08, ease: EASE.soft }, "-=0.4")
        .from(q("[data-label]"), { opacity: 0, y: 14, duration: 0.7, stagger: 0.08, ease: EASE.enter, clearProps: "transform,opacity" }, "<0.2");
    });
  });

  useEffect(() => {
    const a = after.current;
    if (!a) return;
    after.current = null;
    if (a.focus === "heading") {
      heading.current?.focus({ preventScroll: true });
      const top = page.current?.getBoundingClientRect().top ?? 0;
      if (top < 0 || top > window.innerHeight * 0.7) bringIntoView(page.current);
      if (page.current && moving()) gsap.fromTo(page.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: EASE.enter, clearProps: "transform,opacity" });
    } else if (a.focus === "write") {
      writeButton.current?.focus();
    }
    if (a.dropped && moving()) {
      // the new name drops onto the line at its year
      requestAnimationFrame(() => {
        root.current?.querySelectorAll(`[data-flag="${a.dropped}"]`).forEach((f) => {
          const label = f.querySelector("[data-label]");
          const thread = f.querySelector("[data-thread]");
          const tl = gsap.timeline();
          if (label) tl.from(label, { y: -220, opacity: 0, duration: 1.1, ease: "bounce.out", clearProps: "transform,opacity" });
          if (thread) tl.from(thread, { scaleY: 0, transformOrigin: "50% 100%", duration: 0.5 }, "-=0.3");
        });
      });
    }
  }, [openId, writing]);

  const openLetter = (id: string) => {
    after.current = { focus: "heading" };
    setWriting(false);
    setOpenId(id);
  };

  return (
    <section ref={root} id="book" className={s.section} aria-labelledby="book-h">
      <div className={s.head}>
        <h2 id="book-h" className={s.title}>
          {t.bookHeading}
        </h2>
        <div className={s.headText}>
          <p className={s.invite}>{t.bookInvite}</p>
          <button
            ref={writeButton}
            type="button"
            className={k.primary}
            aria-expanded={writing}
            onClick={() => {
              setWriting(true);
              requestAnimationFrame(() => bringIntoView(page.current));
            }}
          >
            <PenLine aria-hidden size={22} strokeWidth={2} />
            {t.bookOpen}
          </button>
        </div>
      </div>

      <div ref={line} className={s.band} role="group" aria-labelledby="d-years-h">
        <div className={s.bandHead}>
          <h3 id="d-years-h" className={s.bandTitle}>
            Những năm tháng bên thầy
          </h3>
          <p className={s.bandLine}>Mỗi lá thư nằm ở năm người viết quen thầy. Bấm vào một tên để đọc.</p>
        </div>

        {/* wide screens: the line runs across */}
        <div className={s.wide} style={{ "--lanes": lanes } as CSSProperties}>
          <ol className={s.wideFlags}>
            {wide.map((p) => (
              <Flag
                key={p.e.id}
                p={p}
                open={!writing && p.e.id === openId}
                onOpen={() => openLetter(p.e.id)}
                style={{ "--x": `${pct(p.year)}%`, "--lane": p.lane } as CSSProperties}
              />
            ))}
          </ol>
          <div className={s.axis} aria-hidden data-axis />
          <div className={s.era} aria-hidden data-era style={{ "--a": `${pct(1970)}%`, "--b": `${pct(1988)}%` } as CSSProperties}>
            <span>Thanh Xuân, 1970–1988</span>
          </div>
          <span className={s.mark} aria-hidden data-era style={{ "--x": "0%" } as CSSProperties}>
            1955, sang Đức
          </span>
          <span className={`${s.mark} ${s.markEnd}`} aria-hidden data-era style={{ "--x": "100%" } as CSSProperties}>
            2026
          </span>
          <ol className={s.decades} aria-hidden>
            {DECADES.map((d) => (
              <li key={d} style={{ "--x": `${pct(d)}%` } as CSSProperties}>
                {d}
              </li>
            ))}
          </ol>
        </div>

        {/* phones: the line runs down, year after year, with the names in their places */}
        <ol className={s.tall}>
          {tallRows.map((r) =>
            r.kind === "mark" ? (
              <li key={`m-${r.year}`} className={s.tallMark} data-era={r.era || undefined} aria-hidden>
                <span className={s.tallYear}>{r.year}</span>
                <span className={s.tallDot} data-axis />
                <span className={s.tallMarkText}>{r.label}</span>
              </li>
            ) : (
              <li key={r.p.e.id} className={s.tallRow} data-era={r.era || undefined} data-flag={r.p.e.id}>
                <span className={s.tallYear} aria-hidden />
                <span className={s.tallDot} aria-hidden data-axis />
                <button type="button" className={s.flagButton} aria-current={(!writing && r.p.e.id === openId) || undefined} onClick={() => openLetter(r.p.e.id)} data-label>
                  {r.p.e.justSent && <SentMark className={s.flagSent} />}
                  <span className={s.flagName}>{r.p.e.name}</span>
                  <span className={s.flagYear}>{isTribute(r.p.e) ? "1977, lời tri ân" : r.p.e.year}</span>
                </button>
              </li>
            ),
          )}
        </ol>

        {undated.length > 0 && (
          <div className={s.undated}>
            <p className={s.undatedLabel}>Không ghi năm</p>
            <ul className={s.undatedFlags}>
              {undated.map((e) => (
                <li key={e.id} data-flag={e.id}>
                  <button type="button" className={s.flagButton} aria-current={(!writing && e.id === openId) || undefined} onClick={() => openLetter(e.id)} data-label>
                    {e.justSent && <SentMark className={s.flagSent} />}
                    <span className={s.flagName}>{e.name}</span>
                    <span className={s.flagYear}>{t.relation[e.relation]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <MoreButton hidden={book.hidden} onMore={book.more} className={s.more} />
      </div>

      <div className={s.reader}>
        <StatusLine posted={book.posted} className={s.status} />
        <MemoryForm
          open={writing}
          className={s.form}
          intro="Ghi năm bạn học hay làm việc với thầy: lá thư của bạn sẽ nằm ở đúng năm ấy trên dòng thời gian."
          onClose={() => {
            after.current = { focus: "write" };
            setWriting(false);
          }}
          onPosted={(e) => {
            book.add(e);
            setWriting(false);
            setOpenId(e.id);
            after.current = { focus: "heading", dropped: e.id };
          }}
        />
        <article ref={page} className={s.page} hidden={writing} aria-labelledby="d-letter-h" key={entry.id}>
          <header className={s.pageHead}>
            <p className={s.bigYear} aria-hidden>
              {year ?? "—"}
            </p>
            <div className={s.pageWho}>
              {entry.justSent && <SentMark />}
              <h3 id="d-letter-h" ref={heading} tabIndex={-1} className={s.name}>
                {entry.name}
              </h3>
              <p className={s.meta}>
                {isTribute(entry) ? t.bookKicker : metaLine(entry)}
                <br />
                {t.sentOn(entry.date)}
              </p>
            </div>
          </header>
          <div className={s.body} data-photos={(entry.photos?.length ?? 0) > 0 || undefined}>
            <LetterText entry={entry} className={s.text} />
            <PhotoButtons
              entry={entry}
              className={s.photos}
              itemClass={s.photo}
              style={(i) => ({ "--ar": `${entry.photos![i].w ?? 4} / ${entry.photos![i].h ?? 3}` }) as CSSProperties}
            />
          </div>
          <nav className={s.turn} aria-label="Đọc tiếp">
            {prev ? (
              <button type="button" className={s.turnButton} onClick={() => openLetter(prev.id)}>
                <ArrowLeft aria-hidden size={22} strokeWidth={2} />
                <span>
                  <span className={s.turnWord}>Năm trước</span>
                  <span className={s.turnName}>{prev.name}</span>
                </span>
              </button>
            ) : (
              <span />
            )}
            <button type="button" className={`${k.textButton} ${s.toLine}`} onClick={() => bringIntoView(line.current)}>
              <ArrowUp aria-hidden size={22} strokeWidth={2} />
              Về dòng thời gian
            </button>
            {next && (
              <button type="button" className={`${s.turnButton} ${s.turnNext}`} onClick={() => openLetter(next.id)}>
                <span>
                  <span className={s.turnWord}>Năm sau</span>
                  <span className={s.turnName}>{next.name}</span>
                </span>
                <ArrowRight aria-hidden size={22} strokeWidth={2} />
              </button>
            )}
          </nav>
        </article>
      </div>
    </section>
  );
}

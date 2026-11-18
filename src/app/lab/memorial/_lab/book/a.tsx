"use client";

// Option A: Thư gửi thầy (letters to him). The book is a writing desk. Every memory is a letter
// in an airmail envelope (he lived between Hà Nội and Germany), stamped with the writer's own
// photo and postmarked with the day it was sent. One letter lies open on the desk at a time,
// the tribute of Cao Hữu Ngạn first. Writing is writing a letter: "Kính gửi thầy Lê Đức Dương,"
// is already on the sheet; on sending, the sheet folds, goes into an envelope and the postmark
// lands on it.
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Images, PenLine } from "lucide-react";
import { classes } from "../cls";
import { isTribute, metaLine, photoCount, t, type Entry } from "./data";
import { MemoryForm } from "./form";
import { EASE, MOVE, bringIntoView, gsap, moving, useMotion } from "./motion";
import { LetterText, MoreButton, PhotoButtons, SentMark, StatusLine, useBook } from "./parts";
import "./a.css";

const s = classes("lba");
const k = classes("lbk");

const lastWord = (name: string) => name.trim().split(/\s+/).pop() ?? name;

function Envelope({
  entry,
  open,
  index,
  onOpen,
}: {
  entry: Entry;
  open: boolean;
  index: number;
  onOpen: () => void;
}) {
  const photo = entry.photos?.[0];
  const n = photoCount(entry);
  return (
    <li className={s.slot} style={{ "--i": index } as React.CSSProperties} data-envelope={entry.id}>
      <button
        type="button"
        className={s.envelope}
        aria-current={open || undefined}
        data-tribute={isTribute(entry) || undefined}
        data-new={entry.justSent || undefined}
        onClick={onOpen}
      >
        <span className={s.envText}>
          <span className={s.envName}>{entry.name}</span>
          <span className={s.envMeta}>{isTribute(entry) ? t.bookKicker : metaLine(entry)}</span>
          <span className={s.envFoot}>
            <span className={k.srOnly}>{t.sentOn(entry.date)}</span>
            {n > 0 && (
              <span className={s.envPhotos}>
                <Images aria-hidden size={20} strokeWidth={2} />
                {n} ảnh
              </span>
            )}
            <span className={s.reading}>
              <BookOpen aria-hidden size={20} strokeWidth={2} />
              Đang đọc
            </span>
          </span>
        </span>
        <span className={s.stamp} aria-hidden>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.src} alt="" width={photo.w} height={photo.h} loading="lazy" />
          ) : (
            <span className={s.stampInitial}>{lastWord(entry.name).charAt(0)}</span>
          )}
        </span>
        <span className={s.postmark} aria-hidden data-postmark>
          <span>{entry.date.slice(0, 5)}</span>
          <span>{entry.date.slice(6)}</span>
        </span>
        {entry.justSent && <SentMark className={s.envSent} />}
      </button>
    </li>
  );
}

export function OptionA() {
  const book = useBook();
  const [openId, setOpenId] = useState("tribute");
  const [writing, setWriting] = useState(false);
  const root = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const writeButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusAfter = useRef<"heading" | "write" | null>(null);

  const all = book.all;
  const index = Math.max(0, all.findIndex((e) => e.id === openId));
  const entry = all[index];
  const prev = all[index - 1];
  const next = all[index + 1];

  // Arrival: the heading rises, the envelopes are dealt into the tray one after another.
  useMotion(root, (mm, el) => {
    mm.add(MOVE, () => {
      const q = gsap.utils.selector(el);
      gsap.from(q("[data-a-head] > *"), {
        opacity: 0,
        y: 24,
        duration: 1,
        stagger: 0.09,
        ease: EASE.enter,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      gsap.from(q("[data-envelope]"), {
        opacity: 0,
        x: 60,
        rotate: 4,
        duration: 0.9,
        stagger: 0.07,
        ease: EASE.enter,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: q("[data-tray]")[0], start: "top 85%", once: true },
      });
      gsap.from(q("[data-sheet]"), {
        opacity: 0,
        y: 40,
        rotate: -1.2,
        duration: 1.1,
        ease: EASE.enter,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: q("[data-sheet]")[0], start: "top 85%", once: true },
      });
    });
  });

  // A letter coming out of its envelope: the sheet unfolds downwards from its top edge.
  const unfold = () => {
    const el = page.current;
    if (!el || !moving()) return;
    gsap.fromTo(
      el,
      { clipPath: "inset(0% 0% 100% 0%)", y: -18 },
      { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.9, ease: EASE.soft, clearProps: "clipPath,transform" },
    );
  };

  function openLetter(id: string) {
    setWriting(false);
    setOpenId(id);
    focusAfter.current = "heading";
  }

  useEffect(() => {
    if (focusAfter.current === "heading") {
      focusAfter.current = null;
      heading.current?.focus({ preventScroll: true });
      const top = sheet.current?.getBoundingClientRect().top ?? 0;
      if (top < 0 || top > window.innerHeight * 0.6) bringIntoView(sheet.current);
      unfold();
    } else if (focusAfter.current === "write") {
      focusAfter.current = null;
      writeButton.current?.focus();
    }
  }, [openId, writing]);

  // The send moment: the written sheet folds in three and drops into the tray.
  const fold = async () => {
    const el = sheet.current;
    if (!el || !moving()) return;
    await gsap
      .timeline()
      .to(el, { scaleY: 0.34, transformOrigin: "50% 0%", duration: 0.55, ease: "power2.inOut" })
      .to(el, { scale: 0.3, x: () => -el.offsetWidth * 0.4, y: 40, opacity: 0, duration: 0.6, ease: "power2.in" })
      .then(() => undefined);
  };

  const onPosted = (e: Entry) => {
    book.add(e);
    setWriting(false);
    setOpenId(e.id);
    focusAfter.current = "heading";
    if (sheet.current) gsap.set(sheet.current, { clearProps: "transform,opacity" });
    requestAnimationFrame(() => {
      const env = root.current?.querySelector(`[data-envelope="${e.id}"]`);
      const mark = env?.querySelector("[data-postmark]");
      if (!env || !moving()) return;
      gsap
        .timeline()
        .from(env, { y: -90, opacity: 0, rotate: -5, duration: 0.8, ease: EASE.enter, clearProps: "transform,opacity" })
        .from(mark ?? [], { scale: 1.9, opacity: 0, rotate: 18, duration: 0.45, ease: "back.out(2)" }, "-=0.2");
    });
  };

  return (
    <section ref={root} id="book" className={s.section} aria-labelledby="book-h">
      <div className={s.head} data-a-head>
        <h2 id="book-h" className={s.title}>
          {t.bookHeading}
        </h2>
        <p className={s.invite}>{t.bookInvite}</p>
        <button
          ref={writeButton}
          type="button"
          className={`${k.primary} ${s.write}`}
          aria-expanded={writing}
          aria-controls="a-sheet"
          onClick={() => {
            setWriting(true);
            requestAnimationFrame(() => bringIntoView(sheet.current));
          }}
        >
          <PenLine aria-hidden size={22} strokeWidth={2} />
          {t.bookOpen}
        </button>
      </div>

      <div className={s.desk}>
        <div className={s.sheetCol}>
          <div ref={sheet} id="a-sheet" className={s.sheet} data-sheet data-writing={writing || undefined}>
            <MemoryForm
              open={writing}
              shape="letter"
              className={s.letterForm}
              prefill={"Kính gửi thầy,\n\n"}
              onClose={() => {
                setWriting(false);
                focusAfter.current = "write";
              }}
              beforePost={fold}
              onPosted={onPosted}
            />
            <article ref={page} className={s.page} hidden={writing} aria-labelledby="a-letter-h" key={entry.id}>
              <header className={s.letterHead}>
                {entry.justSent && <SentMark />}
                <h3 id="a-letter-h" ref={heading} tabIndex={-1} className={s.from}>
                  {entry.name}
                </h3>
                <p className={s.fromMeta}>
                  {isTribute(entry) ? t.bookKicker : metaLine(entry)}
                  <br />
                  {t.sentOn(entry.date)}
                </p>
              </header>
              <LetterText entry={entry} className={s.text} />
              {photoCount(entry) > 0 && (
                <div className={s.enclosed}>
                  <p className={s.enclosedLabel}>Ảnh gửi kèm</p>
                  <PhotoButtons
                    entry={entry}
                    className={s.prints}
                    itemClass={s.print}
                    style={(i, n) =>
                      ({
                        "--r": `${[-1.6, 1.2, -0.6, 1.8, -1.1][i % 5]}deg`,
                        "--ar": `${entry.photos![i].w ?? 4} / ${entry.photos![i].h ?? 3}`,
                        "--span": n === 1 ? "2" : "1",
                      }) as React.CSSProperties
                    }
                  />
                </div>
              )}
              <nav className={s.turn} aria-label="Đọc tiếp">
                {prev ? (
                  <button type="button" className={s.turnButton} onClick={() => openLetter(prev.id)}>
                    <ArrowLeft aria-hidden size={22} strokeWidth={2} />
                    <span>
                      <span className={s.turnWord}>Thư trước</span>
                      <span className={s.turnName}>{prev.name}</span>
                    </span>
                  </button>
                ) : (
                  <span />
                )}
                {next && (
                  <button type="button" className={`${s.turnButton} ${s.turnNext}`} onClick={() => openLetter(next.id)}>
                    <span>
                      <span className={s.turnWord}>Thư sau</span>
                      <span className={s.turnName}>{next.name}</span>
                    </span>
                    <ArrowRight aria-hidden size={22} strokeWidth={2} />
                  </button>
                )}
              </nav>
            </article>
          </div>
          <StatusLine posted={book.posted} className={s.status} />
        </div>

        <div className={s.tray} data-tray>
          <h3 className={s.trayTitle}>Những lá thư gửi thầy</h3>
          <p className={s.trayCount}>{all.length} lá thư. Bấm vào một phong thư để đọc.</p>
          <ol className={s.stack}>
            {all.map((e, i) => (
              <Envelope key={e.id} entry={e} index={i} open={!writing && e.id === openId} onOpen={() => openLetter(e.id)} />
            ))}
          </ol>
          <MoreButton hidden={book.hidden} onMore={book.more} className={s.more} />
        </div>
      </div>
    </section>
  );
}

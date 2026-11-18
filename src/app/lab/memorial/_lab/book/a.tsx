"use client";

// Option A: Thư gửi thầy (letters to him), revised after the owner's notes.
// Every memory is a letter in an airmail envelope, stamped with the writer's own photo and
// postmarked with the day it was sent, the tribute of Cao Hữu Ngạn first in a black-edged
// mourning envelope. The envelopes sit in one centred carousel, one at a time, with previous and
// next buttons. Opening a letter, or writing one, raises a full-screen sheet from the bottom
// (the way a phone opens a sheet): Escape, the "Đóng" button and the phone's Back button close
// it, and focus returns to the envelope. On sending, the written sheet folds in three and the
// new envelope takes its place in the carousel with its postmark.
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Images, PenLine, X } from "lucide-react";
import { classes } from "../cls";
import { isTribute, metaLine, photoCount, t, type Entry } from "./data";
import { MemoryForm } from "./form";
import { useViewer, type ViewerPhoto } from "./viewer";
import { EASE, MOVE, gsap, moving, useMotion } from "./motion";
import { LetterText, MoreButton, SentMark, StatusLine, useBook } from "./parts";
import "./a.css";

const s = classes("lba");
const k = classes("lbk");

const lastWord = (name: string) => name.trim().split(/\s+/).pop() ?? name;

function Envelope({
  entry,
  centred,
  index,
  onOpen,
}: {
  entry: Entry;
  centred: boolean;
  index: number;
  onOpen: (el: HTMLButtonElement) => void;
}) {
  const photo = entry.photos?.[0];
  const n = photoCount(entry);
  return (
    <li className={s.slide} data-envelope={entry.id} data-centred={centred || undefined} aria-current={centred || undefined}>
      <button
        type="button"
        className={s.envelope}
        data-tribute={isTribute(entry) || undefined}
        data-new={entry.justSent || undefined}
        onClick={(e) => onOpen(e.currentTarget)}
        style={{ "--i": index } as CSSProperties}
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
            <span className={s.envOpen}>Mở thư</span>
          </span>
        </span>
        <span className={s.stamp} aria-hidden>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.thumb ?? photo.src} alt="" width={photo.w} height={photo.h} loading="lazy" />
          ) : (
            <span className={s.stampInitial}>{lastWord(entry.name).charAt(0)}</span>
          )}
        </span>
        <span className={s.recipient} aria-hidden>
          <span className={s.recipientTo}>Kính gửi</span>
          <span className={s.recipientName}>Thầy Lê Đức Dương</span>
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

const captionOf = (entry: Entry, i: number) => entry.photos?.[i]?.caption?.trim() || `Ảnh ${i + 1}`;

/** The photos sent with a letter: one row at one height, each at its own width (a horizontal
 *  masonry), scrolled sideways, each with its caption under it. A photo opens full screen. */
function PhotoStrip({ entry }: { entry: Entry }) {
  const open = useViewer();
  const photos = entry.photos ?? [];
  const group: ViewerPhoto[] = photos.map((p, i) => ({ src: p.src, w: p.w, h: p.h, caption: captionOf(entry, i) }));
  return (
    <ul className={s.strip} tabIndex={0} aria-label={`Ảnh của ${entry.name}`}>
      {photos.map((p, i) => (
        <li key={`${p.src}-${i}`} className={s.stripItem} style={{ "--ar": `${p.w ?? 4} / ${p.h ?? 3}`, "--arn": (p.w ?? 4) / (p.h ?? 3) } as CSSProperties}>
          <figure className={s.stripFig}>
            <button type="button" className={s.stripButton} aria-label={`${captionOf(entry, i)}. Xem ảnh lớn`} onClick={() => open(group, i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} width={p.w} height={p.h} alt="" loading="lazy" style={p.pos ? { objectPosition: p.pos } : undefined} />
            </button>
            <figcaption className={s.stripCaption}>{captionOf(entry, i)}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/** One open letter, as it reads inside the sheet. */
function Letter({
  entry,
  prev,
  next,
  onGo,
  headingRef,
}: {
  entry: Entry;
  prev?: Entry;
  next?: Entry;
  onGo: (id: string) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <article className={s.page} aria-labelledby="a-letter-h">
      <header className={s.letterHead}>
        {entry.justSent && <SentMark />}
        <h3 id="a-letter-h" ref={headingRef} tabIndex={-1} className={s.from}>
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
          <PhotoStrip entry={entry} />
        </div>
      )}
      <nav className={s.turn} aria-label="Đọc tiếp">
        {prev ? (
          <button type="button" className={s.turnButton} onClick={() => onGo(prev.id)}>
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
          <button type="button" className={`${s.turnButton} ${s.turnNext}`} onClick={() => onGo(next.id)}>
            <span>
              <span className={s.turnWord}>Thư sau</span>
              <span className={s.turnName}>{next.name}</span>
            </span>
            <ArrowRight aria-hidden size={22} strokeWidth={2} />
          </button>
        )}
      </nav>
    </article>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function OptionA() {
  const book = useBook();
  const all = book.all;
  const [openId, setOpenId] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [centre, setCentre] = useState(0);
  const sheetOpen = openId !== null || writing;

  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const formWrap = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const pushed = useRef(false);

  const index = openId ? Math.max(0, all.findIndex((e) => e.id === openId)) : -1;
  const entry = index >= 0 ? all[index] : undefined;

  // Arrival: the heading is simply there; the envelopes are laid into the carousel one after
  // another, a short quiet movement that shows the row can be browsed.
  useMotion(
    root,
    (mm, el) => {
      mm.add(MOVE, () => {
        const q = gsap.utils.selector(el);
        gsap.from(q("[data-envelope]"), {
          opacity: 0,
          y: 16,
          duration: 0.7,
          stagger: 0.06,
          ease: EASE.enter,
          clearProps: "transform,opacity",
          // as soon as the row enters the screen: with Lenis' glide a later start reads as a delay
          scrollTrigger: { trigger: track.current, start: "top bottom", once: true },
        });
      });
    },
    [],
    { idle: true },
  );

  // ----- carousel -----
  const slides = () => Array.from(track.current?.querySelectorAll<HTMLElement>("[data-envelope]") ?? []);
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    // measured on screen, so it does not depend on which ancestor is the offset parent
    const box = el.getBoundingClientRect();
    const mid = box.left + box.width / 2;
    let best = 0;
    let bestD = Infinity;
    slides().forEach((li, i) => {
      const r = li.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setCentre((c) => (c === best ? c : best));
  }, []);
  const go = useCallback((i: number, smooth = true) => {
    const el = track.current;
    const li = slides()[i];
    if (!el || !li) return;
    const box = el.getBoundingClientRect();
    const r = li.getBoundingClientRect();
    const left = el.scrollLeft + (r.left + r.width / 2) - (box.left + box.width / 2);
    el.scrollTo({ left, behavior: smooth && moving() ? "smooth" : "auto" });
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, all.length]);

  const onTrackKey = (e: KeyboardEvent<HTMLOListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(Math.min(all.length - 1, centre + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(Math.max(0, centre - 1));
    }
  };

  // ----- the sheet -----
  const finishClose = useCallback(() => {
    const done = () => {
      setClosing(false);
      setOpenId(null);
      setWriting(false);
      trigger.current?.focus({ preventScroll: true });
    };
    if (moving()) {
      setClosing(true);
      window.setTimeout(done, 280);
    } else {
      done();
    }
  }, []);

  const closeSheet = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    }
    finishClose();
  }, [finishClose]);

  const openSheet = (from: HTMLElement | null) => {
    trigger.current = from;
    if (!pushed.current) {
      window.history.pushState({ lbaSheet: true }, "");
      pushed.current = true;
    }
  };

  // The phone's Back button closes the sheet instead of leaving the page.
  useEffect(() => {
    const onPop = () => {
      // Back that only closes the photo viewer lands on the sheet's own entry: the sheet stays.
      const onSheetEntry = (window.history.state as { lbaSheet?: boolean } | null)?.lbaSheet;
      if (pushed.current && !onSheetEntry) {
        pushed.current = false;
        finishClose();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [finishClose]);

  // While the sheet is open the page behind it does not scroll.
  useEffect(() => {
    if (!sheetOpen) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, [sheetOpen]);

  // Focus moves into the sheet: the letter's heading, or the form's first field.
  useEffect(() => {
    if (!sheetOpen) return;
    body.current?.scrollTo({ top: 0 });
    if (entry) heading.current?.focus({ preventScroll: true });
    else panel.current?.querySelector<HTMLElement>("input, textarea")?.focus({ preventScroll: true });
  }, [sheetOpen, openId, writing, entry]);

  // Escape closes; Tab stays inside the sheet.
  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSheet();
      return;
    }
    if (e.key !== "Tab" || !panel.current) return;
    const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  function openLetter(id: string, from: HTMLElement | null) {
    openSheet(from);
    setWriting(false);
    setOpenId(id);
    const i = all.findIndex((e) => e.id === id);
    if (i >= 0) go(i);
  }

  function turnTo(id: string) {
    setOpenId(id);
    const i = all.findIndex((e) => e.id === id);
    if (i >= 0) go(i, false);
    // the next letter comes in from the bottom of the sheet, gently
    requestAnimationFrame(() => {
      const page = body.current?.querySelector("article");
      if (page && moving()) gsap.fromTo(page, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE.enter, clearProps: "transform,opacity" });
    });
  }

  // The send moment: the written sheet folds in three and slips away.
  const fold = async () => {
    const el = formWrap.current;
    if (!el || !moving()) return;
    await gsap
      .timeline()
      .to(el, { scaleY: 0.34, transformOrigin: "50% 0%", duration: 0.55, ease: "power2.inOut" })
      .to(el, { scale: 0.3, y: 60, opacity: 0, duration: 0.6, ease: "power2.in" })
      .then(() => undefined);
  };

  const onPosted = (e: Entry) => {
    book.add(e);
    if (formWrap.current) gsap.set(formWrap.current, { clearProps: "transform,opacity" });
    setWriting(false);
    setOpenId(e.id);
    // behind the sheet, the new envelope takes its place in the carousel and is postmarked
    requestAnimationFrame(() => {
      const i = [...slides()].findIndex((li) => li.dataset.envelope === e.id);
      if (i >= 0) go(i, false);
      const env = root.current?.querySelector(`[data-envelope="${e.id}"]`);
      const mark = env?.querySelector("[data-postmark]");
      if (env && mark && moving()) gsap.from(mark, { scale: 1.35, opacity: 0, duration: 0.6, delay: 0.3, ease: EASE.enter, clearProps: "transform,opacity" });
      trigger.current = env?.querySelector("button") ?? trigger.current;
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
          type="button"
          className={`${k.primary} ${s.write}`}
          aria-haspopup="dialog"
          onClick={(e) => {
            openSheet(e.currentTarget);
            setOpenId(null);
            setWriting(true);
          }}
        >
          <PenLine aria-hidden size={22} strokeWidth={2} />
          {t.bookOpen}
        </button>
      </div>

      <StatusLine posted={book.posted} className={s.status} />
      {book.loadFailed && (
        <p role="status" className={k.hint} style={{ textAlign: "center" }}>
          {t.form.loadFailed}
        </p>
      )}

      <div className={s.carousel} role="region" aria-roledescription="carousel" aria-label="Những lá thư gửi thầy">
        <ol ref={track} className={s.track} tabIndex={0} onScroll={measure} onKeyDown={onTrackKey}>
          {all.map((e, i) => (
            <Envelope key={e.id} entry={e} index={i} centred={i === centre} onOpen={(el) => openLetter(e.id, el)} />
          ))}
        </ol>
        <div className={s.nav}>
          <button type="button" className={s.arrow} onClick={() => go(Math.max(0, centre - 1))} disabled={centre === 0} aria-label="Lá thư trước">
            <ChevronLeft aria-hidden size={28} strokeWidth={1.75} />
          </button>
          <p className={s.count} aria-live="polite">
            Thư {centre + 1} / {all.length}
          </p>
          <button
            type="button"
            className={s.arrow}
            onClick={() => go(Math.min(all.length - 1, centre + 1))}
            disabled={centre >= all.length - 1}
            aria-label="Lá thư sau"
          >
            <ChevronRight aria-hidden size={28} strokeWidth={1.75} />
          </button>
        </div>
        <MoreButton hidden={book.hidden} onMore={book.more} className={s.more} />
      </div>

      {sheetOpen && (
        <div className={s.overlay} data-closing={closing || undefined} onClick={closeSheet}>
          <div
            ref={panel}
            className={s.panel}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby={entry ? "a-letter-h" : undefined}
            aria-label={entry ? undefined : t.bookOpen}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onPanelKey}
          >
            <div className={s.panelBar}>
              <span className={s.handle} aria-hidden />
              <button type="button" className={s.close} onClick={closeSheet} aria-label="Đóng">
                <X aria-hidden size={26} strokeWidth={2} />
              </button>
            </div>
            <div ref={body} className={s.panelBody}>
              <div className={s.sheet}>
                {writing && (
                  <div ref={formWrap}>
                    <MemoryForm
                      open
                      shape="letter"
                      className={s.letterForm}
                      prefill={"Kính gửi thầy,\n\n"}
                      onClose={closeSheet}
                      beforePost={fold}
                      onPosted={onPosted}
                    />
                  </div>
                )}
                {entry && !writing && (
                  <Letter key={entry.id} entry={entry} prev={all[index - 1]} next={all[index + 1]} onGo={turnTo} headingRef={heading} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

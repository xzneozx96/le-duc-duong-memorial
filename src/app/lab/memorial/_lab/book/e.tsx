"use client";

// Option E: Mặt sau tấm ảnh (the back of the photograph). People have always written on the back
// of a photo: who, when, what it meant. The book is a wall of prints hung salon-style, each with
// a small museum label (name, relation). A letter that came with photos hangs as its first photo,
// the others stacked behind; a letter without photos hangs as a card with its own first words.
// Pressing a print takes it off the wall and turns it over: the letter is written on the back.
// Writing one starts from the back of a blank card; once sent it is hung on the wall.
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, PenLine, X } from "lucide-react";
import { classes } from "../cls";
import { metaLine, paragraphs, t, type Entry } from "./data";
import { MemoryForm } from "./form";
import { EASE, MOVE, gsap, moving, useMotion } from "./motion";
import { LetterText, MoreButton, PhotoButtons, SentMark, StatusLine, useBook } from "./parts";
import "./e.css";

const s = classes("lbe");
const k = classes("lbk");

const TILT = [-1.6, 1.1, -0.7, 1.8, -1.2, 0.6, -1.9, 1.4];
const DROP = [0, 36, 12, 48, 4, 28, 18, 40];

function Front({ entry, big = false }: { entry: Entry; big?: boolean }) {
  const photo = entry.photos?.[0];
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={s.frontImg}
        src={photo.src}
        width={photo.w}
        height={photo.h}
        alt=""
        loading={big ? "eager" : "lazy"}
        style={{ aspectRatio: `${photo.w ?? 4} / ${photo.h ?? 3}` }}
      />
    );
  }
  return (
    <span className={s.card} aria-hidden>
      <span className={s.cardWords}>{paragraphs(entry.text)[0].slice(0, 60)}</span>
    </span>
  );
}

function Print({
  entry,
  index,
  away,
  onOpen,
  buttonRef,
}: {
  entry: Entry;
  index: number;
  away: boolean;
  onOpen: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const n = entry.photos?.length ?? 0;
  const photo = entry.photos?.[0];
  const landscape = photo ? (photo.w ?? 4) >= (photo.h ?? 3) : true;
  return (
    <li
      className={s.hang}
      data-print={entry.id}
      data-away={away || undefined}
      data-kind={!photo ? "card" : landscape ? "wide" : "tall"}
      style={{ "--tilt": `${TILT[index % TILT.length]}deg`, "--drop": `${DROP[index % DROP.length]}px` } as CSSProperties}
    >
      <button ref={buttonRef} type="button" className={s.print} onClick={onOpen} aria-label={`Đọc lưu bút của ${entry.name}${entry.justSent ? `, ${t.justSent.toLowerCase()}` : ""}`}>
        <span className={s.frame} data-stack={n > 1 ? Math.min(n, 3) : undefined}>
          <Front entry={entry} />
        </span>
        <span className={s.label} aria-hidden>
          {entry.justSent && <SentMark className={s.labelSent} />}
          <span className={s.labelName}>{entry.name}</span>
          <span className={s.labelMeta}>
            {t.relation[entry.relation]}
            {n > 0 ? `, ${n} ảnh` : ""}
          </span>
        </span>
      </button>
    </li>
  );
}

export function OptionE() {
  const book = useBook();
  const [openId, setOpenId] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const writeDialog = useRef<HTMLDialogElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const writeButton = useRef<HTMLButtonElement>(null);
  const prints = useRef(new Map<string, HTMLButtonElement>());
  const hung = useRef<string | null>(null);
  const pushed = useRef(false);
  const openRef = useRef<string | null>(null);

  useEffect(() => {
    openRef.current = openId;
  }, [openId]);

  const visitors = book.visitors;
  const index = openId ? visitors.findIndex((e) => e.id === openId) : -1;
  const entry = index >= 0 ? visitors[index] : undefined;
  const prev = visitors[index - 1];
  const next = visitors[index + 1];

  // Arrival: the prints are hung one after another, each settling at its own small angle.
  useMotion(root, (mm, el) => {
    mm.add(MOVE, () => {
      const q = gsap.utils.selector(el);
      gsap.from(q("[data-e-head] > *"), { opacity: 0, y: 24, duration: 1, stagger: 0.09, ease: EASE.enter, scrollTrigger: { trigger: el, start: "top 80%", once: true } });
      gsap.from(q("[data-print] .lbe-print"), {
        opacity: 0,
        y: -40,
        rotate: (i) => (i % 2 ? 6 : -6),
        duration: 1.1,
        stagger: 0.1,
        ease: "back.out(1.4)",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: q("[data-wall]")[0], start: "top 75%", once: true },
      });
    });
  });

  // Turning a print over: it lifts, turns edge-on, and the back (the letter) comes round.
  const turnOver = useCallback(() => {
    const el = card.current;
    if (!el) return;
    el.setAttribute("data-side", "back");
    if (!moving()) return;
    el.setAttribute("data-side", "front");
    gsap
      .timeline()
      .fromTo(el, { scale: 0.55, y: 80, rotateY: 0, opacity: 0.3 }, { scale: 0.8, y: 0, opacity: 1, duration: 0.45, ease: "power2.out" })
      .to(el, { rotateY: 90, duration: 0.35, ease: "power2.in" })
      .add(() => el.setAttribute("data-side", "back"))
      .fromTo(el, { rotateY: -90 }, { rotateY: 0, scale: 1, duration: 0.55, ease: EASE.enter, clearProps: "transform,opacity" });
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (entry && !d.open) {
      d.showModal();
      // one history entry, so the phone's Back button hangs the print back instead of leaving
      window.history.pushState(null, "");
      pushed.current = true;
      d.scrollTop = 0;
      heading.current?.focus({ preventScroll: true });
      turnOver();
    } else if (entry && d.open) {
      d.scrollTop = 0;
      heading.current?.focus({ preventScroll: true });
      if (card.current && moving()) gsap.fromTo(card.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, ease: EASE.enter, clearProps: "transform,opacity" });
    }
  }, [entry, turnOver]);

  const hangBack = useCallback(() => {
    const id = openRef.current;
    dialog.current?.close();
    setOpenId(null);
    if (id) prints.current.get(id)?.focus({ preventScroll: true });
  }, []);
  const close = () => {
    if (pushed.current) window.history.back();
    else hangBack();
  };
  useEffect(() => {
    const onPop = () => {
      // Back inside the photo viewer closes only the viewer
      if (document.querySelector(".lbk-viewer[open]")) return;
      if (!pushed.current) return;
      pushed.current = false;
      hangBack();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [hangBack]);

  useEffect(() => {
    const d = writeDialog.current;
    if (!d) return;
    if (writing && !d.open) d.showModal();
    if (!writing && d.open) d.close();
  }, [writing]);

  // After sending: the new print is hung on the wall in front of everyone.
  useEffect(() => {
    const id = hung.current;
    if (!id) return;
    hung.current = null;
    const btn = prints.current.get(id);
    if (!btn) return;
    btn.focus({ preventScroll: true });
    btn.closest("[data-wall]")?.scrollIntoView({ block: "start", behavior: moving() ? "smooth" : "auto" });
    if (moving()) gsap.from(btn, { y: -160, rotate: -10, scale: 1.25, opacity: 0, duration: 1.4, delay: 0.5, ease: "back.out(1.2)", clearProps: "transform,opacity" });
  }, [book.visitors]);

  return (
    <section ref={root} id="book" className={s.section} aria-labelledby="book-h">
      <div className={s.head} data-e-head>
        <h2 id="book-h" className={s.title}>
          {t.bookHeading}
        </h2>
        <p className={s.invite}>{t.bookInvite}</p>
        <button ref={writeButton} type="button" className={k.primary} onClick={() => setWriting(true)}>
          <PenLine aria-hidden size={22} strokeWidth={2} />
          {t.bookOpen}
        </button>
      </div>

      <article className={s.tribute} aria-labelledby="e-tribute-h">
        <header className={s.tributeHead}>
          <h3 id="e-tribute-h" className={s.tributeName}>
            {book.tribute.name}
          </h3>
          <p className={s.tributeMeta}>
            {t.bookKicker}
            <br />
            {t.sentOn(book.tribute.date)}
          </p>
        </header>
        <LetterText entry={book.tribute} className={s.tributeText} />
      </article>

      <div className={s.wall} data-wall>
        <div className={s.wallHead}>
          <h3 className={s.wallTitle}>Những tấm ảnh, những lá thư</h3>
          <p className={s.wallLine}>Lá thư được viết ở mặt sau. Bấm vào một tấm ảnh để lật lại và đọc.</p>
          <StatusLine posted={book.posted} className={s.status} />
        </div>
        <ul className={s.prints}>
          {visitors.map((e, i) => (
            <Print
              key={e.id}
              entry={e}
              index={i}
              away={e.id === openId}
              onOpen={() => setOpenId(e.id)}
              buttonRef={(el) => {
                if (el) prints.current.set(e.id, el);
                else prints.current.delete(e.id);
              }}
            />
          ))}
        </ul>
        <MoreButton hidden={book.hidden} onMore={book.more} className={s.more} />
      </div>

      <dialog
        ref={dialog}
        className={s.dialog}
        aria-labelledby="e-letter-h"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {entry && (
          <div className={s.dialogInner}>
            <button type="button" className={`${k.ghost} ${s.close}`} onClick={close}>
              <X aria-hidden size={22} strokeWidth={2} />
              Treo lại lên tường
            </button>
            <div ref={card} className={s.turnCard} data-side="back" key={entry.id}>
              <div className={s.face} data-face="front" aria-hidden>
                <Front entry={entry} big />
              </div>
              <div className={s.face} data-face="back">
                <header className={s.backHead}>
                  {entry.justSent && <SentMark />}
                  <h3 id="e-letter-h" ref={heading} tabIndex={-1} className={s.backName}>
                    {entry.name}
                  </h3>
                  <p className={s.backMeta}>
                    {metaLine(entry)}
                    <br />
                    {t.sentOn(entry.date)}
                  </p>
                </header>
                <LetterText entry={entry} className={s.backText} />
                {(entry.photos?.length ?? 0) > 0 && (
                  <div className={s.backPhotos}>
                    <p className={s.backPhotosLabel}>{(entry.photos?.length ?? 0) > 1 ? `Mặt trước: ${entry.photos?.length} ảnh` : "Mặt trước"}</p>
                    <PhotoButtons
                      entry={entry}
                      className={s.backPhotoRow}
                      itemClass={s.backPhoto}
                      style={(i) => ({ "--ar": `${entry.photos![i].w ?? 4} / ${entry.photos![i].h ?? 3}` }) as CSSProperties}
                    />
                  </div>
                )}
                <nav className={s.turn} aria-label="Đọc tiếp">
                  {prev ? (
                    <button type="button" className={s.turnButton} onClick={() => setOpenId(prev.id)}>
                      <ArrowLeft aria-hidden size={22} strokeWidth={2} />
                      <span>
                        <span className={s.turnWord}>Tấm trước</span>
                        <span className={s.turnName}>{prev.name}</span>
                      </span>
                    </button>
                  ) : (
                    <span />
                  )}
                  {next && (
                    <button type="button" className={`${s.turnButton} ${s.turnNext}`} onClick={() => setOpenId(next.id)}>
                      <span>
                        <span className={s.turnWord}>Tấm sau</span>
                        <span className={s.turnName}>{next.name}</span>
                      </span>
                      <ArrowRight aria-hidden size={22} strokeWidth={2} />
                    </button>
                  )}
                </nav>
              </div>
            </div>
          </div>
        )}
      </dialog>

      <dialog
        ref={writeDialog}
        className={s.dialog}
        aria-label={t.bookOpen}
        onCancel={(e) => {
          e.preventDefault();
          setWriting(false);
          writeButton.current?.focus();
        }}
      >
        <div className={s.dialogInner}>
          <div className={`${s.turnCard} ${s.blankCard}`} data-side="back">
            <div className={s.face} data-face="back">
              <MemoryForm
                open={writing}
                className={s.form}
                intro="Bạn viết ở mặt sau tấm thiệp này. Nếu bạn chọn ảnh, ảnh đầu tiên sẽ là mặt trước khi tấm thiệp được treo lên tường."
                onClose={() => {
                  setWriting(false);
                  writeButton.current?.focus();
                }}
                onPosted={(e) => {
                  hung.current = e.id;
                  book.add(e);
                  setWriting(false);
                }}
              />
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}

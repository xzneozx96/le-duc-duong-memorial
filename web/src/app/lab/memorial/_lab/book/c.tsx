"use client";

// Option C: Lời kể (the reading room). The book reads like a documentary in chapters: one letter
// per chapter, read in full, never folded. On a wide screen the page is split: the writer's photos
// fill the left half and stay in view while the letter is read on the right, changing as the reader
// moves through it (the tribute, which has no photo, shows its own title there). On a phone each
// chapter opens with the writer's first photo and the others fall between the paragraphs.
// Writing opens a blank chapter at the top; once sent it becomes a chapter of its own.
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { PenLine } from "lucide-react";
import { classes } from "../cls";
import { isTribute, metaLine, paragraphs, t, type Entry } from "./data";
import { MemoryForm } from "./form";
import { EASE, MOVE, ScrollTrigger, SplitText, bringIntoView, gsap, useMotion, useRefreshOnResize } from "./motion";
import { LetterText, MoreButton, SentMark, StatusLine, useBook, usePhotoGroup } from "./parts";
import { useViewer } from "./viewer";
import "./c.css";

const s = classes("lbc");
const k = classes("lbk");

function Stage({ entry }: { entry: Entry }) {
  const open = useViewer();
  const group = usePhotoGroup(entry);
  const photos = entry.photos ?? [];
  if (photos.length === 0) {
    // the tribute shows the book's own words for it; a letter without photos shows its first words
    const first = paragraphs(entry.text)[0];
    const words = isTribute(entry) ? t.bookKicker : first.length <= 48 ? first : t.relation[entry.relation];
    return (
      <div className={s.stage} data-plain data-tribute={isTribute(entry) || undefined}>
        <p className={s.stageWords} aria-hidden>
          {words}
        </p>
      </div>
    );
  }
  return (
    <div className={s.stage}>
      <div className={s.shots}>
        {photos.map((p, i) => (
          <button
            key={`${p.src}-${i}`}
            type="button"
            className={s.shot}
            data-c-shot={i}
            data-active={i === 0 || undefined}
            aria-label={t.entryPhoto(i + 1, entry.name)}
            tabIndex={-1}
            onClick={() => open(group, i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} width={p.w} height={p.h} alt="" loading="lazy" style={p.pos ? { objectPosition: p.pos } : undefined} />
          </button>
        ))}
      </div>
      <div className={s.thumbs}>
        <p className={s.thumbsLabel}>{photos.length > 1 ? `${photos.length} ảnh, bấm để xem lớn` : "Bấm để xem ảnh lớn"}</p>
        <ul className={s.thumbRow}>
          {photos.map((p, i) => (
            <li key={`${p.src}-${i}`}>
              <button
                type="button"
                className={s.thumb}
                data-c-thumb={i}
                data-active={i === 0 || undefined}
                aria-label={t.entryPhoto(i + 1, entry.name)}
                onClick={() => open(group, i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} width={p.w} height={p.h} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Phone: the first photo opens the chapter, the others fall between paragraphs. */
function InlineLetter({ entry }: { entry: Entry }) {
  const open = useViewer();
  const group = usePhotoGroup(entry);
  const photos = entry.photos ?? [];
  if (isTribute(entry) || photos.length === 0) return <LetterText entry={entry} className={s.text} />;
  const ps = paragraphs(entry.text);
  const photo = (i: number) => {
    const p = photos[i];
    return (
      <figure className={s.inlinePhoto} style={{ "--ar": `${p.w ?? 4} / ${p.h ?? 3}` } as CSSProperties}>
        <button type="button" className={k.photoButton} aria-label={t.entryPhoto(i + 1, entry.name)} onClick={() => open(group, i)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} width={p.w} height={p.h} alt="" loading="lazy" />
        </button>
      </figure>
    );
  };
  // photo 1 before the text; photo 2.. after paragraphs 2, 3, …; any left over close the letter
  const rest = photos.slice(1).map((_, j) => j + 1);
  const after = (pi: number) => (pi >= 1 && rest[pi - 1] !== undefined ? rest[pi - 1] : null);
  const leftover = rest.slice(Math.max(0, ps.length - 1));
  return (
    <div className={`${k.read} ${s.text}`} lang={entry.lang}>
      <div className={s.phoneOnly}>{photo(0)}</div>
      {ps.map((p, pi) => (
        <Fragment key={pi}>
          <p>{p}</p>
          {after(pi) !== null && pi < ps.length - 1 && <div className={s.phoneOnly}>{photo(after(pi)!)}</div>}
        </Fragment>
      ))}
      {leftover.map((i) => (
        <div key={i} className={s.phoneOnly}>
          {photo(i)}
        </div>
      ))}
    </div>
  );
}

function Chapter({ entry, headingRef }: { entry: Entry; headingRef: (el: HTMLHeadingElement | null) => void }) {
  return (
    <article className={s.chapter} data-c-chapter={entry.id} aria-labelledby={`c-h-${entry.id}`} data-new={entry.justSent || undefined}>
      <div className={s.stageCol}>
        <Stage entry={entry} />
      </div>
      <div className={s.textCol} data-c-text>
        <header className={s.chapterHead}>
          {entry.justSent && <SentMark />}
          <p className={s.meta}>{isTribute(entry) ? t.bookKicker : metaLine(entry)}</p>
          <h3 id={`c-h-${entry.id}`} ref={headingRef} tabIndex={-1} className={s.name} data-c-name>
            {entry.name}
          </h3>
          <p className={s.date}>{t.sentOn(entry.date)}</p>
        </header>
        <InlineLetter entry={entry} />
        <p className={s.end} aria-hidden>
          <span />
        </p>
      </div>
    </article>
  );
}

export function OptionC() {
  const book = useBook();
  const [writing, setWriting] = useState(false);
  const root = useRef<HTMLElement>(null);
  const writeButton = useRef<HTMLButtonElement>(null);
  const headings = useRef(new Map<string, HTMLHeadingElement>());
  const after = useRef<{ focus: "entry" | "write" | "form"; id?: string } | null>(null);
  const blank = useRef<HTMLDivElement>(null);
  useRefreshOnResize(root);

  const chapterIds = book.all.map((e) => e.id).join(",");

  // Photos follow the reading: as the letter passes, the left half moves to the next photo.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    let triggers: ScrollTrigger[] = [];
    const build = () => {
      triggers.forEach((tr) => tr.kill());
      triggers = [];
      if (!mq.matches) return;
      el.querySelectorAll<HTMLElement>("[data-c-chapter]").forEach((ch) => {
        const shots = ch.querySelectorAll<HTMLElement>("[data-c-shot]");
        const thumbs = ch.querySelectorAll<HTMLElement>("[data-c-thumb]");
        if (shots.length < 2) return;
        const text = ch.querySelector<HTMLElement>("[data-c-text]");
        triggers.push(
          ScrollTrigger.create({
            trigger: text,
            start: "top 20%",
            end: "bottom 80%",
            onUpdate: (self) => {
              const at = Math.min(shots.length - 1, Math.floor(self.progress * shots.length));
              shots.forEach((sh, i) => sh.toggleAttribute("data-active", i === at));
              thumbs.forEach((th, i) => th.toggleAttribute("data-active", i === at));
            },
          }),
        );
      });
    };
    build();
    mq.addEventListener("change", build);
    return () => {
      mq.removeEventListener("change", build);
      triggers.forEach((tr) => tr.kill());
    };
  }, [chapterIds]);

  // Each name arrives line by line from behind a mask; the stage photo settles from a slow zoom.
  useMotion(
    root,
    (mm, el) => {
      mm.add(MOVE, () => {
        const q = gsap.utils.selector(el);
        gsap.from(q("[data-c-open] > *"), { opacity: 0, y: 30, duration: 1.1, stagger: 0.1, ease: EASE.enter });
        q("[data-c-name]").forEach((name) => {
          const split = SplitText.create(name as HTMLElement, { type: "lines", mask: "lines" });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 1.1,
            stagger: 0.08,
            ease: EASE.enter,
            scrollTrigger: { trigger: name as HTMLElement, start: "top 85%", once: true },
          });
        });
        q("[data-c-chapter]").forEach((ch) => {
          const imgs = (ch as HTMLElement).querySelectorAll(".lbc-shot img");
          if (!imgs.length) return;
          gsap.fromTo(imgs, { scale: 1.06 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ch as HTMLElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    [chapterIds],
  );

  useEffect(() => {
    const a = after.current;
    if (!a) return;
    after.current = null;
    if (a.focus === "entry" && a.id) {
      const h = headings.current.get(a.id);
      h?.focus({ preventScroll: true });
      // after the page has re-measured (the form closed above), or the scroll is undone
      window.setTimeout(() => bringIntoView(h?.closest("[data-c-chapter]") ?? null), 420);
    } else if (a.focus === "write") writeButton.current?.focus();
    else if (a.focus === "form") window.setTimeout(() => bringIntoView(blank.current), 420);
  }, [writing, chapterIds]);

  return (
    <section ref={root} id="book" className={s.section} aria-labelledby="book-h">
      <div className={s.opening}>
        <div className={s.openStage}>
          <h2 id="book-h" className={s.title}>
            {t.bookHeading}
          </h2>
        </div>
        <div className={s.openText} data-c-open>
          <p className={s.invite}>{t.bookInvite}</p>
          <button
            ref={writeButton}
            type="button"
            className={k.primary}
            aria-expanded={writing}
            onClick={() => {
              after.current = { focus: "form" };
              setWriting(true);
            }}
          >
            <PenLine aria-hidden size={22} strokeWidth={2} />
            {t.bookOpen}
          </button>
          <nav className={s.contents} aria-label="Những người đã viết">
            <p className={s.contentsLead}>Trong lưu bút này, {book.all.length} lá thư:</p>
            <p className={s.contentsNames}>
              {book.all.map((e, i) => (
                <Fragment key={e.id}>
                  <a href={`#c-h-${e.id}`} className={s.contentsLink}>
                    {e.name}
                  </a>
                  {i < book.all.length - 1 ? ", " : "."}
                </Fragment>
              ))}
            </p>
          </nav>
        </div>
      </div>

      <div ref={blank} className={s.blank} hidden={!writing}>
        <div className={s.stageCol}>
          <div className={s.stage} data-plain data-blank>
            <p className={s.stageWords} aria-hidden>
              Kính gửi thầy,
            </p>
          </div>
        </div>
        <div className={s.textCol}>
          <MemoryForm
            open={writing}
            className={s.form}
            intro="Lá thư của bạn sẽ thành một chương trong lưu bút, ngay sau lời tri ân."
            onClose={() => {
              after.current = { focus: "write" };
              setWriting(false);
            }}
            onPosted={(e) => {
              book.add(e);
              setWriting(false);
              after.current = { focus: "entry", id: e.id };
            }}
          />
        </div>
      </div>

      {book.all.map((e, i) => (
        <Fragment key={e.id}>
          {/* after the tribute: the new chapter comes right under this line */}
          {i === 1 && <StatusLine posted={book.posted} className={s.status} />}
          <Chapter
            entry={e}
            headingRef={(el) => {
              if (el) headings.current.set(e.id, el);
              else headings.current.delete(e.id);
            }}
          />
        </Fragment>
      ))}
      <div className={s.moreRow}>
        <MoreButton hidden={book.hidden} onMore={book.more} />
      </div>
    </section>
  );
}

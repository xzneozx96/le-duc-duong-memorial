"use client";

// Shared pieces of the Lưu bút options: the lab frame, the book's state, a letter's text exactly
// as typed, its photos (each opens the viewer), the "Vừa gửi" mark and the status line.
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { classes } from "../cls";
import { fetchEntries } from "./api";
import { isTribute, paragraphs, t, tributeEntry, tributeParts, visitorEntries, type Entry } from "./data";
import { bookFontVars } from "./fonts";
import { useViewer, ViewerProvider, type ViewerPhoto } from "./viewer";

const s = classes("lbk");

/** Visitor letters shown before "Xem thêm": the product's batch. */
export const BATCH = 20;

/** The page around one option: fonts, a slim lab bar, the section, and the design note. */
export function LabShell({
  letter,
  name,
  note,
  children,
  tone = "paper",
}: {
  letter: string;
  name: string;
  note: ReactNode;
  children: ReactNode;
  tone?: "paper" | "dark";
}) {
  return (
    <div className={`${s.page} ${bookFontVars}`} data-tone={tone}>
      <ViewerProvider>
        <nav className={s.labBar} aria-label="Lab">
          <Link href="/lab/memorial/book" className={s.labBack}>
            <ArrowLeft aria-hidden size={22} strokeWidth={2} />
            Lưu bút options
          </Link>
          <span className={s.labName}>
            Option {letter}: {name}
          </span>
        </nav>
        <main>{children}</main>
        <aside className={s.note} aria-label="Design note">
          <div className={s.noteInner}>
            {note}
            <p>
              <strong>Recommendation across the five.</strong> B, the lanterns: it is the one people will remember and it means
              something in Vietnam, while every letter is still read on paper at full size. If reading comfort must win over
              everything, C. A is the warmest second choice.
            </p>
          </div>
        </aside>
      </ViewerProvider>
    </div>
  );
}

/** The approved Lưu bút placed inside another page (the demo): the book's fonts, colours and
 *  photo viewer, without the lab bar or the design note. */
export function BookEmbed({ children }: { children: ReactNode }) {
  return (
    <div className={`${s.page} ${bookFontVars}`} data-tone="paper" data-embed>
      <ViewerProvider>{children}</ViewerProvider>
    </div>
  );
}

/** The six invented letters, for previewing a full wall in dev only. */
const SAMPLES = process.env.NEXT_PUBLIC_SAMPLE_ENTRIES === "1";

/** The book's state: the tribute, letters sent in this visit (newest first), then the letters the
 *  server holds (newest first). Samples only when NEXT_PUBLIC_SAMPLE_ENTRIES=1. */
export function useBook() {
  const [sent, setSent] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState<Entry[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [posted, setPosted] = useState(false);
  const [shown, setShown] = useState(BATCH);
  useEffect(() => {
    const ctl = new AbortController();
    void fetchEntries(ctl.signal).then((r) => {
      if (ctl.signal.aborted) return;
      if (r.ok) setLoaded(r.entries);
      else setLoadFailed(true);
    });
    return () => ctl.abort();
  }, []);
  const allVisitors = useMemo(() => {
    const ids = new Set(sent.map((e) => e.id));
    return [...sent, ...loaded.filter((e) => !ids.has(e.id)), ...(SAMPLES ? visitorEntries : [])];
  }, [sent, loaded]);
  const visitors = allVisitors.slice(0, shown + sent.length);
  const hidden = Math.max(0, allVisitors.length - visitors.length);
  const add = useCallback((e: Entry) => {
    setSent((all) => [e, ...all]);
    setPosted(true);
  }, []);
  const more = useCallback(() => setShown((n) => n + BATCH), []);
  return { tribute: tributeEntry, visitors, all: [tributeEntry, ...visitors], add, posted, hidden, more, loadFailed };
}

/** A letter's text exactly as typed: one <p> per paragraph, single line breaks kept. The tribute's
 *  own first line (its title) and last line (its signature) are set as such, words unchanged. */
export function LetterText({ entry, className }: { entry: Entry; className?: string }) {
  if (isTribute(entry)) {
    const { title, body, signature } = tributeParts(entry);
    return (
      <div className={`${s.read} ${className ?? ""}`} lang={entry.lang}>
        <p className={s.tributeTitle}>{title}</p>
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className={s.signature}>{signature}</p>
      </div>
    );
  }
  return (
    <div className={`${s.read} ${className ?? ""}`} lang={entry.lang}>
      {paragraphs(entry.text).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function usePhotoGroup(entry: Entry) {
  return useMemo<ViewerPhoto[]>(
    () =>
      (entry.photos ?? []).map((p) => ({
        src: p.src,
        w: p.w,
        h: p.h,
        caption: `${entry.name}, ${t.sentOn(entry.date)}`,
      })),
    [entry],
  );
}

/** The writer's photos as buttons that open the viewer. Layout is the option's. */
export function PhotoButtons({
  entry,
  className,
  itemClass,
  style,
  render,
}: {
  entry: Entry;
  className?: string;
  itemClass?: string;
  style?: (i: number, n: number) => CSSProperties | undefined;
  render?: (img: ReactNode, i: number) => ReactNode;
}) {
  const open = useViewer();
  const group = usePhotoGroup(entry);
  if (group.length === 0) return null;
  return (
    <ul className={className}>
      {(entry.photos ?? []).map((p, i) => {
        const img = (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.src} width={p.w} height={p.h} alt="" loading="lazy" style={p.pos ? { objectPosition: p.pos } : undefined} />
        );
        return (
          <li key={`${p.src}-${i}`} className={itemClass} style={style?.(i, group.length)}>
            <button
              type="button"
              className={s.photoButton}
              aria-label={t.entryPhoto(i + 1, entry.name)}
              onClick={() => open(group, i)}
            >
              {render ? render(img, i) : img}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function SentMark({ className }: { className?: string }) {
  return (
    <p className={`${s.sentMark} ${className ?? ""}`}>
      <Check aria-hidden size={22} strokeWidth={2.25} />
      {t.justSent}
    </p>
  );
}

export function StatusLine({ posted, className }: { posted: boolean; className?: string }) {
  return (
    <div role="status" className={`${s.statusLine} ${className ?? ""}`}>
      {posted && (
        <p className={s.status}>
          <Check aria-hidden size={24} strokeWidth={2} />
          <span>{t.posted}</span>
        </p>
      )}
    </div>
  );
}

export function MoreButton({ hidden, onMore, className }: { hidden: number; onMore: () => void; className?: string }) {
  if (hidden <= 0) return null;
  return (
    <button type="button" className={`${s.ghost} ${className ?? ""}`} onClick={onMore}>
      {t.moreEntries(Math.min(hidden, BATCH))}
    </button>
  );
}

export const cls = s;

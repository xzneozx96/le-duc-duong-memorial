"use client";

// The Lưu bút: invitation, the form behind "Viết lưu bút" (it opens in place), the tribute of
// Cao Hữu Ngạn first, then visitor entries newest first. The form works in the browser only:
// nothing is sent anywhere, and a new entry lives until the page reloads.
// v4 look: an open notebook on the evening ground. Entries are ruled pages, two to a spread on
// wide screens, and each spread opens from its spine as it arrives.
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { Check, CircleAlert, ImagePlus, PenLine } from "lucide-react";
import { classes } from "../cls";
import {
  FAMILY_EMAIL,
  FIRST_BATCH,
  LIMITS,
  sampleEntries,
  tributeEntry,
  type Entry,
  type Relation,
  type Strings,
} from "./content";
import { EASE, MOVE, gsap, useMotion } from "./motion";
import { useViewer, type ViewerPhoto } from "./viewer";

const s = classes("lm");

const RELATIONS: Relation[] = [
  "student",
  "colleague",
  "friend",
  "family",
  "other",
];
const CLAMP_FROM = 600;

function EntryItem({
  entry,
  t,
  headingRef,
}: {
  entry: Entry;
  t: Strings;
  headingRef: (el: HTMLHeadingElement | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const article = useRef<HTMLElement>(null);
  const openViewer = useViewer();
  const long = entry.text.length > CLAMP_FROM;
  const meta = [t.relation[entry.relation], entry.cls, entry.year]
    .filter(Boolean)
    .join(", ");
  const group = useMemo<ViewerPhoto[]>(
    () =>
      (entry.photos ?? []).map((p) => ({
        src: p.src,
        w: p.w,
        h: p.h,
        caption: `${entry.name}, ${t.sentOn(entry.date)}`,
      })),
    [entry, t],
  );

  return (
    <article
      ref={article}
      className={s.entry}
      data-new={entry.justSent || undefined}
      data-tribute={entry.id === "tribute" || undefined}
    >
      {entry.justSent && (
        <p className={s.sentLabel}>
          <Check aria-hidden size={24} strokeWidth={2} />
          {t.justSent}
        </p>
      )}
      <h3 ref={headingRef} tabIndex={-1} className={s.who}>
        {entry.name}
      </h3>
      <p className={s.meta}>
        {meta}
        <br />
        {t.sentOn(entry.date)}
      </p>
      <p
        className={s.entryText}
        lang={entry.lang}
        data-clamped={(long && !open) || undefined}
      >
        {entry.text}
      </p>
      {long && (
        <button
          type="button"
          className={s.textButton}
          aria-expanded={open}
          onClick={() => {
            // Folding a long entry keeps the reader at its start instead of far below it.
            const el = article.current;
            if (open && el && el.getBoundingClientRect().top < 0) {
              window.requestAnimationFrame(() =>
                el.scrollIntoView({ block: "start" }),
              );
            }
            setOpen(!open);
          }}
        >
          {open ? t.collapse : t.readAll}
        </button>
      )}
      {group.length > 0 && (
        <ul className={s.entryPhotos}>
          {(entry.photos ?? []).map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                className={s.frameButton}
                aria-label={t.entryPhoto(i + 1, entry.name)}
                onClick={() => openViewer(group, i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  width={p.w}
                  height={p.h}
                  alt=""
                  loading="lazy"
                  style={
                    p.pos ? ({ "--pos": p.pos } as CSSProperties) : undefined
                  }
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

type Values = {
  name: string;
  relation: Relation | "";
  cls: string;
  year: string;
  message: string;
};
type Picked = { id: string; name: string; url: string; w?: number; h?: number };
type Refused = { name: string; bytes: number; why: "type" | "size" };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  name: "",
  relation: "",
  cls: "",
  year: "",
  message: "",
};
const count = (v: string) => v.normalize("NFC").trim().length;
const pause = (ms: number) =>
  new Promise((done) => window.setTimeout(done, ms));
const today = () => {
  const d = new Date();
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}`;
};

function validate(v: Values, f: Strings["form"]): Errors {
  const e: Errors = {};
  if (count(v.name) === 0) e.name = f.nameMissing;
  else if (count(v.name) > LIMITS.name)
    e.name = f.tooLong(f.name, count(v.name), LIMITS.name);
  if (!v.relation) e.relation = f.relationMissing;
  if (count(v.cls) > LIMITS.cls)
    e.cls = f.tooLong(f.clsField, count(v.cls), LIMITS.cls);
  if (count(v.year) > LIMITS.year)
    e.year = f.tooLong(f.yearField, count(v.year), LIMITS.year);
  if (count(v.message) === 0) e.message = f.messageMissing;
  else if (count(v.message) > LIMITS.message)
    e.message = f.tooLong(f.message, count(v.message), LIMITS.message);
  return e;
}

function FieldMessage({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className={s.fieldError}>
      <CircleAlert aria-hidden size={24} strokeWidth={2} />
      <span>{text}</span>
    </p>
  );
}

function MemoryForm({
  t,
  open,
  onClose,
  onPosted,
}: {
  t: Strings;
  open: boolean;
  onClose: () => void;
  onPosted: (e: Entry) => void;
}) {
  const f = t.form;
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const form = useRef<HTMLFormElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [photos, setPhotos] = useState<Picked[]>([]);
  const [refused, setRefused] = useState<Refused[]>([]);
  const [added, setAdded] = useState(0);
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState<{ i: number; n: number } | null>(null);

  const errors = tried ? validate(values, f) : {};
  const errorCount = Object.keys(errors).length;
  const messageCount = count(values.message);
  const dirty =
    values.name !== "" || values.message !== "" || photos.length > 0;

  useEffect(() => {
    if (open) nameInput.current?.focus();
  }, [open]);

  // Leaving with unsent text asks the browser's own "leave page?" question.
  useEffect(() => {
    if (!dirty) return;
    const ask = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", ask);
    return () => window.removeEventListener("beforeunload", ask);
  }, [dirty]);

  const set = (key: keyof Values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  function pick(files: FileList | null) {
    if (!files) return;
    const good: Picked[] = [];
    const bad: Refused[] = [];
    for (const file of Array.from(files)) {
      const isPhoto =
        file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
      if (!isPhoto)
        bad.push({ name: file.name, bytes: file.size, why: "type" });
      else if (file.size > LIMITS.photoBytes)
        bad.push({ name: file.name, bytes: file.size, why: "size" });
      else
        good.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${good.length}`,
          name: file.name,
          url: URL.createObjectURL(file),
        });
    }
    setPhotos((p) => [...p, ...good]);
    setRefused(bad);
    setAdded(good.length);
    // The viewer fits a photo best when it knows its size.
    for (const g of good) {
      const probe = new Image();
      probe.onload = () =>
        setPhotos((p) =>
          p.map((x) =>
            x.id === g.id
              ? { ...x, w: probe.naturalWidth, h: probe.naturalHeight }
              : x,
          ),
        );
      probe.src = g.url;
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setTried(true);
    const found = validate(values, f);
    const first = (
      ["name", "relation", "cls", "year", "message"] as const
    ).find((k) => found[k]);
    if (first) {
      form.current
        ?.querySelector<HTMLElement>(`[data-field="${first}"]`)
        ?.focus();
      return;
    }
    // Simulated sending: one step per photo, or one short wait.
    const n = photos.length;
    if (n === 0) {
      setSending({ i: 0, n: 0 });
      await pause(1100);
    } else {
      for (let i = 1; i <= n; i++) {
        setSending({ i, n });
        await pause(550);
      }
    }
    onPosted({
      id: `sent-${Date.now()}`,
      name: values.name.trim(),
      relation: values.relation || "other",
      cls: values.cls.trim() || undefined,
      year: values.year.trim() || undefined,
      date: today(),
      text: values.message.trim().replace(/\n{3,}/g, "\n\n"),
      photos: photos.map((p) => ({ src: p.url, w: p.w, h: p.h })),
      justSent: true,
    });
    setValues(EMPTY);
    setPhotos([]);
    setRefused([]);
    setAdded(0);
    setTried(false);
    setSending(null);
  }

  const describe = (...ids: (string | false | undefined)[]) =>
    ids.filter(Boolean).join(" ") || undefined;

  return (
    <form
      ref={form}
      className={s.form}
      hidden={!open}
      noValidate
      onSubmit={submit}
      aria-labelledby={id("title")}
    >
      <div className={s.formHead}>
        <h3 id={id("title")} className={s.formTitle}>
          {t.bookOpen}
        </h3>
        <p className={s.formCloseRow}>
          <button type="button" className={s.textButton} onClick={onClose}>
            {t.formClose}
          </button>
          <span className={s.hint}>{t.formCloseNote}</span>
        </p>
      </div>

      <div className={s.fields} inert={sending !== null}>
        <div className={s.field}>
          <label htmlFor={id("name")} className={s.label}>
            {f.name}
          </label>
          <input
            ref={nameInput}
            id={id("name")}
            data-field="name"
            className={s.input}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe(errors.name && id("name-error"))}
          />
          <FieldMessage id={id("name-error")} text={errors.name} />
        </div>

        <fieldset
          className={s.field}
          aria-describedby={describe(errors.relation && id("relation-error"))}
        >
          <legend className={s.label}>{f.relation}</legend>
          <div
            className={s.radios}
            data-invalid={errors.relation ? true : undefined}
          >
            {RELATIONS.map((r, i) => (
              <label key={r} className={s.radioRow}>
                <input
                  type="radio"
                  name={id("relation")}
                  data-field={i === 0 ? "relation" : undefined}
                  value={r}
                  checked={values.relation === r}
                  onChange={() => setValues((v) => ({ ...v, relation: r }))}
                />
                <span>{t.relation[r]}</span>
              </label>
            ))}
          </div>
          <FieldMessage id={id("relation-error")} text={errors.relation} />
        </fieldset>

        <div className={s.fieldPair}>
          <div className={s.field}>
            <label htmlFor={id("cls")} className={s.label}>
              {f.cls}
            </label>
            <p id={id("cls-hint")} className={s.hint}>
              {f.clsHint}
            </p>
            <input
              id={id("cls")}
              data-field="cls"
              className={s.input}
              type="text"
              autoComplete="off"
              value={values.cls}
              onChange={set("cls")}
              aria-invalid={errors.cls ? true : undefined}
              aria-describedby={describe(
                id("cls-hint"),
                errors.cls && id("cls-error"),
              )}
            />
            <FieldMessage id={id("cls-error")} text={errors.cls} />
          </div>
          <div className={s.field}>
            <label htmlFor={id("year")} className={s.label}>
              {f.year}
            </label>
            <p id={id("year-hint")} className={s.hint}>
              {f.yearHint}
            </p>
            <input
              id={id("year")}
              data-field="year"
              className={s.input}
              type="text"
              autoComplete="off"
              value={values.year}
              onChange={set("year")}
              aria-invalid={errors.year ? true : undefined}
              aria-describedby={describe(
                id("year-hint"),
                errors.year && id("year-error"),
              )}
            />
            <FieldMessage id={id("year-error")} text={errors.year} />
          </div>
        </div>

        <div className={s.field}>
          <label htmlFor={id("message")} className={s.label}>
            {f.message}
          </label>
          <p id={id("message-hint")} className={s.hint}>
            {f.messageHint}
          </p>
          <textarea
            id={id("message")}
            data-field="message"
            className={`${s.input} ${s.textarea}`}
            rows={7}
            autoComplete="off"
            value={values.message}
            onChange={set("message")}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describe(
              id("message-hint"),
              errors.message && id("message-error"),
            )}
          />
          {messageCount >= LIMITS.counterFrom && (
            <p className={s.hint}>{f.counter(messageCount, LIMITS.message)}</p>
          )}
          <FieldMessage id={id("message-error")} text={errors.message} />
        </div>

        <div className={s.field}>
          <p className={s.label} id={id("photos-label")}>
            {f.photos}
          </p>
          <p id={id("photos-hint")} className={s.hint}>
            {f.photosHint}
          </p>
          <input
            ref={fileInput}
            id={id("photos")}
            className={s.srOnly}
            type="file"
            accept="image/*"
            multiple
            tabIndex={-1}
            aria-labelledby={id("photos-label")}
            onChange={(e) => pick(e.target.files)}
          />
          <button
            type="button"
            className={`${s.ghost} ${s.pickButton}`}
            aria-describedby={id("photos-hint")}
            onClick={() => fileInput.current?.click()}
          >
            <ImagePlus aria-hidden size={24} strokeWidth={2} />
            {f.pick}
          </button>
          {photos.length > 0 && (
            <ul className={s.thumbs}>
              {photos.map((p) => (
                <li key={p.id} className={s.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" width={96} height={96} />
                  <span className={s.thumbName}>{p.name}</span>
                  <button
                    type="button"
                    className={s.textButton}
                    aria-label={f.removeNamed(p.name)}
                    onClick={() => {
                      URL.revokeObjectURL(p.url);
                      setPhotos((all) => all.filter((x) => x.id !== p.id));
                      setAdded(0);
                    }}
                  >
                    {f.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div role="status" className={s.refusals}>
            {added > 0 && <p className={s.srOnly}>{f.added(added)}</p>}
            {refused.map((r) => (
              <p key={`${r.name}-${r.bytes}`} className={s.fieldError}>
                <CircleAlert aria-hidden size={24} strokeWidth={2} />
                <span>
                  {r.why === "type"
                    ? f.notPhoto(r.name)
                    : f.tooBig(r.name, r.bytes)}
                </span>
              </p>
            ))}
          </div>
          {photos.length >= 6 && (
            <p className={s.hint}>{f.manyPhotos(photos.length)}</p>
          )}
        </div>
      </div>

      <p className={s.privacy}>{f.privacy(FAMILY_EMAIL)}</p>
      <div role="alert">
        {errorCount > 0 && (
          <p className={`${s.fieldError} ${s.summary}`}>
            <CircleAlert aria-hidden size={24} strokeWidth={2} />
            <span>{f.summary(errorCount)}</span>
          </p>
        )}
      </div>
      <button
        type="submit"
        className={s.primary}
        aria-disabled={sending !== null || undefined}
      >
        {sending
          ? sending.n > 0
            ? f.sendingPhoto(sending.i, sending.n)
            : f.sending
          : f.send}
      </button>
    </form>
  );
}

export function Book({ t }: { t: Strings }) {
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState<Entry[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [posted, setPosted] = useState(false);
  const openButton = useRef<HTMLButtonElement>(null);
  const headings = useRef(new Map<string, HTMLHeadingElement>());
  const focusNext = useRef<string | null>(null);
  const root = useRef<HTMLElement>(null);

  // Pages open from the spine as they arrive: the left page swings in from the right edge, the
  // right page from the left edge. Once, quickly; the words are never held back after that.
  useMotion(root, (mm, el) => {
    mm.add(MOVE, () => {
      const pages = Array.from(el.querySelectorAll<HTMLElement>("[data-page]"));
      openPages(pages);
    });
  });

  const samples = showAll ? sampleEntries : sampleEntries.slice(0, FIRST_BATCH);
  const hiddenCount = sampleEntries.length - FIRST_BATCH;
  const entries = [tributeEntry, ...sent, ...samples];

  useEffect(() => {
    const target = focusNext.current;
    focusNext.current = null;
    if (!target) return;
    const heading = headings.current.get(target);
    heading?.focus();
    // A new entry settles onto its page: the sand of the "Vừa gửi" light fades into the paper.
    const page = heading?.closest<HTMLElement>("[data-page]");
    if (page && window.matchMedia(MOVE).matches) {
      gsap.fromTo(page, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: EASE.enter, clearProps: "transform" });
    } else if (page) {
      gsap.set(page, { opacity: 1 });
    }
  }, [sent, showAll]);

  useEffect(() => {
    if (!formOpen && focusNext.current === "open-button") {
      focusNext.current = null;
      openButton.current?.focus();
    }
  }, [formOpen]);

  return (
    <section ref={root} id="book" className={s.book} aria-labelledby="book-h">
      <div className={s.bookBand}>
        <div className={`${s.wrap} ${s.bookIntro}`}>
          <h2 id="book-h" className={s.bookHead}>
            {t.bookHeading}
          </h2>
          <div className={s.bookAsk}>
            <p className={s.bookInvite}>{t.bookInvite}</p>
            {!formOpen && (
              <button
                ref={openButton}
                type="button"
                className={`${s.primary} ${s.bookOpen}`}
                onClick={() => setFormOpen(true)}
              >
                <PenLine aria-hidden size={22} strokeWidth={2} />
                {t.bookOpen}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={s.bookInner}>
        <div className={s.bookMain}>
          <MemoryForm
            t={t}
            open={formOpen}
            onClose={() => {
              focusNext.current = "open-button";
              setFormOpen(false);
            }}
            onPosted={(entry) => {
              focusNext.current = entry.id;
              setSent((all) => [entry, ...all]);
              setPosted(true);
              setFormOpen(false);
            }}
          />
          <div role="status" className={s.statusLine}>
            {posted && (
              <p className={s.status}>
                <Check aria-hidden size={24} strokeWidth={2} />
                <span>{t.posted}</span>
              </p>
            )}
          </div>
          <ol className={s.entries}>
            {entries.map((entry) => (
              <li key={entry.id} data-page>
                <EntryItem
                  entry={entry}
                  t={t}
                  headingRef={(el) => {
                    if (el) headings.current.set(entry.id, el);
                    else headings.current.delete(entry.id);
                  }}
                />
              </li>
            ))}
          </ol>
          {!showAll && hiddenCount > 0 && (
            <button
              type="button"
              className={`${s.ghost} ${s.moreEntries}`}
              onClick={() => {
                focusNext.current = sampleEntries[FIRST_BATCH].id;
                setShowAll(true);
              }}
            >
              {t.moreEntries(hiddenCount)}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/** Each page arrives once, from its spine on wide screens and from below on phones. */
function openPages(pages: HTMLElement[]) {
  const half = (el: HTMLElement) => (el.parentElement?.clientWidth ?? 0) / 2;
  const isLeft = (el: HTMLElement) => el.offsetLeft < half(el) - 8;
  const isSpread = (el: HTMLElement) => el.offsetWidth > half(el) * 1.4;
  pages.forEach((page) => {
    gsap.fromTo(
      page,
      !isSpread(page) && window.matchMedia("(min-width: 900px)").matches
        ? { opacity: 0, rotateY: isLeft(page) ? 16 : -16, transformOrigin: isLeft(page) ? "100% 50%" : "0% 50%" }
        : { opacity: 0, y: 32 },
      {
        opacity: 1,
        rotateY: 0,
        y: 0,
        duration: 1.1,
        ease: EASE.enter,
        clearProps: "transform",
        scrollTrigger: { trigger: page, start: "top 92%", once: true },
      },
    );
  });
}

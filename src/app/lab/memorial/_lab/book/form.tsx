"use client";

// The Lưu bút form, copied from the demo (demo/book.tsx, MemoryForm) so every option shares one
// working behaviour: labels and hints, no maxlength, worded field messages, photo checks (type,
// 5 MB), a simulated send (one step per photo), and a form that stays mounted while closed, so
// "Đóng biểu mẫu" keeps what was typed. Nothing is sent anywhere.
// Two shapes: "fields" (the demo's order) and "letter" (the message first under a printed
// salutation, then who wrote it, as one writes a letter). Options dress it through `className`.
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, ImagePlus } from "lucide-react";
import { classes } from "../cls";
import { FAMILY_EMAIL, LIMITS, RELATIONS, t, type Entry, type Relation } from "./data";

const s = classes("lbk");
const f = t.form;

type Values = { name: string; relation: Relation | ""; cls: string; year: string; message: string };
type Picked = { id: string; name: string; url: string; w?: number; h?: number };
type Refused = { name: string; bytes: number; why: "type" | "size" };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", relation: "", cls: "", year: "", message: "" };
const count = (v: string) => v.normalize("NFC").trim().length;
const pause = (ms: number) => new Promise((done) => window.setTimeout(done, ms));
const today = () => {
  const d = new Date();
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}`;
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (count(v.name) === 0) e.name = f.nameMissing;
  else if (count(v.name) > LIMITS.name) e.name = f.tooLong(f.name, count(v.name), LIMITS.name);
  if (!v.relation) e.relation = f.relationMissing;
  if (count(v.cls) > LIMITS.cls) e.cls = f.tooLong(f.clsField, count(v.cls), LIMITS.cls);
  if (count(v.year) > LIMITS.year) e.year = f.tooLong(f.yearField, count(v.year), LIMITS.year);
  if (count(v.message) === 0) e.message = f.messageMissing;
  else if (count(v.message) > LIMITS.message) e.message = f.tooLong(f.message, count(v.message), LIMITS.message);
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

export function MemoryForm({
  open,
  onClose,
  onPosted,
  shape = "fields",
  className,
  title = t.bookOpen,
  intro,
  prefill = "",
  beforePost,
}: {
  open: boolean;
  onClose: () => void;
  onPosted: (e: Entry) => void;
  shape?: "fields" | "letter";
  className?: string;
  title?: string;
  /** a line under the title, the option's own words */
  intro?: ReactNode;
  /** the message's opening words, already typed and editable, e.g. "Kính gửi thầy," */
  prefill?: string;
  /** runs after the simulated send and before the entry appears (an option's send moment) */
  beforePost?: () => Promise<void>;
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const form = useRef<HTMLFormElement>(null);
  const firstInput = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const start: Values = { ...EMPTY, message: prefill };
  const [values, setValues] = useState<Values>(start);
  const [photos, setPhotos] = useState<Picked[]>([]);
  const [refused, setRefused] = useState<Refused[]>([]);
  const [added, setAdded] = useState(0);
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState<{ i: number; n: number } | null>(null);

  // a message that is only the words already on the page counts as empty
  const checked = (v: Values): Values => (v.message.trim() === prefill.trim() ? { ...v, message: "" } : v);
  const errors = tried ? validate(checked(values)) : {};
  const errorCount = Object.keys(errors).length;
  const messageCount = count(values.message);
  const dirty = values.name !== "" || values.message !== prefill || photos.length > 0;
  const order =
    shape === "letter"
      ? (["message", "name", "relation", "cls", "year"] as const)
      : (["name", "relation", "cls", "year", "message"] as const);

  useEffect(() => {
    const el = firstInput.current;
    if (!open || !el) return;
    el.focus({ preventScroll: true });
    // the caret goes after the words already written, on the line where the letter begins
    if (el instanceof HTMLTextAreaElement) el.setSelectionRange(el.value.length, el.value.length);
  }, [open]);

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
      const isPhoto = file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
      if (!isPhoto) bad.push({ name: file.name, bytes: file.size, why: "type" });
      else if (file.size > LIMITS.photoBytes) bad.push({ name: file.name, bytes: file.size, why: "size" });
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
    for (const g of good) {
      const probe = new Image();
      probe.onload = () =>
        setPhotos((p) => p.map((x) => (x.id === g.id ? { ...x, w: probe.naturalWidth, h: probe.naturalHeight } : x)));
      probe.src = g.url;
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setTried(true);
    const found = validate(checked(values));
    const first = order.find((k) => found[k]);
    if (first) {
      form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
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
    if (beforePost) await beforePost();
    onPosted({
      id: `sent-${Date.now()}`,
      name: values.name.trim(),
      relation: values.relation || "other",
      cls: values.cls.trim() || undefined,
      year: values.year.trim() || undefined,
      date: today(),
      text: values.message.trim().replace(/\n{3,}/g, "\n\n"),
      // the object URLs stay alive: the new entry shows them
      photos: photos.map((p) => ({ src: p.url, w: p.w, h: p.h })),
      justSent: true,
    });
    setValues(start);
    setPhotos([]);
    setRefused([]);
    setAdded(0);
    setTried(false);
    setSending(null);
  }

  const describe = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

  const nameField = (
    <div className={s.field} key="name">
      <label htmlFor={id("name")} className={s.label}>
        {f.name}
      </label>
      <input
        ref={shape === "fields" ? (el) => void (firstInput.current = el) : undefined}
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
  );

  const relationField = (
    <fieldset className={s.field} key="relation" aria-describedby={describe(errors.relation && id("relation-error"))}>
      <legend className={s.label}>{f.relation}</legend>
      <div className={s.radios} data-invalid={errors.relation ? true : undefined}>
        {RELATIONS.map((r, i) => (
          <label key={r} className={s.radio}>
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
  );

  const pairField = (
    <div className={s.fieldPair} key="pair">
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
          aria-describedby={describe(id("cls-hint"), errors.cls && id("cls-error"))}
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
          aria-describedby={describe(id("year-hint"), errors.year && id("year-error"))}
        />
        <FieldMessage id={id("year-error")} text={errors.year} />
      </div>
    </div>
  );

  const messageField = (
    <div className={`${s.field} ${s.messageField}`} key="message">
      <label htmlFor={id("message")} className={s.label}>
        {f.message}
      </label>
      <p id={id("message-hint")} className={s.hint}>
        {f.messageHint}
      </p>
      <textarea
        ref={shape === "letter" ? (el) => void (firstInput.current = el) : undefined}
        id={id("message")}
        data-field="message"
        className={`${s.input} ${s.textarea}`}
        rows={9}
        autoComplete="off"
        value={values.message}
        onChange={set("message")}
        aria-invalid={errors.message ? true : undefined}
        aria-describedby={describe(id("message-hint"), errors.message && id("message-error"))}
      />
      {messageCount >= LIMITS.counterFrom && <p className={s.hint}>{f.counter(messageCount, LIMITS.message)}</p>}
      <FieldMessage id={id("message-error")} text={errors.message} />
    </div>
  );

  const photosField = (
    <div className={s.field} key="photos">
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
            <span>{r.why === "type" ? f.notPhoto(r.name) : f.tooBig(r.name, r.bytes)}</span>
          </p>
        ))}
      </div>
      {photos.length >= 6 && <p className={s.hint}>{f.manyPhotos(photos.length)}</p>}
    </div>
  );

  const fields =
    shape === "letter"
      ? [messageField, photosField, <hr key="rule" className={s.formRule} />, nameField, relationField, pairField]
      : [nameField, relationField, pairField, messageField, photosField];

  return (
    <form
      ref={form}
      className={`${s.form} ${className ?? ""}`}
      data-shape={shape}
      hidden={!open}
      noValidate
      onSubmit={submit}
      aria-labelledby={id("title")}
    >
      <div className={s.formHead}>
        <h3 id={id("title")} className={s.formTitle}>
          {title}
        </h3>
        {intro && <div className={s.formIntro}>{intro}</div>}
        <p className={s.formCloseRow}>
          <button type="button" className={s.textButton} onClick={onClose}>
            {t.formClose}
          </button>
          <span className={s.hint}>{t.formCloseNote}</span>
        </p>
      </div>

      <div className={s.fields} inert={sending !== null}>
        {fields}
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
      <button type="submit" className={`${s.primary} ${s.send}`} aria-disabled={sending !== null || undefined}>
        {sending ? (sending.n > 0 ? f.sendingPhoto(sending.i, sending.n) : f.sending) : f.send}
      </button>
    </form>
  );
}

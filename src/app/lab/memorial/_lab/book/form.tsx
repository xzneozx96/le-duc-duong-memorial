"use client";

// The Lưu bút form, copied from the demo (demo/book.tsx, MemoryForm) so every option shares one
// working behaviour: labels and hints, no maxlength, worded field messages, photo checks (type,
// 5 MB), a simulated send (one step per photo), and a form that stays mounted while closed, so
// closing it keeps what was typed. Nothing is sent anywhere.
// Two shapes: "fields" (the demo's order) and "letter" (the message first under a printed
// salutation, then who wrote it, as one writes a letter). Options dress it through `className`.
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, ImagePlus, X } from "lucide-react";
import { classes } from "../cls";
import { LIMITS, RELATIONS, t, type Entry, type Relation } from "./data";
import { FieldMessage, SelectField, TextArea, TextField } from "./fields";

const s = classes("lbk");
const f = t.form;

type Values = { name: string; relation: Relation | ""; cls: string; year: string; message: string };
type Picked = { id: string; name: string; url: string; w?: number; h?: number; caption?: string };
const CAPTION_MAX = 140;
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
      photos: photos.map((p) => ({ src: p.url, w: p.w, h: p.h, caption: p.caption?.trim() || undefined })),
      justSent: true,
    });
    setValues(start);
    setPhotos([]);
    setRefused([]);
    setAdded(0);
    setTried(false);
    setSending(null);
  }

  const firstRef = (el: HTMLInputElement | HTMLTextAreaElement | null) => void (firstInput.current = el);

  const nameField = (
    <TextField
      key="name"
      id={id("name")}
      label={f.name}
      inputRef={shape === "fields" ? firstRef : undefined}
      data-field="name"
      autoComplete="name"
      value={values.name}
      onChange={set("name")}
      error={errors.name}
    />
  );

  const relationField = (
    <SelectField
      key="relation"
      id={id("relation")}
      label={f.relation}
      placeholder="Chọn quan hệ"
      data-field="relation"
      value={values.relation}
      onChange={(e) => setValues((v) => ({ ...v, relation: e.target.value as Relation }))}
      options={RELATIONS.map((r) => ({ value: r, label: t.relation[r] }))}
      error={errors.relation}
    />
  );

  const pairField = (
    <div className={s.fieldPair} key="pair">
      <TextField
        id={id("cls")}
        label={f.cls}
        data-field="cls"
        autoComplete="off"
        value={values.cls}
        onChange={set("cls")}
        error={errors.cls}
      />
      <TextField
        id={id("year")}
        label={f.year}
        data-field="year"
        autoComplete="off"
        value={values.year}
        onChange={set("year")}
        error={errors.year}
      />
    </div>
  );

  const messageField = (
    <TextArea
      key="message"
      id={id("message")}
      label={f.message}
      className={s.messageField}
      inputRef={shape === "letter" ? firstRef : undefined}
      data-field="message"
      rows={9}
      autoComplete="off"
      value={values.message}
      onChange={set("message")}
      error={errors.message}
      after={messageCount >= LIMITS.counterFrom ? <p className={s.hint}>{f.counter(messageCount, LIMITS.message)}</p> : null}
    />
  );

  const removePhoto = (p: Picked) => {
    URL.revokeObjectURL(p.url);
    setPhotos((all) => all.filter((x) => x.id !== p.id));
    setAdded(0);
  };

  // Photos: a grid of tiles. Each chosen photo shows whole-width with a round x to remove it and
  // its own caption field under it; the last tile adds more.
  const photosField = (
    <div className={s.field} key="photos">
      <p className={s.label} id={id("photos-label")}>
        {f.photos}
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
      <ul className={s.photoGrid}>
        {photos.map((p, i) => (
          <li key={p.id} className={s.photoTile}>
            <div className={s.photoFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" width={p.w} height={p.h} />
              <button type="button" className={s.photoRemove} aria-label={f.removeNamed(p.name)} onClick={() => removePhoto(p)}>
                <X aria-hidden size={22} strokeWidth={2.25} />
              </button>
            </div>
            <input
              id={id(`cap-${p.id}`)}
              className={`${s.control} ${s.photoCaption}`}
              type="text"
              maxLength={CAPTION_MAX}
              placeholder="Thêm chú thích"
              aria-label={`Chú thích cho ảnh ${i + 1}`}
              value={p.caption ?? ""}
              onChange={(e) => {
                const caption = e.target.value;
                setPhotos((all) => all.map((x) => (x.id === p.id ? { ...x, caption } : x)));
              }}
            />
          </li>
        ))}
        <li className={s.photoTile}>
          <button
            type="button"
            className={s.photoAdd}
            onClick={() => fileInput.current?.click()}
          >
            <ImagePlus aria-hidden size={34} strokeWidth={1.75} />
            <span>{photos.length > 0 ? "Thêm ảnh" : f.pick}</span>
          </button>
        </li>
      </ul>
      <div role="status" className={s.refusals}>
        {added > 0 && <p className={s.srOnly}>{f.added(added)}</p>}
        {refused.map((r) => (
          <p key={`${r.name}-${r.bytes}`} className={s.fieldError}>
            <CircleAlert aria-hidden size={24} strokeWidth={2} />
            <span>{r.why === "type" ? f.notPhoto(r.name) : f.tooBig(r.name, r.bytes)}</span>
          </p>
        ))}
      </div>
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
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      aria-labelledby={id("title")}
    >
      <div className={s.formHead}>
        <h3 id={id("title")} className={s.formTitle}>
          {title}
        </h3>
        {intro && <div className={s.formIntro}>{intro}</div>}
      </div>

      <div className={s.fields} inert={sending !== null}>
        {fields}
      </div>

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

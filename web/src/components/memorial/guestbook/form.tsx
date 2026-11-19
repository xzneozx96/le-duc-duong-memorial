"use client";

// The Lưu bút form: labels and hints, no maxlength, worded field messages, photo checks (type,
// 5 MB), the real send (photos one at a time, then the letter: see send.ts), and a form that stays
// mounted while closed, so closing it keeps what was typed. A failed send keeps everything.
// Two shapes: "fields" (the usual order) and "letter" (the message first under a printed
// salutation, then who wrote it, as one writes a letter). The caller dresses it through `className`.
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, ImagePlus, LoaderCircle, X } from "lucide-react";
import { classes } from "@/components/memorial/cls";
import { LIMITS, RELATIONS, t, type Entry, type Relation } from "./data";
import { GUESTBOOK_DEMO, formatDate, postEntry, uploadPhoto } from "./api";
import { SelectField, TextArea, TextField } from "./fields";
import { failureMessage, isHeic, sendLetter } from "./send";

const s = classes("lbk");
const f = t.form;

type Values = { name: string; relation: Relation | ""; cls: string; year: string; message: string };
type Picked = { id: string; file: File; name: string; url: string; w?: number; h?: number; caption?: string };
const CAPTION_MAX = 140;
type Refused = { name: string; bytes: number; why: "type" | "size" | "heic" };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", relation: "", cls: "", year: "", message: "" };
const count = (v: string) => v.normalize("NFC").trim().length;

/** What the server's 422 field codes say, in the form's own words. */
function serverFieldErrors(codes: Partial<Record<string, string>>, v: Values): Errors {
  const out: Errors = {};
  const limits = { name: [f.name, LIMITS.name], cls: [f.clsField, LIMITS.cls], year: [f.yearField, LIMITS.year], message: [f.message, LIMITS.message] } as const;
  for (const key of ["name", "relation", "cls", "year", "message"] as const) {
    const code = codes[key];
    if (!code) continue;
    if (code === "required") {
      out[key] = key === "name" ? f.nameMissing : key === "relation" ? f.relationMissing : key === "message" ? f.messageMissing : f.invalidField;
    } else if (code === "tooLong" && key in limits) {
      const [label, max] = limits[key as keyof typeof limits];
      out[key] = f.tooLong(label, count(v[key]), max);
    } else out[key] = f.invalidField;
  }
  return out;
}


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
  /** a line under the title, the caller's own words */
  intro?: ReactNode;
  /** the message's opening words, already typed and editable, e.g. "Kính gửi thầy," */
  prefill?: string;
  /** runs after the send succeeded and before the entry appears (the caller's send moment) */
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
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);
  // photo id to the server's id for photos already uploaded: a re-send does not upload them again
  const uploaded = useRef(new Map<string, string>());
  // one id per letter, made at the first press of send and kept for re-sends, so a lost reply cannot post it twice
  const requestId = useRef<string | null>(null);

  // a message that is only the words already on the page counts as empty
  const checked = (v: Values): Values => (v.message.trim() === prefill.trim() ? { ...v, message: "" } : v);
  const errors: Errors = { ...serverErrors, ...(tried ? validate(checked(values)) : {}) };
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

  const clearServer = (key: keyof Values) => setServerErrors((all) => ({ ...all, [key]: undefined }));
  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    clearServer(key);
  };

  function pick(files: FileList | null) {
    if (!files) return;
    const good: Picked[] = [];
    const bad: Refused[] = [];
    for (const file of Array.from(files)) {
      const isPhoto = file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
      if (isHeic(file)) bad.push({ name: file.name, bytes: file.size, why: "heic" });
      else if (!isPhoto) bad.push({ name: file.name, bytes: file.size, why: "type" });
      else if (file.size > LIMITS.photoBytes) bad.push({ name: file.name, bytes: file.size, why: "size" });
      else
        good.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${good.length}-${crypto.randomUUID()}`,
          file,
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
    setFailure(null);
    setServerErrors({});
    if (GUESTBOOK_DEMO) {
      // Demo build: nothing leaves this browser; the letter shows on the wall until reload.
      const n = photos.length;
      for (let i = n ? 1 : 0; i <= n; i++) {
        setSending({ i, n });
        await new Promise((r) => setTimeout(r, n ? 450 : 900));
      }
      if (beforePost) await beforePost();
      onPosted({
        id: `demo-${crypto.randomUUID()}`,
        name: values.name.trim(),
        relation: values.relation || "other",
        cls: values.cls.trim() || undefined,
        year: values.year.trim() || undefined,
        date: formatDate(new Date().toISOString()),
        text: values.message.trim().replace(/\n{3,}/g, "\n\n"),
        // the object URLs stay alive: the letter shows them
        photos: photos.map((p) => ({ src: p.url, w: p.w ?? 1200, h: p.h ?? 900, caption: p.caption?.trim() || undefined })),
        justSent: true,
      });
      setValues(start);
      setPhotos([]);
      setRefused([]);
      setAdded(0);
      setTried(false);
      setSending(null);
      return;
    }
    setSending({ i: 0, n: 0 });
    const result = await sendLetter({
      fields: { ...values, relation: values.relation || "other" },
      photos: photos.map((p) => ({ key: p.id, file: p.file, caption: p.caption })),
      uploaded: uploaded.current,
      requestId: (requestId.current ??= crypto.randomUUID()),
      onProgress: (i, n) => setSending({ i, n }),
      api: { uploadPhoto: (file) => uploadPhoto(file), postEntry: (input) => postEntry(input) },
    });
    if (!result.ok) {
      setSending(null);
      if (result.kind === "fields") {
        const shown = serverFieldErrors(result.errors, values);
        setServerErrors(shown);
        const first = order.find((k) => shown[k]);
        if (first) form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
        if (!first) setFailure(f.notSent);
      } else setFailure(failureMessage(result));
      return;
    }
    if (beforePost) await beforePost();
    for (const p of photos) URL.revokeObjectURL(p.url);
    uploaded.current.clear();
    requestId.current = null;
    onPosted({ ...result.entry, justSent: true });
    setValues(start);
    setPhotos([]);
    setRefused([]);
    setAdded(0);
    setTried(false);
    setFailure(null);
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
      onChange={(e) => {
        setValues((v) => ({ ...v, relation: e.target.value as Relation }));
        clearServer("relation");
      }}
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
    uploaded.current.delete(p.id);
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
            <span>{r.why === "heic" ? f.heicNotAccepted(r.name) : r.why === "type" ? f.notPhoto(r.name) : f.tooBig(r.name, r.bytes)}</span>
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
        {failure && (
          <p className={`${s.fieldError} ${s.summary}`}>
            <CircleAlert aria-hidden size={24} strokeWidth={2} />
            <span>{failure}</span>
          </p>
        )}
      </div>
      <button
        type="submit"
        className={`${s.primary} ${s.send}`}
        aria-disabled={sending !== null || undefined}
        aria-busy={sending !== null || undefined}
      >
        {sending && <LoaderCircle aria-hidden className={s.spinner} size={22} strokeWidth={2.25} />}
        {sending ? (sending.n > 0 ? f.sendingPhoto(sending.i, sending.n) : f.sending) : f.send}
      </button>
    </form>
  );
}

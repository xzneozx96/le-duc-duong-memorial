// The send sequence of the form: photos one at a time in order, then the letter. Plain logic with
// the API injected, so it can be tested without a browser. `uploaded` (photo key to server id) is
// the caller's memory across attempts: a photo already in it is not uploaded again.
import type { EntryInput, FieldErrors, PostResult, UploadResult } from "./api";
import { t, type Entry, type Relation } from "./data";

export type SendPhoto = { key: string; file: File; caption?: string };
export type SendFields = { name: string; relation: Relation; cls: string; year: string; message: string };
export type SendOutcome =
  | { ok: true; entry: Entry }
  | { ok: false; kind: "photo"; file: string; reason: "tooBig" | "notPhoto" | "heic" }
  | { ok: false; kind: "fields"; errors: FieldErrors }
  | { ok: false; kind: "general"; reason: "busy" | "storageFull" | "failed" | "photos" | "tooBig" };

export async function sendLetter({
  fields,
  photos,
  uploaded,
  requestId,
  onProgress,
  api,
}: {
  fields: SendFields;
  photos: SendPhoto[];
  uploaded: Map<string, string>;
  /** one per letter, kept across re-sends: the server returns the first letter for a repeat */
  requestId: string;
  onProgress: (i: number, n: number) => void;
  api: {
    uploadPhoto: (file: File) => Promise<UploadResult>;
    postEntry: (input: EntryInput) => Promise<PostResult>;
  };
}): Promise<SendOutcome> {
  const n = photos.length;
  for (let i = 0; i < n; i++) {
    const p = photos[i];
    onProgress(i + 1, n);
    if (uploaded.has(p.key)) continue;
    const r = await api.uploadPhoto(p.file);
    if (!r.ok) {
      if (r.reason === "tooBig" || r.reason === "notPhoto" || r.reason === "heic") {
        return { ok: false, kind: "photo", file: p.file.name, reason: r.reason };
      }
      return { ok: false, kind: "general", reason: r.reason };
    }
    uploaded.set(p.key, r.id);
  }
  const input: EntryInput = {
    requestId,
    name: fields.name.trim(),
    relation: fields.relation,
    ...(fields.cls.trim() ? { cls: fields.cls.trim() } : {}),
    ...(fields.year.trim() ? { year: fields.year.trim() } : {}),
    message: fields.message.trim().replace(/\n{3,}/g, "\n\n"),
    photos: photos.map((p) => {
      const caption = p.caption?.trim();
      return { id: uploaded.get(p.key)!, ...(caption ? { caption } : {}) };
    }),
  };
  const r = await api.postEntry(input);
  if (r.ok) return { ok: true, entry: r.entry };
  if (r.reason === "fields") return { ok: false, kind: "fields", errors: r.errors };
  if (r.reason === "photos") uploaded.clear();
  return { ok: false, kind: "general", reason: r.reason };
}

/** HEIC and HEIF are always refused by the server, so the form refuses them when they are added. */
export const isHeic = (file: File) => /^image\/hei[cf]$/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

/** The Vietnamese message for a failed send. */
export function failureMessage(r: Exclude<SendOutcome, { ok: true } | { kind: "fields" }>): string {
  const f = t.form;
  if (r.kind === "photo") return f.photoRefused(r.file, r.reason);
  if (r.reason === "photos") return f.photosExpired;
  if (r.reason === "storageFull") return f.storageFull;
  if (r.reason === "tooBig") return f.tooLongToSend;
  return f.notSent;
}

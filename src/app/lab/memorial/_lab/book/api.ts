// The Lưu bút's calls to the backend (docs/backend.md). Client only: no server imports.
import type { Entry, Relation } from "./data";

export type PublicPhoto = {
  id: string;
  width: number;
  height: number;
  caption?: string | null;
  src: string;
  thumb: string;
};
export type PublicEntry = {
  id: string;
  name: string;
  relation: Relation;
  cls?: string | null;
  year?: string | null;
  message: string;
  createdAt: string;
  photos?: PublicPhoto[];
};

export type UploadResult =
  | { ok: true; id: string; width: number; height: number }
  | { ok: false; reason: "tooBig" | "notPhoto" | "heic" | "busy" | "storageFull" | "failed" };

export type FieldCode = "required" | "tooLong" | "invalid";
export type FieldErrors = Partial<Record<string, FieldCode>>;
export type EntryInput = {
  /** one per letter; a repeat returns the first letter (HTTP 200) instead of a second one */
  requestId?: string;
  name: string;
  relation: Relation;
  cls?: string;
  year?: string;
  message: string;
  photos: { id: string; caption?: string }[];
};
export type PostResult =
  | { ok: true; entry: Entry }
  | { ok: false; reason: "fields"; errors: FieldErrors }
  | { ok: false; reason: "photos" | "tooBig" | "busy" | "failed" };

const two = (n: number) => String(n).padStart(2, "0");
/** "19.11.2026", as the sample letters write it (the reader's local day). */
function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function toEntry(p: PublicEntry): Entry {
  return {
    id: p.id,
    name: p.name,
    relation: p.relation,
    cls: p.cls || undefined,
    year: p.year || undefined,
    date: formatDate(p.createdAt),
    text: p.message,
    photos: (p.photos ?? []).map((x) => ({
      src: x.src,
      thumb: x.thumb,
      w: x.width,
      h: x.height,
      caption: x.caption || undefined,
    })),
  };
}

async function body(res: Response): Promise<Record<string, unknown>> {
  try {
    const v = await res.json();
    return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export async function uploadPhoto(file: File, signal?: AbortSignal): Promise<UploadResult> {
  try {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/photos", { method: "POST", body: form, signal });
    const b = await body(res);
    if (res.status === 201 || res.status === 200) {
      const { id, width, height } = b;
      if (typeof id === "string" && typeof width === "number" && typeof height === "number") return { ok: true, id, width, height };
      return { ok: false, reason: "failed" };
    }
    if (res.status === 413) return { ok: false, reason: "tooBig" };
    if (res.status === 415) return { ok: false, reason: b.error === "heic" ? "heic" : "notPhoto" };
    if (res.status === 429) return { ok: false, reason: "busy" };
    if (res.status === 507) return { ok: false, reason: "storageFull" };
    return { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

export async function postEntry(input: EntryInput, signal?: AbortSignal): Promise<PostResult> {
  try {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
      signal,
    });
    const b = await body(res);
    if (res.status === 201 || res.status === 200) {
      return typeof b.id === "string" ? { ok: true, entry: toEntry(b as unknown as PublicEntry) } : { ok: false, reason: "failed" };
    }
    if (res.status === 422 && b.errors && typeof b.errors === "object") {
      return { ok: false, reason: "fields", errors: b.errors as FieldErrors };
    }
    if (res.status === 400 && b.errors && typeof b.errors === "object") return { ok: false, reason: "photos" };
    if (res.status === 413) return { ok: false, reason: "tooBig" };
    if (res.status === 429) return { ok: false, reason: "busy" };
    return { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

export async function fetchEntries(signal?: AbortSignal): Promise<{ ok: true; entries: Entry[] } | { ok: false }> {
  try {
    const res = await fetch("/api/entries", { signal, cache: "no-store" });
    if (!res.ok) return { ok: false };
    const list: unknown = await res.json();
    if (!Array.isArray(list)) return { ok: false };
    return { ok: true, entries: (list as PublicEntry[]).map(toEntry) };
  } catch {
    return { ok: false };
  }
}

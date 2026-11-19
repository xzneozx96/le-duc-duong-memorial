import { z } from "zod";

export const RELATIONS = ["student", "colleague", "friend", "family", "other"] as const;
export type Relation = (typeof RELATIONS)[number];

export const LIMITS = { name: 100, cls: 50, year: 50, message: 5000, caption: 140 } as const;

export type FieldCode = "required" | "tooLong" | "invalid";
export type FieldErrors = Partial<Record<string, FieldCode>>;

export type EntryInput = {
  name: string;
  relation: Relation;
  cls: string | null;
  year: string | null;
  message: string;
  photos: { id: string; caption: string | null }[];
  requestId: string | null;
};

export type ParseResult =
  | { ok: true; value: EntryInput }
  | { ok: false; errors: Record<string, FieldCode> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Length as a person reads it: Unicode code points after NFC. */
const length = (s: string) => [...s].length;

const BAD = Symbol("bad");

/** Trimmed, NFC string, null when blank or absent, BAD when not a string. */
function clean(value: unknown): string | null | typeof BAD {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return BAD;
  const text = value
    .replace(/\r\n?/g, "\n")
    // C0 controls except \n and \t, and DEL. NUL would make Postgres reject the insert.
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .normalize("NFC")
    .trim();
  return text || null;
}

function text(max: number, required: boolean, collapseBlankLines = false) {
  return z.unknown().transform((value, ctx) => {
    let s = clean(value);
    if (s === BAD) {
      ctx.addIssue({ code: "custom", message: "invalid" });
      return z.NEVER;
    }
    if (s === null) {
      if (required) ctx.addIssue({ code: "custom", message: "required" });
      return required ? z.NEVER : null;
    }
    if (collapseBlankLines) s = s.replace(/\n(?:[ \t]*\n){2,}/g, "\n\n");
    if (length(s) > max) {
      ctx.addIssue({ code: "custom", message: "tooLong" });
      return z.NEVER;
    }
    return s;
  });
}

const relation = z.unknown().transform((value, ctx) => {
  if (value === undefined || value === null || value === "") {
    ctx.addIssue({ code: "custom", message: "required" });
    return z.NEVER;
  }
  if (typeof value !== "string" || !(RELATIONS as readonly string[]).includes(value)) {
    ctx.addIssue({ code: "custom", message: "invalid" });
    return z.NEVER;
  }
  return value as Relation;
});

const photos = z.unknown().transform((value, ctx) => {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    ctx.addIssue({ code: "custom", message: "invalid" });
    return z.NEVER;
  }
  const out: { id: string; caption: string | null }[] = [];
  let code: FieldCode | null = null;
  const seen = new Set<string>();
  for (const item of value) {
    const rec = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const id = typeof rec.id === "string" ? rec.id.toLowerCase() : "";
    if (!UUID.test(id) || seen.has(id)) {
      code ??= "invalid";
      continue;
    }
    seen.add(id);
    const caption = clean(rec.caption);
    if (caption === BAD) {
      code ??= "invalid";
      continue;
    }
    if (caption !== null && length(caption) > LIMITS.caption) code = "tooLong";
    out.push({ id, caption });
  }
  if (code) {
    ctx.addIssue({ code: "custom", message: code });
    return z.NEVER;
  }
  return out;
});

const requestId = z.unknown().transform((value, ctx) => {
  const s = clean(value);
  if (s === BAD || (s !== null && !UUID.test(s))) {
    ctx.addIssue({ code: "custom", message: "invalid" });
    return z.NEVER;
  }
  return s === null ? null : s.toLowerCase();
});

const schema = z.object({
  name: text(LIMITS.name, true),
  relation,
  cls: text(LIMITS.cls, false),
  year: text(LIMITS.year, false),
  message: text(LIMITS.message, true, true),
  photos,
  requestId,
});

export function parseEntryInput(raw: unknown): ParseResult {
  const body = (raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
  // Pass every key explicitly: zod skips transforms for keys that are absent.
  const result = schema.safeParse({
    name: body.name ?? null,
    relation: body.relation ?? null,
    cls: body.cls ?? null,
    year: body.year ?? null,
    message: body.message ?? null,
    photos: body.photos ?? null,
    requestId: body.requestId ?? null,
  });
  if (result.success) return { ok: true, value: result.data as EntryInput };
  const errors: Record<string, FieldCode> = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "body");
    errors[field] ??= issue.message as FieldCode;
  }
  return { ok: false, errors };
}

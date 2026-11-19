// Content for the Lưu bút options. Everything comes from the demo's content file (not edited):
// the tribute of Cao Hữu Ngạn, the six mock letters and the Vietnamese strings.
import {
  FAMILY_EMAIL,
  FIRST_BATCH,
  LIMITS,
  sampleEntries,
  tributeEntry,
  ui,
  type Entry as BaseEntry,
  type Relation,
  type Strings,
} from "../demo/content";

export { FAMILY_EMAIL, FIRST_BATCH, LIMITS, sampleEntries, tributeEntry };
export type { Relation, Strings };

/** The demo's entry, with an optional small copy of each photo (real letters carry one). */
export type Entry = Omit<BaseEntry, "photos"> & { photos?: (NonNullable<BaseEntry["photos"]>[number] & { thumb?: string })[] };

export const t: Strings = ui.vi;

export const RELATIONS: Relation[] = ["student", "colleague", "friend", "family", "other"];

/** The book as it opens: the tribute first, then visitor letters newest first. */
export const visitorEntries: Entry[] = [...sampleEntries].reverse();

/** Paragraphs as typed: blank lines split them, single line breaks stay inside (pre-line). */
export const paragraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

/** "Học trò, Lớp D3, 1978–1979": commas, no middle dots. */
export const metaLine = (e: Entry) =>
  [t.relation[e.relation], e.cls, e.year].filter(Boolean).join(", ");

/** The tribute's own title line and signature, so they can be set as title and signature. */
export function tributeParts(e: Entry) {
  const ps = paragraphs(e.text);
  return { title: ps[0], body: ps.slice(1, -1), signature: ps[ps.length - 1] };
}

/** The first sentence of the body after the greeting: used as the line an envelope or a
 *  lantern shows. Taken from the letter itself, never written for the writer. */
export function openingLine(e: Entry, max = 140) {
  const ps = paragraphs(e.text);
  const body = e.id === "tribute" ? ps[1] : ps.length > 1 ? ps[1] : ps[0];
  const first = body.split(/(?<=[.!?…»])\s+/)[0] ?? body;
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** The first four-digit year a writer gave ("1978–1979" gives 1978). */
export function firstYear(e: Entry): number | null {
  const m = e.year?.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

export const isTribute = (e: Entry) => e.id === "tribute";

export const photoCount = (e: Entry) => e.photos?.length ?? 0;

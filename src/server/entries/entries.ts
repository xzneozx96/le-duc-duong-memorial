import "server-only";
import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import type { Db } from "@/server/db/client";
import { entries, photos, type EntryRow, type PhotoRow } from "@/server/db/schema";
import type { EntryInput } from "./validation";

export type PublicPhoto = {
  id: string;
  width: number;
  height: number;
  caption?: string;
  src: string;
  thumb: string;
};
export type PublicEntry = {
  id: string;
  name: string;
  relation: string;
  cls?: string;
  year?: string;
  message: string;
  createdAt: string;
  photos: PublicPhoto[];
};
export type CreateResult =
  | { ok: true; created: boolean; entry: PublicEntry }
  | { ok: false; errors: { photos: "invalid" } };

const toPublicPhoto = (p: PhotoRow): PublicPhoto => ({
  id: p.id,
  width: p.width,
  height: p.height,
  ...(p.caption ? { caption: p.caption } : {}),
  src: `/api/photos/${p.id}`,
  thumb: `/api/photos/${p.id}?size=thumb`,
});

const toPublicEntry = (e: EntryRow, ps: PhotoRow[]): PublicEntry => ({
  id: e.id,
  name: e.name,
  relation: e.relation,
  ...(e.cls ? { cls: e.cls } : {}),
  ...(e.year ? { year: e.year } : {}),
  message: e.message,
  createdAt: e.createdAt.toISOString(),
  photos: ps.map(toPublicPhoto),
});

class BadPhotos extends Error {}

const isUniqueViolation = (e: unknown) =>
  (e as { code?: string; cause?: { code?: string } } | null)?.code === "23505" ||
  (e as { cause?: { code?: string } } | null)?.cause?.code === "23505";

async function findByRequestId(db: Db, requestId: string): Promise<PublicEntry | null> {
  const [row] = await db.select().from(entries).where(eq(entries.requestId, requestId));
  if (!row) return null;
  const ps = await db.select().from(photos).where(eq(photos.entryId, row.id)).orderBy(asc(photos.position));
  return toPublicEntry(row, ps);
}

/**
 * Inserts the entry and attaches its staged photos in one transaction, or writes nothing.
 *
 * Idempotent on `requestId`: a repeat returns the first entry (created: false) and writes nothing,
 * whatever the repeat's content or photo list. Two concurrent posts with the same id are settled
 * by the unique constraint: the loser's insert fails and it re-reads the winner's entry.
 */
export async function createEntry(db: Db, input: EntryInput): Promise<CreateResult> {
  const { requestId } = input;
  if (requestId) {
    const existing = await findByRequestId(db, requestId);
    if (existing) return { ok: true, created: false, entry: existing };
  }
  try {
    return await db.transaction(async (tx) => {
      const [entry] = await tx
        .insert(entries)
        .values({
          name: input.name,
          relation: input.relation,
          cls: input.cls,
          year: input.year,
          message: input.message,
          requestId,
        })
        .returning();
      const attached: PhotoRow[] = [];
      for (const [position, p] of input.photos.entries()) {
        // entry_id is null only while staged, so an attached photo matches no row here.
        const [row] = await tx
          .update(photos)
          .set({ entryId: entry.id, position, caption: p.caption })
          .where(and(eq(photos.id, p.id), isNull(photos.entryId)))
          .returning();
        if (!row) throw new BadPhotos();
        attached.push(row);
      }
      return { ok: true as const, created: true, entry: toPublicEntry(entry, attached) };
    });
  } catch (e) {
    if (e instanceof BadPhotos) return { ok: false, errors: { photos: "invalid" } };
    if (requestId && isUniqueViolation(e)) {
      const existing = await findByRequestId(db, requestId);
      if (existing) return { ok: true, created: false, entry: existing };
    }
    throw e;
  }
}

/** Visible entries, newest first, each with its attached photos in order. */
export async function listVisibleEntries(db: Db): Promise<PublicEntry[]> {
  const rows = await db
    .select()
    .from(entries)
    .where(eq(entries.hidden, false))
    .orderBy(desc(entries.createdAt), desc(entries.id));
  if (rows.length === 0) return [];
  const ps = await db
    .select()
    .from(photos)
    .where(inArray(photos.entryId, rows.map((r) => r.id)))
    .orderBy(asc(photos.position));
  const byEntry = new Map<string, PhotoRow[]>();
  for (const p of ps) byEntry.set(p.entryId!, [...(byEntry.get(p.entryId!) ?? []), p]);
  return rows.map((r) => toPublicEntry(r, byEntry.get(r.id) ?? []));
}

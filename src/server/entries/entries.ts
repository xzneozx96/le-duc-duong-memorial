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
  | { ok: true; entry: PublicEntry }
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

/** Inserts the entry and attaches its staged photos in one transaction, or writes nothing. */
export async function createEntry(db: Db, input: EntryInput): Promise<CreateResult> {
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
      return { ok: true as const, entry: toPublicEntry(entry, attached) };
    });
  } catch (e) {
    if (e instanceof BadPhotos) return { ok: false, errors: { photos: "invalid" } };
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

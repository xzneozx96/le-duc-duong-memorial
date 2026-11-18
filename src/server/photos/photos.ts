import "server-only";
import { randomUUID } from "node:crypto";
import { and, eq, inArray, isNull, lt, sql } from "drizzle-orm";
import type { Db } from "@/server/db/client";
import { entries, photos } from "@/server/db/schema";
import type { PhotoStore, StoredObject } from "./store";
import { processPhoto, type ProcessResult } from "./process";
import { createSemaphore } from "./semaphore";

export type PhotoDeps = {
  db: Db;
  store: PhotoStore;
  /** total bytes the photos table may account for (display + thumb); default from PHOTO_QUOTA_BYTES */
  quotaBytes?: number;
  /** swapped by tests; defaults to processPhoto */
  process?: typeof processPhoto;
};
export type StageResult =
  | { ok: true; id: string; width: number; height: number }
  | { ok: false; reason: Extract<ProcessResult, { ok: false }>["reason"] | "storageFull" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WEBP = "image/webp";
/** Two conversions at a time per process keeps memory bounded when many people upload at once. */
const gate = createSemaphore(2);

/** Processes the upload, stores both copies and inserts a staged row (entry_id null). */
export async function stagePhoto(
  { db, store, quotaBytes, process = processPhoto }: PhotoDeps,
  bytes: Uint8Array,
): Promise<StageResult> {
  const processed = await gate.run(() => process(bytes));
  if (!processed.ok) return processed;

  // Quota counts display + thumb of every photo row, staged or attached.
  const size = processed.display.data.length + processed.thumb.data.length;
  const [{ used }] = await db.select({ used: sql<number>`coalesce(sum(${photos.bytes}), 0)::float8` }).from(photos);
  if (used + size > (quotaBytes ?? quotaFromEnv())) {
    console.error("photos: storage quota reached, upload refused");
    return { ok: false, reason: "storageFull" };
  }

  // Random keys, unrelated to the row id: nothing in the bucket can be guessed from a URL.
  const displayKey = `display/${randomUUID()}.webp`;
  const thumbKey = `thumb/${randomUUID()}.webp`;
  const written: string[] = [];
  try {
    for (const [key, img] of [[displayKey, processed.display], [thumbKey, processed.thumb]] as const) {
      written.push(key);
      await store.put(key, img.data, WEBP);
    }
    const [row] = await db
      .insert(photos)
      .values({
        width: processed.display.width,
        height: processed.display.height,
        displayKey,
        thumbKey,
        bytes: size,
      })
      .returning({ id: photos.id });
    return { ok: true, id: row.id, width: processed.display.width, height: processed.display.height };
  } catch (e) {
    // Do not leave orphans in the bucket; a failed cleanup must not hide the original error.
    await Promise.allSettled(written.map((key) => store.delete(key)));
    throw e;
  }
}

async function findPublic(db: Db, id: string) {
  if (!UUID.test(id)) return null;
  const [row] = await db
    .select({ displayKey: photos.displayKey, thumbKey: photos.thumbKey })
    .from(photos)
    .innerJoin(entries, eq(photos.entryId, entries.id))
    .where(and(eq(photos.id, id), eq(entries.hidden, false)))
    .limit(1);
  return row ?? null;
}

/** True only when the photo belongs to a visible (not hidden) entry. */
export async function isPublicPhoto(db: Db, id: string): Promise<boolean> {
  return (await findPublic(db, id)) !== null;
}

/** The stored image, only when its photo belongs to a visible (not hidden) entry. */
export async function getPublicPhoto(
  { db, store }: PhotoDeps,
  id: string,
  size: "display" | "thumb",
): Promise<StoredObject | null> {
  const row = await findPublic(db, id);
  if (!row) return null;
  return store.get(size === "thumb" ? row.thumbKey : row.displayKey);
}

export const DEFAULT_QUOTA_BYTES = 20_000_000_000;
export const STAGED_MAX_AGE_MS = 60 * 60 * 1000;

export function quotaFromEnv(): number {
  const n = Number(process.env.PHOTO_QUOTA_BYTES);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_QUOTA_BYTES;
}

/** Deletes photos still staged after STAGED_MAX_AGE_MS: the row and both stored copies. */
export async function sweepStagedPhotos({ db, store }: PhotoDeps, now: Date): Promise<{ removed: number }> {
  const cutoff = new Date(now.getTime() - STAGED_MAX_AGE_MS);
  const stale = await db.select({ id: photos.id }).from(photos).where(and(isNull(photos.entryId), lt(photos.createdAt, cutoff)));
  if (stale.length === 0) return { removed: 0 };
  // Rows first, and only while still staged: a photo attached meanwhile survives.
  const gone = await db
    .delete(photos)
    .where(and(inArray(photos.id, stale.map((r) => r.id)), isNull(photos.entryId)))
    .returning({ displayKey: photos.displayKey, thumbKey: photos.thumbKey });
  await Promise.allSettled(gone.flatMap((r) => [store.delete(r.displayKey), store.delete(r.thumbKey)]));
  return { removed: gone.length };
}

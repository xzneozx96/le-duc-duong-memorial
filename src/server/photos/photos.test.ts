import { eq } from "drizzle-orm";
import sharp from "sharp";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { closeTestDb, insertEntry, openTestDb, resetTables } from "../../../test/db";
import { openTestS3 } from "../../../test/s3";
import type { Db } from "@/server/db/client";
import { photos } from "@/server/db/schema";
import { getPublicPhoto, quotaFromEnv, stagePhoto, sweepStagedPhotos } from "./photos";
import { createS3PhotoStore, type PhotoStore } from "./store";

let db: Db;
let store: PhotoStore;
beforeAll(async () => {
  db = await openTestDb();
  store = createS3PhotoStore(await openTestS3());
});
afterAll(closeTestDb);
beforeEach(() => resetTables(db));

const jpeg = (w = 300, h = 200) =>
  sharp({ create: { width: w, height: h, channels: 3, background: { r: 10, g: 120, b: 200 } } })
    .jpeg()
    .toBuffer();
const read = async (s: ReadableStream<Uint8Array>) => Buffer.from(await new Response(s).arrayBuffer());

/** Stages a photo and attaches it to a new entry. */
async function stagedPhoto(w = 300, h = 200) {
  const r = await stagePhoto({ db, store }, await jpeg(w, h));
  if (!r.ok) throw new Error(r.reason);
  return r;
}

describe("stagePhoto", () => {
  it("stores both copies and inserts a staged row, answering id, width and height", async () => {
    const r = await stagePhoto({ db, store }, await jpeg(4000, 3000));
    expect(r).toMatchObject({ ok: true, width: 1600, height: 1200 });
    if (!r.ok) throw new Error();
    const [row] = await db.select().from(photos).where(eq(photos.id, r.id));
    expect(row).toMatchObject({ entryId: null, width: 1600, height: 1200 });
    expect(row.displayKey).not.toBe(row.thumbKey);
    const display = await store.get(row.displayKey);
    const thumb = await store.get(row.thumbKey);
    expect(display?.contentType).toBe("image/webp");
    expect((await sharp(await read(display!.body)).metadata()).width).toBe(1600);
    expect((await sharp(await read(thumb!.body)).metadata()).width).toBe(480);
    expect(row.bytes).toBe(display!.contentLength! + thumb!.contentLength!); // quota counts both copies
  });

  it("names the reason and stores nothing when the file is not a photo", async () => {
    expect(await stagePhoto({ db, store }, Buffer.from("%PDF-1.7 hello"))).toEqual({ ok: false, reason: "notPhoto" });
    expect(await db.select().from(photos)).toHaveLength(0);
  });

  it("deletes the stored copies when the database insert fails", async () => {
    const put: string[] = [];
    const spy: PhotoStore = {
      ...store,
      put: async (k, d, t) => {
        put.push(k);
        await store.put(k, d, t);
      },
    };
    const brokenDb = {
      select: () => ({ from: async () => [{ used: 0 }] }),
      insert: () => { throw new Error("db down"); },
    } as unknown as Db;
    await expect(stagePhoto({ db: brokenDb, store: spy }, await jpeg())).rejects.toThrow("db down");
    expect(put).toHaveLength(2);
    for (const k of put) expect(await store.get(k)).toBeNull();
  });
});

describe("getPublicPhoto", () => {
  it("does not serve a staged photo", async () => {
    const { id } = await stagedPhoto();
    expect(await getPublicPhoto({ db, store }, id, "display")).toBeNull();
    expect(await getPublicPhoto({ db, store }, id, "thumb")).toBeNull();
  });

  it("serves both sizes of a photo that belongs to a visible entry", async () => {
    const { id } = await stagedPhoto(3000, 2000);
    const entry = await insertEntry(db);
    await db.update(photos).set({ entryId: entry.id }).where(eq(photos.id, id));
    const display = await getPublicPhoto({ db, store }, id, "display");
    const thumb = await getPublicPhoto({ db, store }, id, "thumb");
    expect(display?.contentType).toBe("image/webp");
    expect((await sharp(await read(display!.body)).metadata()).width).toBe(1600);
    expect((await sharp(await read(thumb!.body)).metadata()).width).toBe(480);
  });

  it("does not serve a photo of a hidden entry", async () => {
    const { id } = await stagedPhoto();
    const entry = await insertEntry(db, { hidden: true });
    await db.update(photos).set({ entryId: entry.id }).where(eq(photos.id, id));
    expect(await getPublicPhoto({ db, store }, id, "display")).toBeNull();
  });

  it("answers null for an unknown id and for a malformed id", async () => {
    expect(await getPublicPhoto({ db, store }, crypto.randomUUID(), "display")).toBeNull();
    expect(await getPublicPhoto({ db, store }, "not-a-uuid", "display")).toBeNull();
    expect(await getPublicPhoto({ db, store }, "' or 1=1 --", "thumb")).toBeNull();
  });
});

describe("storage quota", () => {
  it("refuses an upload that would push the total over the quota and stores nothing", async () => {
    const first = await stagedPhoto();
    const [{ bytes }] = await db.select().from(photos).where(eq(photos.id, first.id));
    const put: string[] = [];
    const spy: PhotoStore = { ...store, put: async (k, d, t) => { put.push(k); await store.put(k, d, t); } };
    const r = await stagePhoto({ db, store: spy, quotaBytes: bytes + 1 }, await jpeg());
    expect(r).toEqual({ ok: false, reason: "storageFull" });
    expect(put).toHaveLength(0);
    expect(await db.select().from(photos)).toHaveLength(1);
  });

  it("accepts an upload that fits under the quota", async () => {
    expect((await stagePhoto({ db, store, quotaBytes: 1_000_000 }, await jpeg())).ok).toBe(true);
  });

  it("reads the quota from PHOTO_QUOTA_BYTES, defaulting to 20 GB", () => {
    const old = process.env.PHOTO_QUOTA_BYTES;
    try {
      delete process.env.PHOTO_QUOTA_BYTES;
      expect(quotaFromEnv()).toBe(20_000_000_000);
      process.env.PHOTO_QUOTA_BYTES = "123456";
      expect(quotaFromEnv()).toBe(123456);
      process.env.PHOTO_QUOTA_BYTES = "junk";
      expect(quotaFromEnv()).toBe(20_000_000_000);
    } finally {
      if (old === undefined) delete process.env.PHOTO_QUOTA_BYTES;
      else process.env.PHOTO_QUOTA_BYTES = old;
    }
  });
});

describe("sweepStagedPhotos", () => {
  const ago = (min: number) => new Date(Date.now() - min * 60_000);

  it("deletes staged photos older than 60 minutes, row and both stored copies, and nothing else", async () => {
    const old = await stagedPhoto();
    const young = await stagedPhoto();
    const attached = await stagedPhoto();
    const entry = await insertEntry(db);
    await db.update(photos).set({ createdAt: ago(61) }).where(eq(photos.id, old.id));
    await db.update(photos).set({ createdAt: ago(59) }).where(eq(photos.id, young.id));
    await db.update(photos).set({ createdAt: ago(600), entryId: entry.id }).where(eq(photos.id, attached.id));
    const [oldRow] = await db.select().from(photos).where(eq(photos.id, old.id));

    const r = await sweepStagedPhotos({ db, store }, new Date());

    expect(r.removed).toBe(1);
    const left = (await db.select().from(photos)).map((p) => p.id).sort();
    expect(left).toEqual([young.id, attached.id].sort());
    expect(await store.get(oldRow.displayKey)).toBeNull();
    expect(await store.get(oldRow.thumbKey)).toBeNull();
  });
});

describe("processing concurrency", () => {
  it("runs at most two photo conversions at a time, the rest wait", async () => {
    let running = 0;
    let peak = 0;
    const slow = async () => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, 30));
      running--;
      return { ok: false as const, reason: "notPhoto" as const };
    };
    const results = await Promise.all(
      Array.from({ length: 6 }, () => stagePhoto({ db, store, process: slow }, Buffer.from("x"))),
    );
    expect(results).toHaveLength(6);
    expect(peak).toBe(2);
  });
});

import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { closeTestDb, insertEntry, openTestDb, resetTables, stagePhoto } from "../../../test/db";
import type { Db } from "@/server/db/client";
import { eq } from "drizzle-orm";
import { entries, photos } from "@/server/db/schema";
import { createEntry, listVisibleEntries } from "./entries";

let db: Db;
beforeAll(async () => {
  db = await openTestDb();
});
afterAll(closeTestDb);
beforeEach(() => resetTables(db));

const base = { name: "Nguyễn Văn A", relation: "student" as const, cls: null, year: null, message: "Thầy ơi", photos: [] };

describe("createEntry", () => {
  it("stores an entry with no photos and returns it in the public shape", async () => {
    const r = await createEntry(db, { ...base, cls: "D3", year: "1978" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.entry).toMatchObject({ name: "Nguyễn Văn A", relation: "student", cls: "D3", year: "1978", message: "Thầy ơi", photos: [] });
    expect(r.entry.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Date(r.entry.createdAt).toISOString()).toBe(r.entry.createdAt);
    expect(await db.select().from(entries)).toHaveLength(1);
  });

  it("leaves out class and year from the public shape when they are null", async () => {
    const r = await createEntry(db, base);
    expect(r.ok && Object.keys(r.entry).sort()).toEqual(["createdAt", "id", "message", "name", "photos", "relation"]);
  });

  it("attaches three staged photos in the given order with captions and positions", async () => {
    const [a, b, c] = [await stagePhoto(db), await stagePhoto(db), await stagePhoto(db)];
    const r = await createEntry(db, {
      ...base,
      photos: [{ id: c, caption: "third first" }, { id: a, caption: null }, { id: b, caption: "Lớp D3" }],
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.entry.photos.map((p) => p.id)).toEqual([c, a, b]);
    expect(r.entry.photos[0]).toEqual({
      id: c, width: 800, height: 600, caption: "third first",
      src: `/api/photos/${c}`, thumb: `/api/photos/${c}?size=thumb`,
    });
    expect("caption" in r.entry.photos[1]).toBe(false);
    const rows = await db.select().from(photos);
    expect(rows.map((p) => [p.id, p.entryId, p.position]).sort()).toEqual(
      [[c, r.entry.id, 0], [a, r.entry.id, 1], [b, r.entry.id, 2]].sort(),
    );
  });

  it("writes nothing and answers photos invalid when a photo id is unknown", async () => {
    const a = await stagePhoto(db);
    const r = await createEntry(db, { ...base, photos: [{ id: a, caption: null }, { id: "11111111-1111-4111-8111-111111111111", caption: null }] });
    expect(r).toEqual({ ok: false, errors: { photos: "invalid" } });
    expect(await db.select().from(entries)).toHaveLength(0);
    expect((await db.select().from(photos))[0].entryId).toBeNull();
  });

  it("writes nothing and answers photos invalid when a photo is already attached", async () => {
    const a = await stagePhoto(db);
    const first = await createEntry(db, { ...base, photos: [{ id: a, caption: "mine" }] });
    expect(first.ok).toBe(true);
    const b = await stagePhoto(db);
    const r = await createEntry(db, { ...base, name: "Second", photos: [{ id: b, caption: null }, { id: a, caption: "stolen" }] });
    expect(r).toEqual({ ok: false, errors: { photos: "invalid" } });
    expect(await db.select().from(entries)).toHaveLength(1);
    const rows = await db.select().from(photos);
    expect(rows.find((p) => p.id === a)?.caption).toBe("mine");
    expect(rows.find((p) => p.id === b)?.entryId).toBeNull();
  });
});

describe("listVisibleEntries", () => {
  it("lists newest first", async () => {
    await insertEntry(db, { name: "old", createdAt: new Date("2026-11-20T10:00:00Z") });
    await insertEntry(db, { name: "new", createdAt: new Date("2026-11-22T10:00:00Z") });
    await insertEntry(db, { name: "mid", createdAt: new Date("2026-11-21T10:00:00Z") });
    expect((await listVisibleEntries(db)).map((e) => e.name)).toEqual(["new", "mid", "old"]);
  });

  it("leaves out hidden entries", async () => {
    await insertEntry(db, { name: "shown" });
    await insertEntry(db, { name: "spam", hidden: true, hiddenNote: "spam" });
    const list = await listVisibleEntries(db);
    expect(list.map((e) => e.name)).toEqual(["shown"]);
    expect(JSON.stringify(list)).not.toContain("hidden");
  });

  it("lists each entry's photos in position order and never lists staged photos", async () => {
    const e = await insertEntry(db);
    const p2 = await stagePhoto(db, { entryId: e.id, position: 1, caption: "two" });
    const p1 = await stagePhoto(db, { entryId: e.id, position: 0 });
    await stagePhoto(db);
    const list = await listVisibleEntries(db);
    expect(list).toHaveLength(1);
    expect(list[0].photos.map((p) => p.id)).toEqual([p1, p2]);
    expect(list[0].photos[1]).toMatchObject({ caption: "two", src: `/api/photos/${p2}`, thumb: `/api/photos/${p2}?size=thumb` });
  });

  it("does not expose storage keys or entry ids on photos", async () => {
    const e = await insertEntry(db);
    const pid = await stagePhoto(db, { entryId: e.id });
    const [row] = await db.select().from(photos).where(eq(photos.id, pid));
    expect(row).toMatchObject({ displayKey: "d/x.webp", thumbKey: "t/x.webp", bytes: 1234 });
    const list = await listVisibleEntries(db);
    expect(list[0].photos.map((p) => p.id)).toEqual([pid]);
    const json = JSON.stringify(list);
    for (const secret of ["displayKey", "thumbKey", "d/x.webp", "entryId", "bytes", "position"]) expect(json).not.toContain(secret);
  });
});

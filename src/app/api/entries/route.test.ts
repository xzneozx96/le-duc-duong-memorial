import { format } from "node:util";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { closeTestDb, openTestDb, resetTables, stagePhoto, TEST_DATABASE_URL } from "../../../../test/db";
import { sql } from "drizzle-orm";
import type { Db } from "@/server/db/client";
import { entries, photos } from "@/server/db/schema";
import { GET, POST } from "./route";
import { makeHandlers } from "@/server/entries/handlers";

// connection() only works inside a Next request, so the test stands in for the framework.
const connection = vi.hoisted(() => vi.fn(async () => {}));
vi.mock("next/server", () => ({ connection }));

let db: Db;
let n = 0;
const freshIp = () => `198.51.100.${++n}`;

beforeAll(async () => {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  db = await openTestDb();
});
afterAll(closeTestDb);
beforeEach(() => resetTables(db));

const valid = { name: "Nguyễn Văn A", relation: "student", message: "Thầy dạy em tiếng Đức." };

function post(body: unknown, ip = freshIp(), raw = false) {
  return new Request("http://localhost/api/entries", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

describe("POST /api/entries", () => {
  it("answers 201 with the public entry for a valid post with no photos", async () => {
    const res = await POST(post({ ...valid, cls: " D3 " }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({ name: "Nguyễn Văn A", relation: "student", cls: "D3", photos: [] });
    expect(await db.select().from(entries)).toHaveLength(1);
  });

  it("attaches three staged photos in order with captions", async () => {
    const [a, b, c] = [await stagePhoto(db), await stagePhoto(db), await stagePhoto(db)];
    const res = await POST(post({ ...valid, photos: [{ id: b, caption: "one" }, { id: c }, { id: a, caption: "three" }] }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.photos.map((p: { id: string }) => p.id)).toEqual([b, c, a]);
    expect(body.photos[0].caption).toBe("one");
    expect(body.photos[0].src).toBe(`/api/photos/${b}`);
  });

  it.each(["name", "relation", "message"])("answers 422 with %s required when it is missing", async (field) => {
    const body: Record<string, unknown> = { ...valid };
    delete body[field];
    const res = await POST(post(body));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ errors: { [field]: "required" } });
    expect(await db.select().from(entries)).toHaveLength(0);
  });

  it.each([
    ["name", "a".repeat(101)],
    ["message", "a".repeat(5001)],
    ["cls", "a".repeat(51)],
    ["year", "a".repeat(51)],
  ])("answers 422 with %s tooLong over its limit", async (field, value) => {
    const res = await POST(post({ ...valid, [field]: value }));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ errors: { [field]: "tooLong" } });
  });

  it("collapses runs of blank lines in the stored message", async () => {
    const res = await POST(post({ ...valid, message: "one\n\n\n\n\ntwo" }));
    expect((await res.json()).message).toBe("one\n\ntwo");
    expect((await db.select().from(entries))[0].message).toBe("one\n\ntwo");
  });

  it("answers 400 and writes nothing for an unknown photo id", async () => {
    const res = await POST(post({ ...valid, photos: [{ id: "11111111-1111-4111-8111-111111111111" }] }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ errors: { photos: "invalid" } });
    expect(await db.select().from(entries)).toHaveLength(0);
  });

  it("answers 400 and writes nothing for an already attached photo", async () => {
    const a = await stagePhoto(db);
    expect((await POST(post({ ...valid, photos: [{ id: a }] }))).status).toBe(201);
    const res = await POST(post({ ...valid, photos: [{ id: a }] }));
    expect(res.status).toBe(400);
    expect(await db.select().from(entries)).toHaveLength(1);
    expect(await db.select().from(photos)).toHaveLength(1);
  });

  it("answers 400 for invalid JSON and for a JSON body that is not an object", async () => {
    const bad = await POST(post("{not json", freshIp(), true));
    expect(bad.status).toBe(400);
    expect(await bad.json()).toEqual({ error: "invalidJson" });
    expect((await POST(post("[1]", freshIp(), true))).status).toBe(422);
  });

  it("answers 413 tooBig when Content-Length is over 64 KB, without reading the body", async () => {
    const body = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode("{}")); c.close(); } });
    const req = new Request("http://localhost/api/entries", {
      method: "POST",
      headers: { "x-forwarded-for": freshIp(), "content-length": String(64 * 1024 + 1) },
      body,
      duplex: "half",
    } as RequestInit);
    const res = await POST(req);
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "tooBig" });
    expect(req.bodyUsed).toBe(false);
  });

  it("answers 413 tooBig and stops reading when a streamed body without Content-Length passes 64 KB", async () => {
    let chunks = 0;
    const chunk = new TextEncoder().encode(" ".repeat(16 * 1024));
    const body = new ReadableStream({ pull(c) { chunks++; c.enqueue(chunk); } }); // never ends on its own
    const req = new Request("http://localhost/api/entries", {
      method: "POST",
      headers: { "x-forwarded-for": freshIp() },
      body,
      duplex: "half",
    } as RequestInit);
    const res = await POST(req);
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "tooBig" });
    expect(chunks).toBeLessThan(10);
    expect(await db.select().from(entries)).toHaveLength(0);
  });

  it("accepts a body just under the cap", async () => {
    const res = await POST(post({ ...valid, message: "a".repeat(5000) }));
    expect(res.status).toBe(201);
  });

  it("answers 429 on the 31st post from one address, and not for another address", async () => {
    const ip = freshIp();
    for (let i = 0; i < 30; i++) expect((await POST(post(valid, ip))).status).toBe(201);
    const res = await POST(post(valid, ip));
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rateLimited" });
    expect(await db.select().from(entries)).toHaveLength(30);
    expect((await POST(post(valid, freshIp()))).status).toBe(201);
  });

  it("shares one limit across a whole IPv6 /64, so rotating addresses does not bypass it", async () => {
    const prefix = `2001:db8:${++n}:7`;
    for (let i = 0; i < 30; i++) expect((await POST(post(valid, `${prefix}::${i + 1}`))).status).toBe(201);
    expect((await POST(post(valid, `${prefix}:ffff::9`))).status).toBe(429);
    expect((await POST(post(valid, `2001:db8:${n}:8::1`))).status).toBe(201);
  });

  it("logs a fixed label with the error name and code only, never the visitor's text", async () => {
    // Without its table every insert fails inside a query, and drizzle wraps that error with the bound params.
    await db.execute(sql`alter table entries rename to entries_gone`);
    const h = makeHandlers({ getDb: () => db, limiter: { hit: () => true } });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const res = await h.POST(post({ ...valid, name: "Secret Name Q", message: "private words ZZZ", cls: "klass-77" }));
      expect(res.status).toBe(500);
      expect(spy).toHaveBeenCalledTimes(1);
      const logged = spy.mock.calls.map((args) => format(...args)).join("\n");
      expect(logged).toContain("entries handler failed");
      expect(logged).not.toMatch(/Secret Name Q|private words ZZZ|klass-77|insert into/i);
    } finally {
      spy.mockRestore();
      await db.execute(sql`alter table entries_gone rename to entries`);
    }
  });

  it("answers 500 with a generic body and no internals when something unexpected fails", async () => {
    const h = makeHandlers({
      getDb: () => {
        throw new Error("connect ECONNREFUSED 10.1.2.3:5432 password=hunter2");
      },
      limiter: { hit: () => true },
    });
    const res = await h.POST(post(valid));
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ error: "server" });
    expect(text).not.toMatch(/ECONNREFUSED|hunter2|10\.1\.2\.3/);
  });
});

describe("POST /api/entries with a requestId", () => {
  const RID = "5a6b7c8d-1111-4222-8333-444455556666";

  it("answers 201 the first time and 200 with the same entry on a re-send", async () => {
    const first = await POST(post({ ...valid, requestId: RID }));
    const again = await POST(post({ ...valid, requestId: RID }));
    expect(first.status).toBe(201);
    expect(again.status).toBe(200);
    const [a, b] = [await first.json(), await again.json()];
    expect(b).toEqual(a);
    expect(JSON.stringify(a)).not.toContain(RID);
    expect(await db.select().from(entries)).toHaveLength(1);
  });

  it("answers 200, not 400, when the re-send lists photos that are now attached", async () => {
    const p = await stagePhoto(db);
    const body = { ...valid, requestId: RID, photos: [{ id: p }] };
    expect((await POST(post(body))).status).toBe(201);
    expect((await POST(post(body))).status).toBe(200);
  });

  it("answers 422 for a malformed requestId", async () => {
    const res = await POST(post({ ...valid, requestId: "nope" }));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ errors: { requestId: "invalid" } });
  });
});

describe("GET /api/entries", () => {
  it("lists visible entries newest first as JSON", async () => {
    await POST(post({ ...valid, name: "first" }));
    await POST(post({ ...valid, name: "second" }));
    const res = await GET();
    expect(res.status).toBe(200);
    expect((await res.json()).map((e: { name: string }) => e.name)).toEqual(["second", "first"]);
  });

  it("waits for a real request (connection) before reading the database", async () => {
    connection.mockClear();
    await GET();
    expect(connection).toHaveBeenCalledTimes(1);
  });

  it("answers 500 with a generic body when the database fails", async () => {
    const h = makeHandlers({ getDb: () => { throw new Error("boom secret"); }, limiter: { hit: () => true } });
    const res = await h.GET();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "server" });
  });
});

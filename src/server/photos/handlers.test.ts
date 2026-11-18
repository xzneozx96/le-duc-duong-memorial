import sharp from "sharp";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { closeTestDb, insertEntry, openTestDb, resetTables } from "../../../test/db";
import { openTestS3 } from "../../../test/s3";
import type { Db } from "@/server/db/client";
import { photos } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createRateLimiter } from "@/server/rate-limit";
import { createPhotoLimiter, makeHandlers } from "./handlers";
import { createS3PhotoStore, type PhotoStore } from "./store";

// connection() only works inside a Next request, so the test stands in for the framework.
vi.mock("next/server", () => ({ connection: async () => {} }));

let db: Db;
let store: PhotoStore;
let n = 0;
const freshIp = () => `203.0.113.${++n}`;
const newHandlers = (
  over: Partial<Parameters<typeof makeHandlers>[0]> & { getDb?: () => Db; store?: PhotoStore; limit?: number } = {},
) =>
  makeHandlers({
    sweep: async () => {}, // no background sweeps in unrelated tests
    ...over,
    getDb: over.getDb ?? (() => db),
    getStore: () => over.store ?? store,
    limiter: createRateLimiter({ limit: over.limit ?? 300, windowMs: 3_600_000 }),
  });

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

/** Builds the request the way a browser does: encoded body, content-type and content-length. */
async function upload(bytes: Uint8Array | null, ip = freshIp(), type = "image/jpeg") {
  const form = new FormData();
  if (bytes) form.set("file", new File([Buffer.from(bytes)], "photo.jpg", { type }));
  const encoded = new Response(form);
  const body = await encoded.arrayBuffer();
  return new Request("http://localhost/api/photos", {
    method: "POST",
    headers: {
      "x-forwarded-for": ip,
      "content-type": encoded.headers.get("content-type")!,
      "content-length": String(body.byteLength),
    },
    body,
  });
}

describe("POST /api/photos", () => {
  it("answers 201 with id, width and height for a photo", async () => {
    const res = await newHandlers().POST(await upload(await jpeg(4000, 3000)));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ id: expect.any(String), width: 1600, height: 1200 });
    expect(await db.select().from(photos)).toHaveLength(1);
  });

  it("answers 415 notPhoto for a PDF and writes nothing", async () => {
    const res = await newHandlers().POST(await upload(Buffer.from("%PDF-1.7 hello"), freshIp(), "application/pdf"));
    expect(res.status).toBe(415);
    expect(await res.json()).toEqual({ error: "notPhoto" });
    expect(await db.select().from(photos)).toHaveLength(0);
  });

  it("answers 415 heic for a HEIC file", async () => {
    const heic = Buffer.concat([Buffer.from([0, 0, 0, 24]), Buffer.from("ftypheic"), Buffer.alloc(64)]);
    const res = await newHandlers().POST(await upload(heic));
    expect(res.status).toBe(415);
    expect(await res.json()).toEqual({ error: "heic" });
  });

  it("answers 413 tooBig for a 7 MB photo", async () => {
    const res = await newHandlers().POST(await upload(Buffer.alloc(7_000_000, 1)));
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "tooBig" });
  });

  it("answers 413 tooBig for 5,000,001 bytes of file, which fits the Content-Length allowance", async () => {
    const res = await newHandlers().POST(await upload(Buffer.concat([await jpeg(), Buffer.alloc(5_000_001)])));
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "tooBig" });
  });

  it("answers 413 from the Content-Length header without reading the body", async () => {
    let pulled = false;
    // highWaterMark 0: the stream is only pulled when somebody actually reads it.
    const body = new ReadableStream<Uint8Array>(
      {
        pull(controller) {
          pulled = true;
          controller.close();
        },
      },
      { highWaterMark: 0 },
    );
    const req = new Request("http://localhost/api/photos", {
      method: "POST",
      headers: {
        "content-type": "multipart/form-data; boundary=x",
        "content-length": "9000000",
        "x-forwarded-for": freshIp(),
      },
      body,
      duplex: "half",
    } as RequestInit);
    const res = await newHandlers().POST(req);
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "tooBig" });
    expect(pulled).toBe(false);
  });

  it("answers 400 when the form has no file", async () => {
    const res = await newHandlers().POST(await upload(null));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "noFile" });
  });

  it("answers 400 when the body is not multipart", async () => {
    const req = new Request("http://localhost/api/photos", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "2", "x-forwarded-for": freshIp() },
      body: "{}",
    });
    const res = await newHandlers().POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "noFile" });
  });

  it("answers 429 once the limit is used up, and not for another address", async () => {
    const h = newHandlers({ limit: 5 });
    const bytes = await sharp({ create: { width: 8, height: 8, channels: 3, background: "red" } }).png().toBuffer();
    for (let i = 0; i < 5; i++) expect((await h.POST(await upload(bytes, "198.51.100.9"))).status).toBe(201);
    const res = await h.POST(await upload(bytes, "198.51.100.9"));
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rateLimited" });
    expect((await h.POST(await upload(bytes, "198.51.100.10"))).status).toBe(201);
  });

  it("counts two IPv6 addresses in one /64 as one client for the rate limit", async () => {
    const h = newHandlers({ limit: 2 });
    const bytes = await sharp({ create: { width: 8, height: 8, channels: 3, background: "red" } }).png().toBuffer();
    expect((await h.POST(await upload(bytes, "2001:db8:1:2::1"))).status).toBe(201);
    expect((await h.POST(await upload(bytes, "2001:db8:1:2:aaaa:bbbb:cccc:dddd"))).status).toBe(201);
    expect((await h.POST(await upload(bytes, "2001:db8:1:2:ffff::9"))).status).toBe(429);
    expect((await h.POST(await upload(bytes, "2001:db8:1:3::1"))).status).toBe(201);
  });

  it("answers 500 with no internals when the store fails", async () => {
    const broken: PhotoStore = { ...store, put: async () => { throw new Error("secret endpoint s3.internal:9000"); } };
    const res = await newHandlers({ store: broken }).POST(await upload(await jpeg()));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "server" });
  });
});

describe("GET /api/photos/[id]", () => {
  async function attached(over: { hidden?: boolean } = {}) {
    const res = await newHandlers().POST(await upload(await jpeg(3000, 2000)));
    const { id } = await res.json();
    const entry = await insertEntry(db, over);
    await db.update(photos).set({ entryId: entry.id }).where(eq(photos.id, id));
    return id as string;
  }
  const get = (id: string, size?: string, headers: Record<string, string> = {}) =>
    newHandlers().GET(new Request(`http://localhost/api/photos/${id}${size ? `?size=${size}` : ""}`, { headers }), id);

  it("streams the display WebP with revalidation headers, an ETag and nosniff for a visible post", async () => {
    const id = await attached();
    const res = await get(id);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/webp");
    expect(res.headers.get("cache-control")).toBe("private, no-cache");
    expect(res.headers.get("etag")).toBe(`"${id}-display"`);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect((await sharp(Buffer.from(await res.arrayBuffer())).metadata()).width).toBe(1600);
  });

  it("streams the thumb for ?size=thumb with its own ETag", async () => {
    const id = await attached();
    const res = await get(id, "thumb");
    expect(res.status).toBe(200);
    expect(res.headers.get("etag")).toBe(`"${id}-thumb"`);
    expect((await sharp(Buffer.from(await res.arrayBuffer())).metadata()).width).toBe(480);
  });

  it("answers 304 with no body when If-None-Match matches and the photo is still visible", async () => {
    const id = await attached();
    const res = await get(id, undefined, { "if-none-match": `"${id}-display"` });
    expect(res.status).toBe(304);
    expect(await res.text()).toBe("");
    expect(res.headers.get("etag")).toBe(`"${id}-display"`);
  });

  it("answers 200 when If-None-Match is for the other size", async () => {
    const id = await attached();
    expect((await get(id, undefined, { "if-none-match": `"${id}-thumb"` })).status).toBe(200);
  });

  it("answers 404 with the same body for hidden, staged, unknown and malformed ids, even with a matching If-None-Match", async () => {
    const hidden = await attached({ hidden: true });
    const staged = (await (await newHandlers().POST(await upload(await jpeg()))).json()).id as string;
    const bodies: string[] = [];
    for (const id of [hidden, staged, crypto.randomUUID(), "nope"]) {
      const res = await get(id, undefined, { "if-none-match": `"${id}-display"` });
      expect(res.status).toBe(404);
      expect(res.headers.get("etag")).toBeNull();
      expect(res.headers.get("cache-control") ?? "").not.toContain("max-age=31536000");
      bodies.push(await res.text());
    }
    expect(new Set(bodies).size).toBe(1);
  });

  it("answers 500 with no internals when the database fails", async () => {
    const h = newHandlers({ getDb: () => { throw new Error("DATABASE_URL leak"); } });
    const res = await h.GET(new Request("http://localhost/api/photos/x"), crypto.randomUUID());
    expect(res.status).toBe(500);
    expect(await res.text()).not.toContain("leak");
  });
});

describe("POST /api/photos hardening", () => {
  const png = () => sharp({ create: { width: 8, height: 8, channels: 3, background: "red" } }).png().toBuffer();

  it("answers 411 without reading the body when Content-Length is missing or not a number", async () => {
    for (const headers of [{}, { "content-length": "abc" }, { "content-length": "-5" }]) {
      let pulled = false;
      const body = new ReadableStream<Uint8Array>(
        { pull(c) { pulled = true; c.close(); } },
        { highWaterMark: 0 },
      );
      const req = new Request("http://localhost/api/photos", {
        method: "POST",
        headers: { "content-type": "multipart/form-data; boundary=x", "x-forwarded-for": freshIp(), ...headers },
        body,
        duplex: "half",
      } as RequestInit);
      const res = await newHandlers().POST(req);
      expect(res.status).toBe(411);
      expect(await res.json()).toEqual({ error: "lengthRequired" });
      expect(pulled).toBe(false);
    }
  });

  it("answers 429 tooMany for the 41st staged photo from one client, and again free after one is attached", async () => {
    const h = newHandlers();
    const ip = freshIp();
    const bytes = await png();
    let firstId = "";
    for (let i = 0; i < 40; i++) {
      const res = await h.POST(await upload(bytes, ip));
      expect(res.status).toBe(201);
      if (i === 0) firstId = (await res.json()).id;
    }
    const over = await h.POST(await upload(bytes, ip));
    expect(over.status).toBe(429);
    expect(await over.json()).toEqual({ error: "tooMany" });
    expect((await h.POST(await upload(bytes, freshIp()))).status).toBe(201); // another client is unaffected

    const entry = await insertEntry(db);
    await db.update(photos).set({ entryId: entry.id }).where(eq(photos.id, firstId));
    expect((await h.POST(await upload(bytes, ip))).status).toBe(201);
    expect((await h.POST(await upload(bytes, ip))).status).toBe(429);
  });

  it("answers 507 storageFull when the quota is used up", async () => {
    const res = await newHandlers({ quotaBytes: 1 }).POST(await upload(await png()));
    expect(res.status).toBe(507);
    expect(await res.json()).toEqual({ error: "storageFull" });
  });

  it("allows 300 uploads per client per hour and refuses the 301st", async () => {
    const h = makeHandlers({ getDb: () => db, getStore: () => store, limiter: createPhotoLimiter() });
    const ip = freshIp();
    const statuses: number[] = [];
    for (let i = 0; i < 301; i++) {
      // no file: answered 400 right after the limit check, so this stays fast
      statuses.push(
        (await h.POST(new Request("http://localhost/api/photos", {
          method: "POST",
          headers: { "x-forwarded-for": ip, "content-type": "application/json", "content-length": "2" },
          body: "{}",
        }))).status,
      );
    }
    expect(statuses.slice(0, 300).every((s) => s === 400)).toBe(true);
    expect(statuses[300]).toBe(429);
  });

  describe("sweeping staged photos", () => {
    const at = (clock: { t: number }, sweep: (now: Date) => Promise<unknown>) =>
      newHandlers({ now: () => clock.t, sweep });

    it("runs at most once every 10 minutes", async () => {
      const calls: number[] = [];
      const clock = { t: 1_000_000 };
      const h = at(clock, async (now) => void calls.push(now.getTime()));
      const bytes = await png();
      await h.POST(await upload(bytes));
      await h.POST(await upload(bytes));
      clock.t += 9 * 60_000;
      await h.POST(await upload(bytes));
      expect(calls).toEqual([1_000_000]);
      clock.t += 61_000;
      await h.POST(await upload(bytes));
      expect(calls).toEqual([1_000_000, 1_000_000 + 9 * 60_000 + 61_000]);
    });

    it("does not fail or delay the upload when the sweep fails", async () => {
      const h = at({ t: 1 }, () => new Promise((_, reject) => reject(new Error("sweep exploded"))));
      const res = await h.POST(await upload(await png()));
      expect(res.status).toBe(201);
    });
  });

  describe("logging", () => {
    it("logs a fixed label and the error name only, never its message or submitted data", async () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      try {
        const broken: PhotoStore = {
          ...store,
          put: async () => { throw new TypeError("password=hunter2 name=Nguyen s3.internal"); },
        };
        const res = await newHandlers({ store: broken }).POST(await upload(await png()));
        expect(res.status).toBe(500);
        const lines = spy.mock.calls.map((c) => c.join(" "));
        expect(lines.length).toBeGreaterThan(0);
        expect(lines.every((l) => !/hunter2|Nguyen|internal/.test(l))).toBe(true);
        expect(spy.mock.calls.every((c) => c.length === 1 && typeof c[0] === "string")).toBe(true);
        expect(lines.join("\n")).toContain("TypeError");
      } finally {
        spy.mockRestore();
      }
    });
  });
});

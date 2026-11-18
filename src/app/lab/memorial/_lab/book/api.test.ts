import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEntries, postEntry, toEntry, uploadPhoto, type PublicEntry } from "./api";

const reply = (status: number, body?: unknown) =>
  vi.fn().mockResolvedValue(new Response(body === undefined ? null : JSON.stringify(body), { status }));
const stub = (f: ReturnType<typeof vi.fn>) => vi.stubGlobal("fetch", f);
afterEach(() => vi.unstubAllGlobals());

const file = new File([new Uint8Array([1, 2, 3])], "a.jpg", { type: "image/jpeg" });

describe("uploadPhoto", () => {
  it("posts the file as multipart field `file` and returns id and size", async () => {
    const f = reply(201, { id: "p1", width: 800, height: 600 });
    stub(f);
    expect(await uploadPhoto(file)).toEqual({ ok: true, id: "p1", width: 800, height: 600 });
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("/api/photos");
    expect(init.method).toBe("POST");
    expect((init.body as FormData).get("file")).toBeInstanceOf(File);
  });

  it.each([
    [413, { error: "tooBig" }, "tooBig"],
    [415, { error: "notPhoto" }, "notPhoto"],
    [415, { error: "heic" }, "heic"],
    [429, { error: "tooMany" }, "busy"],
    [429, { error: "rateLimited" }, "busy"],
    [507, { error: "storageFull" }, "storageFull"],
    [411, { error: "lengthRequired" }, "failed"],
    [400, { error: "noFile" }, "failed"],
    [500, { error: "server" }, "failed"],
  ])("maps %i %j to %s", async (status, body, reason) => {
    stub(reply(status, body));
    expect(await uploadPhoto(file)).toEqual({ ok: false, reason });
  });

  it("maps an unknown 415 body to notPhoto", async () => {
    stub(reply(415, {}));
    expect(await uploadPhoto(file)).toEqual({ ok: false, reason: "notPhoto" });
  });

  it("reports a network failure as failed", async () => {
    stub(vi.fn().mockRejectedValue(new TypeError("network")));
    expect(await uploadPhoto(file)).toEqual({ ok: false, reason: "failed" });
  });

  it("reports a 201 with a broken body as failed", async () => {
    stub(reply(201, { nope: 1 }));
    expect(await uploadPhoto(file)).toEqual({ ok: false, reason: "failed" });
  });
});

const pub: PublicEntry = {
  id: "e1",
  name: "Hà",
  relation: "student",
  cls: "D3",
  year: "1978",
  message: "Kính gửi thầy,\n\n<b>x</b>",
  createdAt: "2026-11-19T12:00:00.000Z",
  photos: [
    { id: "p1", width: 800, height: 600, caption: "Lớp", src: "/api/photos/p1", thumb: "/api/photos/p1?size=thumb" },
    { id: "p2", width: 400, height: 500, src: "/api/photos/p2", thumb: "/api/photos/p2?size=thumb" },
  ],
};

describe("toEntry", () => {
  it("maps the public shape into the UI entry", () => {
    expect(toEntry(pub)).toEqual({
      id: "e1",
      name: "Hà",
      relation: "student",
      cls: "D3",
      year: "1978",
      date: "19.11.2026",
      text: "Kính gửi thầy,\n\n<b>x</b>",
      photos: [
        { src: "/api/photos/p1", thumb: "/api/photos/p1?size=thumb", w: 800, h: 600, caption: "Lớp" },
        { src: "/api/photos/p2", thumb: "/api/photos/p2?size=thumb", w: 400, h: 500, caption: undefined },
      ],
    });
  });

  it("leaves out missing cls, year and photos", () => {
    const e = toEntry({ id: "e2", name: "A", relation: "other", message: "m", createdAt: "2026-11-19T12:00:00.000Z" } as PublicEntry);
    expect(e.cls).toBeUndefined();
    expect(e.year).toBeUndefined();
    expect(e.photos).toEqual([]);
  });

  it("treats null cls, year and caption as missing", () => {
    const e = toEntry({ ...pub, cls: null, year: null, photos: [{ ...pub.photos![0], caption: null }] });
    expect(e.cls).toBeUndefined();
    expect(e.year).toBeUndefined();
    expect(e.photos?.[0].caption).toBeUndefined();
  });
});

const input = { name: "Hà", relation: "student" as const, message: "Xin chào", photos: [{ id: "p1", caption: "Lớp" }] };

describe("postEntry", () => {
  it("posts JSON and returns the mapped entry", async () => {
    const f = reply(201, pub);
    stub(f);
    const r = await postEntry(input);
    expect(r.ok && r.entry.id).toBe("e1");
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("/api/entries");
    expect(init.headers["content-type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual(input);
  });

  it("treats 200 (a repeated requestId) like 201", async () => {
    stub(reply(200, pub));
    const r = await postEntry({ ...input, requestId: "r1" });
    expect(r.ok && r.entry.id).toBe("e1");
  });

  it("sends the requestId in the body", async () => {
    const f = reply(201, pub);
    stub(f);
    await postEntry({ ...input, requestId: "r1" });
    expect(JSON.parse(f.mock.calls[0][1].body).requestId).toBe("r1");
  });

  it("returns field errors from a 422", async () => {
    stub(reply(422, { errors: { name: "required", message: "tooLong" } }));
    expect(await postEntry(input)).toEqual({ ok: false, reason: "fields", errors: { name: "required", message: "tooLong" } });
  });

  it.each([
    [400, { errors: { photos: "invalid" } }, "photos"],
    [413, { error: "tooBig" }, "tooBig"],
    [429, { error: "rateLimited" }, "busy"],
    [500, { error: "server" }, "failed"],
  ])("maps %i to %s", async (status, body, reason) => {
    stub(reply(status, body));
    expect(await postEntry(input)).toEqual({ ok: false, reason });
  });

  it("maps a 400 invalid JSON to failed", async () => {
    stub(reply(400, { error: "invalidJson" }));
    expect(await postEntry(input)).toEqual({ ok: false, reason: "failed" });
  });

  it("reports a network failure as failed", async () => {
    stub(vi.fn().mockRejectedValue(new TypeError("network")));
    expect(await postEntry(input)).toEqual({ ok: false, reason: "failed" });
  });
});

describe("fetchEntries", () => {
  it("returns the mapped entries in the server's order", async () => {
    stub(reply(200, [pub, { ...pub, id: "e0" }]));
    const r = await fetchEntries();
    expect(r.ok && r.entries.map((e) => e.id)).toEqual(["e1", "e0"]);
  });

  it("fails on a server error, a bad body and a network error", async () => {
    stub(reply(500, { error: "server" }));
    expect(await fetchEntries()).toEqual({ ok: false });
    stub(reply(200, { nope: 1 }));
    expect(await fetchEntries()).toEqual({ ok: false });
    stub(vi.fn().mockRejectedValue(new TypeError("x")));
    expect(await fetchEntries()).toEqual({ ok: false });
  });
});

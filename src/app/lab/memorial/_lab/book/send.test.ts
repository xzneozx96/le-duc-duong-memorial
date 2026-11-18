import { describe, expect, it, vi } from "vitest";
import type { EntryInput, PostResult, UploadResult } from "./api";
import { failureMessage, isHeic, sendLetter } from "./send";
import { t } from "./data";

const fileA = new File(["a"], "a.jpg");
const fileB = new File(["b"], "b.jpg");
const fields = { name: " Hà ", relation: "student" as const, cls: "", year: " 1978 ", message: " Xin chào\n\n\n\nvậy " };
const posted = (): PostResult => ({
  ok: true,
  entry: { id: "e1", name: "Hà", relation: "student", date: "19.11.2026", text: "x" },
});
const up = (id: string): UploadResult => ({ ok: true, id, width: 1, height: 1 });

function api(uploads: UploadResult[], post: PostResult = posted()) {
  const queue = [...uploads];
  return {
    uploadPhoto: vi.fn(async () => queue.shift() ?? up("extra")),
    postEntry: vi.fn(async (input: EntryInput) => (void input, post)),
  };
}

describe("sendLetter", () => {
  it("uploads photos in order, reports progress, then posts with ids and captions", async () => {
    const a = api([up("p1"), up("p2")]);
    const progress: [number, number][] = [];
    const r = await sendLetter({
      fields,
      photos: [
        { key: "k1", file: fileA, caption: " Lớp " },
        { key: "k2", file: fileB },
      ],
      uploaded: new Map(),
      requestId: "r1",
      onProgress: (i, n) => progress.push([i, n]),
      api: a,
    });
    expect(r.ok).toBe(true);
    expect(progress).toEqual([[1, 2], [2, 2]]);
    expect(a.uploadPhoto.mock.calls.map((c) => (c as unknown as [File])[0].name)).toEqual(["a.jpg", "b.jpg"]);
    expect(a.postEntry).toHaveBeenCalledWith({
      requestId: "r1",
      name: "Hà",
      relation: "student",
      year: "1978",
      message: "Xin chào\n\nvậy",
      photos: [{ id: "p1", caption: "Lớp" }, { id: "p2" }],
    });
  });

  it("stops at the first refused photo, naming it, and posts nothing", async () => {
    const a = api([up("p1"), { ok: false, reason: "heic" }]);
    const uploaded = new Map<string, string>();
    const r = await sendLetter({
      fields,
      photos: [{ key: "k1", file: fileA }, { key: "k2", file: fileB }],
      uploaded,
      requestId: "r", onProgress: () => {},
      api: a,
    });
    expect(r).toEqual({ ok: false, kind: "photo", file: "b.jpg", reason: "heic" });
    expect(a.postEntry).not.toHaveBeenCalled();
    expect([...uploaded]).toEqual([["k1", "p1"]]);
  });

  it("does not upload again photos that already uploaded in an earlier attempt", async () => {
    const a = api([up("p2")]);
    const r = await sendLetter({
      fields,
      photos: [{ key: "k1", file: fileA }, { key: "k2", file: fileB }],
      uploaded: new Map([["k1", "p1"]]),
      requestId: "r", onProgress: () => {},
      api: a,
    });
    expect(r.ok).toBe(true);
    expect(a.uploadPhoto).toHaveBeenCalledTimes(1);
    expect((a.postEntry.mock.calls as unknown as [EntryInput][])[0][0].photos.map((p) => p.id)).toEqual(["p1", "p2"]);
  });

  it("returns server field errors", async () => {
    const a = api([], { ok: false, reason: "fields", errors: { name: "required" } });
    const r = await sendLetter({ fields, photos: [], uploaded: new Map(), requestId: "r", onProgress: () => {}, api: a });
    expect(r).toEqual({ ok: false, kind: "fields", errors: { name: "required" } });
  });

  it("forgets uploaded ids when the server no longer knows them", async () => {
    const a = api([up("p1")], { ok: false, reason: "photos" });
    const uploaded = new Map<string, string>();
    const r = await sendLetter({ fields, photos: [{ key: "k1", file: fileA }], uploaded, requestId: "r", onProgress: () => {}, api: a });
    expect(r).toEqual({ ok: false, kind: "general", reason: "photos" });
    expect(uploaded.size).toBe(0);
  });

  it("keeps uploaded ids after a failed post so a retry skips the uploads", async () => {
    const a = api([up("p1")], { ok: false, reason: "failed" });
    const uploaded = new Map<string, string>();
    const r = await sendLetter({ fields, photos: [{ key: "k1", file: fileA }], uploaded, requestId: "r", onProgress: () => {}, api: a });
    expect(r).toEqual({ ok: false, kind: "general", reason: "failed" });
    expect(uploaded.get("k1")).toBe("p1");
  });

  it.each(["busy", "storageFull", "failed"] as const)("reports a %s upload as a general failure", async (reason) => {
    const a = api([{ ok: false, reason }]);
    const r = await sendLetter({ fields, photos: [{ key: "k1", file: fileA }], uploaded: new Map(), requestId: "r", onProgress: () => {}, api: a });
    expect(r).toEqual({ ok: false, kind: "general", reason });
  });

  it("reports a too-big upload as naming the file", async () => {
    const a = api([{ ok: false, reason: "tooBig" }]);
    const r = await sendLetter({ fields, photos: [{ key: "k1", file: fileA }], uploaded: new Map(), requestId: "r", onProgress: () => {}, api: a });
    expect(r).toEqual({ ok: false, kind: "photo", file: "a.jpg", reason: "tooBig" });
  });
});

describe("requestId", () => {
  it("is sent with the letter, and the same id on a re-send", async () => {
    const a = api([up("p1")], { ok: false, reason: "failed" });
    const uploaded = new Map<string, string>();
    const base = { fields, photos: [{ key: "k1", file: fileA }], uploaded, onProgress: () => {}, api: a };
    await sendLetter({ ...base, requestId: "same" });
    await sendLetter({ ...base, requestId: "same" });
    const calls = a.postEntry.mock.calls as unknown as [EntryInput][];
    expect(calls.map((c) => c[0].requestId)).toEqual(["same", "same"]);
    expect(a.uploadPhoto).toHaveBeenCalledTimes(1);
  });
});

describe("isHeic", () => {
  it.each([
    [new File(["x"], "a.jpg", { type: "image/heic" }), true],
    [new File(["x"], "a.jpg", { type: "image/heif" }), true],
    [new File(["x"], "IMG_1.HEIC", { type: "" }), true],
    [new File(["x"], "b.heif", { type: "application/octet-stream" }), true],
    [new File(["x"], "a.jpg", { type: "image/jpeg" }), false],
    [new File(["x"], "a.png", { type: "image/png" }), false],
  ])("%#", (file, want) => expect(isHeic(file)).toBe(want));
});

describe("failureMessage", () => {
  const f = t.form;
  it("says storage is full and the letter can go without photos", () => {
    expect(failureMessage({ ok: false, kind: "general", reason: "storageFull" })).toBe(f.storageFull);
    expect(f.storageFull).toMatch(/đầy/);
    expect(f.storageFull).toMatch(/không kèm ảnh|không có ảnh/);
    expect(f.storageFull).not.toMatch(/vài phút/);
  });
  it("says the letter is too long for a post 413", () => {
    expect(failureMessage({ ok: false, kind: "general", reason: "tooBig" })).toBe(f.tooLongToSend);
    expect(f.tooLongToSend).not.toMatch(/vài phút/);
  });
  it("keeps the retry message for busy and failed, the expiry one for photos", () => {
    expect(failureMessage({ ok: false, kind: "general", reason: "busy" })).toBe(f.notSent);
    expect(failureMessage({ ok: false, kind: "general", reason: "failed" })).toBe(f.notSent);
    expect(failureMessage({ ok: false, kind: "general", reason: "photos" })).toBe(f.photosExpired);
  });
  it("names the refused file", () => {
    expect(failureMessage({ ok: false, kind: "photo", file: "x.png", reason: "tooBig" })).toBe(f.photoRefused("x.png", "tooBig"));
  });
});

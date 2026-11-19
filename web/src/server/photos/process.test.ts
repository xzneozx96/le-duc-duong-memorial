import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MAX_PHOTO_BYTES, processPhoto } from "./process";

const solid = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 3, background: { r: 200, g: 30, b: 30 } } });

async function ok(bytes: Uint8Array) {
  const r = await processPhoto(bytes);
  if (!r.ok) throw new Error(`expected ok, got ${r.reason}`);
  return r;
}

describe("processPhoto", () => {
  it("accepts JPEG, PNG, WebP and GIF and outputs WebP", async () => {
    const base = solid(100, 80);
    for (const bytes of [
      await base.clone().jpeg().toBuffer(),
      await base.clone().png().toBuffer(),
      await base.clone().webp().toBuffer(),
      await base.clone().gif().toBuffer(),
    ]) {
      const r = await ok(bytes);
      expect((await sharp(r.display.data).metadata()).format).toBe("webp");
      expect((await sharp(r.thumb.data).metadata()).format).toBe("webp");
    }
  });

  it("applies EXIF orientation 6 so a sideways phone photo comes out upright", async () => {
    const jpeg = await solid(200, 100).jpeg().withMetadata({ orientation: 6 }).toBuffer();
    const r = await ok(jpeg);
    expect([r.display.width, r.display.height]).toEqual([100, 200]);
    const meta = await sharp(r.display.data).metadata();
    expect([meta.width, meta.height]).toEqual([100, 200]);
  });

  it("keeps no metadata, so GPS is gone", async () => {
    const jpeg = await solid(200, 100)
      .jpeg()
      .withExif({ IFD0: { Make: "Phone" }, IFD3: { GPSLatitudeRef: "N", GPSLatitude: "21/1 1/1 1/1" } })
      .toBuffer();
    expect((await sharp(jpeg).metadata()).exif).toBeDefined();
    const r = await ok(jpeg);
    for (const img of [r.display, r.thumb]) {
      const meta = await sharp(img.data).metadata();
      expect(meta.exif).toBeUndefined();
      expect(img.data.includes(Buffer.from("GPS"))).toBe(false);
    }
  });

  it("fits a 4000 px photo into 1600 px (display) and 480 px (thumb)", async () => {
    const r = await ok(await solid(4000, 3000).jpeg().toBuffer());
    expect([r.display.width, r.display.height]).toEqual([1600, 1200]);
    expect([r.thumb.width, r.thumb.height]).toEqual([480, 360]);
  });

  it("does not enlarge a small photo", async () => {
    const r = await ok(await solid(300, 200).png().toBuffer());
    expect([r.display.width, r.display.height]).toEqual([300, 200]);
    expect([r.thumb.width, r.thumb.height]).toEqual([300, 200]);
  });

  it("uses only the first frame of an animated GIF", async () => {
    const frame = (r: number, b: number) =>
      sharp({ create: { width: 40, height: 30, channels: 3, background: { r, g: 0, b } } }).png().toBuffer();
    const frames = await sharp([await frame(255, 0), await frame(0, 255)], { join: { animated: true } })
      .gif()
      .toBuffer();
    expect((await sharp(frames, { animated: true }).metadata()).pages).toBe(2);
    const r = await ok(frames);
    expect([r.display.width, r.display.height]).toEqual([40, 30]);
  });

  it("refuses a PDF as notPhoto", async () => {
    const pdf = Buffer.from("%PDF-1.7\n1 0 obj\n<<>>\nendobj\n");
    expect(await processPhoto(pdf)).toEqual({ ok: false, reason: "notPhoto" });
  });

  it("refuses a HEIC file with its own reason", async () => {
    const heic = Buffer.concat([Buffer.from([0, 0, 0, 24]), Buffer.from("ftypheic"), Buffer.alloc(64)]);
    expect(await processPhoto(heic)).toEqual({ ok: false, reason: "heic" });
  });

  it("refuses a corrupt JPEG as notPhoto", async () => {
    const jpeg = await solid(200, 100).jpeg().toBuffer();
    const corrupt = Buffer.concat([jpeg.subarray(0, 40), Buffer.alloc(200, 7)]);
    expect(await processPhoto(corrupt)).toEqual({ ok: false, reason: "notPhoto" });
  });

  it("refuses an image with too many pixels (decompression bomb) as notPhoto", async () => {
    const bomb = await solid(8000, 8000).png({ compressionLevel: 9 }).toBuffer(); // 64 MP
    expect(bomb.length).toBeLessThan(MAX_PHOTO_BYTES);
    expect(await processPhoto(bomb)).toEqual({ ok: false, reason: "notPhoto" });
  });

  it("refuses 5,000,001 bytes as tooBig but not exactly 5,000,000 bytes", async () => {
    const jpeg = await solid(200, 100).jpeg().toBuffer();
    // JPEG decoders ignore bytes after the end-of-image marker, so padding keeps it valid.
    const pad = (n: number) => Buffer.concat([jpeg, Buffer.alloc(n - jpeg.length)]);
    expect(await processPhoto(pad(5_000_001))).toEqual({ ok: false, reason: "tooBig" });
    expect((await processPhoto(pad(5_000_000))).ok).toBe(true);
  });
});

describe("sharp configuration", () => {
  it("limits sharp to one thread once a photo is processed", async () => {
    sharp.concurrency(4);
    await ok(await solid(10, 10).png().toBuffer());
    expect(sharp.concurrency()).toBe(1);
  });
});

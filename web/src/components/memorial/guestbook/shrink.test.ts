import { describe, expect, it } from "vitest";
import { shouldSkipShrink, targetSize } from "./shrink";

describe("targetSize", () => {
  it("keeps a small image as it is", () => {
    expect(targetSize(1000, 800)).toEqual({ width: 1000, height: 800 });
  });
  it("brings the long side down to 2400, landscape", () => {
    expect(targetSize(4800, 3200)).toEqual({ width: 2400, height: 1600 });
  });
  it("brings the long side down to 2400, portrait", () => {
    expect(targetSize(3000, 4000)).toEqual({ width: 1800, height: 2400 });
  });
  it("caps the area when the area is the tighter limit", () => {
    const { width, height } = targetSize(4000, 4000, 4000, 4_000_000);
    expect(width * height).toBeLessThanOrEqual(4_000_000);
    expect(width).toBeGreaterThan(1900);
    expect(Math.abs(width - height)).toBeLessThanOrEqual(1);
  });
  it("never gives a zero side for a very thin image", () => {
    expect(targetSize(20000, 3)).toEqual({ width: 2400, height: 1 });
  });
  it("takes the explicit limits", () => {
    expect(targetSize(1000, 500, 500, 1_000_000)).toEqual({ width: 500, height: 250 });
  });
});

const file = (name: string, type: string, bytes: number) => ({ name, type, size: bytes });

describe("shouldSkipShrink", () => {
  it("skips a small JPEG within 2400 px", () => {
    expect(shouldSkipShrink(file("a.jpg", "image/jpeg", 1_500_000), 2400, 1800)).toBe(true);
  });
  it("skips small PNG and WebP too", () => {
    expect(shouldSkipShrink(file("a.png", "image/png", 100_000), 800, 600)).toBe(true);
    expect(shouldSkipShrink(file("a.webp", "image/webp", 100_000), 800, 600)).toBe(true);
  });
  it("does not skip when over 1.5 MB", () => {
    expect(shouldSkipShrink(file("a.jpg", "image/jpeg", 1_500_001), 800, 600)).toBe(false);
  });
  it("does not skip when the long side is over 2400", () => {
    expect(shouldSkipShrink(file("a.jpg", "image/jpeg", 500_000), 2401, 100)).toBe(false);
    expect(shouldSkipShrink(file("a.jpg", "image/jpeg", 500_000), 100, 2401)).toBe(false);
  });
  it("always skips GIFs, however big", () => {
    expect(shouldSkipShrink(file("a.gif", "image/gif", 20_000_000), 6000, 4000)).toBe(true);
  });
  it("never skips HEIC, by type or by name", () => {
    expect(shouldSkipShrink(file("a.heic", "image/heic", 100_000), 800, 600)).toBe(false);
    expect(shouldSkipShrink(file("a.HEIC", "", 100_000), 800, 600)).toBe(false);
    expect(shouldSkipShrink(file("a.heif", "image/heif", 100_000), 800, 600)).toBe(false);
  });
  it("does not skip other types", () => {
    expect(shouldSkipShrink(file("a.bmp", "image/bmp", 100_000), 800, 600)).toBe(false);
  });
});

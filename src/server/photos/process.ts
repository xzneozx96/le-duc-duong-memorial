import "server-only";
import sharp from "sharp";

export const MAX_PHOTO_BYTES = 5_000_000;
const MAX_INPUT_PIXELS = 50_000_000;
const DISPLAY_PX = 1600;
const THUMB_PX = 480;
const QUALITY = 80;

export type ProcessedImage = { data: Buffer; width: number; height: number };
export type ProcessResult =
  | { ok: true; display: ProcessedImage; thumb: ProcessedImage }
  | { ok: false; reason: "tooBig" | "heic" | "notPhoto" };

type Kind = "photo" | "heic" | "other";

const HEIC_BRANDS = new Set(["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"]);

/** Decides by magic bytes, never by file name or the browser's content type. */
function sniff(b: Uint8Array): Kind {
  const text = (from: number, to: number) => String.fromCharCode(...b.subarray(from, to));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "photo"; // JPEG
  if (text(0, 8) === "\x89PNG\r\n\x1a\n") return "photo";
  if (text(0, 4) === "RIFF" && text(8, 12) === "WEBP") return "photo";
  if (text(0, 4) === "GIF8") return "photo";
  if (text(4, 8) === "ftyp" && HEIC_BRANDS.has(text(8, 12))) return "heic";
  return "other";
}

/** One libvips thread per conversion keeps memory predictable; applied lazily, never at import. */
function configureSharp() {
  if (sharp.concurrency() !== 1) sharp.concurrency(1);
}

async function render(source: Buffer, fit: number): Promise<ProcessedImage> {
  const { data, info } = await sharp(source, { limitInputPixels: MAX_INPUT_PIXELS })
    .rotate()
    .resize({ width: fit, height: fit, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

export async function processPhoto(bytes: Uint8Array): Promise<ProcessResult> {
  if (bytes.length > MAX_PHOTO_BYTES) return { ok: false, reason: "tooBig" };
  const kind = sniff(bytes);
  if (kind === "heic") return { ok: false, reason: "heic" };
  if (kind !== "photo") return { ok: false, reason: "notPhoto" };
  try {
    configureSharp();
    const source = Buffer.from(bytes);
    const [display, thumb] = await Promise.all([render(source, DISPLAY_PX), render(source, THUMB_PX)]);
    return { ok: true, display, thumb };
  } catch {
    return { ok: false, reason: "notPhoto" };
  }
}

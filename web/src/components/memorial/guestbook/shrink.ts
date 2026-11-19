// Shrinks a photo in the browser before it is sent, so a phone photo fits under the host's
// 4.5 MB request limit. Client-only (canvas). The pure maths is exported and tested; the canvas
// part is not tested in node. It never throws: on any failure the original file is returned.
import { isHeic } from "./send";

export const MAX_EDGE = 2400;
/** Old iOS Safari refuses canvases much above this many pixels. */
export const MAX_AREA = 16_000_000;
export const SKIP_BYTES = 1_500_000;
/** Aim for a result under this; lower qualities are tried when it is not. */
export const TARGET_BYTES = 4_000_000;
const QUALITIES = [0.88, 0.8, 0.7] as const;

/** The size to draw at: long side at most `maxEdge`, area at most `maxArea`, never enlarged. */
export function targetSize(width: number, height: number, maxEdge = MAX_EDGE, maxArea = MAX_AREA) {
  const scale = Math.min(1, maxEdge / Math.max(width, height), Math.sqrt(maxArea / (width * height)));
  if (scale >= 1) return { width, height };
  return { width: Math.max(1, Math.floor(width * scale)), height: Math.max(1, Math.floor(height * scale)) };
}

/** True when the original should be sent as it is: GIFs (animation), or a small, ordinary file. HEIC is never skipped. */
export function shouldSkipShrink(file: { name: string; type: string; size: number }, width: number, height: number) {
  if (isHeic(file as File)) return false;
  if (file.type === "image/gif" || /\.gif$/i.test(file.name)) return true;
  return (
    file.size <= SKIP_BYTES &&
    /^image\/(jpeg|png|webp)$/.test(file.type) &&
    Math.max(width, height) <= MAX_EDGE
  );
}

async function encode(bitmap: ImageBitmap, width: number, height: number, quality: number): Promise<Blob | null> {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    return canvas.convertToBlob({ type: "image/jpeg", quality });
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

export async function shrinkPhoto(file: File): Promise<File> {
  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    if (shouldSkipShrink(file, bitmap.width, bitmap.height)) return file;
    const { width, height } = targetSize(bitmap.width, bitmap.height);
    let best: Blob | null = null;
    for (const quality of QUALITIES) {
      const blob = await encode(bitmap, width, height, quality);
      if (!blob || blob.type !== "image/jpeg") return best ? toFile(best, file) : file;
      best = blob;
      if (blob.size <= TARGET_BYTES) break;
    }
    return best ? toFile(best, file) : file;
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}

const toFile = (blob: Blob, original: File) =>
  new File([blob], original.name.replace(/\.[^./\\]*$/, "") + ".jpg", { type: "image/jpeg", lastModified: original.lastModified });

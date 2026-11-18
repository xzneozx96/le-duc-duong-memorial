import "server-only";
import { connection } from "next/server";
import type { Db } from "@/server/db/client";
import { clientKey, createRateLimiter, type RateLimiter } from "@/server/rate-limit";
import { createPendingTracker } from "./pending";
import { getPublicPhoto, isPublicPhoto, stagePhoto, sweepStagedPhotos } from "./photos";
import type { PhotoStore } from "./store";

/** A little above 5 MB: multipart framing and the file's own name add a few hundred bytes. */
const MAX_BODY_BYTES = 5_500_000;
const MAX_PENDING_PER_CLIENT = 40;
const SWEEP_EVERY_MS = 10 * 60 * 1000;
const UPLOADS_PER_HOUR = 300;

export const createPhotoLimiter = (): RateLimiter =>
  createRateLimiter({ limit: UPLOADS_PER_HOUR, windowMs: 60 * 60 * 1000 });

const NOSNIFF = { "x-content-type-options": "nosniff" };
const json = (body: unknown, status: number) => Response.json(body, { status, headers: NOSNIFF });

/** Fixed label plus the error's name and code. Messages can carry query values or user data. */
function logFailure(label: string, e: unknown) {
  const err = e as { name?: unknown; code?: unknown } | null;
  const name = typeof err?.name === "string" ? err.name : "Error";
  const code = typeof err?.code === "string" ? ` ${err.code}` : "";
  console.error(`photos ${label} failed: ${name}${code}`);
}
const serverError = (label: string, e: unknown) => {
  logFailure(label, e);
  return json({ error: "server" }, 500);
};
const notFound = () =>
  Response.json({ error: "notFound" }, { status: 404, headers: { ...NOSNIFF, "cache-control": "no-store" } });

const STATUS = { tooBig: 413, heic: 415, notPhoto: 415, storageFull: 507 } as const;

const matches = (header: string | null, etag: string) =>
  header !== null &&
  header.split(",").some((t) => {
    const v = t.trim().replace(/^W\//, "");
    return v === "*" || v === etag;
  });

/** Route handler logic with its collaborators injected, so tests can swap them. */
export function makeHandlers(deps: {
  getDb: () => Db;
  getStore: () => PhotoStore;
  limiter: RateLimiter;
  quotaBytes?: number;
  maxPending?: number;
  now?: () => number;
  sweep?: (now: Date) => Promise<unknown>;
}) {
  const pending = createPendingTracker(deps.maxPending ?? MAX_PENDING_PER_CLIENT);
  const clock = deps.now ?? Date.now;
  const sweep =
    deps.sweep ?? ((now: Date) => sweepStagedPhotos({ db: deps.getDb(), store: deps.getStore() }, now));
  let lastSweep = -Infinity;

  /** Fire and forget: a slow or failing sweep never touches the upload that triggered it. */
  function maybeSweep() {
    const t = clock();
    if (t - lastSweep < SWEEP_EVERY_MS) return;
    lastSweep = t;
    void Promise.resolve()
      .then(() => sweep(new Date(t)))
      .catch((e) => logFailure("sweep", e));
  }

  return {
    async POST(req: Request): Promise<Response> {
      try {
        const client = clientKey(req);
        if (!deps.limiter.hit(client)) return json({ error: "rateLimited" }, 429);
        // Decide from the header alone, before reading a byte of the body.
        const header = req.headers.get("content-length");
        if (header === null || !/^\d+$/.test(header.trim())) return json({ error: "lengthRequired" }, 411);
        if (Number(header) > MAX_BODY_BYTES) return json({ error: "tooBig" }, 413);
        maybeSweep();
        const db = deps.getDb();
        if (await pending.isFull(db, client)) return json({ error: "tooMany" }, 429);
        let file: FormDataEntryValue | null;
        try {
          file = (await req.formData()).get("file");
        } catch {
          return json({ error: "noFile" }, 400);
        }
        if (!(file instanceof Blob)) return json({ error: "noFile" }, 400);
        const result = await stagePhoto(
          { db, store: deps.getStore(), quotaBytes: deps.quotaBytes },
          new Uint8Array(await file.arrayBuffer()),
        );
        if (!result.ok) return json({ error: result.reason }, STATUS[result.reason]);
        pending.add(client, result.id);
        return json({ id: result.id, width: result.width, height: result.height }, 201);
      } catch (e) {
        return serverError("upload", e);
      }
    },

    async GET(req: Request, id: string): Promise<Response> {
      try {
        await connection(); // request-time only: never read the database during next build
        const size = new URL(req.url).searchParams.get("size") === "thumb" ? "thumb" : "display";
        const etag = `"${id}-${size}"`;
        // Always revalidate: a browser may keep the bytes, but must ask the app before showing
        // them again, so a post hidden later stops working (AC-19).
        const headers = { ...NOSNIFF, "cache-control": "private, no-cache", etag };
        if (matches(req.headers.get("if-none-match"), etag) && (await isPublicPhoto(deps.getDb(), id))) {
          return new Response(null, { status: 304, headers });
        }
        const photo = await getPublicPhoto({ db: deps.getDb(), store: deps.getStore() }, id, size);
        if (!photo) return notFound();
        return new Response(photo.body, {
          headers: {
            ...headers,
            "content-type": "image/webp",
            ...(photo.contentLength !== undefined ? { "content-length": String(photo.contentLength) } : {}),
          },
        });
      } catch (e) {
        return serverError("read", e);
      }
    },
  };
}

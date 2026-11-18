import "server-only";
import { connection } from "next/server";
import type { Db } from "@/server/db/client";
import { clientKey, type RateLimiter } from "@/server/rate-limit";
import { createEntry, listVisibleEntries } from "./entries";
import { parseEntryInput } from "./validation";

const json = (body: unknown, status: number) => Response.json(body, { status });
/**
 * Logs a fixed label with the error's name and code only. Drizzle puts the bound query
 * parameters (the visitor's name and message) into error messages, so the error itself is never logged.
 */
const serverError = (e: unknown) => {
  const err = e as { name?: unknown; code?: unknown; cause?: { code?: unknown } } | null;
  const code = err?.code ?? err?.cause?.code;
  console.error(`entries handler failed: ${String(err?.name ?? "Error")}${code ? ` ${String(code)}` : ""}`);
  return json({ error: "server" }, 500);
};

const MAX_BODY_BYTES = 64 * 1024;

/** The body text, or null when it is over the cap (decided from Content-Length, else while streaming). */
async function readCappedBody(req: Request): Promise<string | null> {
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      return null;
    }
    parts.push(value);
  }
  return Buffer.concat(parts).toString("utf8");
}

/** Route handler logic with its collaborators injected, so tests can swap them. */
export function makeHandlers(deps: { getDb: () => Db; limiter: RateLimiter }) {
  return {
    async POST(req: Request): Promise<Response> {
      try {
        if (!deps.limiter.hit(clientKey(req))) return json({ error: "rateLimited" }, 429);
        let raw: unknown;
        try {
          const text = await readCappedBody(req);
          if (text === null) return json({ error: "tooBig" }, 413);
          raw = JSON.parse(text);
        } catch {
          return json({ error: "invalidJson" }, 400);
        }
        const parsed = parseEntryInput(raw);
        if (!parsed.ok) return json({ errors: parsed.errors }, 422);
        const result = await createEntry(deps.getDb(), parsed.value);
        if (!result.ok) return json({ errors: result.errors }, 400);
        return json(result.entry, 201);
      } catch (e) {
        return serverError(e);
      }
    },

    async GET(): Promise<Response> {
      // Request-time only: never read the database during next build. Outside the try so a
      // prerender abort is not caught and logged as a failure.
      await connection();
      try {
        return json(await listVisibleEntries(deps.getDb()), 200);
      } catch (e) {
        return serverError(e);
      }
    },
  };
}

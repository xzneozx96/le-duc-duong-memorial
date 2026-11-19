import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "@/server/db/client";

/** Liveness plus database reachability. The body never carries error details. */
export async function GET() {
  await connection(); // request-time only: never touch the database during next build
  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ ok: true }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error(`health check failed: ${(e as Error)?.name ?? "Error"} ${(e as { code?: string })?.code ?? ""}`.trim());
    return Response.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

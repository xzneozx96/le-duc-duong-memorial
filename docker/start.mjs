// Container entry point (copied to /app/start.mjs): apply Drizzle migrations (retrying while Postgres starts), then start Next.
import { spawn } from "node:child_process";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[start] DATABASE_URL is not set; refusing to start.");
  process.exit(1);
}

const attempts = Number(process.env.MIGRATE_ATTEMPTS ?? 30);
const delayMs = Number(process.env.MIGRATE_DELAY_MS ?? 2000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function migrateOnce() {
  const sql = postgres(url, { max: 1, connect_timeout: 5, onnotice: () => {} });
  try {
    await migrate(drizzle(sql), { migrationsFolder: new URL("./drizzle", import.meta.url).pathname });
  } finally {
    await sql.end({ timeout: 5 }).catch(() => {});
  }
}

let done = false;
for (let i = 1; i <= attempts && !done; i++) {
  try {
    await migrateOnce();
    done = true;
    console.log(`[start] migrations applied (attempt ${i}).`);
  } catch (e) {
    console.warn(`[start] migration attempt ${i}/${attempts} failed: ${e?.code ?? ""} ${e?.message ?? e}`);
    if (i < attempts) await sleep(delayMs);
  }
}
if (!done) {
  console.error(`[start] FATAL: migrations failed after ${attempts} attempts; not starting the server.`);
  process.exit(1);
}

const child = spawn(process.execPath, [new URL("./server.js", import.meta.url).pathname], { stdio: "inherit" });
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => child.kill(sig));
child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));

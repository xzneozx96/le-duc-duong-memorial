import { sql } from "drizzle-orm";
import { createDb, type Db } from "@/server/db/client";
import { runMigrations } from "@/server/db/migrate";
import { entries, photos } from "@/server/db/schema";

export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgres://memorial_test:memorial_test@127.0.0.1:55432/memorial_test";

let handle: ReturnType<typeof createDb> | undefined;

/** Connects to the test database, applies migrations and returns it. Fails fast with a hint. */
export async function openTestDb(): Promise<Db> {
  handle = createDb(TEST_DATABASE_URL.includes("?") ? TEST_DATABASE_URL : `${TEST_DATABASE_URL}?connect_timeout=3`);
  try {
    await handle.db.execute(sql`select 1`);
  } catch (cause) {
    await handle.close().catch(() => {});
    throw new Error(
      `Test database is not reachable at ${TEST_DATABASE_URL}.\n` +
        `Start it with: docker compose -f docker-compose.test.yml up -d\n` +
        `(or set TEST_DATABASE_URL). Cause: ${(cause as Error).message}`,
    );
  }
  await runMigrations(handle.db);
  return handle.db;
}

export async function closeTestDb() {
  await handle?.close();
  handle = undefined;
}

export async function resetTables(db: Db) {
  await db.execute(sql`truncate table photos, entries restart identity cascade`);
}

/** Inserts a staged photo (as slice 2's upload will) and returns its id. */
export async function stagePhoto(db: Db, over: Partial<typeof photos.$inferInsert> = {}) {
  const [row] = await db
    .insert(photos)
    .values({ width: 800, height: 600, displayKey: "d/x.webp", thumbKey: "t/x.webp", bytes: 1234, ...over })
    .returning({ id: photos.id });
  return row.id;
}

export async function insertEntry(db: Db, over: Partial<typeof entries.$inferInsert> = {}) {
  const [row] = await db
    .insert(entries)
    .values({ name: "An", relation: "friend", message: "hi", ...over })
    .returning();
  return row;
}

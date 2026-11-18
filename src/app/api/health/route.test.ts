import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { closeTestDb, openTestDb, TEST_DATABASE_URL } from "../../../../test/db";

// connection() only works inside a Next request, so the test stands in for the framework.
const connection = vi.hoisted(() => vi.fn(async () => {}));
vi.mock("next/server", () => ({ connection }));

// Swapped per test: the real test database, or one that is down.
const dbUnderTest = vi.hoisted(() => ({ current: undefined as unknown }));
vi.mock("@/server/db/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/server/db/client")>()),
  getDb: () => dbUnderTest.current,
}));

import { GET } from "./route";

beforeAll(async () => {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  dbUnderTest.current = await openTestDb();
});
afterAll(closeTestDb);

describe("GET /api/health", () => {
  it("answers 200 with ok true when the database answers select 1", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("answers 503 with ok false and no error details when the database is down", async () => {
    const real = dbUnderTest.current;
    dbUnderTest.current = {
      execute: async () => {
        throw new Error("connect ECONNREFUSED postgres://user:secret@db:5432/x");
      },
    };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const res = await GET();
      expect(res.status).toBe(503);
      const text = await res.text();
      expect(JSON.parse(text)).toEqual({ ok: false });
      expect(text).not.toContain("secret");
    } finally {
      dbUnderTest.current = real;
      spy.mockRestore();
    }
  });
});

import { eq } from "drizzle-orm";
import sharp from "sharp";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { closeTestDb, insertEntry, openTestDb, resetTables, TEST_DATABASE_URL } from "../../../../test/db";
import { openTestS3 } from "../../../../test/s3";
import { photos } from "@/server/db/schema";
import { POST } from "./route";
import { GET } from "./[id]/route";

vi.mock("next/server", () => ({ connection: async () => {} }));

let db: Awaited<ReturnType<typeof openTestDb>>;
beforeAll(async () => {
  const s3 = await openTestS3();
  Object.assign(process.env, {
    DATABASE_URL: TEST_DATABASE_URL,
    S3_ENDPOINT: s3.endpoint,
    S3_REGION: s3.region,
    S3_BUCKET: s3.bucket,
    S3_ACCESS_KEY: s3.accessKey,
    S3_SECRET_KEY: s3.secretKey,
    S3_FORCE_PATH_STYLE: "true",
  });
  db = await openTestDb();
  await resetTables(db);
});
beforeEach(() => resetTables(db));
afterAll(closeTestDb);

async function uploadViaRoute() {
  const form = new FormData();
  const png = await sharp({ create: { width: 20, height: 10, channels: 3, background: "blue" } }).png().toBuffer();
  form.set("file", new File([new Uint8Array(png)], "a.png", { type: "image/png" }));
  const encoded = new Response(form);
  const body = await encoded.arrayBuffer();
  return POST(
    new Request("http://localhost/api/photos", {
      method: "POST",
      headers: { "content-type": encoded.headers.get("content-type")!, "content-length": String(body.byteLength) },
      body,
    }),
  );
}
const getViaRoute = (id: string, size?: string) =>
  GET(new Request(`http://localhost/api/photos/${id}${size ? `?size=${size}` : ""}`), {
    params: Promise.resolve({ id }),
  } as never);

describe("photo routes", () => {
  it("POST stores a photo from the env-configured store, and a staged photo then answers 404 on GET", async () => {
    const res = await uploadViaRoute();
    expect(res.status).toBe(201);
    const { id } = await res.json();
    expect(await db.select().from(photos)).toHaveLength(1);
    expect((await getViaRoute(id)).status).toBe(404);
  });

  it("GET serves image/webp at both sizes for a photo of a visible entry", async () => {
    const { id } = await (await uploadViaRoute()).json();
    const entry = await insertEntry(db);
    await db.update(photos).set({ entryId: entry.id }).where(eq(photos.id, id));
    for (const size of [undefined, "thumb"]) {
      const res = await getViaRoute(id, size);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toBe("image/webp");
      expect((await sharp(Buffer.from(await res.arrayBuffer())).metadata()).format).toBe("webp");
    }
  });

  it("GET answers 404 for the thumb of a hidden entry's photo", async () => {
    const { id } = await (await uploadViaRoute()).json();
    const entry = await insertEntry(db, { hidden: true });
    await db.update(photos).set({ entryId: entry.id }).where(eq(photos.id, id));
    expect((await getViaRoute(id, "thumb")).status).toBe(404);
  });
});

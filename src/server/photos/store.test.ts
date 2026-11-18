import { beforeAll, describe, expect, it } from "vitest";
import { openTestS3 } from "../../../test/s3";
import { createS3PhotoStore, type PhotoStore } from "./store";

let store: PhotoStore;
beforeAll(async () => {
  store = createS3PhotoStore(await openTestS3());
});

const key = () => `test/${crypto.randomUUID()}.webp`;
const read = async (s: ReadableStream<Uint8Array>) => Buffer.from(await new Response(s).arrayBuffer());

describe("S3 photo store", () => {
  it("returns what was put, with its content type and length", async () => {
    const k = key();
    await store.put(k, Buffer.from("hello"), "image/webp");
    const got = await store.get(k);
    expect(got?.contentType).toBe("image/webp");
    expect(got?.contentLength).toBe(5);
    expect((await read(got!.body)).toString()).toBe("hello");
  });

  it("returns null for a key that does not exist", async () => {
    expect(await store.get(key())).toBeNull();
  });

  it("deletes an object", async () => {
    const k = key();
    await store.put(k, Buffer.from("x"), "image/webp");
    await store.delete(k);
    expect(await store.get(k)).toBeNull();
  });
});

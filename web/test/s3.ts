import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import type { S3Config } from "@/server/photos/store";

export const TEST_S3: S3Config = {
  endpoint: process.env.TEST_S3_ENDPOINT ?? "http://127.0.0.1:59000",
  region: process.env.TEST_S3_REGION ?? "us-east-1",
  bucket: process.env.TEST_S3_BUCKET ?? "memorial-test",
  accessKey: process.env.TEST_S3_ACCESS_KEY ?? "memorial_test",
  secretKey: process.env.TEST_S3_SECRET_KEY ?? "memorial_test_secret",
  forcePathStyle: true,
};

/** Creates the test bucket (if missing) and returns the config. Fails fast with a hint. */
export async function openTestS3(): Promise<S3Config> {
  const client = new S3Client({
    endpoint: TEST_S3.endpoint,
    region: TEST_S3.region,
    forcePathStyle: true,
    credentials: { accessKeyId: TEST_S3.accessKey, secretAccessKey: TEST_S3.secretKey },
    maxAttempts: 1,
    requestHandler: { requestTimeout: 3000, connectionTimeout: 3000 },
  });
  try {
    await client.send(new CreateBucketCommand({ Bucket: TEST_S3.bucket }));
  } catch (cause) {
    const name = (cause as { name?: string }).name;
    if (name !== "BucketAlreadyOwnedByYou" && name !== "BucketAlreadyExists") {
      throw new Error(
        `Test S3 store is not reachable at ${TEST_S3.endpoint}.\n` +
          `Start it with: docker compose -f docker-compose.test.yml up -d\n` +
          `(or set TEST_S3_ENDPOINT, TEST_S3_ACCESS_KEY, TEST_S3_SECRET_KEY). Cause: ${(cause as Error).message}`,
      );
    }
  } finally {
    client.destroy();
  }
  return TEST_S3;
}

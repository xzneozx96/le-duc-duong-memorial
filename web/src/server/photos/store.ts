import "server-only";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export type StoredObject = { body: ReadableStream<Uint8Array>; contentType: string; contentLength?: number };

/** Where photo bytes live. The bucket is private; only the app reads it. */
export interface PhotoStore {
  put(key: string, data: Buffer, contentType: string): Promise<void>;
  /** null when there is no such object */
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
}

export type S3Config = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
  forcePathStyle: boolean;
};

/** The client is built on first use, never at import or build time. */
export function createS3PhotoStore(config: S3Config): PhotoStore {
  let client: S3Client | undefined;
  const s3 = () =>
    (client ??= new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      forcePathStyle: config.forcePathStyle,
      credentials: { accessKeyId: config.accessKey, secretAccessKey: config.secretKey },
    }));
  const Bucket = config.bucket;

  return {
    async put(Key, data, contentType) {
      await s3().send(new PutObjectCommand({ Bucket, Key, Body: data, ContentType: contentType }));
    },
    async get(Key) {
      try {
        const res = await s3().send(new GetObjectCommand({ Bucket, Key }));
        if (!res.Body) return null;
        return {
          body: res.Body.transformToWebStream(),
          contentType: res.ContentType ?? "application/octet-stream",
          contentLength: res.ContentLength,
        };
      } catch (e) {
        if ((e as { name?: string }).name === "NoSuchKey") return null;
        throw e;
      }
    },
    async delete(Key) {
      await s3().send(new DeleteObjectCommand({ Bucket, Key }));
    },
  };
}

let shared: PhotoStore | undefined;

/** The app's store, configured on first use from Neon's standard env names (AWS_*) plus S3_BUCKET. */
export function getPhotoStore(): PhotoStore {
  if (!shared) {
    const need = (name: string) => {
      const v = process.env[name];
      if (!v) throw new Error(`${name} is not set`);
      return v;
    };
    shared = createS3PhotoStore({
      endpoint: need("AWS_ENDPOINT_URL_S3"),
      region: process.env.AWS_REGION || "us-east-1",
      bucket: need("S3_BUCKET"),
      accessKey: need("AWS_ACCESS_KEY_ID"),
      secretKey: need("AWS_SECRET_ACCESS_KEY"),
      // Neon Object Storage only speaks path-style.
      forcePathStyle: true,
    });
  }
  return shared;
}

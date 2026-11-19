# Backend: Lưu bút (guestbook) and photos

The design every backend task follows. The spec is `.factory/work/001-memorial-website/spec.md`
(AC-12 to AC-22). The factory plugin is off for this project (owner's call, 18.11.2026), so this
note stands in for the plan.

## Stack

The app lives in `web/`; every path and command in this file is relative to `web/`.

- Next.js 16 route handlers (not Server Actions: they cap the body at about 1 MB).
- Postgres 17 with Drizzle ORM (`drizzle-orm`, `postgres` driver, `drizzle-kit` migrations in
  `drizzle/`).
- An S3-compatible store for photos through the S3 API (`@aws-sdk/client-s3`): SeaweedFS
  (`chrislusf/seaweedfs`), since MinIO stopped publishing pullable Docker images (checked
  18.11.2026). "MinIO" below means this store. The bucket is private. Photos are
  only ever served through the app, so a hidden post's photos stop working (AC-19).
- `sharp` for photos. `zod` for input checks. `vitest` for tests.
- Server code lives in `src/server/` (never imported by client components). Route handlers in
  `src/app/api/`.

## Data

`entries`

| column | type | notes |
| --- | --- | --- |
| id | uuid pk | random |
| name | text | 1–100 characters after trim |
| relation | text | one of `student`, `colleague`, `friend`, `family`, `other` |
| cls | text null | 0–50 |
| year | text null | 0–50 |
| message | text | 1–5,000 after trim; two or more blank lines in a row collapse to one blank line (as the form does) |
| created_at | timestamptz | default now() |
| hidden | boolean | default false (admin hides; no delete, ever) |
| hidden_note | text null | the family's note when hiding |

`photos`

| column | type | notes |
| --- | --- | --- |
| id | uuid pk | random, unguessable |
| entry_id | uuid null fk → entries | null while staged (uploaded, not yet attached) |
| position | int | order within the post |
| caption | text null | 0–140 |
| width, height | int | of the display copy |
| display_key, thumb_key | text | MinIO object keys |
| bytes | int | size of the display copy |
| created_at | timestamptz | staged photos older than 24 h may be cleaned up later |

Lengths are counted in Unicode code points after NFC normalisation, so Vietnamese with combining
marks counts the way a person reads it.

## Flow (one photo per request, then the post)

1. For each photo: `POST /api/photos` (multipart, one `file` field). The server:
   - refuses more than 5,000,000 bytes (413) and anything whose magic bytes are not JPEG, PNG,
     WebP or GIF (415). HEIC is refused with its own reason (`heic`), since Safari usually converts
     to JPEG anyway;
   - runs sharp: `.rotate()` (applies phone rotation), resize to fit 1600 px (display) and
     480 px (thumb), WebP q80, no metadata kept (removes GPS);
   - stores both copies in MinIO, inserts a staged `photos` row, returns
     `{ id, width, height }`.
   The form shows "Đang gửi ảnh i/n" per photo.
   Browser side (`guestbook/shrink.ts`): the form accepts photos up to 25 MB, then shrinks each one
   just before its upload (long side 2400 px, JPEG q0.88, lower if still over 4 MB; GIFs and small
   JPEG/PNG/WebP are sent as they are). That keeps the request under Vercel's 4.5 MB body limit.
   HEIC is accepted only where the browser can decode it (Safari) and is sent as JPEG. If shrinking
   fails, the original is sent and the server's 5 MB limit applies.
2. `POST /api/entries` (JSON): `{ name, relation, cls?, year?, message, photos: [{ id, caption? }] }`.
   One transaction: insert the entry, attach the staged photos in the given order with their
   captions. Unknown or already-attached photo ids → 400, nothing written. Field errors → 422 with
   `{ errors: { field: code } }` (codes: `required`, `tooLong`, `invalid`), so the form can show
   its own Vietnamese messages (AC-13). Returns the created entry in the public shape.
3. `GET /api/entries` → visible entries, newest first, in the public shape:
   `{ id, name, relation, cls?, year?, message, createdAt, photos: [{ id, width, height, caption?,
   src: "/api/photos/<id>", thumb: "/api/photos/<id>?size=thumb" }] }`.
4. `GET /api/photos/<id>[?size=thumb]` streams the WebP from MinIO only when the photo belongs to a
   visible entry (404 otherwise, including staged and hidden). `Cache-Control: private, no-cache`
   with a strong ETag: browsers revalidate each time (304 while visible), so a hidden post's photo
   stops opening at once (AC-19). `X-Content-Type-Options: nosniff`.

All reads are dynamic (`cacheComponents` is on): call `connection()` before reading the database
in any server component, and mark route handlers dynamic.

## Abuse limits (simple, in memory, per client)

No bot check (spec: the family hides spam by hand). People at the funeral may share one venue
Wi-Fi, so per-client limits are generous and the disk is protected by other means:

- 30 posts and 300 photo uploads per client per hour (429). The client key is the IPv4 address,
  or the IPv6 /64 prefix, from the `X-Forwarded-For` that Caddy overwrites.
- At most 40 staged (not yet posted) photos per client at a time (429 `tooMany`).
- Staged photos older than 60 minutes are deleted (row and both objects) by a sweep that runs
  from the upload route at most every 10 minutes.
- A global photo quota, `PHOTO_QUOTA_BYTES` (default 20 GB): uploads past it get 507
  `storageFull`.
- At most 2 photos are processed at once per process (`sharp.concurrency(1)`), 50 MP input cap.
- Bodies: post JSON capped at 64 KB; photo uploads must send `Content-Length` (411 otherwise) and
  are capped at about 5.5 MB before reading; Caddy caps both routes too.
- Logs never carry visitor text: errors are logged as a fixed label plus the error name and code.

## Admin (AC-18 to AC-22)

Not in this batch unless the owner says so. The `hidden` column is there from the start.

## Config (env)

`DATABASE_URL`, `DATABASE_URL_UNPOOLED` (migrations), `AWS_ENDPOINT_URL_S3`, `AWS_REGION`,
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET` (Neon Postgres and Object Storage), later `ADMIN_PASSWORD`. A `.env.example` lists them; real values never
go in git.

## Tests

- Unit and route tests with vitest. Integration tests run against Postgres and MinIO started by
  `docker compose -f docker-compose.test.yml up -d` on ports 55432 and 59000 (never the dev
  server's 3100, never the other project's 8333).
- Every behaviour is test-first: write the failing test, watch it fail, then the code.
- Test photos are generated in the test (sharp) or kept tiny in `test/fixtures/`, including one
  JPEG with EXIF rotation and GPS, a PDF, an over-size file and a HEIC header.

## Deployment

`Dockerfile` (multi-stage, `output: "standalone"`, runs as non-root, sharp included) and
`docker-compose.yml`: `app`, `postgres` (volume), `minio` (volume), a one-shot `minio-init` that
creates the private bucket, `caddy` for HTTPS on the domain from `SITE_DOMAIN`. Migrations run on
app start. Postgres and MinIO are not published to the host.

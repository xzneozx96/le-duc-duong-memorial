# Deploying the memorial site

One small Linux server, Docker, and a domain name. `docker-compose.yml` runs the site (`app`) and
Caddy for HTTPS. The database and the photos live on Neon (Postgres and Object Storage), so the
server keeps no data except the HTTPS certificates.

## First time

1. Install Docker Engine and the Compose plugin: https://docs.docker.com/engine/install/
2. Copy this repository to the server (git clone or rsync). You do not need the `documents/`,
   `images/` or `videos/` folders there.
3. Create the settings file and fill in every `CHANGE_ME`:
   ```
   cp .env.example .env
   nano .env
   ```
   Set `SITE_DOMAIN` to your domain. Fill the Neon variables (`DATABASE_URL`,
   `DATABASE_URL_UNPOOLED`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`,
   `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET=uploads`): on a machine where the repo is linked to the Neon
   project, `npx neon@latest env pull --file .env` writes them. `.env` stays on the server and is
   never committed. `PHOTO_QUOTA_BYTES` (default 20 GB): once photos take this much space, new
   uploads are refused.
4. Point DNS at the server: an `A` record (and `AAAA` if you have IPv6) for the domain. Open
   ports 80 and 443 in the firewall. Caddy fetches the HTTPS certificate by itself once DNS works.
5. Start it:
   ```
   docker compose up -d --build
   ```
   The first build takes a few minutes. The database tables are created on Neon when the app starts (over `DATABASE_URL_UNPOOLED`).
6. Check it:
   ```
   curl https://YOUR-DOMAIN/api/health      # {"ok":true}
   docker compose ps
   docker compose logs app --tail 50
   ```

Only Caddy publishes ports.

The proxy (Caddy) must keep the `Content-Length` header: the photo route answers 411 without it.

## Backups (do this regularly, and before updates)

Posts and photos are on Neon, not on this server. Neon keeps point-in-time history of the database
(restore from the Neon console or `npx neon@latest`). For an extra copy, dump the database over the
direct URL:
```
pg_dump "$DATABASE_URL_UNPOOLED" | gzip > backup/db-$(date +%F).sql.gz
```
Photos are objects in the `uploads` bucket; copy them with any S3 tool pointed at
`AWS_ENDPOINT_URL_S3` (path-style), for example `aws s3 sync s3://uploads backup/photos`.

Copy the `backup/` folder off the server (another machine or cloud storage). A backup on the same
small disk does not protect against a lost disk.

## Updating

```
cd the-repo-folder
git pull                       # or copy the new files over
docker compose up -d --build
docker image prune -f          # frees disk from old builds
```
The Neon data and the certificates volume are kept. Migrations run automatically on start; if one
fails the app logs `[start] FATAL` and restarts until fixed (`docker compose logs app`).

## Stop

`docker compose down` stops the site. `docker compose down -v` also deletes the certificate volume
(Caddy fetches new ones). Posts and photos are on Neon and are not touched either way.

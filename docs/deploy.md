# Deploying the memorial site

One small Linux server, Docker, and a domain name. Everything runs from `docker-compose.yml`:
the site (`app`), Postgres, SeaweedFS (S3 store) for photos, and Caddy for HTTPS.

## First time

1. Install Docker Engine and the Compose plugin: https://docs.docker.com/engine/install/
2. Copy this repository to the server (git clone or rsync). You do not need the `documents/`,
   `images/` or `videos/` folders there.
3. Create the settings file and fill in every `CHANGE_ME`:
   ```
   cp .env.example .env
   nano .env
   ```
   Set `SITE_DOMAIN` to your domain, and use long random passwords (for example
   `openssl rand -base64 24`). `.env` stays on the server and is never committed.
   Also set `PHOTO_QUOTA_BYTES` (default 20 GB): once photos take this much space, new uploads are
   refused. Keep it well below the free disk space (`df -h`).
4. Point DNS at the server: an `A` record (and `AAAA` if you have IPv6) for the domain. Open
   ports 80 and 443 in the firewall. Caddy fetches the HTTPS certificate by itself once DNS works.
5. Start it:
   ```
   docker compose up -d --build
   ```
   The first build takes a few minutes. The database tables are created when the app starts.
6. Check it:
   ```
   curl https://YOUR-DOMAIN/api/health      # {"ok":true}
   docker compose ps
   docker compose logs app --tail 50
   ```

Postgres and the photo store are not reachable from outside the server. Only Caddy publishes ports.

The proxy (Caddy) must keep the `Content-Length` header: the photo route answers 411 without it.

## Backups (do this regularly, and before updates)

Posts (Postgres):
```
mkdir -p backup
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > backup/db-$(date +%F).sql.gz
```
Restore into an empty database:
`gunzip -c backup/db-DATE.sql.gz | docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'`

Photos (SeaweedFS volume `s3data`). Stop the store for a moment so the copy is consistent, then
archive the volume:
```
docker compose stop s3
docker run --rm -v "$(basename "$PWD")_s3data:/data:ro" -v "$PWD/backup:/backup" alpine \
  tar czf /backup/photos-$(date +%F).tar.gz -C /data .
docker compose start s3
```
(The volume name is the folder name plus `_s3data`; `docker volume ls` shows it. The site shows
photos as missing for those few seconds.) Restore: stop `s3`, untar into the volume the same way,
start `s3`.

Copy the `backup/` folder off the server (another machine or cloud storage). A backup on the same
small disk does not protect against a lost disk.

## Updating

```
cd the-repo-folder
git pull                       # or copy the new files over
docker compose up -d --build
docker image prune -f          # frees disk from old builds
```
The volumes (posts, photos, certificates) are kept. Migrations run automatically on start; if one
fails the app logs `[start] FATAL` and restarts until fixed (`docker compose logs app`).

## Stop / disk

`docker compose down` stops everything and keeps the data. `docker compose down -v` also deletes
the volumes (posts and photos), so never use `-v` on the live site.

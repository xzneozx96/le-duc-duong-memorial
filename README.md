# Lê Đức Dương memorial

A one-page memorial website for Nhà giáo Lê Đức Dương (01.05.1942 – 11.11.2026), where his students, colleagues and friends in Vietnam and Germany can leave a letter and photos.

- `web/`: the site (Next.js 16, pnpm). Neon Postgres stores the letters; Neon Object Storage stores the photos.
- `materials/`: the source material (documents, original photos and video, design assets). The originals stay out of git.
- `docs/`: deploy (`docs/deploy.md`) and backend (`docs/backend.md`) notes.

## Run it locally

```bash
cd web
pnpm install
npx neon@latest env pull --file .env.local   # needs the repo linked to the Neon project
pnpm dev
```

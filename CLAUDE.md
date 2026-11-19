# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A one-page memorial website for thầy Lê Đức Dương (01.05.1942 to 11.11.2026), a German teacher at the Foreign Language University in Thanh Xuân, Hanoi, from 1970 to 1988. His students, colleagues and friends in Vietnam and Germany can post memories on it without an account. The target is to be live for the funeral on 27.11.2026.

## Layout and commands

- `web/` is the Next.js 16 app (pnpm): `src/`, `public/`, `drizzle/` migrations, Docker and Caddy files, `neon.ts`, and the `.env*` files. Run every app command there, or with `pnpm --dir web <script>` from the root: `dev`, `build`, `typecheck`, `lint`, `test`.
- The database is Neon Postgres and photos go to the Neon Object Storage bucket `uploads`. `npx neon@latest env pull --file .env.local`, run in `web/`, writes the variables. The Vercel project's Root Directory is `web`.
- `materials/` holds the source material (the life story documents, original photos and video, design assets). `documents/`, `images/` and `videos/` in it stay out of git. The site uses copies in `web/public/`.
- `docs/` holds the deploy and backend notes. `DESIGN.md` is the design system.

## Where things are

- `.factory/brainstorm/2026-11-18-father-memorial-website/intent.md` holds the agreed scope, page structure, visual direction, open questions and draft acceptance criteria. Read it before any spec, design or build work. `memlog.md` next to it is the full decision record, with sources for each fact.
- `materials/documents/` holds the source material for the life story:
  - `Thay_Le_Duc_Duong_01.05.1942-11.11.2026.pdf` is his life story in his own words, compiled from two 2020 podcast interviews. Its last page lists details that still need checking.
  - `Ho_so_tu_lieu_Thay_Le_Duc_Duong.pdf` is a research dossier with a cross-checked timeline, photo sources, contacts and verification gaps.
  - `Tri ân.docx` is a tribute from Cao Hữu Ngạn, former dean of the German department.
- `materials/images/dòng thời gian/` holds timeline photos, not yet sorted by period. `materials/images/gặp mặt hội cựu học sinh/` holds alumni reunion photos. `materials/images/portrait/` holds the header portraits. Filenames are WhatsApp exports with no captions.
- `materials/videos/gap-bac-ho.mp4` is a 58-second clip. The main life film (about 14 minutes) is hosted on YouTube, not in this folder.

Folder and file names contain Vietnamese characters (`dòng thời gian`, `Tri ân.docx`), and some use decomposed Unicode. Quote paths, and use a glob when an exact name fails to match.

## Content rules

These come from the research dossier and apply to every text on the site:

- His memories are his own account. Write "thầy kể..." ("he recalled...") when a source has no independent confirmation, for example the meetings with Hồ Chí Minh, the Egon Krenz trip, or the 1972 youth festival (likely 1973).
- Do not state his exact role in the German section as fact until it is confirmed. The dossier says not to claim "head", while the former dean's tribute calls him Trưởng Tổ Bộ môn.
- Every press photo (VietnamPlus/TTXVN, Spiegel, Dr Trương Hồng Quang's blog) needs permission and a visible credit. Do not present search-result photos with no caption as historical photos of him.
- The site is in Vietnamese and German. Every font must render all Vietnamese diacritics and German characters. Readers are mostly in their 60s and 70s, so body text must be large.

## Workflow

This project uses the software-factory skills (`sf-*` in `~/.claude/skills/`). `.factory/config.json` holds the project config; its verify commands run the app's scripts in `web/`. The work item is `.factory/work/001-memorial-website/`.

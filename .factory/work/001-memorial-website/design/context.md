# Design context: 001-memorial-website

No researchers were dispatched: the repository has no application code yet, so there is nothing to trace. This file lists what exists and what the human decided about stack and hosting.

## What exists (measured)

- No application code, no package manifest, no CI, no tests. Git repo created 2026-11-18, branch `sf/001-memorial-website`.
- `CLAUDE.md`: project purpose, where the source material is, and the content rules (his memories as "thầy kể…", no claim about his exact role, press photo credit and permission, fonts with full Vietnamese and German glyphs, large body text for readers in their 60s and 70s).
- `documents/`: `Thay_Le_Duc_Duong_01.05.1942-11.11.2026.pdf` (life story; timeline on pages 10 to 11; podcast links), `Ho_so_tu_lieu_Thay_Le_Duc_Duong.pdf` (research dossier, sources and verification gaps), `Tri ân.docx` (Mr. Cao Hữu Ngạn's tribute, Vietnamese).
- `images/`: 63 JPEG files, about 10 MB total. `images/portrait/` has 2 portraits (`portait-in-solid-background-nice.jpeg`, `portrait-in-solid-background.jpeg`), `images/dòng thời gian/` holds unsorted timeline photos, `images/gặp mặt hội cựu học sinh/` holds alumni reunion photos. WhatsApp exports, no captions. A dozen are black-and-white archive photos, the rest bright recent phone photos.
- `videos/gap-bac-ho.mp4`: 58.2 s, 9.9 MB.
- Folder and file names contain Vietnamese characters, some in decomposed Unicode.

## Human decisions for design (2026-11-18)

- Stack: Next.js.
- Hosting: the human's own server, not set up yet. Plan for Docker, Postgres and MinIO (S3-compatible object storage) on it.
- Disk: under 20 GB free for uploaded photos. Photos must be shrunk hard.
- Domain: a new domain will be bought. Not chosen yet.
- Videos in the film section are two YouTube interviews, hardcoded. The 14-minute life film and a video upload dashboard are later items.
- Visual direction (from the brainstorm, summarised in spec Constraints): warm off-white paper, dark ink, a large serif with full Vietnamese and German glyphs, photos framed as prints with captions, the timeline as a railway line with stations named in both languages, amber only on the title "Một ánh Dương còn mãi". No clock or autumn-leaf motifs. Not the dark navy AI mockups.

## Key files

1. `.factory/work/001-memorial-website/spec.md`
2. `CLAUDE.md`
3. `.factory/constitution.md`
4. `.factory/brainstorm/2026-11-18-father-memorial-website/intent.md` (Chosen direction, page structure)
5. `documents/Thay_Le_Duc_Duong_01.05.1942-11.11.2026.pdf` pages 10 to 11 (timeline periods)
6. `images/` (photo set)

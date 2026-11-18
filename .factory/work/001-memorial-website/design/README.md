# Design: a one-page memorial website for thầy Lê Đức Dương

Spec: `../spec.md`
Track: feature
Lenses: ux (the page, the timeline, the viewer, the Lưu bút and its form, the admin page, and a new design system). | Skipped: architecture and data, stopped by the human ("focus on the UI first, this is mostly a static page"), so plan makes the server, storage and admin choices as simply as possible. api: the only contract is between the page and its own server inside one Next.js app. ai: no model.
Context: `context.md`

<!-- sf:frozen decisions -->
## Decisions

| ID | Decision | Lens | Criteria | Door | Record |
| --- | --- | --- | --- | --- | --- |
| DD-1 | The look is direction B, the night train: ground #161412, text #EFE8DC, white enamel signs, Archivo Narrow and Spectral, film frames, the Lưu bút on surface #221F1B | ux | AC-2, AC-5, AC-6, AC-8 | two-way | U1, `DESIGN.md`, `docs/decisions/2026-11-18-memorial-look-and-wording.md` |
| DD-2 | Amber #F2B347 marks the title and actions only, with #161412 labels at 9.9:1; never running text, years, headings, captions or meta | ux | AC-2, AC-6 | two-way | U21, decision record |
| DD-3 | 18 px floor for every word, body 20 px at line height 1.7, all text 4.5:1 or more, secondary text 7:1 or more, no pure white, no italic reading text, no text over photos | ux | AC-6 | two-way | U2, U20 |
| DD-4 | The language switch swaps text without a reload, keeps the choice in a cookie the server reads for the first paint, and updates `<html lang>` | ux | AC-3 | two-way | U3 |
| DD-5 | Station signs show the Vietnamese line over the German line, each with its own `lang`, whatever the page language | ux | AC-8 | two-way | U4 |
| DD-6 | Each station has one lead film frame, then a contact sheet (3 on phones, 6 wide) with "Xem thêm {n} ảnh" for the rest; captions and press credits sit under each frame | ux | AC-8, AC-10, AC-23, AC-26 | two-way | U5, U6 |
| DD-7 | The photo viewer is a modal dialog with text-labelled controls, arrow keys and Escape, one history entry so phone Back closes it, opening as a film cut | ux | AC-10, AC-17 | two-way | U9, U17 |
| DD-8 | Films and the Bác Hồ clip load nothing until pressed; the films then play from youtube-nocookie; the clip control is a 56 px amber pill with words | ux | AC-7, AC-9, AC-26 | two-way | U10, ux.md "Settled after review" |
| DD-9 | The Lưu bút / Gästebuch reads: invitation, "Viết lưu bút" opening the form in place, the tribute first, then visitor entries newest first, 20 at a time | ux | AC-12, AC-17, AC-25 | two-way | U7, U11, U15 |
| DD-10 | The form checks on send, in the page's language, counts length on NFC text, and lists refused files by name with the reason and the 5 MB limit | ux | AC-13, AC-14, AC-15, AC-16 | two-way | U8, U16 |
| DD-11 | Visitor text shows exactly as typed: line breaks kept, markup literal, URLs not linked, long words and URLs wrap (`overflow-wrap: anywhere`) | ux | AC-4, AC-5, AC-17 | two-way | U14, U18 |
| DD-12 | The admin page lists every entry newest first with a status word and one Hide or Show again button, a count line, errors in the row, no confirm dialog | ux | AC-18, AC-19, AC-20, AC-21 | two-way | U12 |
| DD-13 | Copy: Vietnamese addresses visitors as "bạn"; the German page shows "Ein Sonnenstrahl, der bleibt"; the book is "Lưu bút" / "Gästebuch"; `EXPERIENCE.md` microcopy is the one source of strings | ux | AC-2, AC-3, AC-12 | two-way | U16, U19, decision record |
| DD-14 | Motion: the rail bracket lights as the reader reaches a station (the one designed moment); nothing moves on load; reduced motion keeps only fades and colour | ux | AC-8, AC-10, AC-12 | two-way | U17 |
| DD-15 | The phone's first screen is the full 4:5 portrait; the name, title, two-line intro and three jump links follow | ux | AC-1, AC-2 | two-way | U13, decision record |
<!-- /sf:frozen -->

## Conflicts resolved

- Spec Constraints vs the picked direction: the spec pinned paper, ink and a serif with amber on the title only. The human picked B and allowed amber on actions; the Constraints line was updated (outside the frozen blocks) and Gate A stays valid.
- Lab vs `EXPERIENCE.md` copy: `EXPERIENCE.md` wins; the lab follows in round 2.
- Clip play control 72 px overlay vs 48 px pill: ruled 56 px amber pill with words.
- Muted text on the hidden-surface at 6.6:1 vs the 7:1 rule: meta there uses the text colour (11.7:1).

## For Gate C

No decision is a one-way door, so there is no Gate B. These travel to Gate C with the plan:

- DD-1, the night-train look. The family picked it from three built options. Cost if wrong: about a day of re-theming, no change to behaviour or data. Readers with astigmatism or cataracts may find light text on dark harder; family members should read the form and a long entry on their own phones before launch.
- DD-8, nothing loads from YouTube before a press. Recommended for privacy and speed on phones. Cost if wrong: a thumbnail-less film panel some visitors may not recognise as a video.
- DD-15, the full portrait first on phones. The family's choice over the reviewer's suggestion. Cost if wrong: writers scroll about one screen before the name and the "Lưu bút" link.
- Build facts the plan must handle: every `.css` file goes through the Tailwind loader in `next.config.ts`, so CSS modules lose their class names (product code uses Tailwind `@theme` utilities, or the loader rule is narrowed to the global stylesheet); the font variables belong on `<html>` in the root layout.
- Server, storage and admin (posts, photos up to 5 MB with no count limit, hiding, the admin password and lockout, Docker with Postgres and MinIO on the human's own server) were not designed by a lens. Plan decides them, simply, and names any hard-to-undo choice at Gate C.
- ADRs still proposed: none.

## Lens documents

- `ux.md`: the UX lens, decisions U1 to U21, the art direction, the lab rounds, questions and concerns.
- `EXPERIENCE.md`: flows, every state, the microcopy table in both languages, the worst-case fixture.
- `DESIGN.md` at the repo root: tokens, type, components, motion, the Tailwind mapping (proposed until Gate C).
- `context.md`: what existed and the human's stack and hosting answers.

## Lab routes

- `/lab/memorial/b` (`src/app/lab/memorial/b/page.tsx`, code in `src/app/lab/memorial/_lab/`): the picked direction, B. A visual reference, not product code; hidden in production unless `LAB_ENABLED` is set.
- `/lab/memorial/a` and `/lab/memorial/c`: the directions not picked, kept for the record.
- Round 2 (states: viewer, form, admin, empty and error states, in B) is designed in `ux.md` but not built.

## Review

- design-reviewer: 8 findings (2 P2, 6 P3), lowest pass 7/10. One P2 declined by the human (full portrait first on phones), the rest fixed in the docs and the lab. Details in `review.md`.
- Render checks not covered by the reviewer (its captures were stale) were run by the main session in the browser at 375 and 1280 px; fresh captures are in `runtime/reports/lab/`.

## Open questions

- Should the site have an Impressum and a privacy page for German readers? Not in the spec; the family should ask someone who knows German law.
- Someone needs to watch the Bác Hồ clip to see whether its caption must say what is spoken.
- The German speaker checks the German title and all German copy before launch.

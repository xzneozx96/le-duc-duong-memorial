# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A one-page memorial website for thầy Lê Đức Dương (01.05.1942 to 11.11.2026), a German teacher at the Foreign Language University in Thanh Xuân, Hanoi, from 1970 to 1988. His students, colleagues and friends in Vietnam and Germany can post memories on it without an account. The target is to be live for the funeral on 27.11.2026.

There is no application code yet, so there are no build, lint or test commands. Add them here once the stack is chosen.

## Where things are

- `.factory/brainstorm/2026-11-18-father-memorial-website/intent.md` holds the agreed scope, page structure, visual direction, open questions and draft acceptance criteria. Read it before any spec, design or build work. `memlog.md` next to it is the full decision record, with sources for each fact.
- `documents/` holds the source material for the life story:
  - `Thay_Le_Duc_Duong_01.05.1942-11.11.2026.pdf` is his life story in his own words, compiled from two 2020 podcast interviews. Its last page lists details that still need checking.
  - `Ho_so_tu_lieu_Thay_Le_Duc_Duong.pdf` is a research dossier with a cross-checked timeline, photo sources, contacts and verification gaps.
  - `Tri ân.docx` is a tribute from Cao Hữu Ngạn, former dean of the German department.
- `images/dòng thời gian/` holds timeline photos, not yet sorted by period. `images/gặp mặt hội cựu học sinh/` holds alumni reunion photos. `images/portrait/` holds the header portraits. Filenames are WhatsApp exports with no captions.
- `videos/gap-bac-ho.mp4` is a 58-second clip. The main life film (about 14 minutes) is hosted on YouTube, not in this folder.

Folder and file names contain Vietnamese characters (`dòng thời gian`, `Tri ân.docx`), and some use decomposed Unicode. Quote paths, and use a glob when an exact name fails to match.

## Content rules

These come from the research dossier and apply to every text on the site:

- His memories are his own account. Write "thầy kể..." ("he recalled...") when a source has no independent confirmation, for example the meetings with Hồ Chí Minh, the Egon Krenz trip, or the 1972 youth festival (likely 1973).
- Do not state his exact role in the German section as fact until it is confirmed. The dossier says not to claim "head", while the former dean's tribute calls him Trưởng Tổ Bộ môn.
- Every press photo (VietnamPlus/TTXVN, Spiegel, Dr Trương Hồng Quang's blog) needs permission and a visible credit. Do not present search-result photos with no caption as historical photos of him.
- The site is in Vietnamese and German. Every font must render all Vietnamese diacritics and German characters. Readers are mostly in their 60s and 70s, so body text must be large.

## Workflow

This project uses the software-factory skills (`sf-*` in `~/.claude/skills/`). The project has not been initialized yet, because `.factory/config.json` does not exist. The user runs `/sf-init`, which can't be invoked through the Skill tool. After that, start the work item with `sf-factory`, and the spec reads `intent.md`.

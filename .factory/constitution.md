# Memorial website for thầy Lê Đức Dương: factory constitution

Version 1.0.0, ratified 2026-11-18, last amended 2026-11-18.

Agents read this file before every stage. When it and the linked files disagree, the linked file wins and this file gets fixed.

## Read first

- `CLAUDE.md`: what the site is, where the source documents, photos and videos are, and the content rules for every text on the site.
- `.factory/brainstorm/2026-11-18-father-memorial-website/intent.md`: agreed scope, page order, visual direction, open questions and draft acceptance criteria. `memlog.md` beside it has the source for each decision.
- TODO(stack): no stack is chosen yet, so there are no verify commands. Run init in refresh mode once design picks one.

## People and decisions

- The developer is you. The owner is not set, so the developer decides. The factory never sets Done.
- Decision records live in `docs/decisions/`. No record exists yet, so the first one sets the format. There are no sprints.
- The factory MAY commit on its own item branches without asking. It MUST ask before committing to `main`. Source: the Commits answer at init, 2026-11-18.

## Formats that win

- Branch names: `sf/{id}-{slug}`. The repo had no branches at init, so this is the factory default.
- ADRs: no ADR exists yet. The first uses `templates/adr/` from the factory and goes in `docs/adr/`, indexed in `docs/adr/INDEX.md`.
- Manual test cases: no case file exists yet. Items write `docs/testing/<item-id>-manual-test-cases.md` with the factory's rules template.

## Bans and protected files

- MUST NOT write `approvals.jsonl`, `acceptance.json` or anything under `runtime/`; `sf` and the hooks own them.

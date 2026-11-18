# Design review: 001-memorial-website

## UX (direction B), design-reviewer, 2026-11-18

Verdict FINDINGS, lowest pass 7/10, heuristics 26/32. Render passes not run: the captures it was given were stale (taken before route /lab/memorial/b existed). The main session checked the current page in the browser at 375 and 1280 px.

- [P2] bad_plan DESIGN.md:230 phone first screen is the 4:5 portrait only; name and jump links come about 900 px down | source: design-reviewer | status: wontfix(the human chose "keep as designed", 2026-11-18)
- [P2] patch EXPERIENCE.md:202 no break rule for long unbroken text; a long URL is cut off silently | source: design-reviewer | status: open
- [P3] patch EXPERIENCE.md:68 language switch placement differs between the IA table and the sketch, DESIGN.md and the lab | source: design-reviewer | status: open
- [P3] patch EXPERIENCE.md:179 clip play control 72 px overlay vs 48 px pill | source: design-reviewer | status: open (ruling: 56 px amber pill with words)
- [P3] patch DESIGN.md:245 muted text on hidden-surface is 6.58:1, under the 7:1 rule | source: design-reviewer | status: open (ruling: text colour for meta on hidden-surface, 11.7:1)
- [P3] patch content.ts:43 lab copy disagrees with the EXPERIENCE.md microcopy | source: design-reviewer | status: open (ruling: EXPERIENCE.md wins; lab follows in round 2)
- [P3] patch EXPERIENCE.md:22 and ux.md stale light-theme and old-route lines after the B pick | source: design-reviewer | status: open
- [P3] patch b.css:571 Lưu bút heading off-token (44 px, line height 1) | source: design-reviewer | status: open
- Unverified render items (bracket light transition, visible focus on dark, 320 px and 200 % text) | source: design-reviewer | status: open, to be shown in round 2

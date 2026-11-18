# UX lens: 001-memorial-website

Behaviour, flows, states, motion plan, copy and worst-case data: [EXPERIENCE.md](EXPERIENCE.md). Visual system: [DESIGN.md](DESIGN.md), proposed, written from direction B (the night train, picked 2026-11-18). It moves to `DESIGN.md` at the repo root after the gate, because the ux-designer may not write there.

Revised 2026-11-18 against the newer ux references (art direction, motion, UI copy, worst-case data, operate screens, visual slop, critique, variants). What changed and why is under "Revision".

## Decisions

| Id | Decision | Criteria | Door | ADR |
|---|---|---|---|---|
| U1 | (changed) The visual system is direction B, the night train, picked by the human on 2026-11-18: ground #161412, text #EFE8DC, amber #F2B347 on the title and actions (Q6), white enamel signs, Archivo Narrow and Spectral, film frames, the Lưu bút on surface #221F1B; DESIGN.md is rewritten from the lab as built (b03dca2) with marked corrections | AC-2, AC-5, AC-6, AC-8 | two-way | none |
| U2 | (changed) 18 px floor for every word, body 20 px at line height 1.7, all text at 4.5:1 or more, plus the light-on-dark rules of U20 | AC-6 | two-way | none |
| U3 | The language switch swaps text without reloading, stores the choice in a cookie the server reads for the first paint, and updates `<html lang>` | AC-3 | two-way | none |
| U4 | Station boards always show the Vietnamese line first and the German line second, each with its own `lang` | AC-8 | two-way | none |
| U5 | (changed) Every timeline photo is a film frame edge to edge with its caption and any press credit under it; entry photos get accessible names; no mounts | AC-8, AC-10, AC-17, AC-23 | two-way | none |
| U6 | (changed) Each station shows one lead frame, then a contact sheet of the rest (one column on phones, three wide), first 3 or 6, the others behind "Xem thêm {n} ảnh" | AC-8, AC-26 | two-way | none |
| U7 | The book reads: invitation, a "Viết lưu bút" button that opens the form in place, the tribute as first entry, then visitor entries newest first | AC-12, AC-25 | two-way | none |
| U8 | Form checks run on send, in the page's language, with `noValidate`, no `maxlength`, lengths on NFC text; refused files listed by name with the reason and the 5 MB limit | AC-13, AC-14 | two-way | none |
| U9 | The photo viewer is a modal dialog with text-labelled controls, arrow keys and Escape, and one history entry so phone Back closes it | AC-10, AC-17 | two-way | none |
| U10 | Films are click-to-load facades, no YouTube request before play, then youtube-nocookie in the same frame | AC-7, AC-26 | two-way | none |
| U11 | The book shows 20 visitor entries, then "Xem thêm {n} bài", and clamps entries over about 600 characters at 8 lines | AC-1, AC-17, AC-23 | two-way | none |
| U12 | Admin lists every entry newest first with a status word, one Hide or Show again button, a count line with real zeros, errors inside the row, no confirm and no story motion | AC-18, AC-19, AC-20, AC-21 | two-way | none |
| U13 | Three jump links under the intro, no sticky bar | AC-1 | two-way | none |
| U14 | The relationship label shows in the page's language; everything the visitor typed shows as typed | AC-4, AC-17, AC-25 | two-way | none |
| U15 | (changed) The memory wall is "Lưu bút" / "Gästebuch" on the raised dark surface band; the form opens with "Viết lưu bút" / "Ins Gästebuch schreiben" and sends with "Gửi lưu bút" / "Eintragen" | AC-12, AC-17, AC-25 | two-way | none |
| U16 | All Vietnamese and German strings rewritten to the ui-copy rules: each error names the field, the limit and the fix, one verb per action through the flow | AC-13, AC-14, AC-15, AC-16 | two-way | none |
| U17 | (changed) Motion: the station bracket lights as reached (the one authored moment), the viewer opens as a 450 ms film cut and closes in 200 ms, a new entry fades in and stays marked, nothing on load; reduced motion keeps opacity and colour only | AC-8, AC-10, AC-12 | two-way | none |
| U18 | Worst-case rules per field: names, messages, class, year and captions break anywhere when a word is too long (`overflow-wrap: anywhere`), messages keep line breaks and clamp at 8 lines, URLs not linked, markup literal, German plurals, decimal comma in sizes | AC-5, AC-13, AC-17 | two-way | none |
| U19 | The German page shows its own title, "Ein Sonnenstrahl, der bleibt" (draft for the German speaker), in amber-ink; the Vietnamese page keeps "Một ánh Dương còn mãi" (the human\'s answer) | AC-2, AC-3 | two-way | none |
| U20 | (new) Light text on dark for older eyes: no pure white (16:1 ceiling for running text), no weight under 400, body 20 px at 1.7, secondary text at 7:1 or more (so meta on the hidden-surface uses the text colour, 11.7:1), no italic reading text, no text over photos, bright enamel only on signs and the active language | AC-6 | two-way | none |
| U21 | (new) Amber marks the title and actions (primary button, clip play pill, film play controls, text buttons, the lit bracket), with #161412 labels on amber at 9.9:1; never running text, years, headings, captions or meta | AC-2, AC-6 | two-way | none |

No UX decision here is hard to reverse, so there is no ADR draft. U1 is the largest: switching back to A after build would mean re-theming every component, about a day, but no change to behaviour or data.

Unchanged by the switch to B: U3, U4, U7, U8, U9, U10, U11, U12 (its rows now use the dark surfaces), U13, U14, U16, U18, U19.

## Revision

What the newer references changed, by reference:

- **art-direction.md.** The repo is greenfield, so the direction is now chosen through the method: subject, rut, seven candidates and two or three lab directions (below). Round 1 first varied inside the brainstorm's paper pin, then (at the human's request) across three truly different looks. The human picked B; `DESIGN.md` is written from it and carries B's contract.
- **visual-slop.md.** Three tells fixed. The italic serif title is now roman (`italic-serif-display`). The rail is SVG linework, not a stripe gradient (`repeating-stripes-gradient`). The "enamel sign" is a flat plate, with fake materials banned (faked physicality). `cream-palette` is noted, not fixed, because the frozen spec pins the paper ground; specificity comes from the boards, the captions and the book instead.
- **motion.md.** New motion plan in `EXPERIENCE.md` and a `motion` token group in `DESIGN.md`. The first pass had one 150 ms fade and nothing else; reduced motion is now "fewer and gentler", not off.
- **ui-copy.md.** A fact sheet, a voice card, and every string rewritten with a "Not" column. "Lời tưởng nhớ" became the memory book (U15), now "Lưu bút" / "Gästebuch" by the human's answer; the reader is "bạn", the human's answer, with "xin" in every request; errors gained the fix and the count to cut; the server error gained the family contact.
- **worst-case-data.md.** A value map and a fixture in `EXPERIENCE.md`; three findings went to TOUCHES (no length limit on content fields, captions can be missing, no photo count limit).
- **operate-screens.md.** The admin page rebuilt to its rules (U12).
- **variants.md.** The first pass's timeline options (left rail against a centred zigzag) are dropped: the zigzag is the category template, and both varied only layout. The direction round now carries the real choice, on different axes.
- **critique.md.** Render passes and the fix-the-top-three loop need captures, and there are none (no routes yet). The seven passes ran on the files (Self-review below).
- **Persona names.** The first pass gave the family member an invented name. That is replaced by "a family member".

- **Direction picked (2026-11-18).** The human picked B from the round-1 lab, which the main session built and committed (b03dca2). `DESIGN.md` is rewritten from `src/app/lab/memorial/_lab/b.css` and `direction-b.tsx`, with corrections the docs require. Since Q6 (amber allowed on actions) six remain: amber off the station years (and off the film episode labels and jump-link underlines, which are not actions), section headings at 36 to 52 px instead of 18 px tracked capitals, name line height 1.1 instead of 0.98, roman captions instead of italic, commas instead of middle dots in entry meta, tokens instead of four inline hex values, and a disabled style with no opacity.

## Art direction

**The subject.**
- Mechanism: one place where people in two countries remember one teacher, his life told station by station and their memories written in by hand.
- Audience scene: a 70-year-old former student at home in Hà Nội in the evening, on a phone with Zalo open; a retired colleague in Saxony on a laptop.
- Cultural home: Hanoi's German-teaching circle of the 1970s and 1980s, the GDR children's homes and colleges, and Vietnamese and German funeral custom.
- What the first screen must prove: this is thầy Dương, and you can write to him here.

**The rut.** The category page is a dark memorial: centred portrait in an oval, candles, doves or lilies, script type, "In loving memory", guestbook cards in a grid. Its predictable opposite is the bright "celebration of life" template: cream, a big serif, a terracotta accent, rounded cards, a fade-up on every section. The brief's own metaphor adds a third: a metro-map timeline with coloured lines. The spec's pins sit close to the opposite, so every direction has to earn its specificity from his own material.

**Seven candidates**, by resonance:

| # | Candidate | Family | Why it resonates | How it looks |
|---|---|---|---|---|
| 1 | The family photo album | paper and photos | Archive black-and-white and bright phone photos sit together as prints | Paper ground, prints in mounts, captions inside the mount |
| 2 | The condolence book (sổ tang, Kondolenzbuch) | ritual | Both cultures keep one at funerals, so older readers know at once what to do | One continuous page, entries ruled by hairlines, names as signatures |
| 3 | The 1955 train and a printed railway timetable (Kursbuch) | transport | His journey began on a train from Hàng Cỏ; this is the brief's literal metaphor, so only one candidate is spent on it | Tabular years, two-column place names, timetable rules |
| 4 | His textbook, "Deutsch – Ein Lehrbuch für Ausländer" (Herder-Institut) | school | Mr. Ngạn's tribute names it; it is what he taught from | Numbered lessons, vocabulary pairs, figure captions |
| 5 | Airmail letters between Hà Nội and the GDR | correspondence | Two homelands joined by post | Thin paper, postmarks, the red and blue border |
| 6 | The family altar with the memorial portrait | ritual | Where Vietnamese families remember | Lacquer red and gold, incense; pulls toward mourning, against the photos |
| 7 | The classroom in Thanh Xuân, blackboard and chalk | school | His room for 18 years | Dark green ground, chalk type; breaks the paper pin and invites fake chalk |
| 8 | The film archive: the 1955 to 1970 black-and-white photos and the 2020 filmed interviews | cinema and archive | His early life survives as black-and-white photos and his voice as film; a station sign at night is how a train journey looks from inside | Near-black ground, photos edge to edge, white enamel platform signs, a condensed sign face |
| 9 | A weekend magazine story in daylight | editorial print | The many bright colour photos of him laughing with his dogs, family and students carry a life story better than a mourning page | White ground, a broad ochre band, very large grotesque type, colour photos at full size |

Seven families (paper and photos, ritual, transport, school, correspondence, cinema and archive, editorial print). Candidates 8 and 9 were added when the human asked for three truly different looks; round 1 now builds 1 and 2 (A), 8 (B) and 9 (C). Candidates 3 and 4 (the timetable and the lesson book) are set aside, because they changed structure but not the look. Candidates 5 to 7 are turned down: 5 makes its border stripe the whole idea, 6 pulls the page toward mourning, 7 breaks the pinned paper ground and fakes a material.

**Colour strategy.** Picked: B, restrained on a dark ground. Round 1 had one per direction: A restrained (paper, ink, oxblood plates, amber title); B restrained on a dark ground (warm light text, white signs, one bright amber); C committed (ochre carries the rail and bands, green carries the Lưu bút field). Scene for B: older readers on phones at home in the evening, where a dark page is calm, and at the funeral reception in daylight, where the 15:1 text and the rules in `DESIGN.md` Colors keep it readable.

## Lab

Round 1 is built and committed (b03dca2) at `src/app/lab/memorial/`, with direction stylesheets and components in `_lab/`. Round 2 builds in the same place and shape:

- Routes under `src/app/lab/memorial/`, components in `_lab/`, an index page listing each route with its note.
- Stylesheets: plain CSS with the `lb-` prefix, because this app pipes every `.css` file through the Tailwind loader and CSS modules lose their class names. Fonts: each lab page applies the font variables from `_lab/fonts.ts` itself, because the lab layout's fonts did not apply.
- Guard: each lab page calls `notFound()` when `process.env.NODE_ENV === "production"` and `LAB_ENABLED` is not set. Metadata `robots: { index: false, follow: false }`.
- Values: only the `DESIGN.md` tokens (direction B), as CSS custom properties on the `lb-page` wrapper; no inline hex.
- Content: real text in both languages from `EXPERIENCE.md` (Voice and microcopy), the real portrait and 8 to 10 copies of photos from `images/` in `public/lab/` (originals untouched), captions marked "chú thích mẫu" / "Beispieltext" because the family has not captioned them, and the tribute from `documents/Tri ân.docx` exactly as written. The worst-case fixture in `EXPERIENCE.md` is the one dataset for the book and the admin.
- Widths: each screen in an `<iframe>` of the same route at 375 px and at 1280 px (a narrow div in a wide window would still match the 900 px media query). The timeline and the form also at 320 px with 200% text, and the form with the software keyboard open on a phone.
- Each page: a VI and DE toggle, the list of what stays fixed across directions at the top, and a note per option (what it tries, trade-offs including what it removed, recommended or not).
- Motion: the mockup-maker captures frames of the viewer open and close, the new entry arriving and a marker filling, in a normal and a reduced set (`agents/mockup-maker.md`, "Captures").

**Identity lock lifted for round 1** (the human, 2026-11-18: "three truly different looks"). Each direction now has its own ground, palette, faces, scale, layout, photo treatment and rail. What stays fixed in every direction, from the frozen criteria and the human's answers:
- the title, "Một ánh Dương còn mãi" on the Vietnamese page and "Ein Sonnenstrahl, der bleibt" on the German page, in an amber that passes 4.5:1 on that direction's ground (AC-2);
- faces with every Vietnamese and German glyph, checked with fontTools (AC-5);
- every word at 18 px or more and 4.5:1 or more (AC-6);
- a railway line with a station per period showing the Vietnamese and German names together (AC-8);
- the full-screen viewer (AC-10), the Lưu bút with its form and the tribute first, "bạn", and every string in `EXPERIENCE.md`;
- the page order header, film, timeline, Lưu bút, footer, with no sideways scrolling (AC-1).

**Argument of the page** (shared by every option): who he was (portrait, name, years, title, intro); his own voice (two 2020 interviews); where his life went (seven stations between two homelands, with photos); what he meant to people (the Lưu bút, the tribute first); where the facts come from (sources). Each section has a claim; nothing else is added.

Glyph check, 2026-11-18, fontTools on the Google Fonts files, the same 164 characters as before (every Vietnamese letter in both cases, ä ö ü Ä Ö Ü ß ẞ, the quotes, en dash and ellipsis): Literata roman and italic, Be Vietnam Pro, Spectral Regular and Medium, Archivo Narrow, Bricolage Grotesque and Lexend miss nothing. Two candidates failed and are not used: Barlow Condensed lacks ẞ, and Sofia Sans Condensed lacks most Vietnamese letters (ả, ặ, ơ, ư and 90 more).

### Round 1: directions

Build the first viewport, the Moritzburg station (clip, three prints, one press credit), the Nước Đức station (six colour reunion photos) and the Lưu bút's first two entries with its button, at 375 and 1280 px, in VI and DE. A glance at each first viewport must tell them apart, and so must a squint with the copy blurred: A is a mid-light warm page with deep red plates and mounted prints; B is a near-black page with white enamel signs and photos edge to edge; C is a white page with yellow bands, very large type and colour photos.

#### Direction A, the family album (safe, recommended)

- **Idea sentence.** On this page, the family's photo album becomes the timeline, and the Lưu bút is its last pages.
- **Palette** (contrast measured on paper #F3EBDD): paper #F3EBDD ground; ink #2A2522 text, 12.8:1; ink-muted #5E554C captions and meta, 6.2:1; oxblood #6E2A22 for station boards and the Lưu bút's ribbon edge, 8.8:1 as text and with paper text on it at 8.8:1; amber #8F5300 title, 5.2:1; white mounts #FFFCF6. This is the first build's palette deepened with the oxblood of an album's cloth cover, so it no longer reads as one cream page.
- **Fonts.** Literata for the name (600, 44 px phone, 76 px wide), body (20 px) and captions (Literata italic, 18 px, the way captions were written under album photos); Be Vietnam Pro 600 for boards, years and controls.
- **Layout.** 375: one column; the portrait print 280 px wide with drawn photo corners; boards full width. 1280: a 12-column grid in 1200 px, centred. Header: portrait print 5 columns, name, years, title and intro 7 columns. Each station: years, board and paragraph in 5 columns that stay in view (`position: sticky`) while the prints scroll past in the other 7, laid out as an album page of mixed sizes (one large, the rest half size), never overlapping.
- **Photo treatment.** Prints in white mounts with four flat drawn photo corners in oxblood, caption inside the mount; colour photos in colour, archive photos as they are.
- **Rail.** SVG double rail with sleepers in the gutter between text and prints (wide) or at the left edge (phone); markers are oxblood rings that fill as reached; the last station has a double ring.
- **Title.** Amber, Literata 500 roman, 34 px phone and 48 px wide, on its own line under the years.
- **Motion signature.** The station marker fills as its board reaches the middle of the screen (colour only, 600 ms).
- **Risks.** Closest to the common warm-paper-and-serif default; specificity rests on the oxblood boards, the photo corners and the sticky album layout. Safest for readers aged 60 to 75 and closest to the brainstorm.

#### Direction B, the night train (from candidate 8, the film archive)

- **Idea sentence.** On this page, the black-and-white archive photos become film frames, and his life is a night train that stops at lit station signs between Hàng Cỏ and Germany.
- **Palette** (contrast measured on ground #161412 and surface #221F1B): ground #161412; surface #221F1B for the Lưu bút and the form; text #EFE8DC, 15.1:1 and 13.5:1; muted #B9AFA0, 8.5:1 and 7.6:1; amber #F2B347 title, 9.9:1; station signs are enamel plates #EFE8DC with ground-coloured letters, 15.1:1; error #FF9C85, 9.1:1; edges and the rail #8C8274, 4.9:1 and 4.3:1 (graphics only). Light text is warm, never pure white, and body weight stays 400 to limit glare.
- **Fonts.** Archivo Narrow 600 for the name (52 px phone, 96 px wide), station signs, years and controls, in the condensed letters of a Reichsbahn platform sign; Spectral for body (20 px, line height 1.7) and captions (18 px).
- **Layout.** 375: the portrait edge to edge, 4:5, then the name and title under it; each station opens with its lead photo edge to edge, then the sign, years and paragraph in a 20 px inset column. 1280: cinematic, full-bleed. The header is the portrait at the left 45% of the viewport, edge to edge top to bottom of the first screen, with the name, years, title and intro on the right. Each station opens with its lead photo across the full width at 21:9 (letterboxed, never text over the photo), then the sign and text in a 640 px column, then the other photos as a contact-sheet strip of equal frames that wraps (no sideways scrolling).
- **Photo treatment.** No mounts: frames edge to edge with a 1 px muted keyline, captions under them in muted Spectral. Archive photos stay black and white, colour photos stay in colour. No grain, no film-strip sprocket holes (faked material).
- **Rail.** One 3 px rail in #8C8274 down the left of the text column, with short ticks every 24 px; each station is a white enamel sign hung from the rail by a 2 px bracket, Vietnamese name on top, German below, in Archivo Narrow.
- **Title.** Amber #F2B347, Archivo Narrow 500, 30 px phone and 44 px wide, the only warm colour on the page.
- **Motion signature.** The viewer opens like a cut in a film: the page fades to the ground colour over 300 ms, then the photo fades in over 300 ms, no scale. Reduced motion: one 150 ms fade.
- **Risks.** The dark-mournful rut. It avoids it with warm text, a bright amber, colour photos left in colour, and the Germany station's laughing reunion photos at full width. Light text on a dark ground can halo for older eyes with astigmatism; 20 px Spectral at 400 and line height 1.7 is the floor, and the lab must show the Lưu bút form on the dark surface for the family to judge.

#### Direction C, Hà Nội daylight (from candidate 9, the illustrated weekend magazine)

- **Idea sentence.** On this page, the bright colour photos of a laughing man with his dogs, family and students set the tone of a weekend magazine story about him, and the railway line runs through it as a broad ochre band, the colour of old Hà Nội façades.
- **Palette** (contrast measured on ground #FBFAF6 and on ochre #E9B949): ground #FBFAF6; ochre #E9B949 for the rail band, the jump-link band and the station number fields; ink #1A1A18, 16.7:1 and 9.6:1; deep green #1E4D3B for station names and links, 9.2:1 and 5.3:1, and as a field with ground-coloured text, 9.2:1; muted #55524C, 7.5:1 on the ground only (it fails on ochre at 4.3:1, so ochre carries only ink and green); amber #9C5A00 title, 5.2:1 on the ground (it fails on ochre at 3.0:1, so the title never sits on ochre); error #B0271A, 6.4:1 on the ground.
- **Fonts.** Bricolage Grotesque for the name (64 px phone on two lines, 128 px wide), section heads and station names (bold, tight); Lexend for body (20 px), captions (18 px) and controls. Lexend was drawn for reading ease, which suits the readers.
- **Layout.** 375: the colour portrait edge to edge, the name huge on two lines, the title in amber under it, the jump links on an ochre band. Stations stack: lead photo edge to edge, then station name, text and the other photos two to a row. 1280: an editorial 12-column grid in 1240 px, centred. Each station is a spread: the lead photo across 8 columns and the text in 4, alternating sides from station to station, other photos in a row of three under it. The Lưu bút sits on a deep green field with ground-coloured text and white entry panels.
- **Photo treatment.** Colour photos large and uncropped in height, square corners, no mounts, no shadow; archive photos smaller and inset, with a 12 px white border, so the bright recent photos lead. Captions in Lexend under each.
- **Rail.** A 14 px ochre band, vertical, at the left edge on phones and down the grid's centre gutter on wide screens; each station is a green disc on the band with the years in it, and both names set beside it, Vietnamese above German. One line, one colour, no interchanges, so it does not read as a metro map.
- **Title.** Amber #9C5A00, Bricolage Grotesque 600, 32 px phone and 56 px wide, under the name.
- **Motion signature.** When a station's lead photo first comes into view, it opens from the rail outward with a clip-path over 600 ms. The photo is visible without script and under reduced motion, where it simply appears.
- **Risks.** The bright celebration-template rut; it avoids it with the ochre band, the green Lưu bút field and his real photos at full size instead of stock cards. The black-and-white archive years look smaller than the bright later years, so the 1955 to 1970 stations need the archive photos at their best.

**The quiet exit** is not a lab route: the category standard, played straight, named in Q5.

Side-by-side check: three grounds (warm paper, near-black, white with ochre), three type pairings (book serif with a Vietnamese sans; condensed sign sans with Spectral; a display grotesque with Lexend), three layouts (sticky album grid, cinematic full bleed, alternating magazine spreads), three rails (double rail with sleepers, a hung enamel sign line, a broad ochre band). Squint test with copy blurred: A is light warm masses with small dark red blocks, B is dark with white rectangles and wide photo bands, C is white with yellow verticals and big type blocks.

#### Build notes for the mockup-maker

The first round-1 build had five faults. Each direction must avoid all of them, and the captures must show it.

1. **Blank photos** (only the clip poster loaded). Copy the photos into `public/lab/` with plain ASCII file names; the originals sit in folders with Vietnamese and decomposed-Unicode names, which break URLs. Give every `<img>` a real `src`, `width` and `height`; never an empty `src` or a grey box. Check each photo loads in the capture. Direction B and C depend on photos more than A: a blank lead photo there leaves a hole a screen wide.
2. **A narrow column stuck to the left at 1280 px.** Every layout container is centred (`mx-auto`) at its stated width (A 1200 px grid, B full bleed with a 640 px text column, C 1240 px grid). Capture at 1280 px inside an iframe of that width and check both margins are equal.
3. **The rail drawn as a ladder stripe.** Draw each rail as inline SVG linework exactly as its direction says: A the double rail with sleepers, B one rail with ticks and hung signs, C a solid ochre band with green discs. No `repeating-linear-gradient`.
4. **A Next.js error badge in the capture.** Fix the error before capturing (common causes: a hydration mismatch from a date or locale formatted on server and client, a `<button>` inside a `<button>`, a missing `key`). The console log in the captures must be empty of errors, and no dev overlay may show.
5. **Double-escaped text in an entry.** Render visitor text once as React text, never through `dangerouslySetInnerHTML` and never pre-escaped in the fixture. The fixture string `<b>Danke</b> &amp; auf Wiedersehen` must show exactly those characters, and an apostrophe or quote must never show as `&#39;` or `&quot;`.

Each direction also needs the `next/font` subsets latin, latin-ext and vietnamese for its two faces, the title in its language with `lang`, and every word at 18 px or more at both widths.

### Round 2: states, in direction B

Build on the round-1 B page, with the corrections in `DESIGN.md` applied first (amber off years, episode labels and jump-link underlines, real section headings, name line height, roman captions, commas in meta, tokens for every colour, disabled style). Every screen at 375 and 1280 px in an iframe, in VI and DE; the timeline and form also at 320 px with 200% text; the form also with the phone keyboard open. Each route lists what stays fixed at the top. Captures per `agents/mockup-maker.md`, including the motion frames below, normal and reduced.

0. **Fixes from the review first:** the long-text break rule, the language switch under the portrait on phones and at the top of the text column on wide, the 56 px clip pill, text-colour meta on hidden rows, the Lưu bút heading on `heading-section`, every string from the `EXPERIENCE.md` microcopy table (including the corrected film episode order and the two-line intro), and the still-unverified items: the bracket light transition, visible focus on dark, 320 px and 200% text. Routes: round 1 B is `/lab/memorial/b`.
1. **Tokens and glyphs** (`/lab/memorial/tokens`). Every colour swatch on ground, surface, well and hidden-surface with its measured ratio; the light-on-dark rules shown side by side with what they forbid (pure white, 300 weight, italic caption) so the family can see why; every type token with "LÊ ĐỨC DƯƠNG, Lê Đức Dương, ằ ẫ ệ ộ ữ ợ Đ, ä ö ü Ä Ö Ü ß ẞ, „Grüße“", the capitals on two lines to prove the 1.1 line height; the title in both languages at real size; the focus ring on ground, surface, an enamel button and a sign.
2. **Header and film** (`/lab/memorial/top`). The portrait edge to edge (phone) and 45% full height (wide); the German page with each of the three German title drafts (Q1); one facade switched to the player; the portrait failed to load (the well colour with the alt text).
3. **Timeline** (`/lab/memorial/timeline`). Hà Nam with no photos (sign, years, text only, no empty frame); Moritzburg with the lead frame, the clip before and after play, a press credit; Thanh Xuân with 12 photos, the contact sheet collapsed and expanded; Nước Đức with 26 colour reunion photos and a long German paragraph; one frame failed; brackets unlit and lit; the sign "RADEBEUL VÀ DRESDEN, CHDC ĐỨC" / "Radebeul und Dresden, DDR" wrapping at 320 px. Motion frames: a bracket lighting.
4. **Viewer** (`/lab/memorial/viewer`). A black-and-white archive photo, a colour photo with a press credit, a long caption, an entry photo captioned with its writer's name and date, the 4000×200 panorama and the 1080×2400 screenshot, the first and last photo, a failed photo; phone bottom bar and wide side buttons. Motion frames: the cut in, the close.
5. **Lưu bút, options A and B** (`/lab/memorial/book?option=a|b`). The worst-case fixture from `EXPERIENCE.md` on the surface band; the tribute clamped and expanded; empty with the tribute only and with nothing; "Xem thêm" idle, loading, failed; a just-sent entry with its hidden-surface fill and "Vừa gửi" label. Motion frames: the entry arriving.
6. **Form** (`/lab/memorial/form`). On the surface: closed; open and pristine with the privacy note; every field message with the summary; a 6,000-character message marked with the count to cut; refusals (a PDF and a 7.2 MB photo among three good ones); sending with "Đang gửi ảnh 2/3…"; offline; server error; success. This is the screen where the light-on-dark rules matter most; the family should read it on their own phones.
7. **Admin** (`/lab/memorial/admin`). Dark tokens; login; wrong password with tries left; locked with the retry time; the list with visible and hidden rows (hidden-surface with the word "Đang ẩn"), the two "Nguyễn Văn Hùng" rows and the count line; counts at 0; a failed hide; an expired session.

## Self-review

The seven passes on the files, before any capture. Scores are the designer's own and are no evidence for the reviewer.

1. Information architecture, 8: first his face and name, then the films, the stations, the book. The jump links serve the funeral-day writer. Missing: the intro lines are content the family has not written.
2. State coverage, 8: every surface has loading, empty, error, partial, success and overflow rows, plus offline and JavaScript off. Not yet visible in a lab route.
3. Journey, 8: three flows with a climax beat and a failure path each. The writer's climax (the entry arriving in the book) now has motion and a lasting label.
4. Generic-pattern risk, 7: direction B is named and specific to him (the archive photos as film frames, the enamel station signs with Vietnamese over German, the Lưu bút). The risk is the dark-mournful rut; warm text, amber on the title and actions, colour photos in colour and the laughing reunion photos at full width answer it. Mode named per surface.
5. Design-system alignment, 8: every value is a token in the proposed `DESIGN.md`; every component is named new; no standalone HTML.
6. Responsive and accessibility, 9: 375 and 1280 decisions, 320 px and 200% text, 48 and 56 px targets, keyboard path and focus after every action, reduced motion defined.
7. Unresolved decisions, 9: Q1, Q3, Q5 and Q6 answered and Q4 settled; Q2 open, each with a recommendation and a cost.

## Touches

- **architecture.** A Next.js app scaffold must exist before any lab route. Fonts load through `next/font/google` with subsets `latin`, `latin-ext`, `vietnamese` (Literata roman only). Page text comes from one VI and one DE dictionary held client-side, with singular and plural forms for German, so the switch needs no reload; the server picks the first-paint language from a cookie, else `Accept-Language` (German if it starts with `de`, Vietnamese otherwise). The book's first 20 entries render on the server per request, with no static or ISR cache, so a new or hidden entry shows correctly to the next visitor (AC-12, AC-19). Phone Back closing the viewer assumes a `history.pushState` entry (for example `?foto=`) that the App Router does not turn into a navigation or reload; a reload would lose the form and the scroll place. The station marker fill uses one IntersectionObserver class toggle per station, no scroll handler. The admin path is architecture's choice; the design assumes it is `noindex` and unlinked. `lucide-react` is a new dependency. The Bác Hồ clip needs re-encoding (9.9 MB today) and a poster frame. Per-photo progress ("Đang gửi ảnh 3/12…") assumes photos upload one by one or report progress; if they go as one request, the button shows "Đang đăng…" only. With no limit on photo count, one entry can carry 40 photos of up to 5 MB (200 MB) over a phone connection: the upload path needs a timeout and a retry that keep the form, and the server a body limit that fits. The lockout message shows a retry time if the server returns one. The content files need a check at build time that every timeline photo has a caption and every press photo a credit (worst-case finding: there is no limit or check on content fields).
- **data.** Relationship is stored as a code (`hoc_tro`, `dong_nghiep`, `ban_be`, `gia_dinh`, `khac`) and shown in the page's language. Class and year are free text, stored as typed. The message is stored with its line breaks. The tribute needs a pinned flag or a fixed order key so it stays above visitor entries whatever its date (AC-25); it is a normal entry the family can hide. Each photo needs a small-print size (about 480 px), a viewer size (about 1600 px long side) and its width and height so prints reserve space. Which types count as photos (JPEG, PNG, WebP, HEIC and HEIF are assumed, and the refusal message names JPG, PNG and HEIC) and whether 5 MB means 5,000,000 or 5 × 1,048,576 bytes must match the page's own check. Lengths are counted on NFC-normalised text, the same on client and server (AC-13). A hidden entry's photos must stop answering at their public address (AC-19). The admin list needs every entry with its hidden flag, and a total and hidden count.

## Settled after review (do not reopen)

- **Phone first screen keeps the full 4:5 portrait** (the human, 2026-11-18). The design-reviewer's P2 that the name and jump links sit about 900 px down on a 375 px phone was declined: the portrait is the first thing readers should see. Recorded in `review.md` as wontfix.
- **AC-2's "two-line intro"** means at most two rendered lines on a 375 px phone, in each language (the human, 2026-11-18). See `EXPERIENCE.md`, Voice and microcopy; the lab's sample intro must be cut to fit.
- **EXPERIENCE.md's microcopy wins over the lab's copy** (ruling, 2026-11-18). Round 2 aligns the lab to the table.
- **The clip's play control is a 56 px amber pill with words** (ruling, 2026-11-18).
- **Meta on the hidden-surface uses the text colour** (11.7:1), not muted (6.6:1, under the 7:1 rule) (ruling, 2026-11-18).

## Questions

- **Q1 German title (answered 2026-11-18: translate it).** The German page shows a German title; the Vietnamese page keeps "Một ánh Dương còn mãi". Dương means sun, so the drafts keep as much of the sun as German allows. Draft: "Ein Sonnenstrahl, der bleibt". Alternatives: "Ein Licht, das bleibt" (simpler, loses the sun) and "Seine Sonne geht nicht unter" (keeps the sun, and reads as an idiom for something that lasts). All three go to the German speaker for a check before launch. Note for the orchestrator: AC-2 names only the Vietnamese title, so its manual test case should check the German title on the German page.
- **Q2 Approve DESIGN.md for direction B.** `DESIGN.md` is now written from the B lab with six marked corrections and the light-on-dark rules. (Recommended) Approve it at the design gate, so it becomes the record the build and the reviewer follow. Other option: approve the B lab exactly as built, keeping its uppercase 18 px section heads, italic captions and wider amber, which keeps the lab as the reference but conflicts with the spec on amber and with the readability rules. Lab: `/lab/memorial/tokens` once built. Cost if wrong: a few hours of token and type changes before build.
- **Q3 Vietnamese address (answered 2026-11-18: "bạn").** Every Vietnamese string that addresses the reader uses "bạn", with "xin" in each request so it stays respectful for readers aged 60 to 75.
- **Q4 Lab routes in the app (settled).** The lab exists at `src/app/lab/memorial/` (b03dca2). It must stay unreachable in production (`notFound()` unless `LAB_ENABLED`, `noindex`) and be removed or kept per the build plan after launch.
- **Q5 Which direction (answered 2026-11-18: B, the night train).** Picked from the round-1 lab. The spec Constraints line now names B (edited by the orchestrator). `DESIGN.md` is written from it.
- **Q6 Amber beyond the title (answered 2026-11-18: amber on actions too).** Amber #F2B347 is allowed on the title and on actions: the primary button, the clip's play pill, the film play controls, text buttons such as "Đọc hết bài", and the rail bracket when lit. Never on running text, years or headings. Labels on amber are #161412, measured at 9.9:1. The spec Constraints line is updated (by the orchestrator).

## Concerns

- **Lab sample station text states unsourced facts.** The Nước Đức sample in `content.ts` says he worked as an interpreter for the Vietnamese community and "was always the first to arrive on time"; the intro says almost every cohort passed through his class as fact. None of this is in the fact sheet. Round 2 should replace them with lines from the sources or mark them clearly as sample text, and the family's real paragraphs must follow the "thầy kể…" rule (AC-11).

- **Older eyes on a dark page.** B is the boldest direction and the hardest to read for some readers aged 60 to 75 (astigmatism, cataracts). The rules in `DESIGN.md` Colors reduce the risk; they do not remove it. The family should read the form and a long entry on their own phones before launch. A light reading mode is not designed; adding one later means a second set of colour tokens.
- **The lab deviates from the docs in six places** (listed under Revision). Round 2 applies the corrections first; until then the round-1 lab is not the reference for amber on years, heading size, name line height, captions or entry meta.

- **DESIGN.md location.** The brief asks for `DESIGN.md` at the repo root, but a hook blocks the ux-designer outside `design/`. It is at `design/DESIGN.md`; the orchestrator needs to move it after the gate.
- **The critique loop has not run.** There are no captures, so the render passes and the fix-the-top-three loop are left for the mockup-maker on its own captures. Pass 4 (generic-pattern risk) is the one to watch.
- **5 MB and phone photos.** Many recent Android phones save photos over 5 MB. The refusal message gives a way to shrink a photo, but some visitors will still give up. AC-14 fixes the limit, so this is noted, not changed.
- **"Gästebuch".** "Lưu bút" is the human's name for the book. "Gästebuch" is the closest German guestbook word; the German speaker may prefer "Kondolenzbuch", which fits the funeral but not the weeks after.
- **Bác Hồ clip speech.** If the clip has speech, its caption should say what is said. Someone needs to watch it.
- **German-facing legal pages.** A site read in Germany that stores visitor entries may need an Impressum and a privacy page. They are not in the spec; the family should ask someone who knows.

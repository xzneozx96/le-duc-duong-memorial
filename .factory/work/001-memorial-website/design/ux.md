# UX lens: 001-memorial-website

Behaviour, flows, states, motion plan, copy and worst-case data: [EXPERIENCE.md](EXPERIENCE.md). Visual system: [DESIGN.md](DESIGN.md), proposed and drafted from direction A. It moves to `DESIGN.md` at the repo root after the gate, because the ux-designer may not write there.

Revised 2026-11-18 against the newer ux references (art direction, motion, UI copy, worst-case data, operate screens, visual slop, critique, variants). What changed and why is under "Revision".

## Decisions

| Id | Decision | Criteria | Door | ADR |
|---|---|---|---|---|
| U1 | One light visual system drafted from lab direction A inside the spec's pins: paper #F5EFE3, ink #2A2522, amber-ink #8F5300 on the title only, Literata (roman) and Be Vietnam Pro self-hosted, prints in mounts, flat station boards, SVG rail; rewritten from whichever direction the family picks | AC-2, AC-5, AC-6, AC-8 | two-way | none |
| U2 | 18 px floor for every word on the page, body 20 px, all text measured at 4.5:1 or more, disabled controls included | AC-6 | two-way | none |
| U3 | The language switch swaps text without reloading, stores the choice in a cookie the server reads for the first paint, and updates `<html lang>` | AC-3 | two-way | none |
| U4 | Station boards always show the Vietnamese line first and the German line second, each with its own `lang` | AC-8 | two-way | none |
| U5 | Every timeline print shows its caption and every press photo its credit on the page; entry photos get accessible names instead; phones one column, wide three | AC-8, AC-10, AC-17, AC-23 | two-way | none |
| U6 | A station shows its first 3 prints (phone) or 6 (wide), the rest behind "Xem thêm {n} ảnh" | AC-8, AC-26 | two-way | none |
| U7 | The book reads: invitation, a "Viết lưu bút" button that opens the form in place, the tribute as first entry, then visitor entries newest first | AC-12, AC-25 | two-way | none |
| U8 | Form checks run on send, in the page's language, with `noValidate`, no `maxlength`, lengths on NFC text; refused files listed by name with the reason and the 5 MB limit | AC-13, AC-14 | two-way | none |
| U9 | The photo viewer is a modal dialog with text-labelled controls, arrow keys and Escape, and one history entry so phone Back closes it | AC-10, AC-17 | two-way | none |
| U10 | Films are click-to-load facades, no YouTube request before play, then youtube-nocookie in the same frame | AC-7, AC-26 | two-way | none |
| U11 | The book shows 20 visitor entries, then "Xem thêm {n} bài", and clamps entries over about 600 characters at 8 lines | AC-1, AC-17, AC-23 | two-way | none |
| U12 | Admin lists every entry newest first with a status word, one Hide or Show again button, a count line with real zeros, errors inside the row, no confirm and no story motion | AC-18, AC-19, AC-20, AC-21 | two-way | none |
| U13 | Three jump links under the intro, no sticky bar | AC-1 | two-way | none |
| U14 | The relationship label shows in the page's language; everything the visitor typed shows as typed | AC-4, AC-17, AC-25 | two-way | none |
| U15 | The memory wall is named "Lưu bút" / "Gästebuch" and drawn as one continuous book page; the form opens with "Viết lưu bút" / "Ins Gästebuch schreiben" and sends with "Gửi lưu bút" / "Eintragen" (the human's answer) | AC-12, AC-17, AC-25 | two-way | none |
| U16 | All Vietnamese and German strings rewritten to the ui-copy rules: each error names the field, the limit and the fix, one verb per action through the flow | AC-13, AC-14, AC-15, AC-16 | two-way | none |
| U17 | Motion: one colour-only focal moment (station markers fill as reached), short viewer and new-entry feedback, nothing on load, reduced motion keeps opacity and colour only; tokens in DESIGN.md | AC-8, AC-10, AC-12 | two-way | none |
| U18 | Worst-case rules per field: names wrap, messages keep line breaks and clamp at 8 lines, URLs not linked, markup literal, German plurals, decimal comma in sizes | AC-5, AC-13, AC-17 | two-way | none |
| U19 | The German page shows its own title, "Ein Sonnenstrahl, der bleibt" (draft for the German speaker), in amber-ink; the Vietnamese page keeps "Một ánh Dương còn mãi" (the human\'s answer) | AC-2, AC-3 | two-way | none |

No UX decision here is hard to reverse, so there is no ADR draft.

## Revision

What the newer references changed, by reference:

- **art-direction.md.** The repo is greenfield, so the direction is now chosen through the method: subject, rut, seven candidates and two or three lab directions (below). The spec pins paper, ink, serif, prints, railway and amber, so the directions vary inside the pin. `DESIGN.md` carries direction A's contract and is marked to be rewritten from the picked route.
- **visual-slop.md.** Three tells fixed. The italic serif title is now roman (`italic-serif-display`). The rail is SVG linework, not a stripe gradient (`repeating-stripes-gradient`). The "enamel sign" is a flat plate, with fake materials banned (faked physicality). `cream-palette` is noted, not fixed, because the frozen spec pins the paper ground; specificity comes from the boards, the captions and the book instead.
- **motion.md.** New motion plan in `EXPERIENCE.md` and a `motion` token group in `DESIGN.md`. The first pass had one 150 ms fade and nothing else; reduced motion is now "fewer and gentler", not off.
- **ui-copy.md.** A fact sheet, a voice card, and every string rewritten with a "Not" column. "Lời tưởng nhớ" became the memory book (U15), now "Lưu bút" / "Gästebuch" by the human's answer; the reader is "bạn", the human's answer, with "xin" in every request; errors gained the fix and the count to cut; the server error gained the family contact.
- **worst-case-data.md.** A value map and a fixture in `EXPERIENCE.md`; three findings went to TOUCHES (no length limit on content fields, captions can be missing, no photo count limit).
- **operate-screens.md.** The admin page rebuilt to its rules (U12).
- **variants.md.** The first pass's timeline options (left rail against a centred zigzag) are dropped: the zigzag is the category template, and both varied only layout. The direction round now carries the real choice, on different axes.
- **critique.md.** Render passes and the fix-the-top-three loop need captures, and there are none (no routes yet). The seven passes ran on the files (Self-review below).
- **Persona names.** The first pass gave the family member an invented name. That is replaced by "a family member".

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

**Colour strategy.** One per direction: A restrained (paper, ink, oxblood plates, amber title); B restrained on a dark ground (warm light text, white signs, one bright amber); C committed (ochre carries the rail and bands, green carries the Lưu bút field). Scene: older readers on phones at home in the evening and at the funeral reception in daylight, both of which favour a light page with high-contrast ink.

## Lab

Not built. The repo has no app and no lab folder, so Q4 asks first. When the human says yes and the scaffold exists, the mockup-maker builds in this shape:

- Routes under `app/lab/memorial/`, components in `app/lab/memorial/_components/`, an index page listing each route with its note.
- Guard: each lab page calls `notFound()` when `process.env.NODE_ENV === "production"` and `LAB_ENABLED` is not set. Metadata `robots: { index: false, follow: false }`.
- Values: each direction's values live in a wrapper with local CSS variables inside its own lab folder (`_directions/a|b|c/`), named new on the page. Direction A starts from the `DESIGN.md` tokens plus its round-1 additions; B and C use only the values in their sections below. Fonts are loaded in `app/lab/memorial/layout.tsx` with `next/font/google`, subsets latin, latin-ext, vietnamese.
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

### Round 2: states, in the picked direction

1. **Tokens and glyphs** (`/lab/memorial/tokens`). Swatches with the measured ratios from `DESIGN.md`, the disabled styles, every type token with "Lê Đức Dương, ằ ẫ ệ ộ ữ ợ Đ, ä ö ü Ä Ö Ü ß ẞ, „Grüße“", the title at real size.
2. **Header and film** (`/lab/memorial/top`). Both languages; the German page with each of the three German title drafts from Q1; one facade switched to the player; the portrait failed.
3. **Timeline** (`/lab/memorial/timeline`). Hà Nam with no photos; Moritzburg with the clip before and after play and a press credit; Thanh Xuân with 12 prints collapsed and expanded; Nước Đức with 26 prints and a long German paragraph; one print failed; markers hollow, filled and the double-ringed end.
4. **Viewer** (`/lab/memorial/viewer`). A black-and-white portrait photo, a wide colour photo with a press credit, a long caption, an entry photo captioned with its writer's name, the 4000×200 panorama and the 1080×2400 screenshot, first and last photo, a failed photo; phone and wide layouts.
5. **Book, options A and B** (`/lab/memorial/book?option=a|b`). The worst-case fixture; tribute clamped and expanded; the empty book with the tribute only and with nothing; "Xem thêm" idle, loading, failed; a just-posted entry with its tint and label.
6. **Form** (`/lab/memorial/form`). Closed; open and pristine with the privacy note; every field message with the summary; a 6,000-character message marked with the count to cut; refusals (a PDF and a 7.2 MB photo among three good ones); sending with "Đang gửi ảnh 2/3…"; offline; server error; success.
7. **Admin** (`/lab/memorial/admin`). Login; wrong password with tries left; locked with the retry time; the list with visible and hidden entries, the two "Nguyễn Văn Hùng" rows and the count line; counts at 0; a failed hide; an expired session.

## Self-review

The seven passes on the files, before any capture. Scores are the designer's own and are no evidence for the reviewer.

1. Information architecture, 8: first his face and name, then the films, the stations, the book. The jump links serve the funeral-day writer. Missing: the intro lines are content the family has not written.
2. State coverage, 8: every surface has loading, empty, error, partial, success and overflow rows, plus offline and JavaScript off. Not yet visible in a lab route.
3. Journey, 8: three flows with a climax beat and a failure path each. The writer's climax (the entry arriving in the book) now has motion and a lasting label.
4. Generic-pattern risk, 6: the pinned paper-and-serif ground is the most common default for this subject. The boards, real captions, the book and the 1955 train carry the specificity, but until a capture shows them, this stays the weakest pass. Mode named per surface.
5. Design-system alignment, 8: every value is a token in the proposed `DESIGN.md`; every component is named new; no standalone HTML.
6. Responsive and accessibility, 9: 375 and 1280 decisions, 320 px and 200% text, 48 and 56 px targets, keyboard path and focus after every action, reduced motion defined.
7. Unresolved decisions, 9: Q1 and Q3 answered by the human; Q2, Q4 and Q5 open, each with a recommendation and a cost.

## Touches

- **architecture.** A Next.js app scaffold must exist before any lab route. Fonts load through `next/font/google` with subsets `latin`, `latin-ext`, `vietnamese` (Literata roman only). Page text comes from one VI and one DE dictionary held client-side, with singular and plural forms for German, so the switch needs no reload; the server picks the first-paint language from a cookie, else `Accept-Language` (German if it starts with `de`, Vietnamese otherwise). The book's first 20 entries render on the server per request, with no static or ISR cache, so a new or hidden entry shows correctly to the next visitor (AC-12, AC-19). Phone Back closing the viewer assumes a `history.pushState` entry (for example `?foto=`) that the App Router does not turn into a navigation or reload; a reload would lose the form and the scroll place. The station marker fill uses one IntersectionObserver class toggle per station, no scroll handler. The admin path is architecture's choice; the design assumes it is `noindex` and unlinked. `lucide-react` is a new dependency. The Bác Hồ clip needs re-encoding (9.9 MB today) and a poster frame. Per-photo progress ("Đang gửi ảnh 3/12…") assumes photos upload one by one or report progress; if they go as one request, the button shows "Đang đăng…" only. With no limit on photo count, one entry can carry 40 photos of up to 5 MB (200 MB) over a phone connection: the upload path needs a timeout and a retry that keep the form, and the server a body limit that fits. The lockout message shows a retry time if the server returns one. The content files need a check at build time that every timeline photo has a caption and every press photo a credit (worst-case finding: there is no limit or check on content fields).
- **data.** Relationship is stored as a code (`hoc_tro`, `dong_nghiep`, `ban_be`, `gia_dinh`, `khac`) and shown in the page's language. Class and year are free text, stored as typed. The message is stored with its line breaks. The tribute needs a pinned flag or a fixed order key so it stays above visitor entries whatever its date (AC-25); it is a normal entry the family can hide. Each photo needs a small-print size (about 480 px), a viewer size (about 1600 px long side) and its width and height so prints reserve space. Which types count as photos (JPEG, PNG, WebP, HEIC and HEIF are assumed, and the refusal message names JPG, PNG and HEIC) and whether 5 MB means 5,000,000 or 5 × 1,048,576 bytes must match the page's own check. Lengths are counted on NFC-normalised text, the same on client and server (AC-13). A hidden entry's photos must stop answering at their public address (AC-19). The admin list needs every entry with its hidden flag, and a total and hidden count.

## Questions

- **Q1 German title (answered 2026-11-18: translate it).** The German page shows a German title; the Vietnamese page keeps "Một ánh Dương còn mãi". Dương means sun, so the drafts keep as much of the sun as German allows. Draft: "Ein Sonnenstrahl, der bleibt". Alternatives: "Ein Licht, das bleibt" (simpler, loses the sun) and "Seine Sonne geht nicht unter" (keeps the sun, and reads as an idiom for something that lasts). All three go to the German speaker for a check before launch. Note for the orchestrator: AC-2 names only the Vietnamese title, so its manual test case should check the German title on the German page.
- **Q2 Approve the visual system and record the pins.** `DESIGN.md` is a first draft. The paper ground, serif and amber come from the frozen spec and the brainstorm, but no design record holds them yet, so a reviewer would flag the paper ground as a common default. The title colour that passes 4.5:1 is #8F5300, a dark bronze-amber. (Recommended) Approve the pins and the amber-ink as drafted, and record them at the gate. Other option: ask for a brighter amber, which passes only as large text at 3:1 and so breaks AC-6. Lab: `/lab/memorial/tokens`. Cost if wrong: about half a day of re-theming before build.
- **Q3 Vietnamese address (answered 2026-11-18: "bạn").** Every Vietnamese string that addresses the reader uses "bạn", with "xin" in each request so it stays respectful for readers aged 60 to 75.
- **Q4 Lab routes in the app.** The repo has no lab folder. (Recommended) Add `app/lab/memorial/` once architecture's scaffold exists, with `notFound()` in production unless `LAB_ENABLED` is set and `noindex`, and remove it after launch. Other option: skip mockups and review the first build directly, which saves about a day but puts every visual call on the build. Cost if wrong: about a day either way.
- **Q5 Which direction.** (Recommended) A, the family album: closest to the brainstorm and the safest to read at 60 to 75, now with oxblood plates, photo corners and a sticky album grid on wide screens. Other options: B, the night train (dark, cinematic, built on the archive photos; the boldest, with a glare risk for older eyes), or C, Hà Nội daylight (white, ochre and large type, built on the colour photos; risks a cheerful template look). The quiet exit is also open: a plain, well-made memorial page with no railway or album idea. Lab: `/lab/memorial/direction?d=a|b|c`. Cost if wrong: about a day of re-theming before build. If B or C is picked, the spec Constraints line pinning paper, ink and serif must be amended first.

## Concerns

- **Spec Constraints and directions B and C.** The spec Constraints pin "warm off-white paper, dark ink, a large serif". B (dark ground, condensed sans for display) and C (white ground, grotesque and Lexend, no serif) break that line. If the human picks B or C, the spec's Constraints line must be amended through the spec process before build. I have not edited `spec.md`.

- **DESIGN.md location.** The brief asks for `DESIGN.md` at the repo root, but a hook blocks the ux-designer outside `design/`. It is at `design/DESIGN.md`; the orchestrator needs to move it after the gate.
- **DESIGN.md ahead of the lab.** `DESIGN.md` still holds the first-pass A values. Round 1 now gives A oxblood plates, photo corners, italic captions and a sticky grid on wide screens. Whichever direction is picked, `DESIGN.md` is rewritten from that lab route's actual values.
- **The critique loop has not run.** There are no captures, so the render passes and the fix-the-top-three loop are left for the mockup-maker on its own captures. Pass 4 (generic-pattern risk) is the one to watch.
- **5 MB and phone photos.** Many recent Android phones save photos over 5 MB. The refusal message gives a way to shrink a photo, but some visitors will still give up. AC-14 fixes the limit, so this is noted, not changed.
- **"Gästebuch".** "Lưu bút" is the human's name for the book. "Gästebuch" is the closest German guestbook word; the German speaker may prefer "Kondolenzbuch", which fits the funeral but not the weeks after.
- **Bác Hồ clip speech.** If the clip has speech, its caption should say what is said. Someone needs to watch it.
- **German-facing legal pages.** A site read in Germany that stores visitor entries may need an Impressum and a privacy page. They are not in the spec; the family should ask someone who knows.

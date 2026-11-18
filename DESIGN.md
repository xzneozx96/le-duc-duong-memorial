---
version: alpha
name: Một ánh Dương còn mãi
description: Memorial page for thầy Lê Đức Dương. Direction B, the night train. A warm near-black ground, archive photos as film frames, white enamel station signs hung from one rail, and the Lưu bút on a raised dark surface.
status: proposed
colors:
  ground: "#161412"           # page background
  surface: "#221F1B"          # the Lưu bút section, the form, admin rows
  well: "#0C0B0A"             # behind photos while they load, film facades, the viewer
  hidden-surface: "#2E2A25"   # admin only: a hidden entry
  text: "#EFE8DC"             # all reading text; never pure white
  muted: "#B9AFA0"            # captions, meta, hints, years in the header
  amber: "#F2B347"            # the title and actions only (spec Constraints, Q6): never running text, years or headings
  on-amber: "#161412"         # labels on amber fills, 9.9:1
  enamel: "#EFE8DC"           # station signs, the active language, focus rings
  on-enamel: "#161412"        # letters on enamel
  edge: "#8C8274"             # rail, ticks, brackets, input and button borders (graphics only, never text)
  rule: "#3A352F"             # decorative section and entry rules
  keyline: "#4A443C"          # 1 px line around film frames
  error: "#FF9C85"            # error text and its icon
  success: "#9BD3A6"          # success text and its icon
typography:
  display-name:
    fontFamily: Archivo Narrow
    fontSize: 52px
    fontWeight: 700
    lineHeight: 1.1
    textTransform: uppercase
  display-name-wide:
    fontFamily: Archivo Narrow
    fontSize: 96px
    fontWeight: 700
    lineHeight: 1.05
    textTransform: uppercase
  title:
    fontFamily: Archivo Narrow
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1.2
  title-wide:
    fontFamily: Archivo Narrow
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.2
  years:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.2em
    fontFeature: "tnum"
  heading-section:
    fontFamily: Archivo Narrow
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    textTransform: uppercase
  heading-section-wide:
    fontFamily: Archivo Narrow
    fontSize: 52px
    fontWeight: 700
    lineHeight: 1.1
    textTransform: uppercase
  sign-primary:
    fontFamily: Archivo Narrow
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.1
    textTransform: uppercase
  sign-secondary:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.2
  sign-years:
    fontFamily: Archivo Narrow
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.18em
    fontFeature: "tnum"
  heading-entry:
    fontFamily: Archivo Narrow
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.2
  film-title:
    fontFamily: Spectral
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.3
  body-lg:
    fontFamily: Spectral
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: Spectral
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.7
  caption:
    fontFamily: Spectral
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.06em
    textTransform: uppercase
  meta:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.02em
    fontFeature: "tnum"
  credit:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em
rounded:
  none: 0px
  sign: 4px
  full: 9999px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 24px
  "6": 32px
  "7": 48px
  "8": 64px
  "9": 96px
  page-x: 20px
  page-x-wide: 48px
  section-y: 48px
  section-y-wide: 72px
  station-gap: 72px
  station-gap-wide: 112px
  rail-column: 28px
  rail-gap: 18px
  stop-measure: 760px
  content-max: 1200px
  breakpoint-wide: 900px
  target-min: 48px
  target-primary: 56px
components:
  station-sign:
    backgroundColor: "{colors.enamel}"
    textColor: "{colors.on-enamel}"
    rounded: "{rounded.sign}"
    padding: 12px 20px 14px
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.on-amber}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: 56px
    padding: 26px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: 48px
    padding: 18px
  input:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: 56px
    padding: 14px
  film-facade:
    backgroundColor: "{colors.well}"
    textColor: "{colors.text}"
  viewer:
    backgroundColor: "{colors.well}"
    textColor: "{colors.text}"
motion:
  easing:
    out: "cubic-bezier(0.23, 1, 0.32, 1)"       # UI enter and exit
    in-out: "cubic-bezier(0.77, 0, 0.175, 1)"   # movement on screen
    enter: "cubic-bezier(0.16, 1, 0.3, 1)"      # a new entry arriving
    colour: "ease"                              # hover, bracket light, row surface
  duration:
    press: 120ms          # button press scale
    quick: 180ms          # hover colour, admin row surface, switch fill
    cut-out: 200ms        # viewer open, first half: the page fades to the well colour
    cut-in: 250ms         # viewer open, second half: the photo fades in
    exit: 200ms           # viewer close
    arrive: 400ms         # a new Lưu bút entry appearing
    bracket: 600ms        # a station's bracket lights as the reader reaches it
  story:
    focal: 600ms          # the bracket light is the page's one authored moment
    beats: {}
  stagger: { ui: 0ms, story: 0ms }
  reduced: "fewer and gentler: opacity and colour stay, every movement and scale goes, the viewer cut becomes one 150 ms fade, smooth scrolling goes"
omitted:
  - section: light theme
    reason: "Direction B is dark by the family's choice. There is no light mode at launch; see the older-eyes rules under Colors."
  - section: elevation
    reason: "Nothing casts a shadow. Depth comes from the ground, surface and well values and from the enamel signs."
---

# DESIGN.md: memorial page for thầy Lê Đức Dương

Status: proposed, rewritten on 2026-11-18 from lab direction B, "the night train", which the human picked from the round-1 lab. Values come from the lab as built and checked in the browser at 375 and 1280 px (`src/app/lab/memorial/_lab/direction-b.tsx` and `b.css`, commit b03dca2), with the corrections marked "changed from the lab" below. The repo had no design system before. Its home is `DESIGN.md` at the repo root; it sits in the item's `design/` folder because the ux-designer may not write outside it, and the design orchestrator moves it after the gate.

## Overview

His life seen from a night train. The black-and-white photos of 1955 to 1970 run edge to edge like film frames, and each place of his life is a white enamel station sign hung from one rail, its Vietnamese name above its German name. The amber title and the amber buttons are the only warm light on the page. The Lưu bút sits at the end on a slightly raised dark surface, where his students write to him.

Readers are mostly 60 to 75, in Vietnam and Germany, many on phones. Dark pages are harder for some older eyes, so this file sets rules for light text on dark (Colors) that are stricter than AC-6 asks.

The page must not read as a dark mourning page. What keeps it from that: warm light text instead of white, the bright amber title and actions, colour photos left in colour, the laughing reunion photos of the Germany station at full width, and no black frames, candles or crosses.

## Direction contract

- **THESIS.** His life is a night journey between two homelands, told in film frames and station signs. The page refuses the category default: a centred portrait in an oval, candles, doves, script type, and guestbook cards in a grid.
- **OWN-WORLD.** A warm near-black ground, warm light text, bright amber on the title and on everything you can press. Archivo Narrow in the condensed letters of a platform sign for his name, the signs and every control; Spectral for everything people read. White enamel signs with a dark inner border. Photos edge to edge with a thin keyline, no mounts.
- **STORY.** The visitor sees his face filling half the screen and his name in tall capitals, understands that his life ran from Hà Nam through the GDR to Germany station by station, sees the people and places as film frames, then writes in the Lưu bút and sees the entry there at once.
- **FIRST VIEWPORT.** Phone: his portrait edge to edge at 4:5, then the language switch, the years, his name in 52 px capitals, the amber title, two lines of intro and three jump links. Wide: the portrait fills the left 45% of the first screen from top to bottom; the same text column sits on the right, centred vertically. Memory test: "his face in the dark and his name in tall white letters, like a station at night".
- **FORM.** Candidate 8, the film archive, with the railway carried by candidate 3's station signs.
- **FINISH.** Reviewed by the design-reviewer, chosen by the family (2026-11-18), and this file written from the chosen lab route's values. Done when the design gate approves it.

## Colors

All ratios measured on 2026-11-18 with the WCAG 2.x formula.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| ground | #161412 | Page background | |
| surface | #221F1B | Lưu bút section, form, admin rows | |
| well | #0C0B0A | Behind loading photos, film facades, the viewer | |
| hidden-surface | #2E2A25 | A hidden entry on the admin page | |
| text | #EFE8DC | All reading text | 15.1:1 on ground, 13.5:1 on surface, 16.2:1 on well, 11.7:1 on hidden-surface |
| muted | #B9AFA0 | Captions, meta, hints, header years; never on hidden-surface | 8.5:1 on ground, 7.6:1 on surface, 9.1:1 on well (6.6:1 on hidden-surface, under the 7:1 rule, so text there uses `text`) |
| amber | #F2B347 | The title, and actions: primary button, clip play pill, film play controls, text buttons, the lit rail bracket | 9.9:1 on ground, 8.8:1 on surface, 10.6:1 on well |
| on-amber | #161412 | Labels on amber fills | 9.9:1 on amber |
| enamel, on-enamel | #EFE8DC, #161412 | Signs, active language | 15.1:1 |
| edge | #8C8274 | Rail, ticks, brackets, borders of inputs and buttons | 4.9:1 on ground, 4.3:1 on surface, 3.8:1 on hidden-surface (UI edges need 3:1) |
| rule, keyline | #3A352F, #4A443C | Section and entry rules, the line around frames | Decoration only (1.5:1 and 1.9:1) |
| error | #FF9C85 | Error text and icon | 9.1:1 on ground, 8.1:1 on surface |
| success | #9BD3A6 | Success text and icon | 10.7:1 on ground, 9.6:1 on surface |

**Light text on dark, for older eyes.** AC-6 asks 4.5:1. These rules go further, because light strokes on a dark ground look thinner and can halo for readers with astigmatism or cataracts:

- **No pure white.** Reading text is #EFE8DC. A ceiling of 16:1 for running text; #FFFFFF on the ground would be 18.5:1 and is not used.
- **No light weights.** Spectral 400 is the lightest weight on the page; Archivo Narrow 500 the lightest for labels. Nothing at 300.
- **Size and spacing.** Body 20 px with line height 1.7, measure at most 70 characters (the 760 px stop column). Captions 18 px with line height 1.5.
- **Secondary text at 7:1 or more**, not just 4.5:1 (muted is 7.6 to 9.1). On the hidden-surface (a hidden admin row, a just-sent entry) meta uses `text`, 11.7:1, because muted there is 6.6:1.
- **No italic for reading text** (changed from the lab, which set captions in italic). Spectral italic at 18 px light-on-dark is the hardest text on the page to read.
- **No text over photos.** Captions sit under frames.
- **Bright fields stay small.** Enamel is for signs and the active language, amber fills for buttons and play pills. No large white panels next to reading text.

Other rules:

- **Amber marks the title and things you can press** (spec Constraints, the human's answer to Q6, 2026-11-18): the title in either language, the primary button, the clip's play pill, the film play controls, text buttons such as "Đọc hết bài", and the rail bracket once lit. Labels on amber fills are on-amber #161412 at 9.9:1 (measured); amber text on ground, surface and well is 9.9:1, 8.8:1 and 10.6:1. Never on running text, years, headings, captions or meta. Changed from the lab: the station years, the film episode labels and the jump-link underlines leave amber.
- **edge, rule and keyline never colour text.**
- **No colour carries meaning alone.** Errors have an icon and words; a hidden admin row has the word "Đang ẩn" / "Ausgeblendet" and a different surface.
- **No raw hex in components** (changed from the lab, which has #3a352f, #4a443c, #0c0b0a and #000 inline; they are now rule, keyline and well).
- Text selection: on-enamel on enamel. The caret is text.

## Typography

Two families, both free (SIL Open Font License), both from Google Fonts, both self-hosted through `next/font` with the subsets `latin`, `latin-ext` and `vietnamese`.

- **Archivo Narrow** (500, 600, 700) for his name, the title, section headings, station signs, years, labels, buttons and meta. Its condensed letters are those of a platform sign.
- **Spectral** (400, 500) for the intro, station text, captions, film titles, Lưu bút entries and form input.

Glyph coverage was measured on 2026-11-18 with fontTools on `ArchivoNarrow[wght].ttf`, `Spectral-Regular.ttf` and `Spectral-Medium.ttf`: all 134 Vietnamese letters in both cases with đ and Đ, ä ö ü Ä Ö Ü ß ẞ, „ “ ” ‚ ‘ ’ « », the en dash and the ellipsis. None is missing.

| Token | Use | Phone | Wide |
|---|---|---|---|
| display-name | His name, capitals | 52 px Archivo Narrow 700, line height 1.1 | 96 px, 1.05 |
| title | "Một ánh Dương còn mãi" / "Ein Sonnenstrahl, der bleibt", amber, mixed case | 30 px Archivo Narrow 500 | 44 px |
| years | 1942–2026 in the header, muted | 20 px Archivo Narrow 500, tracking 0.2em, tabular | 20 px |
| heading-section | Section headings, capitals | 36 px Archivo Narrow 700, 1.15 | 52 px, 1.1 |
| sign-primary | Vietnamese line of a sign, capitals | 30 px Archivo Narrow 700, 1.1 | 30 px |
| sign-secondary | German line of a sign, mixed case | 20 px Archivo Narrow 500 | 20 px |
| sign-years | Years under a sign, text colour | 22 px Archivo Narrow 600, tracking 0.18em, tabular | 22 px |
| heading-entry | Name on a Lưu bút entry | 26 px Archivo Narrow 600 | 26 px |
| film-title | Film titles on the facades | 24 px Spectral 400 | 24 px |
| body-lg | The intro, at most two rendered lines at 375 px (AC-2) | 22 px Spectral 400, 1.6 | 24 px |
| body | Station text, entries, input | 20 px Spectral 400, 1.7 | 20 px |
| caption | Photo captions, roman | 18 px Spectral 400, 1.5, muted | 18 px |
| label | Buttons, jump links, language switch, capitals | 18 px Archivo Narrow 600, tracking 0.06em | 18 px |
| meta | Entry meta, hints, counters, privacy note, errors | 18 px Archivo Narrow 400, tracking 0.02em | 18 px |
| credit | Press credit under a caption | 18 px Archivo Narrow 500, text colour | 18 px |

Rules:

- **18 px is the floor for every word** (AC-6), including credits, counters, hints and errors.
- **Capitals are part of the sign world** the family picked: his name, section headings, the Vietnamese sign line and labels. Never on sentences longer than a heading, never on reading text, never on the German sign line.
- **Line height for capitals with Vietnamese marks** is at least 1.05 at display size and 1.1 elsewhere (changed from the lab's 0.98 on the name). Stacked marks over capitals (Ấ, Ứ, Ộ) need the room when a name wraps to two lines.
- **Section headings are real headings** at 36 to 52 px (changed from the lab, which set them at 18 px in tracked capitals, where they read as small labels and the tracking was 0.24em). Tracking above 0.06em is kept only on digits (years).
- Body measure at most 70 characters. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`.
- Years and dates use tabular figures; dates are written 20.11.2026 in both languages.
- Quotes follow the language: “…” in Vietnamese, „…“ in German.
- `font-display: swap` with the metric-matched fallbacks `next/font` generates (AC-26).

## Layout

- **Phone, 375 px.** The header portrait edge to edge at 4:5, text below with `page-x`. Films stacked. Each station: its lead photo edge to edge at 4:3, its caption, then the stop row (rail column 28 px, gap 18 px, then the sign, years, text and the clip), then the other photos one per row, first 3 shown.
- **Wide, from 900 px.** The header is two columns: the portrait 45% wide, edge to edge from the top to the bottom of the first screen; the text column centred vertically with 64 px padding. Films side by side in `content-max`. Each station: the lead photo across the full width at 21:9, the stop row in `stop-measure` (760 px) centred, the other photos as a contact sheet of three columns in `content-max`, first 6 shown.
- Every container is centred (`margin-inline: auto`). Nothing scrolls sideways at 320, 375 or 1280 px (the page uses `overflow-x: clip`).
- Vertical rhythm: `section-y` (48, 72 wide) around sections; `station-gap` (72, 112 wide) between stations. More space above a heading than below it.
- Targets: 48 px minimum, 56 px for the primary buttons and the viewer controls, 8 px apart.

## Shapes

- Signs: `rounded.sign` (4 px), with a 3 px enamel and 2 px ground inner border, drawn flat (no bevel, no gradient, no shine).
- Everything else is square: frames, buttons, inputs, facades.

## Components

**Station sign.** An enamel plate (`station-sign`), its Vietnamese name in `sign-primary` with `lang="vi"` over its German name in `sign-secondary` with `lang="de"`, inside a 3 px enamel and 2 px ground inner border. The order never changes with the page language (AC-8). It is the station's `<h3>`. The years sit under it in `sign-years`, text colour.

**Rail, ticks and bracket.** In the 28 px rail column, decorative and hidden from assistive technology: one 3 px rail in edge at 12 px from the left, ticks 16 px wide and 2 px thick every 24 px, and a 22 × 2 px bracket from the rail to the sign, 26 px from the top of the stop row. The bracket starts in edge and lights to amber when the reader reaches the station (Motion). Inline SVG is preferred; the lab's single SVG tick tile plus one gradient line is accepted, because it draws linework, not a stripe.

**Film frame.** A photo edge to edge with no mount: lead frames at 4:3 (phone) or 21:9 (wide), `object-fit: cover`; contact-sheet frames at 3:2 with a 1 px keyline outline. The well colour shows while loading. The caption sits under the frame in `caption`, muted; a press photo adds a credit line in `credit`, text colour, always visible. The frame is a button that opens the viewer, named by its caption. Archive photos stay black and white and colour photos stay in colour; the header portrait alone has a light grade (saturation 0.85, contrast 1.05). No grain, no sprocket holes.

**Contact sheet.** The station's other photos in a grid (one column on phones, three from 900 px), first 3 or 6 shown, the rest behind a ghost button "Xem thêm {n} ảnh" / "{n} weitere Fotos zeigen".

**Film facade.** A 16:9 `well` plate with a 1 px rule border, the episode label in `label` muted (changed from amber, which is for actions), the title in `film-title`, and an amber play control with on-amber `label`, an icon and "Phát video" / "Video abspielen", 48 px tall. Pressing it loads the YouTube player (youtube-nocookie) in the same frame.

**Clip.** The 58-second clip as a poster in a `well` frame with a 1 px rule border; the play control is an amber pill with on-amber `label` and words ("Xem đoạn phim 58 giây" / "58-Sekunden-Film abspielen") and a play icon, 56 px tall, bottom left. Native controls after the press.

**Buttons.** Primary: amber fill, on-amber `label` (9.9:1), 56 px, square. Ghost: transparent, 1 px edge border, text-colour `label`, 48 px. Text button ("Đọc hết bài", "Thử lại", "Đóng biểu mẫu"): amber `label` with no fill, 48 px tall. Every button has words; an icon may sit beside them. Hover: ghost buttons turn their border to text colour, text buttons gain a 2 px amber underline, and the primary gains a 2 px text-colour outline at 2 px offset. Disabled: muted label on hidden-surface fill, dashed edge border, `aria-disabled`; no opacity change. Busy: the label changes, the width stays.

**Focus.** A 3 px enamel outline at 3 px offset on every focusable element, `:focus-visible` only. On the amber primary button and the enamel signs the ring sits on the ground beside them at 3 px offset and reads at 15.1:1 against the ground.

**Language switch.** In the header: under the portrait on phones, at the top of the text column on wide screens; again in the footer. Two buttons, "Tiếng Việt" and "Deutsch", in `label`, each in its own language with its own `lang`, 48 px, 1 px edge border. The active one is enamel with on-enamel text and `aria-pressed="true"`. No flags.

**Jump links.** Three links in `label`, 48 px tall, each with a 2 px edge underline that turns text colour on hover. They are navigation, not actions, so they stay out of amber (changed from the lab).

**Lưu bút.** The whole section sits on `surface` with a 1 px rule on top. The heading in `heading-section` (36 px at 1.15, 52 px at 1.1 wide; changed from the lab's 44 px at line height 1), the invitation in `body`, the primary button "Viết lưu bút" / "Ins Gästebuch schreiben", then the entries in a list, each separated by a 1 px rule and 28 px of space. Each entry: the name in `heading-entry`, the meta in `meta` muted on its own lines (relationship, class and year on one line; the date on the next; commas, no middle dots, changed from the lab), the message in `body` with the visitor's line breaks kept, then its photos as small frames. Names, meta and messages break a word or URL that does not fit (`overflow-wrap: anywhere`, `word-break: normal`, `min-width: 0` on the grid or flex parent), so a long URL wraps inside the 760 px column and at 320 px and is never cut off. A just-sent entry's meta uses `text`, not muted, on its hidden-surface fill. The tribute is the first entry with no badge. A just-sent entry has a `hidden-surface` fill and the label "Vừa gửi" / "Gerade eingetragen" until reload.

**Form.** On `surface`. Inputs: `ground` fill, 2 px edge border (4.3:1 against the surface), square, 56 px, text in `body`. Label above in `label` but mixed case (labels are read, not signed), hint under the label in `meta` muted, message under the field in `meta` error with an icon; an invalid field also gets a 2 px error border. The relationship is five 48 px radio rows. The privacy note in `meta` text colour beside the send button.

**Viewer.** Full screen on `well`. The photo is fitted whole. Caption in `caption` muted, credit in `credit`. Controls are ghost buttons at 56 px with words and icons: "Đóng", "Ảnh trước", "Ảnh sau", and a counter "Ảnh 3/8" in `meta`.

**Admin rows.** On `surface`, a 1 px rule between rows; a hidden row on `hidden-surface` with the status word, its meta in `text` (11.7:1), not muted. Same buttons and focus as the public page.

**Icons.** Lucide, 2 px stroke, 24 px beside 18 px labels, always next to words.

## Motion

Tokens are in the front matter. Every motion answers something the reader did, except the bracket light, which answers their scroll. Nothing moves on page load, nothing hides content at rest, nothing blocks a control.

| Motion | What it says | Spec | Reduced motion |
|---|---|---|---|
| Bracket lights | "You have reached this station" | The bracket's colour goes from edge to amber over `bracket` with `colour` easing when the sign crosses the middle of the screen; it stays lit | Colour changes at once |
| Viewer opens, the cut | The film cuts to the photo | The page fades to `well` over `cut-out` with `out`, then the photo fades in over `cut-in` with `out`; no scale (450 ms in all, inside the 500 ms dialog budget) | One 150 ms opacity fade |
| Viewer closes | Back to the page | Opacity to 0 over `exit` with `out` | 150 ms fade |
| Next or previous photo | | None by keyboard or button; a touch swipe follows the finger and settles over `exit` | Swipe follows the finger; no settle |
| New Lưu bút entry | Your entry is in | Fades in and rises 8 px over `arrive` with `enter`; keeps its fill and label until reload | Opacity only |
| Form opens, language switch, read more, more photos | | None; at once | None |
| Button press | Pressed | `scale(0.98)` over `press`, pointer and touch only | Colour only |
| Hover | | Border, underline and outline colour over `quick`, only under `(hover: hover) and (pointer: fine)` | Same |
| Admin hide or show | The row changed | Surface colour over `quick` | At once |
| Jump links | | `scroll-behavior: smooth` | Instant |

Only `opacity`, `transform`, `color`, `border-color`, `outline-color` and `background-color` animate. No `transition: all`, no bounce, no stagger, no glow.

## Voice

```
Voice: family-plain, as a son or daughter would write to their father's students
Pairs: respectful, not ceremonial; brief, not curt
Person: "bạn" / "Sie" for the reader (only where needed; Vietnamese requests always carry "xin"), "gia đình" / "die Familie" for us, "thầy" / "er" for him
Sentences: mostly 6 to 14 words; the station paragraphs may run longer
Humour: none
House words: thầy, trạm (station), lưu bút / Gästebuch, viết lưu bút and gửi lưu bút / ins Gästebuch schreiben and eintragen, ẩn / ausblenden; the same word every time
Never: ceremonial set phrases from funeral notices, virtue words about the site or the family, praise of him that no source gives
```

- **Vietnamese.** He is "thầy" throughout. The reader is "bạn" (the human's choice), always with "xin" in requests. Unconfirmed memories are written "thầy kể…".
- **German.** He is "Lê Đức Dương" or "er". The reader is "Sie". Unconfirmed memories are written "er erzählte…". A German speaker checks every German string before launch.
- Errors say what happened and what to do, and do not apologise. One verb per action through the flow.
- Site text never states his exact role in the German section as fact.

## Tailwind mapping

The app uses Tailwind CSS (v4) with its own component library on top (the human, 2026-11-18). Two build facts from the lab (commit b03dca2) shape how the tokens reach components:

- **Every `.css` file goes through the Tailwind loader** in this app's `next.config`, so CSS modules lose their class names. The lab therefore uses plain stylesheets with a direction prefix (`lb-`). Product components use Tailwind utilities generated from the `@theme` block below, not CSS modules.
- **The lab route's layout did not apply its fonts**, so each lab page sets the font variables itself. In the product, the root layout puts the `next/font` variables on `<html>` once, and `@theme` reads them.

The `@theme` block in the global stylesheet maps the tokens one to one, so utilities carry the token names and no raw values:

- Colours: `--color-ground`, `--color-surface`, `--color-well`, `--color-hidden-surface`, `--color-text`, `--color-muted`, `--color-amber`, `--color-on-amber`, `--color-enamel`, `--color-on-enamel`, `--color-edge`, `--color-rule`, `--color-keyline`, `--color-error`, `--color-success` (giving `bg-ground`, `text-muted`, `border-edge` and so on). Tailwind's default palette is cleared, so a raw `text-white` or `bg-black` cannot slip in.
- Fonts: `--font-narrow` from Archivo Narrow's `next/font` variable and `--font-serif` from Spectral's.
- Type: one `--text-<token>` per typography token with its `--line-height`, `--letter-spacing` and `--font-weight` companions (for example `--text-body: 20px`, `--text-body--line-height: 1.7`); the `-wide` sizes apply at the `wide` breakpoint. Capitals come from the `uppercase` utility on the tokens marked uppercase only.
- Breakpoint: `--breakpoint-wide: 900px`; the default breakpoints are cleared.
- Radius: `--radius-sign: 4px`; everything else uses `rounded-none`.
- Spacing: Tailwind's 4 px base. Steps 1 to 4 of this scale are Tailwind's `1` to `4`; steps 5 to 9 (24, 32, 48, 64, 96 px) are Tailwind's `6`, `8`, `12`, `16` and `24`, and components use only those numbers. The named steps are variables: `--spacing-page-x`, `--spacing-rail-column`, `--spacing-rail-gap`, `--container-stop`, `--container-content`.
- Motion: `--ease-out`, `--ease-in-out`, `--ease-enter` and `--duration-*` custom properties for the durations above.

## Do's and don'ts

- Do keep amber on the title and on actions; never on running text, years, headings, captions or meta.
- Do keep reading text at #EFE8DC, 20 px, weight 400, line height 1.7.
- Do show a caption under every timeline photo and a credit under every press photo.
- Do give every control words and at least 48 px of height.
- Don't use pure white, light weights, italic reading text or text over photos.
- Don't use black mourning frames, candles, crosses, doves, clock or leaf motifs, or the dark navy look of the AI mockups.
- Don't fake materials: no film grain, sprocket holes, enamel shine or chipped paint.
- Don't add glows or coloured shadows on the dark ground.
- Don't animate anything the reader did not start; no scroll reveals, no parallax, no autoplay.
- Don't set sentences in capitals or track reading text.
- Don't use middle dots in entry meta; use commas and line breaks.

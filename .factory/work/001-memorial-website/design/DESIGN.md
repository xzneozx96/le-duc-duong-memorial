---
version: alpha
name: Một ánh Dương còn mãi
description: Memorial page for thầy Lê Đức Dương. Paper, ink, mounted prints, two-language station boards and a memory book. Drafted from lab direction A on 2026-11-18, not yet approved.
status: proposed
colors:
  paper: "#F5EFE3"            # page background, warm off-white
  paper-raised: "#FFFCF6"     # print frames, the pinned tribute, the open form
  field: "#FFFFFF"            # inside text inputs and the textarea
  hidden-surface: "#EDE6D8"   # admin page only: a hidden post
  ink: "#2A2522"              # all body text, headings, primary button, sign plates
  ink-muted: "#5E554C"        # captions, meta lines, hints, the rail
  amber-ink: "#8F5300"        # the title (Vietnamese or German), nothing else
  edge: "#7A6F64"             # input and button borders, admin row edges (graphics and edges only, never text)
  hairline: "#D8CFC1"         # decorative print edge and section rules (never the only boundary of a control)
  error: "#A3261B"            # error text and its icon
  success: "#2F6B3A"          # success text and its icon
  viewer-backdrop: "#14110F"  # full-screen photo viewer
  on-ink: "#F5EFE3"           # text on ink plates and on the viewer
  on-ink-muted: "#C9BFB2"     # caption text in the viewer
typography:
  display-name:
    fontFamily: Literata
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.2
  display-name-wide:
    fontFamily: Literata
    fontSize: 60px
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: Literata
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1.3
  title-wide:
    fontFamily: Literata
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.3
  years:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.02em
    fontFeature: "tnum"
  heading-section:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.25
  heading-section-wide:
    fontFamily: Literata
    fontSize: 42px
    fontWeight: 600
    lineHeight: 1.2
  sign-primary:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  sign-secondary:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.3
  sign-years:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    fontFeature: "tnum"
  heading-post:
    fontFamily: Literata
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontFamily: Literata
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: Literata
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: Literata
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
  label-strong:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
  meta:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
rounded:
  none: 0px
  print: 2px
  control: 6px
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
  rail-gutter: 44px
  rail-gutter-wide: 80px
  measure: 40rem
  wide: 65rem
  breakpoint-wide: 900px
  target-min: 48px
  target-primary: 56px
components:
  print:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.print}"
    padding: 10px
  print-wide:
    padding: 14px
  station-sign:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.control}"
    padding: 16px
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.label-strong}"
    rounded: "{rounded.control}"
    height: 56px
    padding: 24px
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: 48px
    padding: 20px
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: 56px
    padding: 14px
  lang-switch-option:
    typography: "{typography.label}"
    height: 48px
    padding: 16px
  viewer:
    backgroundColor: "{colors.viewer-backdrop}"
    textColor: "{colors.on-ink}"
motion:
  easing:
    out: "cubic-bezier(0.23, 1, 0.32, 1)"       # UI enter and exit
    in-out: "cubic-bezier(0.77, 0, 0.175, 1)"   # movement on screen
    enter: "cubic-bezier(0.16, 1, 0.3, 1)"      # a new memory arriving
    colour: "ease"                              # hover, marker fill, row surface
  duration:
    press: 120ms          # button press scale
    quick: 180ms          # hover colour, admin row surface, switch fill
    exit: 200ms           # viewer close
    overlay: 300ms        # viewer open
    arrive: 400ms         # a new post appearing on the wall
    marker: 600ms         # a station marker filling as the reader reaches it
  story:
    transition: 400ms
    focal: 600ms          # the station marker fill is the page's one authored moment
    beats: {}
  stagger: { ui: 0ms, story: 0ms }   # nothing on this site staggers
  reduced: "fewer and gentler: opacity and colour stay, every movement and scale goes, smooth scrolling goes"
omitted:
  - section: dark theme
    reason: "One light theme. The paper and print idea depends on it, and readers' devices default to light. The photo viewer is the only dark surface."
---

# DESIGN.md: memorial page for thầy Lê Đức Dương

Status: proposed on 2026-11-18 by the ux lens of item 001, revised the same day against the newer design references. The repo had no design system, so this is a first draft for the family to approve at the design gate. It is written from direction A of the direction lab (`ux.md`, Lab), ahead of the lab build because the launch is 8 days away. If the family picks B or C, or the lab shows a value that does not work, this file is rewritten from the values the chosen lab route actually uses. Its home is `DESIGN.md` at the repo root. It sits in the item's `design/` folder because the ux-designer may not write outside it; the design orchestrator moves it after the gate.

## Overview

A family album with a memory book at the back. The page is paper with dark ink, a book serif, and photos mounted as prints with their captions. His life runs down the page as a railway line, with a two-language board at each station, because his story starts with the 1955 train from Hàng Cỏ, which took 150 children to the GDR, and runs between two homelands. The memory wall is a book called "Lưu bút" / "Gästebuch": Lưu bút is the book Vietnamese students write in for classmates and teachers at the end of their school years, and his former students are most of its writers. The station boards are the one memorable element. Everything around them stays plain.

Readers are his students, colleagues and friends, mostly in their 60s and 70s, in Vietnam and Germany, many on phones. So the type is large, every control has a text label, and nothing moves on its own.

The page should read like a family album, not a funeral notice. Many photos show a laughing man with his dogs, family and alumni. A dark, black-framed memorial look would fight those photos. The brainstorm rejected it for that reason, and rejected the dark navy AI mockups.

Paper ground, ink, a large serif, prints with captions, the railway and amber on the title only are pinned by the frozen spec (Constraints) and the brainstorm. A warm paper ground with a serif is also the most common AI default for family subjects (`visual-slop.md`, `cream-palette`). Because the ground is pinned, the page has to earn its specificity elsewhere: the two-language station boards, real captions in the mounts, the memory book, and the 1955 train in the intro.

## Direction contract

The contract of lab direction A, proposed. Round 1 now has three directions with different looks (`ux.md`, Lab), and A gained oxblood station plates (#6E2A22, 8.8:1 on paper), drawn photo corners, Literata italic captions and a sticky 5 and 7 column album grid at 1280 px. If the family picks A, this file is updated with those values from the lab route; if B or C, the whole file is rewritten from that route and the spec's paper pin is amended first.

- **THESIS.** His life is a train journey between two homelands, and the people he taught write in one shared memory book. The page refuses the category default: a centred portrait in an oval, candles, doves, script type, and guestbook cards in a grid.
- **OWN-WORLD.** Warm paper and dark ink, Literata for every word of story and memory, Be Vietnam Pro only on station boards, years and controls. Flat ink station boards with a Vietnamese line over a German line. Photos mounted as prints with a caption inside the mount. One amber-ink line, the title. The memory wall, "Lưu bút" / "Gästebuch", is one long page of a book, entries ruled by hairlines, no boxes.
- **STORY.** The visitor recognises his face and name first, understands that his life ran from Hà Nam through the GDR to Germany, sees the people and places in photos, then writes into the book and sees the entry there at once.
- **FIRST VIEWPORT.** Phone: the language switch top right; his portrait print centred at about 240 px wide; his name at 40 px; 1942–2026; the title in amber-ink; two lines of intro; the three jump links, the third of which opens the book. Wide: portrait print 360 px on the left, the same column of text on the right, top-aligned. Memory test: "his photo on paper like an album, and a line that said where he went in 1955".
- **FORM.** Candidates 1 (the family photo album) and 2 (the condolence book that Vietnamese and German funerals both keep), joined.
- **FINISH.** Reviewed by the design-reviewer, chosen by the family, and this file rewritten from the chosen lab option's actual values.

## Colors

All ratios were measured on 2026-11-18 with the WCAG 2.x formula in a short Python script.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| paper | #F5EFE3 | Page background | |
| paper-raised | #FFFCF6 | Print frames, the pinned tribute, the open form | |
| field | #FFFFFF | Inside inputs | |
| hidden-surface | #EDE6D8 | A hidden post on the admin page | |
| ink | #2A2522 | Body text, headings, primary button, sign plates | 13.2:1 on paper, 14.8:1 on paper-raised, 12.2:1 on hidden-surface |
| ink-muted | #5E554C | Captions, meta, hints, the rail | 6.4:1 on paper, 7.1:1 on paper-raised, 5.9:1 on hidden-surface |
| amber-ink | #8F5300 | The title only | 5.4:1 on paper |
| edge | #7A6F64 | Borders of inputs, buttons, admin rows, rail sleepers | 4.3:1 on paper, 4.9:1 on field, 4.0:1 on hidden-surface (UI edges need 3:1) |
| hairline | #D8CFC1 | Decorative edges and rules | Decoration only |
| error | #A3261B | Error text and icon | 6.4:1 on paper, 7.4:1 on field |
| success | #2F6B3A | Success text and icon | 5.6:1 on paper |
| on-ink | #F5EFE3 | Text on ink and on the viewer | 13.2:1 on ink, 16.4:1 on viewer-backdrop |
| on-ink-muted | #C9BFB2 | Captions in the viewer, disabled viewer controls | 10.4:1 on viewer-backdrop |

Disabled controls keep readable text (AC-6 covers all text): on paper, ink-muted text on a hidden-surface fill, 5.9:1; in the viewer, on-ink-muted text with no border, 10.4:1. Opacity is never used to dim text.

Rules:

- **Amber is for the title alone.** A bright amber fails 4.5:1 on paper, and AC-6 asks 4.5:1 for all text. The amber that passes reads as a dark bronze-amber. The family sees the real swatch before approving.
- **edge and hairline never colour text.** edge is under 4.5:1 on paper. It is for borders, rail sleepers and icons beside words only.
- **No colour carries meaning alone.** Errors have an icon and words. A hidden post on the admin page has the word "Đã ẩn" / "Ausgeblendet" and a different surface.
- **No raw hex in components.** Components read these tokens as CSS custom properties (`--color-paper` and so on).
- Text selection uses ink on hidden-surface. The caret is ink.

## Typography

Two families, both free under the SIL Open Font License, both on Google Fonts, both self-hosted through `next/font`, so no browser request goes to Google.

- **Literata** (variable, roman only; the italic file was checked but is not used) for names, headings, body, captions and posts. It is a book face drawn for long reading on screens, with a large x-height that stays legible at 20 px.
- **Be Vietnam Pro** for station boards, years, labels, buttons and meta lines. Vietnamese designers drew it, and its plain shapes suit railway station boards.

Glyph coverage was measured on 2026-11-18 with fontTools on the Google Fonts files `Literata[opsz,wght].ttf`, `Literata-Italic[opsz,wght].ttf`, `BeVietnamPro-Regular.ttf`, `-Medium.ttf` and `-SemiBold.ttf`. Each has all 134 Vietnamese letters (every vowel with every tone mark in both cases, plus đ and Đ), ä ö ü Ä Ö Ü ß ẞ, the quotes „ “ ” ‚ ‘ ’ « », the en dash and the ellipsis. None is missing. The `next/font` call must load the subsets `latin`, `latin-ext` and `vietnamese`, or the Vietnamese letters fall back to a system font and AC-5 fails.

Scale. Phone values apply from 0 px. The wide values apply from `breakpoint-wide` (900 px).

| Token | Use | Phone | Wide |
|---|---|---|---|
| display-name | His name in the header | 40 px Literata 600 | 60 px |
| title | "Một ánh Dương còn mãi" on the Vietnamese page, "Ein Sonnenstrahl, der bleibt" on the German page (draft), amber-ink | 30 px Literata 500, roman | 40 px |
| years | 1942–2026 under the name | 22 px Be Vietnam Pro 500, tabular | 26 px |
| heading-section | Section headings | 32 px Literata 600 | 42 px |
| sign-primary | Vietnamese line of a station board | 24 px Be Vietnam Pro 600 | 28 px |
| sign-secondary | German line of a station board | 22 px Be Vietnam Pro 400 | 24 px |
| sign-years | Years above a station board | 20 px Be Vietnam Pro 500, tabular | 20 px |
| heading-post | Name on a wall post, video titles | 22 px Literata 600 | 24 px |
| body-lg | The two-line intro | 22 px Literata | 24 px |
| body | Paragraphs, messages, input text | 20 px Literata, line height 1.65 | 20 px |
| caption | Print captions | 18 px Literata | 18 px |
| label, label-strong | Buttons, form labels, language switch, nav links | 18 px Be Vietnam Pro 500 or 600 | 18 px |
| meta | Post meta, credits, hints, counters, privacy note, errors | 18 px Be Vietnam Pro 400 | 18 px |

Rules:

- **18 px is the floor for every word on the page,** including credits, counters, hints and errors. AC-6 asks 18 px for body text, and this audience has to read all of it.
- **No all caps anywhere.** Vietnamese stacked marks (Ầ, Ẫ, Ộ) collide above capitals, and all caps is harder to read.
- Line height is at least 1.15 on display lines and 1.3 on other headings, so stacked marks never touch the line above. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`.
- Body measure is `measure` (40 rem, about 65 characters of Literata at 20 px).
- Years and dates use tabular figures. Dates are written 20.11.2026 in both languages.
- Quotes follow the language: “…” in Vietnamese, „…“ in German. The ellipsis is one character.
- `font-display: swap` with the metric-matched fallback `next/font` generates, so header text never waits for a font file (AC-26).

## Layout

- One column, centred. Text sits in `measure`. Photo grids, the pair of films and the admin list may widen to `wide` (65 rem).
- Page side padding is `page-x` on phones and `page-x-wide` from 900 px.
- Space above a section heading: `spacing.8` on phones, `spacing.9` from 900 px. Between blocks inside a section, `spacing.5`. More space above a heading than below it.
- The timeline reserves a left gutter for the railway: `rail-gutter` on phones, `rail-gutter-wide` from 900 px. Station content sits right of it.
- Nothing scrolls sideways at 320, 375 or 1280 px. User text wraps with `overflow-wrap: anywhere`.
- Targets: `target-min` (48 px) for every control, `target-primary` (56 px) for the main buttons (open the form, send, viewer controls). At least 8 px between targets.
- One breakpoint, `breakpoint-wide` at 900 px.

## Motion

The tokens are in the front matter. Every motion answers something the reader did, except the station marker fill, which answers the reader's own scroll. Nothing moves on page load, nothing hides content at rest, and nothing blocks a control while it moves.

| Motion | What it says | Spec | Reduced motion |
|---|---|---|---|
| Station marker fills | "You have reached this station" | Marker fill from paper to ink over `marker` with `colour` easing when the board crosses the middle of the screen; stays filled; scrolling back up does not unfill | Fill changes at once, no transition |
| Viewer opens | The photo came from that print | Backdrop opacity 0 to 1 and photo `scale(0.97)` to 1 with opacity, over `overlay` with `out` | Opacity only, `quick` |
| Viewer closes | Back to the page | Opacity to 0 over `exit` with `out`, no scale | Opacity only, `quick` |
| Next or previous photo | | None. Keyboard-initiated and repeated, so the photo swaps at once. A touch swipe follows the finger 1:1 and settles over `exit` with `out` | Swipe still follows the finger; no settle movement |
| New post arrives | Your entry is in the book | The new entry fades in and rises 8 px over `arrive` with `enter`; it keeps a hidden-surface tint and a "Vừa đăng" / "Gerade eingetragen" label until reload | Opacity only, `arrive`; tint and label stay |
| Form opens | | None. The form appears in place and focus moves to Name | None |
| Language switch | | Page text swaps at once (a crossfade would dim every line). The pressed option's fill changes over `quick` | Fill changes at once |
| Button press | The press registered | `scale(0.98)` over `press` with `out`, pointer and touch only | Colour change only |
| Hover | | Border and text colour over `quick` with `colour`, only under `(hover: hover) and (pointer: fine)` | Same |
| Admin hide or show | The row changed state | Row surface colour over `quick` | At once |
| Jump links | Where you went | `scroll-behavior: smooth` | Instant jump |

Animated properties are only `opacity`, `transform` and `background-color`. No `transition: all`. No bounce, no stagger, no scroll-linked movement.

## Elevation and depth

Prints are the only raised things. A print has a soft offset shadow, `0 1px 2px` plus `0 8px 18px -8px`, both in ink at low opacity (12% and 28%). Nothing else has a shadow: not posts, not the form, not buttons. Posts are separated by space and a hairline rule, like letters in a folder, not boxed as cards.

## Shapes

- Prints: `rounded.print` (2 px), like photo paper.
- Controls and station boards: `rounded.control` (6 px).
- The language switch pill and the station markers: `rounded.full`.

## Components

**Print.** A photo mounted on `paper-raised` with the `print` padding, a 1 px hairline edge and the print shadow. On the timeline, the caption sits inside the frame under the photo in `caption`, ink-muted, and a press photo adds a credit line in `meta`, always visible on the page ("Ảnh: TTXVN/VietnamPlus" / "Foto: TTXVN/VietnamPlus"). Visitor photos on posts are small prints with no caption, because the form asks for none. The header portrait is a print with no caption and is not a button. Every other print's photo area is one button that opens the viewer, named by its caption, or on posts by "Ảnh {i} của {name}" / "Foto {i} von {name}". Prints are never tilted.

**Station board.** A flat ink plate (no bevel, no faked enamel or metal) with `on-ink` text and two lines: the Vietnamese name in `sign-primary` with `lang="vi"`, a hairline rule, the German name in `sign-secondary` with `lang="de"`. The order never changes with the page language, so the sign reads the same for everyone, like a real two-language sign. The years sit above the sign in `sign-years`, ink-muted.

**Rail.** One inline SVG in the left gutter, drawn as linework, decorative and hidden from assistive technology: two 2 px rails in ink-muted with sleepers in edge every 14 px (not a CSS stripe gradient). Each station has a marker on the rail, a 22 px circle with a 4 px ink ring, level with its board. A marker is hollow (paper fill) until the reader has reached that station, then filled ink (see Motion). The last station has a double ring, so the end of the line reads without colour.

**Buttons.** Primary: ink fill, on-ink label-strong, 56 px high. Secondary: paper fill, 2 px edge border, ink label, 48 px high. Every button has a text label; an icon may sit beside it, never alone. Hover turns the border ink. Disabled: hidden-surface fill, ink-muted label, edge border dashed, `aria-disabled`, never lowered opacity (5.9:1 measured). Busy keeps its width and changes its label ("Đang đăng…").

**Focus.** Every focusable element shows a 3 px ink outline at 3 px offset on paper surfaces, and a 3 px on-ink outline on the viewer and on ink plates. Only on `:focus-visible`. Never removed.

**Language switch.** Two options in a pill with a 2 px edge border, "Tiếng Việt" and "Deutsch", each written in its own language with its own `lang`. The current one is filled ink with on-ink text and has `aria-pressed="true"`. No flags.

**Inputs.** `field` fill, 2 px edge border, `rounded.control`, 56 px high, text in `body`. Label above in `label`, hint under the label in `meta` ink-muted, error under the field in `meta` error with an icon. An invalid field also gets a 2 px error border. The relationship is a group of five 48 px radio rows, not a select.

**Video facade.** An ink plate in a 16:9 frame with the video title in `heading-post` on-ink, a 72 px round play button and the line "Phát từ YouTube" / "Wird von YouTube abgespielt" in `meta`. Pressing it swaps in the YouTube player (youtube-nocookie.com) in the same frame.

**Viewer.** Full screen on `viewer-backdrop`. The photo is fitted whole, never cropped. Caption in `caption` on-ink-muted, credit in `meta` on-ink. Controls in label-strong with icons: "Đóng", "Ảnh trước", "Ảnh sau", and a counter "Ảnh 3 / 8".

**Memory book and entry.** The wall is one continuous `paper-raised` page with a hairline edge, like an open book; entries are not separate boxes. Each entry: name in `heading-post`, a meta line in `meta` ink-muted (relationship, class, year, date), the message in `body` with the visitor's line breaks kept, then its photos as small prints. Entries are separated by a hairline rule and `spacing.6`. The tribute is the first entry, with no extra badge. A just-posted entry carries a hidden-surface tint and the label "Vừa gửi" / "Gerade eingetragen" until reload.

**Icons.** Lucide, 2 px stroke, 24 px beside 18 px labels, always next to words.

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

- **Vietnamese.** He is "thầy" throughout. Readers are addressed as little as possible. Where an address is needed the text uses "bạn" (the human's choice, 2026-11-18), kept respectful with "xin" in every request and no casual phrasing. Unconfirmed memories are written "thầy kể…".
- **German.** He is "Lê Đức Dương" or "er". Readers are addressed as "Sie". Unconfirmed memories are written "er erzählte…". A German speaker checks every German string before launch.
- Errors say what happened and what to do, and do not apologise. Buttons name their action, and the result uses the same verb ("Đăng" leads to "Đã đăng", "Veröffentlichen" to "veröffentlicht").
- Site text never states his exact role in the German section as fact.

## Tailwind mapping

The app is scaffolded with Tailwind CSS (v4) and its own component library on top (the human, 2026-11-18). The tokens map one to one onto Tailwind theme variables in the global stylesheet's `@theme` block, so utilities carry the token names and no raw values:

- Colours: `--color-paper`, `--color-paper-raised`, `--color-field`, `--color-hidden-surface`, `--color-ink`, `--color-ink-muted`, `--color-amber-ink`, `--color-edge`, `--color-hairline`, `--color-error`, `--color-success`, `--color-viewer-backdrop`, `--color-on-ink`, `--color-on-ink-muted` (gives `bg-paper`, `text-ink`, `border-edge` and so on).
- Fonts: `--font-serif` is Literata and `--font-sans` is Be Vietnam Pro, both from the `next/font` CSS variables.
- Type: one `--text-<token>` per typography token with its `--line-height` and `--font-weight` companions (for example `--text-body: 20px`, `--text-body--line-height: 1.65`); the `-wide` sizes apply at the `wide` breakpoint.
- Breakpoint: `--breakpoint-wide: 900px`; the default Tailwind breakpoints are cleared so only this one exists.
- Radius: `--radius-print`, `--radius-control`. Shadow: `--shadow-print`. Spacing: keep Tailwind's 4 px base. Steps 1 to 4 of this scale are Tailwind's `1` to `4`; steps 5 to 9 (24, 32, 48, 64, 96 px) are Tailwind's `6`, `8`, `12`, `16` and `24`, and components use only those numbers. The named steps are variables: `--spacing-page-x`, `--spacing-rail-gutter`, `--container-measure`, `--container-wide`.
- Motion: `--ease-out`, `--ease-in-out`, `--ease-enter` and `--duration-*` custom properties for the durations above.

The components of the app's library (Print, StationBoard, Button, Input, RadioRows, PhotoViewer and the rest in `EXPERIENCE.md`) read only these utilities.

## Do's and don'ts

- Do keep amber on the title only, in either language.
- Do show a caption under every timeline print, and a credit under every press photo, on the page itself.
- Do give every control a text label and at least 48 px of height.
- Don't use clock or autumn-leaf motifs, black mourning frames, or the dark navy look of the AI mockups.
- Don't animate anything the reader did not start. No scroll reveals, no parallax, no autoplay.
- Don't use all caps, eyebrow labels above headings, or text under 18 px. Data that arrives in capitals (a video title) is shown as given.
- Don't set display text in italic. The title is roman.
- Don't fake materials: no bevels, embossing, paper textures or tape on prints.
- Don't wrap posts or sections in shadowed cards. Only prints are raised.
- Don't use flags for languages.

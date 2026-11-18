---
item: 001-memorial-website
spec: .factory/work/001-memorial-website/spec.md
design_md: .factory/work/001-memorial-website/design/DESIGN.md (proposed, drafted from direction A; moves to DESIGN.md at the repo root after the gate)
lab_routes: [proposed, see ux.md Lab]
status: proposed
revised: 2026-11-18, against the newer ux references (art direction, motion, UI copy, worst-case data, operate screens)
---
# Experience: the memorial page, its memory book and the admin page

## Brief

- **Job and audience.** His students, colleagues and friends, mostly aged 60 to 75, in Vietnam and Germany, open a link someone sent them, often on a phone, around the funeral on 27.11.2026. They want to see him, read his story, and write something to him and about him. A few family members use a private admin page to hide entries.
- **Outcome and proof.** A reader finds his face and name at once, follows his life station by station in their language, opens any photo full screen, and writes into the memory book without an account. Proof is AC-1 to AC-26.
- **Direction.** Pinned by the frozen spec Constraints and the brainstorm: paper, ink, a large serif, photos as prints with captions, the life as a railway line with two-language station boards, amber on the title only. Inside that pin, three lab directions (A album and memory book, B timetable, C lesson book) are proposed in `ux.md`, Lab. This file is written for A, the recommendation. B and C change the whole look (ground, palette, faces, layout, photos, rail) but not behaviour, states or copy.
- **Modes.** The public page is a story page (Persuade): header, film, timeline. The memory book form and the admin page are working screens (Operate): plain words, standard controls, no story motion.
- **Scope and anti-goals.** One public page plus the admin page. No accounts, likes, replies, filters, gallery, CMS or QR code. No motion on load, no clock or leaf motifs, no dark mourning look, no faked paper textures.
- **Constraints.** Next.js, live by 26.11.2026, so the simplest design that meets the spec wins every tie. Prelaunch. Two languages everywhere. Every word at 18 px or more and 4.5:1 or more.

## Foundation

Platform: web (Next.js), phones first. Library: none yet. Repo UI skills: none (`.claude/` holds settings only). Source of truth for tokens: `DESIGN.md` (proposed, written by this lens). Themes: light only.

### Reused

Nothing. The repo has no application code, no tokens, no components and no lab routes (measured: `config.paths.lab_routes` is empty; the repo holds `documents/`, `images/`, `videos/`, `CLAUDE.md` and `.factory/`).

### Rules that apply

- Write unconfirmed memories as his account ("thầy kể…" / "er erzählte…"); never state his exact role in the German section as fact (`CLAUDE.md`, AC-11).
- Every press photo needs permission and a visible credit; no uncaptioned search-result photos as historical photos of him (`CLAUDE.md`, AC-23).
- Every font renders all Vietnamese and German characters; body text is large (`CLAUDE.md`, AC-5, AC-6).
- Never ask visitors for an email, phone number or other private contact (spec Constraints).
- No Delete on the admin page, only Hide and Show again (spec Constraints).

### Gaps

Everything is new, because no system exists.

| Gap | Proposal | New? |
|---|---|---|
| Tokens (colour, type, spacing, radius, shadow, motion) | `DESIGN.md` front matter, as CSS custom properties in the app's global stylesheet | new |
| Fonts | Literata (roman) and Be Vietnam Pro through `next/font/google`, self-hosted at build, subsets latin, latin-ext, vietnamese | new |
| Icons | `lucide-react` (ISC licence) | new dependency, architecture to confirm |
| Components | Listed under Component patterns | new |

## Fact sheet

What the copy may say, word for word from the sources. Nothing outside this list is stated as fact; gaps are open questions.

| Field | Fact | Source |
|---|---|---|
| What it is | A memorial page for thầy Lê Đức Dương (01.05.1942 to 11.11.2026), a German teacher at the Foreign Language University in Thanh Xuân, Hà Nội, from 1970 to 1988 | `CLAUDE.md` |
| Odd true details | 1955: 150 children leave from Hàng Cỏ station; Käthe-Kollwitz-Heim, Moritzburg; trained as a fitter in Radebeul and Dresden; Diplom-Ingenieur from TH Magdeburg 1970; back to the GDR on 22.12.1988 | life-story PDF, timeline page 10 |
| Customer words | thầy, học trò, đồng nghiệp, Tri ân, "Tổ Bộ môn" (only in Mr. Ngạn's own words) | `Tri ân.docx`, spec |
| The film | Two 2020 episodes of the podcast «Sống chung với Corona» by Trương Hồng Quang | spec AC-7, AC-23 |
| Numbers | 5 MB per photo; name 100, message 5,000, class 50, year 50 characters; admin lockout after 5 wrong tries for 15 minutes | spec AC-13, AC-14, AC-21 |
| What the system does | An entry shows at once for everyone; the family can hide it; hidden entries are kept; nothing is translated | spec |
| A limit | Entries and photos are public; removal goes through the family by email | spec AC-15 |
| Missing | The family contact email, the station paragraphs, every photo caption, the intro lines | open (content work) |

## Information architecture

One public page, top to bottom (AC-1). A separate admin page, not linked from it (AC-18).

| Surface | Mode | Reached from | Purpose | Criteria |
|---|---|---|---|---|
| Top bar | Persuade | Page top | Language switch, right aligned | AC-3 |
| Header | Persuade | Page top | Portrait, name, 1942–2026, title, two-line intro, three jump links | AC-1, AC-2, AC-26 |
| Film | Persuade | Jump link "Phim" or scroll | Two YouTube interviews, played in the page | AC-1, AC-7, AC-26 |
| Timeline | Persuade | Jump link "Hành trình" or scroll | Railway line, one station per period: years, two-language board, paragraph, prints | AC-1, AC-8, AC-9, AC-11, AC-23, AC-26 |
| Photo viewer | Both | Tapping any print, on the timeline or in an entry | One photo full screen with caption and credit, previous and next within its group | AC-10, AC-17 |
| Memory book (Lưu bút) | Persuade (entries) | Jump link "Lưu bút" or scroll | Invitation, the "Viết lưu bút" button, the tribute as first entry, then visitor entries newest first | AC-1, AC-4, AC-12, AC-17, AC-25 |
| Memory form | Operate | "Viết lưu bút" button | Name, relationship, class, year, message, photos, privacy note, send | AC-12 to AC-16 |
| Footer | Persuade | Page end | Sources, family line and contact, language switch again, "Lên đầu trang" | AC-1, AC-3, AC-23 |
| Admin page | Operate | Typed address only (architecture names the path) | Password, then every entry with Hide or Show again | AC-18 to AC-22 |

The three jump links under the intro ("Phim", "Hành trình", "Lưu bút") are plain in-page anchors. Many visitors on funeral day come only to write, and they should not have to scroll past seven stations to find the book. There is no sticky bar: it would cover the focused field on a small phone (WCAG 2.4.11) and take room from 20 px text.

Phone, 375 px (direction A):

```
                     Tiếng Việt | Deutsch      pill, right
        ┌──────────────┐
        │   portrait   │                       print, about 240 px wide, centred
        └──────────────┘
          Lê Đức Dương                         display-name
            1942–2026                          years
      Một ánh Dương còn mãi                    title, amber-ink, roman
   1955, thầy là một trong 150 em nhỏ …        body-lg, two lines (family supplies)
  Phim   Hành trình   Lưu bút                  jump links, 48 px, wrap if needed

 Hai buổi trò chuyện năm 2020                  heading-section
 one line naming the podcast                   body
 [ facade: title, play, "Phát từ YouTube" ]
 [ facade 2 ]

 Hành trình của thầy
 ║  1955–1959                                  sign-years (a date the reader needs, not a kicker)
 ●  ┌ Moritzburg, CHDC Đức ┐                   station board, ink plate
 ║  └ Moritzburg, DDR      ┘
 ║  paragraph
 ║  [ Bác Hồ clip, poster + play ] caption
 ║  [ print, caption inside the mount ]        one column on phones, first 3
 ║  [ Xem thêm 9 ảnh ]
 ◉  last station has a double ring

 Lưu bút
 invitation, two lines
 [ Viết lưu bút ]                              primary, 56 px, full width
 ┌ one book page (paper-raised) ─────────┐
 │ Cao Hữu Ngạn, Đồng nghiệp, 18.11.2026 │     first entry, clamped, "Đọc hết bài"
 │ ───────────────────────────────────── │
 │ next entry …                          │
 └───────────────────────────────────────┘
 [ Xem thêm 20 bài ]

 Tư liệu & nguồn
 family line and contact, language switch, Lên đầu trang
```

Wide, 1280 px: the header is two columns inside `wide`, portrait print 360 px on the left, the text column on the right, both top-aligned. The two facades sit side by side. Station text keeps the `measure`; prints widen to three columns. The book stays in `measure`, so lines stay readable.

## Key flows

### F-1 Reading his life (Bà Hạnh, 72, a former student in Hà Nội, opens a Zalo link on her phone)

1. The page opens in Vietnamese. His portrait, name and years show before the films load (AC-26).
2. She taps "Hành trình" and lands on the first station, Hà Nam.
3. She scrolls. Each station has its years, its two-language board, a short paragraph, and prints with captions. As each board reaches the middle of her screen, its marker on the rail fills in.
4. At Moritzburg she presses play on the Bác Hồ clip. It plays inline and makes sound only now (AC-9).
5. **She taps a black-and-white print of the children at Käthe-Kollwitz-Heim. It opens full screen with its caption. She taps "Ảnh sau" through the other Moritzburg photos.**
6. She presses her phone's Back button. The viewer closes and she is at the same print (AC-10, U9).

Failure path: a photo fails on a weak connection. The print keeps its size and caption and shows "Ảnh này chưa tải được." with a "Thử lại" button. The viewer shows the same line. The rest of the station works.

### F-2 Writing into the book (Herr Krüger, 68, a former colleague in Dresden, on a laptop)

1. The page opens in German because his browser is German (spec Assumptions). Station boards still show both names (AC-8).
2. He clicks "Gästebuch", then "Ins Gästebuch schreiben". The form appears in place and focus moves to "Ihr Name".
3. He types his name, picks "Kollege/Kollegin", types "Deutschabteilung ĐHNN" as the class and "1978–1984" as the year, and writes four paragraphs in German.
4. He chooses 4 photos. One is a 7.2 MB scan. It is refused with its file name, its size, the 5 MB limit and a way to shrink it; the other three stay as thumbnails (AC-14).
5. He reads the privacy note beside the button (AC-15) and presses "Eintragen". The button reads "Foto 2 von 3 wird gesendet …".
6. **His entry fades into the book at the top of the visitor entries, just under Mr. Ngạn's tribute, tinted and marked "Gerade eingetragen". Focus moves to his name in it, and a status line says "Ihr Eintrag steht jetzt im Gästebuch."** The form closes and clears (AC-12).
7. A Vietnamese reader who loads the page later sees his entry in German, with "Đồng nghiệp" as its relationship (AC-4, U14).

Failure path: his Wi-Fi drops while sending. The button returns to "Eintragen". An alert above it says the entry was not saved because the device is offline, that text and photos are still there, and to press "Eintragen" again. Every field and photo is as he left it (AC-16).

Validation path: he presses "Eintragen" with no relationship chosen. Nothing is sent. The summary above the button says "Noch nicht eingetragen. 1 Angabe fehlt oder ist zu lang, der Hinweis steht beim Feld.", the relationship group shows its message, and focus moves to it. Everything he typed stays (AC-13).

### F-3 Hiding an entry (a family member, on a phone, the evening after the funeral)

1. They open the admin address and see only the family password field (AC-18, AC-21).
2. They type the password and press "Vào trang quản lý". The page title says "Quản lý lưu bút", and the line under it says "42 lưu bút, 0 đang ẩn".
3. **They press "Ẩn bài" on a spam entry. The row turns to the hidden surface, its status reads "Đang ẩn", its button reads "Hiện lại", and the count reads "42 lưu bút, 1 đang ẩn".** A status line says "Đã ẩn bài của {name}. Bấm “Hiện lại” nếu nhầm." (AC-19)
4. They hid the wrong one, and press "Hiện lại". It reads "Đang hiện" again and returns to its place by date on the wall (AC-20).

Failure path: the hide request fails. The row stays as it was, and under its button a line says "Chưa ẩn được bài này." next to a "Thử lại" button. If the 12-hour login has expired, the password field returns with "Phiên đăng nhập đã hết. Nhập lại mật khẩu để tiếp tục." and the list stays out of view.

Wrong password path: "Mật khẩu chưa đúng. Còn 3 lần thử, sau đó trang khóa 15 phút." under the field, no entries shown. After the 5th wrong try: "Đã sai 5 lần. Thử lại lúc 21:47." and the button is disabled with that line as its reason (AC-21).

## States

| Surface | Loading | Empty | Error | Partial | Success | Overflow and other |
|---|---|---|---|---|---|---|
| Header | Server-rendered text shows at once; the portrait has a fixed box in its mount while it loads | n/a | Portrait fails: the mount stays with the alt text "Lê Đức Dương"; the page works | n/a | Portrait, name, years, title, intro | German page: the German title in amber-ink with `lang="de"` (Q1, answered). Intro wraps to 3 or 4 lines on phones |
| Language switch | Instant, no spinner | n/a | Cookie blocked: the switch still works for this visit | n/a | All page text swaps at once, `<html lang>` updates, focus stays on the pressed option, form contents untouched | n/a |
| Film facades | Facade shows at once (no thumbnail fetched) | n/a | YouTube blocked or offline: the player's own error, and under the frame a link "Mở trên YouTube" / "Auf YouTube öffnen" | n/a | The player replaces the facade in the same 16:9 frame and starts | The real title "Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG" wraps under its facade, capitals as given |
| Station | Prints have fixed boxes; photos lazy-load as they come near (AC-26) | No photos: years, board and paragraph only, no empty mount (AC-8) | One photo fails: the line and "Thử lại" inside its mount; caption stays | More than 3 prints (phone) or 6 (wide): "Xem thêm {n} ảnh" | Years, board, paragraph, prints; marker filled once reached | German paragraph about 20% longer, wraps; a two-line board name wraps inside the plate |
| Bác Hồ clip | Poster frame with a 72 px play button, `preload="none"` | n/a | Fails: "Đoạn phim chưa phát được." with "Thử lại" | n/a | Plays inline with native controls after the press (AC-9) | Caption in the page's language, written as his account |
| Photo viewer | Caption shows at once, the photo when loaded; neighbours preloaded | n/a | Photo fails: the line in place, controls work | First photo: "Ảnh trước" disabled; last: "Ảnh sau" disabled; the counter says where you are | Photo, caption, credit, counter | Long caption scrolls in its own area; a 4000×200 panorama or a 1080×2400 screenshot fits whole |
| Memory book | Rendered with the page on the server, no first-load spinner | Tribute only: under it "Chưa có lưu bút nào khác. Lưu bút đầu tiên sẽ hiện ngay dưới lời tri ân của thầy Cao Hữu Ngạn." Tribute hidden too: "Chưa có lưu bút nào. Lưu bút đầu tiên sẽ hiện ở đây." | "Xem thêm" fails: "Chưa tải được các bài cũ hơn." and "Thử lại" in place | 20 visitor entries, then "Xem thêm {n} bài" (n = the next batch, up to 20); exactly 20 shows no button | Tribute, then visitor entries newest first | See Worst-case data |
| Form | n/a | Closed: the "Viết lưu bút" button only. Open: labels, hints, no errors | Field messages (AC-13), file refusals (AC-14), send failure (AC-16) | Some photos refused, the others kept | Entry inserted, form closes and clears, status line | Message counter from 4,500 characters: "4.812/5.000 ký tự" |
| Sending | Button "Đang gửi…" or "Đang gửi ảnh {i}/{n}…", disabled; fields read-only, not cleared | n/a | Offline or server error: alert, button active again, all content kept | n/a | Entry shown at once (AC-12) | 6 photos or more: "{n} ảnh có thể cần vài phút trên mạng điện thoại." |
| Admin login | "Đang kiểm tra…" on the button | n/a | Wrong password with tries left; locked with the retry time | n/a | The list | Paste and password managers work; "Hiện mật khẩu" toggle |
| Admin list | Server-rendered after login | "Chưa có lưu bút nào." inside the list frame, count "0 lưu bút, 0 đang ẩn" | Hide or Show fails: inside that row; session expired: login again | n/a | Count line, rows with status word and one button | A real zero is printed ("0 đang ẩn"); long messages clamped to 3 lines with "Đọc hết bài"; two entries with the same name are told apart by date and first line |

Offline at page load is the browser's own page. Offline after load affects only the film, "Xem thêm" and sending, each handled above. With JavaScript off, the page still reads in full (server-rendered), a print link opens the photo file, every marker stays hollow except the double-ringed last one, and the form shows "Để viết lưu bút, bạn cần bật JavaScript trong trình duyệt." / "Für einen Eintrag ins Gästebuch muss JavaScript eingeschaltet sein."

## Worst-case data

The fixture the lab uses (one dataset, real naming patterns, limits from the spec). Build may keep it as test data for the wall and admin.

### Every rendered value

| Value | Source | Limit | Optional | Rule |
|---|---|---|---|---|
| Visitor name | form | 100 characters (AC-13), counted on NFC text, trimmed | no | Wrap, never truncate; `overflow-wrap: anywhere`; only spaces counts as missing |
| Relationship | form, a code | 5 values | no | Label in the page's language (U14) |
| Class | form, free text | 50 | yes | Wrap; shown as typed, no prefix; missing parts leave no stray comma |
| Year | form, free text | 50 | yes | As typed ("1975", "1970–1988", "khoảng 1980", "75") |
| Date posted | server | n/a | no | Date only, `dd.mm.yyyy`, the viewer's time zone |
| Message | form | 5,000 (AC-13) | no | Keep the visitor's line breaks, collapse more than one blank line; clamp to 8 lines with "Đọc hết bài" when over about 600 characters; never auto-link URLs (spam is out of scope at launch, and links invite it); markup shows as literal text |
| Entry photos | form | 5 MB each, no count limit (spec) | yes | First 6 small prints, then a "Xem thêm {n} ảnh" tile that opens the viewer at photo 7; square crop in the grid, whole photo in the viewer |
| Station names, VI and DE | content files | none found (finding: add a content check) | no | Wrap inside the board |
| Station paragraph | content files | none found | no | Wrap; aim for 60 to 120 words per language |
| Caption | content files | none found | required for timeline photos | Wrap inside the mount; a missing caption fails the content check rather than showing an empty line |
| Credit | content files | none found | press photos only | Wrap |
| Video titles | spec AC-7 | fixed | no | Wrap, as given |
| Counts | server | n/a | n/a | Vietnamese has no plural; German uses singular and plural forms ("1 Eintrag", "2 Einträge", "1 Foto", "2 Fotos", "1 Versuch") |
| File size in refusals | browser | n/a | n/a | One decimal with a comma in both languages ("7,2 MB") |

### The fixture

| Case | Value in the fixture | Where it shows |
|---|---|---|
| Long name with stacked marks | "Tôn Nữ Thị Ngọc Diễm Phượng" | entry 1 |
| Long German name with hyphen and umlauts | "Hans-Joachim Schäfer-Brückner" | entry 2 |
| Short name | "Hà" | entry 3 |
| Name with the class typed into it, at the limit | "Nguyễn Thị Hồng Nhung, học trò lớp tiếng Đức khóa 1974–1976, Đại học Ngoại ngữ Hà Nội" cut to exactly 100 characters (older visitors often put the class in the name field) | entry 4 |
| Name in capitals | "TRẦN VĂN ĐỨC" | entry 5 |
| Emoji in name and message | "Lan 🌸", message ending "Vĩnh biệt thầy 🙏🌹" (common in Vietnamese condolences; emoji fall back to the system emoji font, which AC-5 does not cover) | entry 6 |
| Message of one line | "Con nhớ thầy." | entry 3 |
| Message at 5,000 characters in one paragraph | Vietnamese prose, no line breaks | entry 4 |
| Message with many line breaks and a long URL | a poem in 14 short lines, then `https://www.example.org/album/2015/moritzburg-50-jahre-treffen?foto=12` | entry 7 |
| Markup typed as text | "<b>Danke</b> &amp; auf Wiedersehen" | entry 2 |
| German message on the Vietnamese page | four paragraphs in German | entry 2 |
| Optional fields empty | no class, no year | entry 3 |
| Class at the limit | "Lớp tiếng Đức chuyên tu khóa 1974, Đại học Ngoại ngữ" (50) | entry 1 |
| Photos: 0, 1, 12, 40 | entries 3, 5, 1, 4 | |
| Panorama and tall screenshot | 4000×200 and 1080×2400 | entry 1 |
| Two entries with the same name | "Nguyễn Văn Hùng" twice, different dates | admin list |
| Tribute | `Tri ân.docx`, 3,223 characters, typos as written | first entry |
| Station board names | "Radebeul và Dresden, CHDC Đức" / "Radebeul und Dresden, DDR" | timeline |
| Station with 0 photos and with 26 | Hà Nam; Nước Đức (the alumni reunion photos) | timeline |
| Long credit | "Ảnh: Thông tấn xã Việt Nam (TTXVN)/VietnamPlus" | Moritzburg |
| Counts 0 and 1 | "0 lưu bút, 0 đang ẩn"; "1 Eintrag, davon 0 ausgeblendet" | admin |

Viewing conditions for each: 320 px, 375 px, 1280 px, 200% text, the software keyboard open on the form (the focused field stays visible; no bottom-pinned button), and German.

## Component patterns

All new. Visual specs are in `DESIGN.md`.

| Component | Where used | Behaviour rules |
|---|---|---|
| LanguageSwitch | Top bar, footer | Two `<button aria-pressed>` in a group named "Ngôn ngữ" / "Sprache". Swaps text client-side with no reload, writes the cookie, updates `<html lang>`, keeps focus (U3) |
| JumpLinks | Header | Three anchors to section ids `film`, `timeline`, `memories`; sections have `scroll-margin-top` |
| Print | Header portrait, stations, entries, admin | Timeline prints: caption and credit inside the mount, the photo is a `<button>` named by the caption. Entry prints: no caption, button named "Ảnh {i} của {name}" / "Foto {i} von {name}", and in the viewer the caption line is the writer's name and date. Portrait: no caption, not a button, `alt` is his name. Fixed box so nothing shifts; `loading="lazy"` except the portrait |
| VideoFacade | Film | `<button>` named "Phát video: {title}"; on press an `<iframe>` from youtube-nocookie.com with `autoplay=1` replaces it and takes focus |
| ClipPlayer | Moritzburg station | Native `<video controls preload="none" playsinline>` with poster and a 72 px play overlay until first play; no autoplay, no sound before the press |
| Rail, StationMarker | Timeline | One SVG, `aria-hidden`; markers fill once reached (Motion plan) |
| Station | Timeline | `<section>` with an `<h3>` holding both board lines (each with its `lang`) and the years; the extra-prints button |
| StationBoard | Station | Two lines, VI then DE, always both (AC-8) |
| PhotoViewer | Stations, entries, admin | Native `<dialog>` opened modal; focus trapped; Escape closes; arrow keys move; one history entry so Back closes it; focus returns to the print that opened it (U9) |
| MemoryBook, Entry | Memory book, admin | One `paper-raised` page; each entry an `<article>` with the name as `<h3>`, meta, message, photos; "Đọc hết bài" with `aria-expanded` |
| MemoryForm | Memory book | Opens in place (U7) with a "Đóng biểu mẫu" link that keeps what was typed; `noValidate`; every message in the page's language; no `maxlength` |
| RadioRows | Form | Fieldset "Quan hệ với thầy" with five 48 px rows; label and control share one target |
| PhotoPicker | Form | "Chọn ảnh" button over a visually hidden `<input type="file" accept="image/*" multiple>`; each accepted photo a thumbnail with "Bỏ ảnh {file}"; refusals listed under the picker by file name |
| FieldMessage, FormAlert | Form, admin | Field message under the field, tied with `aria-describedby`; alert above the send button in a `role="alert"` region |
| StatusLine | Book, admin | `role="status"` polite region |
| AdminLogin, AdminRow | Admin | Row: status word, surface change, one button; no confirm dialog, because Show again undoes Hide |

## Admin page (Operate)

- **Its one question:** "Is there an entry that should not be in the book?" The list answers it: every entry newest first, the text readable without opening anything.
- **Title row:** "Quản lý lưu bút" / "Gästebuch verwalten", his name under it as the scope, "Thoát" / "Abmelden" on the right. The count line under the title: "{n} lưu bút, {h} đang ẩn" / "{n} Einträge, davon {h} ausgeblendet".
- **Rows:** name and date on the first line, relationship, class and year on the second, then the first 3 lines of the message and small prints. Status word and the one button in a fixed trailing column on wide screens; on phones the button sits under the text, full width, 48 px. One status mark per row: the word plus the hidden surface, no coloured dot.
- **Honest states:** a real zero is printed; an error sits inside the failed row with "Thử lại"; a disabled login button says why in the line beside it.
- **No story motion.** Only the 180 ms row surface change.

## Interaction primitives

- Tap and click everywhere; nothing needs a drag, a long press or hover. In the viewer, swiping left and right on a touch screen is an extra; the buttons do the same.
- Keyboard: Tab follows the page. In the viewer, Left and Right move, Escape closes, Tab cycles inside the viewer.
- Native pinch zoom stays on, on the page and in the viewer. The viewport never sets `maximum-scale` or `user-scalable=no`.
- Phone Back closes an open viewer instead of leaving the page (U9).
- No autosave. Leaving with text in the form asks the browser's "leave page?" question. The language switch never reloads, so it never loses the form. Closing the form keeps its content until reload.
- No confirmation dialogs. Hide is undone by Show again, and the status line says so.

### Motion plan

Tokens and specs are in `DESIGN.md`, Motion. The one-line purpose of each:

- **Focal moment:** the station marker fills when its board reaches the middle of the screen. Purpose: the reader sees how far along his life they are. Colour only, no movement, never hides content, and with JavaScript off every station is still readable.
- **Continuity:** the viewer opens from the print with a short scale and fade, so the photo reads as the same one, larger. It closes faster than it opens.
- **Feedback:** a new entry fades and rises 8 px into the book and keeps its tint and "Vừa gửi" label until reload, so the writer finds it; button press scale; hover colour on pointer devices; admin row surface.
- **Deliberately still:** the page load, the language switch (a crossfade would dim every line), next and previous photo by keyboard, the form opening, "Đọc hết bài", extra prints, errors (no shake).
- **Budget:** only `opacity`, `transform` and `background-color`; nothing runs on scroll except one IntersectionObserver class toggle per station.
- **Reduced motion:** fewer and gentler. Opacity and colour stay (the viewer fade, the new-entry fade and tint, the marker fill without transition); all movement and scale go; smooth scrolling goes.

## Voice and microcopy

Voice card: `DESIGN.md`, Voice. Device budget for the story page: no two-fragment headings, no negation runs, no virtue words, no humour. The Vietnamese addresses the reader as "bạn" (the human's answer to Q3), always with "xin" in requests so it stays respectful for readers aged 60 to 75. The family confirms the Vietnamese and a German speaker checks the German. `{}` marks a value.

| Moment | Vietnamese | German | Not |
|---|---|---|---|
| Switch group | Ngôn ngữ | Sprache | flags |
| Title (AC-2, Q1 answered) | Một ánh Dương còn mãi | Ein Sonnenstrahl, der bleibt (draft, `lang="de"`, amber-ink; the German speaker checks it; alternatives in `ux.md` Q1) | the Vietnamese title on the German page |
| Jump links | Phim · Hành trình · Lưu bút (three links) | Film · Lebensweg · Gästebuch (three links) | "Khám phá" / "Entdecken" |
| Film heading | Hai buổi trò chuyện năm 2020 | Zwei Gespräche aus dem Jahr 2020 | "Trò chuyện với thầy" (says nothing the titles do not) |
| Film line | Trong podcast «Sống chung với Corona» của Trương Hồng Quang, thầy kể về cuộc đời mình. | Im Podcast «Sống chung với Corona» von Trương Hồng Quang erzählt er aus seinem Leben. | |
| Facade | Phát video: {title} (name) · Phát từ YouTube (note) | Video abspielen: {title} · Wird von YouTube abgespielt | a bare play icon |
| Timeline heading | Hành trình của thầy | Sein Lebensweg | "Dòng thời gian" / "Zeitleiste" |
| Extra prints | Xem thêm {n} ảnh · Thu gọn ảnh | {n} weitere Fotos zeigen · Weniger Fotos zeigen | "Xem tất cả" |
| Photo failed | Ảnh này chưa tải được. · Thử lại | Dieses Foto wurde nicht geladen. · Erneut versuchen | a broken-image icon |
| Clip button | Phát đoạn phim 58 giây | 58-Sekunden-Film abspielen | |
| Clip caption (sample, family to confirm) | Thầy kể về lần gặp Bác Hồ khi Bác thăm trường ở Moritzburg năm 1957. | Er erzählte von der Begegnung mit Hồ Chí Minh bei dessen Besuch in Moritzburg 1957. | a caption stating the meeting as fact |
| Viewer | Đóng · Ảnh trước · Ảnh sau · Ảnh {i}/{n} | Schließen · Voriges Foto · Nächstes Foto · Foto {i} von {n} | "✕", "‹ ›" alone |
| Credit | Ảnh: {source} | Foto: {source} | |
| Book heading | Lưu bút | Gästebuch | "Lời tưởng nhớ", "Sổ tưởng nhớ", "Erinnerungsbuch" (earlier drafts) |
| Invitation | Ai từng học, làm việc hay sống cùng thầy đều có thể viết lưu bút ở đây. Bạn không cần tài khoản. | Wer mit ihm gelernt, gearbeitet oder gelebt hat, kann sich hier ins Gästebuch eintragen. Ein Konto ist nicht nötig. | "Hãy chia sẻ kỷ niệm của bạn!" |
| Open form | Viết lưu bút | Ins Gästebuch schreiben | "Gửi" / "Absenden" |
| Close form | Đóng biểu mẫu (những gì bạn đã viết vẫn được giữ) | Formular schließen (Ihr Text bleibt erhalten) | "Hủy" / "Abbrechen", which sounds like it deletes |
| Name | Tên của bạn | Ihr Name | "Họ tên*" |
| Relationship | Quan hệ với thầy: Học trò · Đồng nghiệp · Bạn bè · Gia đình · Khác | Ihre Verbindung zu ihm: Schüler/in · Kollege/Kollegin · Freund/in · Familie · Andere | a select |
| Class | Lớp hoặc khóa (nếu có), hint "Ví dụ: lớp tiếng Đức khóa 1974" | Klasse oder Jahrgang (freiwillig), hint "Zum Beispiel: Deutschkurs 1974" | "Lớp*" |
| Year | Năm (nếu có), hint "Ví dụ: 1975 hoặc 1975–1979" | Jahr (freiwillig), hint "Zum Beispiel 1975 oder 1975–1979" | |
| Message | Lời lưu bút, hint "Bạn có thể viết bằng tiếng Việt hay tiếng Đức. Lưu bút hiện đúng như bạn viết, không dịch." | Ihr Eintrag, hint "Auf Deutsch oder Vietnamesisch. Er erscheint so, wie Sie ihn schreiben, ohne Übersetzung." | "Nội dung" / "Inhalt" |
| Photos | Ảnh (nếu có), hint "Mỗi ảnh tối đa 5 MB. Ảnh hiện công khai cùng lưu bút." · Chọn ảnh · Bỏ ảnh {file} | Fotos (freiwillig), hint "Höchstens 5 MB pro Foto. Die Fotos sind mit dem Eintrag öffentlich." · Fotos auswählen · {file} entfernen | "Upload" |
| Privacy note (AC-15) | Lưu bút và ảnh của bạn hiện công khai trên trang này. Trang lưu tên, quan hệ, lớp, năm, lời lưu bút, ảnh và ngày gửi, không lưu email hay số điện thoại. Nếu bạn muốn gỡ lưu bút, xin viết cho gia đình: {email}. | Eintrag und Fotos sind auf dieser Seite öffentlich. Gespeichert werden Name, Verbindung, Klasse, Jahr, Text, Fotos und Datum, keine E-Mail-Adresse und keine Telefonnummer. Wenn ein Eintrag entfernt werden soll, schreiben Sie der Familie: {email}. | a link to a long policy |
| Send | Gửi lưu bút | Eintragen | "Gửi" / "Absenden" |
| Sending | Đang gửi… · Đang gửi ảnh {i}/{n}… | Wird eingetragen … · Foto {i} von {n} wird gesendet … | a spinner alone |
| Many photos | {n} ảnh có thể cần vài phút trên mạng điện thoại. | {n} Fotos können über Mobilfunk einige Minuten dauern. | |
| Posted | Đã gửi lưu bút. Lưu bút của bạn hiện ngay dưới đây. · label "Vừa gửi" | Ihr Eintrag steht jetzt im Gästebuch. · label "Gerade eingetragen" | "Thành công!" / "Erfolg!" |
| Summary | Chưa gửi. Bạn cần sửa {n} mục, ghi chú ở ngay dưới từng mục. | Noch nicht eingetragen. 1 Angabe fehlt oder ist zu lang, der Hinweis steht beim Feld. / {n} Angaben fehlen oder sind zu lang, die Hinweise stehen bei den Feldern. | "Có lỗi xảy ra" |
| Name missing | Xin bạn ghi tên để mọi người biết ai viết. | Bitte geben Sie Ihren Namen an, damit man weiß, wer schreibt. | "Trường bắt buộc" / "Pflichtfeld" |
| Relationship missing | Xin bạn chọn một mục. Nếu không mục nào đúng, xin chọn Khác. | Bitte wählen Sie eine Angabe. Wenn keine passt, wählen Sie Andere. | |
| Message missing | Xin bạn viết vài dòng trước khi gửi. | Bitte schreiben Sie ein paar Zeilen, bevor Sie eintragen. | |
| Too long (any field) | {Field} dài {count} ký tự, tối đa {limit}. Xin bạn bớt {over} ký tự. | {Field} hat {count} Zeichen, erlaubt sind {limit}. Bitte kürzen Sie um {over} Zeichen. | "Quá dài" / "Zu lang" |
| Not a photo (AC-14) | “{file}” không phải ảnh nên chưa được thêm. Chỉ nhận ảnh (JPG, PNG, HEIC…), mỗi ảnh tối đa 5 MB. | „{file}“ ist kein Foto und wurde nicht hinzugefügt. Nur Fotos (JPG, PNG, HEIC …), höchstens 5 MB pro Foto. | "Định dạng không hợp lệ" |
| Over 5 MB (AC-14) | “{file}” nặng {size} MB, quá mức 5 MB nên chưa được thêm. Các ảnh khác vẫn giữ nguyên. Cách làm nhỏ ảnh: bạn gửi ảnh qua Zalo hoặc WhatsApp cho chính mình rồi lưu bản nhận được, bản này thường nhỏ hơn 5 MB. | „{file}“ ist {size} MB groß, erlaubt sind 5 MB. Es wurde nicht hinzugefügt, die anderen Fotos bleiben. So wird es kleiner: Schicken Sie es sich selbst per WhatsApp und speichern Sie die empfangene Kopie, sie ist meist kleiner als 5 MB. | "File too large" |
| Offline (AC-16) | Chưa gửi được vì máy của bạn đang không có mạng. Lời lưu bút và ảnh vẫn còn nguyên ở đây. Khi có mạng, xin bạn bấm “Gửi lưu bút” lần nữa. | Nicht eingetragen, weil das Gerät keine Internetverbindung hat. Text und Fotos sind noch da. Sobald die Verbindung steht, tippen Sie bitte erneut auf „Eintragen“. | "Network error" |
| Server error (AC-16) | Chưa gửi được vì trang đang gặp lỗi. Lời lưu bút và ảnh của bạn vẫn còn nguyên ở đây. Xin bạn bấm “Gửi lưu bút” lại sau vài phút. Nếu vẫn không được, xin báo gia đình: {email}. | Nicht eingetragen, weil die Seite einen Fehler hat. Text und Fotos sind noch da. Bitte tippen Sie in ein paar Minuten erneut auf „Eintragen“. Wenn es dann nicht klappt, schreiben Sie der Familie: {email}. | "Lỗi 500" |
| Empty book | Chưa có lưu bút nào khác. Lưu bút đầu tiên sẽ hiện ngay dưới lời tri ân của thầy Cao Hữu Ngạn. | Noch keine weiteren Einträge. Der erste erscheint direkt unter der Würdigung von Cao Hữu Ngạn. | "Hãy là người đầu tiên!" |
| Entry meta | {Học trò}, {class}, {year} · Gửi ngày {dd.mm.yyyy} (two lines) | {Schüler/in}, {class}, {year} · Eingetragen am {dd.mm.yyyy} | "lớp {class}" prefix |
| Read more | Đọc hết bài · Thu gọn bài | Ganzen Eintrag lesen · Eintrag einklappen | "Xem thêm…" |
| More entries | Xem thêm {n} bài · Đang tải… · Chưa tải được các bài cũ hơn. Thử lại | {n} weitere Einträge zeigen · Wird geladen … · Ältere Einträge wurden nicht geladen. Erneut versuchen | infinite scroll |
| Footer | Tư liệu & nguồn · Trang do gia đình thầy Lê Đức Dương lập năm 2026. Liên hệ: {email} · Lên đầu trang | Quellen · Eine Seite der Familie von Lê Đức Dương, 2026. Kontakt: {email} · Nach oben | "Made with love" |
| Admin | Quản lý lưu bút · Mật khẩu của gia đình · Hiện mật khẩu · Vào trang quản lý · Thoát · {n} lưu bút, {h} đang ẩn | Gästebuch verwalten · Familienpasswort · Passwort anzeigen · Anmelden · Abmelden · {n} Einträge, davon {h} ausgeblendet | "Dashboard" |
| Admin status and actions | Đang hiện · Đang ẩn · Ẩn bài · Hiện lại · Đã ẩn bài của {name}. Bấm “Hiện lại” nếu nhầm. · Đã hiện lại bài của {name}. | Sichtbar · Ausgeblendet · Ausblenden · Wieder zeigen · Eintrag von {name} ausgeblendet. „Wieder zeigen“ macht das rückgängig. · Eintrag von {name} wieder sichtbar. | "Xóa" / "Löschen" |
| Admin errors | Mật khẩu chưa đúng. Còn {r} lần thử, sau đó trang khóa 15 phút. · Đã sai 5 lần. Thử lại lúc {hh:mm}. · Chưa ẩn được bài này. Thử lại · Phiên đăng nhập đã hết. Nhập lại mật khẩu để tiếp tục. | Passwort falsch. Noch {r} Versuche, dann ist die Anmeldung 15 Minuten gesperrt. (1 Versuch) · 5 Fehlversuche. Nächster Versuch um {hh:mm}. · Nicht ausgeblendet. Erneut versuchen · Die Anmeldung ist abgelaufen. Bitte geben Sie das Passwort erneut ein. | "Unauthorized" |

Copy checks run (ui-copy.md section 7): the competitor test on the headings ("Hai buổi trò chuyện năm 2020", "Hành trình của thầy", "Lưu bút" only fit this page with its podcast and its book); sameness across the page and the admin (one verb per action: "Gửi lưu bút", "Đã gửi lưu bút", "Vừa gửi", "Ẩn bài", "Đã ẩn"); read aloud as the family (every request to the reader carries "xin", and the invitation names who may write); over-correction (no comma splices left where dashes were).

## Accessibility floor

- **Language.** `<html lang>` is the page language and changes on switch. Each station board line and the tribute carry their own `lang`; the title carries `lang="vi"` or `lang="de"` by page. Visitor entries get no `lang`, because their language is unknown.
- **Structure.** One `<h1>` (his name). `<h2>` per section. `<h3>` per station and per entry. The jump links come early in the tab order and act as skip links.
- **Keyboard path.** Language switch, jump links, facades, each station's prints and extra-prints button, the clip, "Viết lưu bút", the form fields in order, send, entries' "Đọc hết bài" and photos, "Xem thêm", footer links.
- **Focus after each action.** Switch language: stays on the pressed option. Open form: the Name field. Send with errors: the first field with a message, the summary announced. Send success: the new entry's name heading (`tabindex="-1"`), status announced. Send failure: the alert, with the send button next. Open viewer: its close button. Close viewer: the print that opened it. Extra prints: the first newly shown print. "Xem thêm": the first new entry. Hide or Show again: stays on the same button, whose label changed; the status line announces it.
- **Names.** Timeline prints by caption, entry prints by "Ảnh {i} của {name}"; the portrait is not a button. Icons are hidden; every button has text.
- **Announcements.** Polite: entry posted, hidden, shown again, "{n} ảnh đã được thêm", photos refused. Assertive alert: send failed. The send progress is the button label, not announced per photo.
- **Targets.** 48 px minimum, 56 px for primary buttons and viewer controls, 8 px apart.
- **Forms.** Visible labels, hints tied by `aria-describedby`, `aria-invalid` on fields with a message, `autocomplete="name"` on Name and `off` on the others, paste always allowed, lengths counted on NFC text the same way as the server, no `maxlength` (a pasted 6,000 characters must stay and be marked), `noValidate` so the browser never shows messages in another language.
- **Viewer.** Modal `<dialog>`, focus trapped, Escape closes, arrows move, Back closes, caption and credit read with the photo, counter in text.
- **Media.** The YouTube player brings its own captions. The Bác Hồ clip has a written caption (see CONCERNS in `ux.md` on speech).
- **Reflow.** Works at 320 px and at 200% text: one column, boards wrap inside their plate, buttons grow in height, the viewer caption scrolls. With the software keyboard open, the focused field stays visible.
- **Reduced motion.** Fewer and gentler, as in the Motion plan.
- **Zoom.** Never disabled.

## Responsive and platform

- Phones first. One breakpoint at 900 px.
- Under 900 px: header centred and stacked; films stacked; prints in one column, first 3 shown; rail gutter 44 px; viewer controls in a bottom bar ("Ảnh trước", counter, "Ảnh sau") and "Đóng" top right.
- From 900 px: header in two columns; films side by side; prints in three columns, first 6 shown; rail gutter 80 px; viewer previous and next as tall buttons at the left and right edges, "Đóng" top right, caption under the photo.
- Safe areas: the viewer's bars respect `env(safe-area-inset-*)`.
- iPhone photos: `accept="image/*"` lets iOS hand over JPEG copies of HEIC photos in most cases. Desktop users can still pick "All files", so the page checks type and size itself before upload.

## Lab

Directions and states to build are in `ux.md`, Lab. Summary:

| Option | Route | What it tries | Trade-offs | Recommended |
|---|---|---|---|---|
| Direction A, the family album | `/lab/memorial/direction?d=a` | Paper, ink and oxblood plates, prints with photo corners, a sticky album grid on wide screens, Literata and Be Vietnam Pro | Closest to the brainstorm and safest to read; the warm paper ground is a common default | Yes |
| Direction B, the night train | `/lab/memorial/direction?d=b` | Near-black ground, archive photos edge to edge, white enamel station signs, Archivo Narrow and Spectral | The boldest; near the dark-mournful rut and a glare risk for older eyes; breaks the spec's paper pin | No |
| Direction C, Hà Nội daylight | `/lab/memorial/direction?d=c` | White ground, a broad ochre rail band, colour photos at full size, Bricolage Grotesque and Lexend | Bright and modern; risks a cheerful template look; breaks the spec's serif pin | No |
| Wall A | `/lab/memorial/book?option=a` | Form always open above the tribute | One tap fewer; a screen and a half of form before any memory | No |
| Wall B | `/lab/memorial/book?option=b` | Form behind "Viết lưu bút", opens in place | Memories read first, the form is one tap away | Yes |

The timeline layout options of the first pass (rail left at every width against a centred alternating rail on desktop) are dropped. The alternating zigzag is the category's template, and the directions now carry the real choice.

## Decisions

### U1 Visual system drafted from direction A, inside the spec's pins (revised)
Paper, ink, Literata and Be Vietnam Pro, prints, station boards, amber-ink on the title only, with the wall as a memory book. Changed in this pass: the title is roman, not italic (`visual-slop.md`, `italic-serif-display`); the rail is SVG linework, not a stripe gradient (`repeating-stripes-gradient`); the boards are flat, not faked enamel; `DESIGN.md` carries a direction contract and is rewritten from the chosen lab route. Criteria AC-2, AC-5, AC-6, AC-8.

### U2 18 px floor for all text, 20 px body
Unchanged. Criteria AC-6.

### U3 Language switch without reload, cookie-backed
Unchanged. Criteria AC-3.

### U4 Station boards always bilingual, Vietnamese line first
Unchanged. Criteria AC-8.

### U5 Captions on every timeline print, credits always visible
Unchanged. Criteria AC-8, AC-10, AC-23.

### U6 Extra prints behind an inline expand
Unchanged. Criteria AC-8, AC-26.

### U7 Form behind a button above the tribute (Wall B)
Unchanged. Criteria AC-12, AC-25.

### U8 Validation on send, in the page's language
Unchanged; messages rewritten (U16). Criteria AC-13, AC-14.

### U9 Modal viewer that phone Back closes
Unchanged; next and previous by keyboard swap without animation. Criteria AC-10, AC-17.

### U10 Film as click-to-load facades
Unchanged. Criteria AC-7, AC-26.

### U11 20 entries, then "Xem thêm", long entries clamped
Unchanged. Criteria AC-1, AC-17, AC-23.

### U12 Admin list with status words, Hide and Show again, no confirm
Revised: built to the operate-screens rules (one question, count line with real zeros, errors inside the row, no story motion). Criteria AC-18 to AC-21.

### U13 Three jump links, no sticky bar
Unchanged. Criteria AC-1.

### U14 Relationship label in the page's language
Unchanged. Criteria AC-4, AC-17, AC-25.

### U15 The memory wall is named "Lưu bút" / "Gästebuch" and drawn as one book (revised)
"Lưu bút" / "Gästebuch", one continuous page, "Viết lưu bút" and "Gửi lưu bút" / "Ins Gästebuch schreiben" and "Eintragen" (the human's answer, 2026-11-18). Lưu bút is the book Vietnamese students write in for classmates and teachers at the end of their school years, so his former students know at once what to do. Gästebuch is the word older German readers know for a book or page they sign with a short entry, and "sich ins Gästebuch eintragen" is its everyday verb. The German speaker may prefer "Kondolenzbuch"; it fits the funeral but not the weeks after. Criteria AC-12, AC-17, AC-25.

### U16 Copy rewritten to the ui-copy rules (new)
Every error names the field, the limit and the fix; refusals keep the other photos and give a way to shrink a photo; the server error gives the family contact; one verb per action through the flow. Criteria AC-13, AC-14, AC-15, AC-16.

### U17 Motion plan: one colour-only focal moment and short feedback (new)
Station markers fill as reached; viewer open and close; a new entry fades in and stays marked; nothing on load; reduced motion keeps opacity and colour only. Criteria AC-8, AC-10, AC-12.

### U18 Worst-case rules per field (new)
Names wrap and never truncate, messages keep line breaks and clamp at 8 lines, URLs are not linked, markup is literal, German plural forms, file sizes with a decimal comma. Criteria AC-5, AC-13, AC-17.

### U19 The German page has its own title (new)
"Ein Sonnenstrahl, der bleibt" in amber-ink on the German page, "Một ánh Dương còn mãi" on the Vietnamese page (the human's answer to Q1, 2026-11-18). Draft for the German speaker's check. Criteria AC-2, AC-3.

## Open questions

See `ux.md` Questions. Each has a recommended answer and the cost if wrong.

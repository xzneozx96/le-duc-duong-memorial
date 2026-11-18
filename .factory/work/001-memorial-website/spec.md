# 001: A one-page memorial website for thầy Lê Đức Dương, with a memory wall

<!-- sf:frozen intent -->
## Intent

**In our words.** The family wants a one-page memorial site for thầy Lê Đức Dương, live by his funeral on 27.11.2026, in Vietnamese and German. It tells his life as a railway journey of photos and short texts, plays two filmed interviews with him, and lets his students, colleagues and friends in both countries leave a memory with photos, with no account. The family can hide any post from a private admin page. It gives people scattered across two countries one place to remember him together.

**Problem.** His students, colleagues and friends live in Vietnam and Germany and are mostly in their 60s and 70s. Today there is no single place where they can see his life story and photos, or share their own memories of him.

**Outcome.** Anyone with the link can read his life story in Vietnamese or German, look at his photos full screen, watch the interviews, and post a memory that shows on the wall at once. The family can take down any post that should not be there.

**Users.** Visitors (his students, colleagues, friends and family, reading on phones and computers), and the family (who hide posts on the admin page).
<!-- /sf:frozen -->

## Acceptance criteria

<!-- sf:frozen criteria -->
- **AC-1** The page shows, from top to bottom, the header, the film, the timeline, the memory wall with its form, and the footer, at 375 px and at 1280 px wide, with no sideways scrolling. (test: 001-AC1)
- **AC-2** The header shows his portrait, his name, the years 1942–2026, the title "Một ánh Dương còn mãi" in the amber accent, and a two-line intro below it. (test: 001-AC2)
- **AC-3** When a visitor uses the language switch, every piece of page text (headings, intro, timeline paragraphs, captions, form labels, buttons, messages and footer) changes between Vietnamese and German, and the choice stays when the page is reloaded. (test: 001-AC3)
- **AC-4** Memory wall posts always show in the language they were written in, whichever language the page is set to. (test: 001-AC4)
- **AC-5** Every Vietnamese diacritic (for example ằ, ẫ, ệ, ộ, ữ, ợ, Đ) and every German character (ä, ö, ü, Ä, Ö, Ü, ß) renders in the page's own fonts, with no fallback glyphs, in the header, timeline, wall and form. (test: 001-AC5)
- **AC-6** Body text is at least 18 CSS px on a 375 px wide phone, and all text has a contrast ratio of at least 4.5:1 against its background. (test: 001-AC6)
- **AC-7** The film section shows two videos with their titles, "Talk with the former “Moritzburger” Lê Đức Dương" (https://youtu.be/otEfBuw2AoE) and "Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG" (https://youtu.be/K4gtri_cHB8), and each plays from YouTube inside the page, without leaving it. (test: 001-AC7)
- **AC-8** The timeline shows his life as a railway line, one station per period, each station showing its Vietnamese and German name together, like a two-language railway sign, whatever language the page is set to, with its years, a short paragraph and the photos of that period. (test: 001-AC8)
- **AC-9** The 1955–1959 Moritzburg station shows the 58-second clip of his meeting with Bác Hồ with a caption in the page's language, and it plays inside the page only when the visitor presses play. (test: 001-AC9)
- **AC-10** When a visitor taps a timeline photo, it opens full screen with its caption, and with its credit when it is a press photo. The visitor can move to the previous or next photo of the same period, and close the viewer to return to the same place on the page. On a computer, the arrow keys move and Escape closes. (test: 001-AC10)
- **AC-11** Timeline text that comes from his own recollection with no independent source is written as his account ("thầy kể…" / "er erzählte…"), and no text states his exact role in the German section as fact. (test: 001-AC11)
- **AC-12** When a visitor with no account submits the form with a name, a relationship (học trò, đồng nghiệp, bạn bè, gia đình or khác), a message, an optional class, an optional year and any number of photos, the post appears at the top of the visitor posts, just below the tribute, at once, without reloading, and shows on the wall for every other visitor who loads the page afterwards. (test: 001-AC12)
- **AC-13** If the name, the relationship or the message is missing, or a field is longer than its limit (name 100 characters, message 5,000, class 50, year 50), then the form is not sent, that field is marked with a message in the page's language that names the problem and any limit, and everything the visitor typed or chose stays in the form. (test: 001-AC13)
- **AC-14** If a visitor adds a file that is not a photo, or a photo larger than 5 MB, then that file is refused with a message in the page's language that names the reason and the 5 MB limit, and the rest of the form, including the other photos, stays as it was. (test: 001-AC14)
- **AC-15** The form shows a short privacy note in the page's language, next to the send button: posts and their photos are public, what is stored (name, relationship, class, year, message, photos, date), and a family contact for asking to have a post removed. (test: 001-AC15)
- **AC-16** If sending the post fails (no connection, server error), then the visitor sees a message in the page's language saying it was not posted, and their text and photos stay in the form so they can send it again. (test: 001-AC16)
- **AC-17** Each post on the wall shows the name, the relationship, the class and year when given, the date posted, the message, and its photos as small prints that open full screen when tapped. (test: 001-AC17)
- **AC-18** The admin page is not linked from the public page. A person who enters the correct admin password sees every post, including hidden ones, each with a Hide button (or Show again for a hidden post). (test: 001-AC18)
- **AC-19** When the family presses Hide on a post, it no longer shows on the public wall for any visitor who loads the page afterwards, and its photos can no longer be opened from their public addresses. (test: 001-AC19)
- **AC-20** When the family presses Show again on a hidden post, it shows on the public wall again in its original place by date. (test: 001-AC20)
- **AC-21** If someone enters a wrong admin password, then the admin page shows no posts and no hide controls, and after 5 wrong tries in 15 minutes from one address it refuses further tries for 15 minutes. (test: 001-AC21)
- **AC-22** Without the admin password, no request can hide, show or delete a post, or read a hidden post. (test: 001-AC22)
- **AC-23** The footer lists the sources ("Tư liệu & nguồn" / "Quellen") with working links to both episodes of the podcast «Sống chung với Corona» by Trương Hồng Quang (https://youtu.be/K4gtri_cHB8 and https://youtu.be/otEfBuw2AoE) and to each article the timeline cites, and each press photo on the page carries a visible credit. (test: 001-AC23)
- **AC-24** The site answers at its public address over HTTPS by 26.11.2026, the day before the funeral. (test: 001-AC24)
- **AC-25** The memory wall shows Mr. Cao Hữu Ngạn's tribute from `documents/Tri ân.docx` as a post at the top of the wall, above visitor posts, with his name, the relationship đồng nghiệp, and the text exactly as written in the file, typos included. (test: 001-AC25)
- **AC-26** On a 375 px phone over a 4G connection, the header and the start of the film section show within 3 seconds, and timeline photos further down load only as the visitor scrolls towards them. (test: 001-AC26)
<!-- /sf:frozen -->

## Edge cases

| Scenario | Input or state | Expected behaviour | Covered by |
|---|---|---|---|
| Post a memory with photos | Name, relationship, message, 3 photos | Post appears at the top of the visitor posts, below the tribute, at once with 3 prints | AC-12, AC-17 |
| Post with no photos | Name, relationship, message only | Post appears with text only | AC-12 |
| Missing message | Name and relationship, empty message | Not sent, message field marked, name kept | AC-13 |
| Many photos | Visitor adds 12 photos under 5 MB each | All 12 accepted and shown on the post | AC-12, AC-17 |
| Large phone photo | One 7 MB photo among three smaller ones | The 7 MB photo is refused with the 5 MB limit named, the other three stay | AC-14 |
| Wrong file | A PDF chosen as a photo | Refused as not a photo | AC-14 |
| Phone photo sideways | A portrait phone photo with rotation data | Shows upright | AC-17 |
| Network drops | Submit with no connection | "Not posted" message, form keeps text and photos | AC-16 |
| Visitor writes in German on the Vietnamese page | Message in German | Post shows as written, not translated | AC-4 |
| Family hides spam | Admin presses Hide | Gone from the wall on next load, photos unreachable | AC-19 |
| Family hid the wrong post | Admin presses Show again | Back on the wall at its date | AC-20 |
| Someone guesses the admin password | 6 wrong tries in a minute | Locked out for 15 minutes after the 5th | AC-21 |
| Direct request to hide a post | A hide request with no admin password | Refused, post unchanged | AC-22 |
| Period with no photos yet | A station whose photos are not sorted in time | Station shows its paragraph only, no empty frame | AC-8 |
| Press photo without permission | Permission not given by launch | Photo is not on the page; the source may appear as a link in the footer | AC-23 |
| Tribute names his role | The tribute calls him Trưởng Tổ Bộ môn | Shown as written, because it is Mr. Ngạn's own words in a post, not site text | AC-25, AC-11 |
| Visitor asks for removal | A visitor writes to the contact in the privacy note | The family hides the post on the admin page and removes the stored copy by hand | AC-15, AC-19 |
| Bác Hồ clip | Visitor scrolls past Moritzburg | Clip does not play or make sound until pressed | AC-9 |
| Very long message | 6,000 characters pasted | Not sent, message field marked with the 5,000 limit, text kept | AC-13 |
| Language chosen, then reload | Visitor picks German, reloads | Page stays German | AC-3 |
| Long Vietnamese name | 60 characters with diacritics | Wraps, all diacritics render | AC-5, AC-17 |

## Out of scope

- A CMS, and an admin dashboard for uploading or changing videos. Life story, timeline, captions, video links and sources are written into the site's content files for now. A CMS is a later item.
- Deleting posts permanently from the admin page. Removal requests are handled by hand.
- Spam protection or a bot check. The family hides spam by hand (the user's call in the brainstorm).
- Accounts, logins for visitors, editing or deleting one's own post, replies or likes on posts.
- Filtering or grouping posts by class or relationship.
- Translating posts. They stay in the language they were written in.
- A separate gallery or album section. Photos live inside their timeline period.
- Hosting videos ourselves for the film section. They play from YouTube.
- The 14-minute life film. It can be added later through the admin dashboard of a later item.
- A QR code for the funeral programme (dropped 2026-11-18). One can be made from the final address in a minute if needed.
- Email or other notifications to the family about new posts.
- Clock or autumn-leaf motifs.
- A limit on how many photos one post can carry.
- Finding, sorting and captioning the photos, writing the period paragraphs, checking the German text, and getting press-photo permissions. The family and helpers do this. The site is built so this content can be dropped in.

## Constraints

- **Always.** Follow the content rules in `CLAUDE.md`: write unconfirmed memories as his own account, do not state his exact role in the German section as fact, show a visible credit on every press photo and use it only with permission, and use fonts that render all Vietnamese and German characters.
- **Always.** The visual direction in `.factory/brainstorm/2026-11-18-father-memorial-website/intent.md` ("Chosen direction"): warm off-white paper, dark ink, a large serif, photos framed as prints with captions, a railway line for the timeline, amber only on the title.
- **Never.** Use the two AI-made mockup images the user showed during the brainstorm (not kept in the repo, dark navy with notebook rings and a castle scene) as a design reference. Show search-result photos with no caption as historical photos of him.
- **Never.** Ask visitors for an email, phone number or other private contact.
- **Never.** Give the admin page a permanent Delete button. The family only hides and shows posts. A removal request is handled by hand (clarified 2026-11-18).
- The source photos and files in `documents/`, `images/` and `videos/` stay as they are. The site uses copies.
- The site must be live by 26.11.2026, the day before the funeral on 27.11.2026. Build effort goes to what visitors see on that day.
- The admin password is set by the family outside the code and is never stored in the repository.

## Testing

- **Seams.** The page as a visitor sees it in a browser (for page structure, language switch, viewer and the form), and the memory wall's server interface (for posting, refusing bad input, hiding, showing again and the admin password). The server interface is the main automated seam. Visual and launch criteria (AC-2, AC-5, AC-6, AC-8, AC-9, AC-11, AC-15, AC-23, AC-24, AC-25) are proved by manual test cases.
- **Prior art.** None. The repo has no code or tests yet.

## Assumptions

- The page opens in German when the browser's language is German, and in Vietnamese otherwise.
- The timeline has the seven periods the documents suggest (1942–1955 Hà Nam, 1955–1959 Moritzburg, 1959–1962 Radebeul, 1962–1965 Hà Nội, 1965–1970 Magdeburg, 1970–1988 Thanh Xuân, 1988–2026 Germany). The stations come from content data, so adding an eighth station later needs no code change.
- A period with no sorted photos by launch shows its paragraph only.
- The two interview videos are also the podcast episodes the footer lists as sources. Showing them in both places is intended.
- Class and year are free text.
- A post can carry any number of photos, each at most 5 MB (clarified 2026-11-18). The limit applies to the file the visitor picks.
- Uploaded photos are shrunk for display. Rotation data from phones is applied, and location data (GPS) is removed from the stored copy.
- One admin password is shared by the family. An admin login lasts until the browser is closed or for 12 hours, whichever comes first.
- Hidden posts are kept, so the family can show them again.
- Hosting costs fit a free or low-cost plan. The domain and hosting account are chosen in design.
- The family supplies the contact (an email address) shown in the privacy note before launch.
- Mr. Cao Hữu Ngạn has agreed to his tribute being on the wall (the user, 2026-11-18). It is in Vietnamese and shows only in Vietnamese, like any post. The family can hide it like any post.
- The Bác Hồ clip is captioned as his account of the meeting, following the `CLAUDE.md` content rule.

## Clarifications

### Session 2026-11-18
- Q: Should the family be able to delete a post for good, and should the form show a privacy note with a contact for removal? → A: Hide only, plus the privacy note. No permanent delete on the admin page.
- Q: What limits apply to uploaded photos? → A: No limit on how many photos per post, 5 MB each.
- Q: Should `videos/gap-bac-ho.mp4` be on the page at launch? → A: Yes, in the Moritzburg station.
- Q: Should Mr. Cao Hữu Ngạn's tribute go on the memory wall? → A: Yes, in the memory wall section. Everyone has already agreed, so no permission step.
- Q: Which videos does the film section show, and who supplies them? → A: Two YouTube interviews, hardcoded now (otEfBuw2AoE and K4gtri_cHB8, titles as in AC-7). An admin dashboard for uploading videos comes later.
- Q: Show the tribute exactly as written, or with spelling fixed? → A: Exactly as written.
- Q: Keep the QR code for the funeral programme? → A: Drop it. Nobody asked for it outside the brainstorm.

## Source

- `.factory/brainstorm/2026-11-18-father-memorial-website/intent.md` and `memlog.md` (brainstorm of 2026-11-18).
- `CLAUDE.md` content rules, which come from `documents/Ho_so_tu_lieu_Thay_Le_Duc_Duong.pdf`.

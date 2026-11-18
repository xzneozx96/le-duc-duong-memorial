# A memorial website for thầy Lê Đức Dương: intent

Source: `.factory/brainstorm/2026-11-18-father-memorial-website/memlog.md` (ideate, partner stance, 2026-11-18)
Size: one feature. A single page with hardcoded content, plus a small backend for the memory wall and a private admin page. Several slices, one deadline.

## What and why

A one-page memorial website for the user's father, Lê Đức Dương (01.05.1942 to 11.11.2026). He went to Moritzburg in 1955 as one of 150 Vietnamese children, trained and studied in the GDR, then taught German at the Foreign Language University in Thanh Xuân, Hanoi, from 1970 to 1988. He said almost every cohort that left to study in the GDR in those years passed through his class. He moved back to Germany on 22.12.1988.

The site honours him and gives his students, colleagues and friends in Vietnam and Germany a simple place to share memories, with no account and no login. The funeral is on 27.11.2026, and the whole site should be live by then, with a QR code that can go on the funeral programme.

## Chosen direction

A calm "family album" page with his life told as a railway journey. The page has a warm off-white paper tone, dark ink text, and a large serif that renders every Vietnamese and German character. Each photo is framed like a print with a caption. The timeline is drawn as a railway line whose stations are the places of his life, named in Vietnamese and German. Amber is used only on the title "Một ánh Dương còn mãi".

The reason for this direction is the photos. A dozen black-and-white archive photos sit next to many bright recent phone photos of a laughing man with his dogs, family and alumni. The print frame makes both kinds of photo belong on one page. The railway line tells the two-homeland story, which starts with the 1955 train.

The user's two mockups were AI drafts. They are not a design reference.

## Decisions made

- The site is one page, with sections in this order: header, film, timeline, memory wall with form, footer (my call, from the user's mockup order; the user did not object).
- The header shows only his portrait from `images/portrait`, with his name, 1942–2026 and the title "Một ánh Dương còn mãi".
- The first release has everything, live by 27.11.2026 (because the user wants the full site, not a cut-down first version).
- The life story, timeline, captions, film and albums are hardcoded for now. A CMS comes later.
- The life story lives inside the timeline as a short paragraph per period, with a two-line intro under the header (because it keeps the page short).
- Each period's photos open full screen with captions. There is no separate gallery section.
- The film (about 14 minutes) is ready. It goes on YouTube as unlisted and plays embedded in the page.
- Guestbook and shared memories are one wall with one form (because it is simpler).
- The form asks for name, message and relationship (học trò, đồng nghiệp, bạn bè, gia đình, khác), plus optional class and year and up to 5 photos. There is no private contact field.
- Posts appear right away. The family can hide a post afterwards (because the wall should feel alive in the days after the funeral).
- The family hides posts on a private admin page protected by a password, with a Hide button on each post.
- There is no spam protection at launch. The family hides spam by hand if it appears (the user's call; I recommended an invisible bot check).
- The site is in Vietnamese and German, with a language switch. Posts show in the language they were written in.
- I draft the German text, and a German speaker checks it before launch (because it is the fastest way to have both languages by 27.11).
- The footer has a short "Tư liệu & nguồn" list with links to the two podcast episodes and the articles. Each press photo carries a credit (because the research file requires credit and permission for press photos).
- There are no clock or autumn-leaf motifs (my call after the user was unsure; the journey line already carries the story).

## Rejected, and why

- Visitor personas, class filters and grouping memories by class: the user wants a simple one-page site.
- A separate guestbook and a separate stories section: one wall is simpler.
- A separate life story section and a separate album section: they make the one page long and repeat facts.
- The style of the draft mockups (dark navy, notebook rings, castle scene): AI drafts, and a dark mournful look clashes with the bright recent photos.
- The "Sunlight" style alone: archive photos and the memorial tone fit it badly.
- The railway style for the whole page: risks feeling designed more than personal. Kept for the timeline only.
- Hosting the film ourselves: heavy, and YouTube plays better on phones.
- Vietnamese only: shuts out his German friends and colleagues after 1988.

## Open questions for the spec

- The final list of timeline periods. The documents suggest 1942–1955 Hà Nam, 1955–1959 Moritzburg, 1959–1962 Radebeul, 1962–1965 Hà Nội (Viện Đo lường), 1965–1970 Magdeburg, 1970–1988 Thanh Xuân, 1988–2026 Germany. Should there be an eighth station for the memories and reunions?
- Which photo in `images/dòng thời gian` and `images/gặp mặt hội cựu học sinh` belongs to which period, and the caption for each. The family has to supply this. It is the largest piece of work before 27.11.
- Who checks the German text, and by when.
- The domain name, and who owns the hosting account.
- Permission to use press photos (VietnamPlus/TTXVN, Spiegel, Dr Trương Hồng Quang's blog) and the podcast audio. Without permission, those items stay off the page or appear as links only.
- Whether Mr. Cao Hữu Ngạn's tribute (`documents/Tri ân.docx`) goes on the wall as the first post, with his permission.
- Whether `videos/gap-bac-ho.mp4` (58 seconds) goes on the page, and where.
- The YouTube link for the film.
- The life after 1988 is the least documented period. The third podcast episode was never recorded. Who writes that part?
- Facts the research file flags as unconfirmed: his birth date in official papers, his exact role in the German section (the dossier says not to claim "head" without records, while the former dean's tribute calls him Trưởng Tổ Bộ môn), and the 1972 or 1973 youth festival year.
- Limits for uploaded photos (file size, total storage) and how long hidden posts are kept.

## Candidate acceptance criteria

- On a phone and a desktop, the page shows header, film, timeline, memory wall and footer in that order.
- The language switch changes all page text between Vietnamese and German. Posts stay in their own language.
- Every Vietnamese and German character renders correctly in every font on the page.
- Body text is large enough for readers in their 60s and 70s to read without zooming on a phone.
- The timeline shows his life as a railway line with stations named in both languages. Each station has a short paragraph and its photos.
- Tapping a photo opens it full screen with its caption and, for press photos, its credit. The viewer can move to the next photo of that period.
- The film plays inside the page from YouTube.
- A visitor with no account can post a memory with name, relationship, message, optional class and year, and up to 5 photos. The post shows on the wall right away.
- A family member who enters the admin password sees all posts and can hide any one. A hidden post no longer shows on the wall.
- The footer lists the sources with working links to the two podcast episodes and the articles.
- A QR code for the site URL is ready to print on the funeral programme.
- The site is live at its public URL by 27.11.2026.

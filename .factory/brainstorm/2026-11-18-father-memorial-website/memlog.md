---
topic: A memorial website for my father, a teacher who recently passed away
goal: Honor him and give his many students a simple place to share memories; settle structure and design direction into a concrete PRD before design starts
mode: ideate
stance: partner
item: none
status: complete
started: 2026-11-18
---
# A memorial website for my father

- [idea by user] Background section: where he was born and grew up
- [idea by user] Achievements section
- [idea by user] Life timeline by period, each item with several photos and captions; hardcoded now, editable via a CMS later
- [idea by user] Students can share memories without signing up or logging in
- [direction] Output is a PRD covering site structure first, then design direction
- [decision] Technique batch picked by coach: Persona Journey, Ritual Innovation, Sensory Exploration, Time Horizon Ladder (because user chose "you pick")
- [technique] started Persona Journey
- [idea by coach] Students tag a memory with the school and class year they were in, so classmates find each other's stories
- [direction] Session moved into the project folder; user shared 3 documents and 2 mockup images (mobile and desktop home page)
- [fact] Born 01.05.1942, grew up in rural Hà Nam; died 11.11.2026; funeral 27.11.2026 (source: documents/Thay_Le_Duc_Duong_01.05.1942-11.11.2026.pdf p1, p11)
- [fact] Life periods: 1955-1959 Moritzburg (Käthe-Kollwitz-Heim, one of 150 children); 1959-1962 apprenticeship Radebeul/Dresden; 1962-1965 Viện Đo lường + night school; 1965-1970 TH Magdeburg, Diplom-Ingenieur Maschinenbau; 1970-1988 German teacher at ĐH Ngoại ngữ Thanh Xuân + interpreter; 1975-1976 one year in Leipzig for German pedagogy; 22.12.1988 back to GDR; later interpreting and community work in Germany (source: Thay_Le_Duc_Duong pdf timeline p10-11)
- [fact] His students were mostly Vietnamese going to study in the GDR; he said almost every cohort of that era passed through his class, and he was a strict teacher. They are now roughly 60-75 years old, in Vietnam and Germany (source: Thay_Le_Duc_Duong pdf p8; age is inferred)
- [fact] Colleagues called him "người đúng giờ" (the punctual one); his laundry number at Moritzburg was 155; first textbook sentence he remembered; Bác Hồ meetings 1955 and 1957 (source: Ho_so pdf p3, Thay_Le_Duc_Duong pdf p3-4)
- [fact] Podcast part 3 (life after 1988) was planned but never recorded; the post-1988 chapter is the least documented (source: Thay_Le_Duc_Duong pdf p10)
- [fact] Former dean Cao Hữu Ngạn's tribute calls him former head of the German section (Trưởng Tổ Bộ môn) and a founder of the German department; the German faculty (now Hanoi University) celebrates its 60th anniversary in 2027 (source: documents/Tri ân.docx)
- [fact] The dossier says to label his memories as "thầy kể..." (his own account), not as independent facts, and to get permission and credit for every press photo (VietnamPlus/TTXVN, Dr Trương Hồng Quang blog, Spiegel) (source: Ho_so pdf p1, p4-5, p7)
- [fact] Two YouTube podcast episodes with his voice exist: K4gtri_cHB8 (part I), otEfBuw2AoE (part II) (source: Thay_Le_Duc_Duong pdf p11)
- [fact] Mockups show: title "Một ánh Dương còn mãi" (pun on his name), nav Trang chủ / Bộ phim / Dòng thời gian / Album ảnh / Sổ lưu niệm / Tư liệu, a 14-minute life film, a guestbook with name + relationship + message, 8 timeline periods with photo counts, "Gia đình bổ sung ảnh", and a QR code (source: user images)
- [idea by coach] A "Chapter 3" section: the post-1988 story he never got to record, filled in by people who knew him in Germany
- [idea by coach] Show the punctual-teacher trait in the design, e.g. a classroom clock motif or "he was always on time" as a recurring line
- [question] Does the site need to be live for the funeral on 27.11.2026 (QR code on the program), or for the German faculty's 60th anniversary in 2027?
- [decision] First release has everything: life story, timeline, film and albums (all hardcoded), plus a display section and an upload form for the guestbook and shared memories (because user wants the full site, not a cut-down version; deadline read as the funeral on 27.11.2026, to confirm)
- [question] Are the guestbook (short tributes) and shared memories (longer stories with photos) two separate things, or one?
- [idea by coach] Memory form asks for his class (D1-D10) and the year the student left for Germany, the way his students identify each other
- [direction] Keep it simple: a one-page memorial site. No visitor personas, no class filters. Decisions go through AskUserQuestion
- [direction] Project folder has images/dòng thời gian (timeline photos), images/gặp mặt hội cựu học sinh (alumni meeting), images/portrait, videos/gap-bac-ho.mp4
- [decision] Guestbook and shared memories are one wall; a post can include photos (because simpler, one form)
- [decision] Site in Vietnamese and German with a language switch (because his German friends and colleagues should read it too)
- [decision] Posts appear right away; the family can hide one afterwards (because it feels alive in the days after the funeral)
- [decision] One-page order: header (portrait, name, 1942-2026, "Một ánh Dương còn mãi") > film > timeline > memory wall + form > footer with credits and QR (decision by agent from the user's mockup, user did not object)
- [decision] Life story lives inside the timeline, a short paragraph per period, with a two-line intro under the header (because it keeps the page short)
- [decision] Albums live inside each period and open full screen with captions; no separate gallery (because one page)
- [decision] Footer has a short "Tư liệu & nguồn" list with the podcast and article links, plus a credit under each press photo (because the dossier requires credit for press photos)
- [decision] Coach drafts the German text; a German speaker checks it before launch (because it is the fastest route to two languages by 27.11)
- [decision] Memory form: name, message, relationship (học trò / đồng nghiệp / bạn bè / gia đình / khác), optional class and year, optional photos up to 5; no private contact field
- [decision] Family hides posts from a private password-protected admin page with a Hide button per post
- [decision] No spam protection at launch; hide spam by hand if it appears (user's call; coach recommended an invisible bot check)
- [decision] The ~14-minute life film is ready and goes on YouTube as unlisted, embedded in the page
- [technique] started design direction questions
- [decision] Header shows his portrait only (images/portrait), with name, years and title
- [direction] The mockups were AI drafts, not a design reference. Coach proposes the visual style from scratch
- [fact] Photo set: ~60 photos. A dozen black-and-white historic ones (Moritzburg 1950s, sepia portrait as a young man, group photos) and many bright recent phone photos: him laughing with his dogs (a samoyed, a pug, poodles), Christmas hats, family, alumni trips (Spreewald boats, Moritzburg park). Mixed portrait and landscape. videos/gap-bac-ho.mp4 is 58 s (source: images/, ffprobe)
- [insight] The photos show a joyful, warm man. A dark, mournful design would clash with the colourful recent photos; the style has to hold both B&W archive prints and bright phone photos
- [option] A Album: warm off-white paper, dark ink text, one muted amber accent; serif type with full Vietnamese and German glyphs; every photo framed as a print with a thin border and caption, which unifies B&W and colour photos (described in chat)
- [option] B Journey: the timeline drawn as a railway line with stations Hà Nam, Hàng Cỏ, Moritzburg, Radebeul, Hà Nội, Magdeburg, Thanh Xuân, Berlin, names in VI and DE; slate blue, rail red, paper; station-sign type (described in chat)
- [option] C Sunlight: white page, large photos edge to edge, warm gold accent for "Dương" (sun); modern sans made for Vietnamese; celebrates his life, risks looking like a lifestyle blog with the B&W archive photos (described in chat)
- [idea by coach] Hybrid: A as the base, B's railway line for the timeline only, C's warm amber only on the title "Một ánh Dương còn mãi"
- [decision] Visual direction: Album base (paper tone, dark ink, large serif with VI/DE glyphs, photos framed as prints with captions) + timeline drawn as his railway journey with VI/DE place names + amber only on the title (because it suits both archive and recent photos and tells the two-homeland story)
- [decision] No clock or autumn-leaf motifs (decision by agent after user was unsure; they get decorative and the journey line already carries the story)
- [insight] For the 27.11 deadline, the content is the critical path more than the code: sorting ~60 photos into periods, writing captions and period paragraphs, the German check, and press-photo permissions
- [insight] The print-frame photo style and the railway timeline together solve the mixed archive and phone photo set and the two-homeland story
- [insight] Size: one feature (one page + small memory-wall backend + admin page); intent.md written

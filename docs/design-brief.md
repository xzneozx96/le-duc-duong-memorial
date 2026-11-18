# Design brief: memorial website for thầy Lê Đức Dương

## Purpose

A one-page memorial website for thầy Lê Đức Dương (01.05.1942 – 11.11.2026), a German teacher who lived between Vietnam and Germany. The site preserves his legacy so his students, colleagues, family and later generations remember him. It speaks about him; it is never narrated in his own voice. It should be award-worthy (Awwwards Site of the Day level): eye-catching, crafted and moving, yet dignified and appropriate for a memorial. Nothing kitsch or flashy.

The funeral is on 27.11.2026. The site goes live by 26.11.2026.

## Who reads it

His former students, colleagues, friends and family in Vietnam and Germany, mostly aged 60 to 75, on phones and computers. The site is in Vietnamese and German, with a language switch.

## His story

- Born 01.05.1942, grew up in rural Hà Nam, Vietnam.
- 1955: one of 150 Vietnamese children who took the train from Hàng Cỏ station in Hanoi to the GDR (East Germany). Lived in the Käthe-Kollwitz-Heim in Moritzburg. He recalled that Hồ Chí Minh visited the school in 1957.
- 1959–1962: apprenticeship as a fitter in Radebeul and Dresden.
- 1962–1965: back in Hanoi, worked at the Institute of Metrology, finished school at night.
- 1965–1970: studied at TH Magdeburg, graduated as a mechanical engineer (Diplom-Ingenieur).
- 1970–1988: taught German at the Foreign Language University in Thanh Xuân, Hanoi, and worked as an interpreter; 1975–1976 a year of German teaching studies in Leipzig. He recalled that nearly every cohort that went to study in the GDR passed through his class. Colleagues called him "người đúng giờ" (the punctual one).
- 22.12.1988: returned to Germany. Former students later met him in Moritzburg and the Spreewald. A warm, laughing man, often photographed with his dogs.
- Died 11.11.2026.

## The page, in this order

1. **Header (hero).** His portrait, his name "Lê Đức Dương", the years 1942–2026, and the title: "Một ánh Dương còn mãi" on the Vietnamese page, "Ein Sonnenstrahl, der bleibt" on the German page (a play on his name: Dương means sun). A short intro of at most two lines on a phone. Jump links to the films, the journey and the guestbook.
2. **Films.** Two recorded interviews from 2020 (podcast «Sống chung với Corona» by Trương Hồng Quang), played from YouTube only when pressed:
   - Part I, 06.09.2020: "Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG" (https://youtu.be/K4gtri_cHB8)
   - Part II, 13.09.2020: "Talk with the former "Moritzburger" Lê Đức Dương" (https://youtu.be/otEfBuw2AoE)
3. **Timeline of his life.** Seven stations, each with years, the place in Vietnamese and German, a short paragraph and photos: Hà Nam (1942–1955), Moritzburg (1955–1959, includes a 58-second clip about meeting Hồ Chí Minh), Radebeul and Dresden (1959–1962), Hà Nội (1962–1965), Magdeburg (1965–1970), Thanh Xuân, Hà Nội (1970–1988), Germany (1988–2026). Photos open full screen with their caption. Press photos carry a credit.
4. **Guestbook ("Lưu bút" / "Gästebuch").** Visitors leave a memory with no account: name, relationship (student, colleague, friend, family, other), optional class and year, message, and photos. Posts appear right away. A tribute from Cao Hữu Ngạn, former dean of the German department, is the first entry. A short privacy note sits by the form.
5. **Sources.** Links to the two podcast episodes, a Der Spiegel article, VietnamPlus and Dr Trương Hồng Quang's blog. A line from the family with a contact.

## Theme

Colour palette, taken from the Farewell funeral theme (https://demo.themnific.com/farewell/), palette only, not its layout:

| Role | Colour |
|---|---|
| Page backgrounds | #F9F8F7, #F4F2EF, #E8E0DC |
| Text (ink) | #17082D (aubergine black; text only, never a background) |
| Accents | sand #D6C0A7, tan #C6A983, bronze #9E714B |
| Dark sections, sparingly | forest #313D36, warm darks #292622 and #3A342E |

No purple backgrounds and no purple-to-gold sunset gradients.

## Typography

- **Source Serif 4** for headings, and for reading text if you like. It must render every Vietnamese letter. Check "Lê Đức Dương" large: the accents must sit close to their letters.
- A Vietnamese-capable sans serif for small labels and buttons, for example Be Vietnam Pro.
- Every font must render all Vietnamese letters and the German ä ö ü ß ẞ.

## Motion

Built with GSAP (ScrollTrigger, SplitText, Flip). Scroll-triggered reveals, a timeline line that draws as you scroll, refined micro-interactions. Calm and purposeful, never blocking reading. With "reduce motion" turned on, show a still version.

## Must have

- His portrait and name are the first thing you see.
- A real vertical timeline with a line that fills in as the reader scrolls, and each station as a marker on it.
- Text at 18 px or larger (body around 20 px), strong contrast (at least 4.5:1, 7:1 for long reading), buttons at least 48 px tall.
- Works well on a phone at 375 px wide and on desktop at 1280 px and wider.

## Avoid (already tried and rejected)

- A purple night sky, a glowing sun orb or sphere, radial glows, or the sun drawn literally.
- Arcs swinging between "Vietnam" and "Germany" with a dot travelling on them.
- A stock split hero (text left, photo right) that could belong to any memorial.
- Guestbook entries as identical white cards with shadows.
- Text-only dark cards for the films.
- Tracked uppercase labels everywhere, and the same fade-in on every section.
- Candles, lilies, doves, oval portrait frames, script fonts, "In loving memory" clichés.
- Cormorant: its Vietnamese accents float away from the letters at large sizes.

## Assets available (to share separately)

- His studio portrait, and a cut-out version.
- About 60 photos: black-and-white archive photos (1950s Moritzburg, GDR years, a sepia portrait as a young man) and bright recent colour photos (reunions with former students, the Spreewald, family, his dogs).
- The 58-second clip about meeting Hồ Chí Minh.
- The tribute text from Cao Hữu Ngạn (in Vietnamese).

## Deliverable

A complete one-page design for desktop and phone, in Vietnamese with the German version, covering every section above, with the hero, timeline and guestbook designed in detail and the motion described for each.

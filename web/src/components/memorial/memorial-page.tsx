"use client";

// The memorial page. One story from top to bottom: the header says it in a
// sentence (he learned German from nothing, then taught it), the timeline tells it station by
// station, each station handing on to the next, with the two 2020 interviews in the 1988–2026
// station; the farewell; then the Lưu bút, where the people who knew him write the part that was
// never recorded.
import { useRef } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { classes } from "./cls";
import { Guestbook } from "./guestbook/guestbook";
import { BookEmbed } from "./guestbook/parts";
import "./guestbook/book.css";
import { FAMILY_EMAIL, sourceLinks, ui, type Lang } from "./content";
import { Films } from "./films";
import { memorialFontVars } from "./fonts";
import { Hero } from "./hero/hero";
import { Journey } from "./journey";
import { useRefreshOnResize } from "./motion";
import { SmoothScroll } from "./smooth-scroll";
import { ViewerProvider } from "./viewer";
import "./memorial.css";

const s = classes("lm");

export function MemorialPage() {
  // Vietnamese only for now; the German strings stay in content.ts for later.
  const lang: Lang = "vi";
  const t = ui[lang];
  const main = useRef<HTMLElement>(null);
  useRefreshOnResize(main);

  return (
    <div id="top" className={`${s.page} ${memorialFontVars}`}>
      <ViewerProvider t={t.viewer}>
        <SmoothScroll />

        {/* the hero (his portrait over the class photo in sepia mist) */}
        <Hero withNext={false} cueHref="#journey" />

        <main ref={main}>
          {/* his life from the train of 1955 to the farewell; the 2020 films sit in the 1988–2026 station */}
          <Journey lang={lang} t={t} films={<Films lang={lang} t={t} />} />
          {/* the approved Lưu bút: the guestbook (envelope carousel, letters in a bottom sheet) */}
          <BookEmbed>
            <Guestbook />
          </BookEmbed>
        </main>

        <footer className={s.footer}>
          <div className={s.wrap}>
            <h2 className={s.footerHead}>{t.footerHeading}</h2>
            <ul className={s.sources}>
              {sourceLinks.map((href, i) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener">
                    <span>{t.sources[i]}</span>
                    <ArrowUpRight aria-hidden size={26} strokeWidth={1.75} />
                    <span className={s.srOnly}> {t.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className={s.footerEnd}>
              <p className={s.family}>{t.family(FAMILY_EMAIL)}</p>
              <div className={s.footerRow}>
                <a href="#top" className={s.toTop}>
                  <ArrowUp aria-hidden size={20} strokeWidth={2.25} />
                  {t.toTop}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </ViewerProvider>
    </div>
  );
}

"use client";

// Hero option D5, "Thành dòng đời" (the line becomes his life story). The first screen is D's
// line of photographs around his portrait. As the reader scrolls, the photographs leave the line
// and travel down, each to its own station in the life story below (Moritzburg, Magdeburg,
// Thanh Xuân, Germany), and the horizontal line turns into the vertical line of the timeline.
// Without motion, the photographs stand in both places and nothing moves.
import { useRef, type CSSProperties } from "react";
import { classes } from "../cls";
import { BigName, Below, Foot, Img, LabNote, Shell, hero, pics, type Pic } from "./shared";
import { EASE, gsap, useHero } from "./motion";
import { ScrollTrigger } from "../demo/motion";
import "./d5.css";

const s = classes("lhd5");

type Item = { key: string; pic: Pic; k: number; side: "past" | "now"; station: number };
const items: Item[] = [
  { key: "m1", pic: pics.moritzburg1, k: 0.4, side: "past", station: 0 },
  { key: "m3", pic: pics.moritzburg3, k: 0.5, side: "past", station: 0 },
  { key: "yg", pic: pics.young, k: 0.7, side: "past", station: 1 },
  { key: "tx", pic: pics.thanhxuan2, k: 0.56, side: "past", station: 2 },
  { key: "g14", pic: pics.germany14, k: 0.7, side: "now", station: 3 },
  { key: "g4", pic: pics.germany4, k: 0.52, side: "now", station: 3 },
  { key: "g1", pic: pics.germany1, k: 0.4, side: "now", station: 3 },
];
// left to right in the hero: the earliest years furthest from his portrait
const pastRow = ["m1", "m3", "yg", "tx"].map((k) => items.find((i) => i.key === k)!);
const nowRow = items.filter((i) => i.side === "now");

const stations = [
  { years: "1955 – 1959", place: "Moritzburg, CHDC Đức", text: "Một trong 150 em nhỏ Việt Nam đi tàu từ ga Hàng Cỏ sang Đức, sống ở trường Käthe Kollwitz." },
  { years: "1965 – 1970", place: "Magdeburg, CHDC Đức", text: "Học ở Trường Đại học Kỹ thuật Magdeburg, tốt nghiệp kỹ sư cơ khí." },
  { years: "1970 – 1988", place: "Thanh Xuân, Hà Nội", text: "Mười tám năm dạy tiếng Đức ở Thanh Xuân, Hà Nội." },
  { years: "1988 – 2026", place: "Nước Đức", text: "Trở lại Đức. Học trò cũ nhiều lần tìm về gặp lại thầy." },
];

function RowItem({ it }: { it: Item }) {
  return (
    <figure className={`${s.item} ${s[it.side]}`} style={{ "--k": it.k } as CSSProperties} data-key={it.key}>
      <div className={s.fly}>
        <Img pic={it.pic} />
      </div>
    </figure>
  );
}

export function OptionD5() {
  const root = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useHero(
    heroRef,
    (q) => {
      gsap
        .timeline({ defaults: { ease: EASE.enter } })
        .fromTo(q(".lhx-honorific"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 0.1)
        .fromTo(q(".lhx-char"), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.04 }, 0.15)
        .fromTo(q(`.${s.item}`), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, stagger: { each: 0.07, from: "center" } }, 0.5)
        .fromTo(q(`.${s.axis}`), { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "expo.inOut" }, 0.7)
        .fromTo(q(".lhx-foot > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 1.3);
    },
    (mm, q) => {
      // Scroll carries each photograph from the line down to its station in the life story.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const page = root.current!;
        const life = page.querySelector(`.${s.life}`) as HTMLElement;
        page.classList.add(s.flying);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            endTrigger: life,
            end: "top 18%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        (q(`.${s.item}`) as HTMLElement[]).forEach((item, i) => {
          const slot = page.querySelector(`[data-slot="${item.dataset.key}"]`) as HTMLElement;
          const fly = item.querySelector(`.${s.fly}`) as HTMLElement;
          const r = () => [item.getBoundingClientRect(), slot.getBoundingClientRect()] as const;
          tl.to(
            fly,
            {
              x: () => r()[1].left - r()[0].left,
              y: () => r()[1].top - r()[0].top,
              scale: () => r()[1].height / r()[0].height,
              transformOrigin: "0 0",
              ease: "power2.inOut",
              duration: 0.75,
            },
            i * 0.09,
          );
        });
        tl.to(q(`.${s.axis}`), { scaleX: 0, opacity: 0, duration: 0.5, ease: "none" }, 0)
          .fromTo(life.querySelector(`.${s.rail}`), { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "none" }, 0.3);
        // measure again once the faces are in and the entrance has settled
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
        const settle = gsap.delayedCall(3.2, () => ScrollTrigger.refresh());
        return () => {
          settle.kill();
          page.classList.remove(s.flying);
        };
      });
    },
  );

  return (
    <Shell prefix="lhd5">
      <div ref={root}>
        <header ref={heroRef} className={s.hero} data-hero>
          <BigName />
          <div className={s.row} data-a>
            <span className={s.axis} aria-hidden />
            <div className={`${s.side} ${s.sidePast}`}>
              {pastRow.map((it) => (
                <RowItem key={it.key} it={it} />
              ))}
            </div>
            <figure className={s.centre}>
              <Img pic={{ ...pics.portrait, pos: "50% 22%" }} alt={hero.portraitAlt} eager />
            </figure>
            <div className={`${s.side} ${s.sideNow}`}>
              {nowRow.map((it) => (
                <RowItem key={it.key} it={it} />
              ))}
            </div>
          </div>
          <Foot />
        </header>

        <section id="cuoc-doi" className={s.life} aria-labelledby="lhd5-life-h">
          <div className="lhx-wrap">
            <h2 id="lhd5-life-h" className={s.lifeH}>
              Cuộc đời
            </h2>
            <div className={s.tl}>
            <span className={s.rail} aria-hidden />
            <ol className={s.stations}>
              {stations.map((st, n) => (
                <li key={st.years} className={s.station}>
                  <div className={s.stText}>
                    <p className={s.years}>{st.years}</p>
                    <h3 className={s.place}>{st.place}</h3>
                    <p className={s.stLine}>{st.text}</p>
                  </div>
                  <div className={s.slots}>
                    {items
                      .filter((it) => it.station === n)
                      .map((it) => (
                        <div
                          key={it.key}
                          className={`${s.slot} ${s[it.side]}`}
                          data-slot={it.key}
                          style={{ aspectRatio: `${it.pic.w} / ${it.pic.h}` }}
                        >
                          <Img pic={it.pic} />
                        </div>
                      ))}
                  </div>
                </li>
              ))}
            </ol>
            </div>
          </div>
        </section>

        <Below tone="dark" noLifeStub />
      </div>

      <LabNote id="d5" name="Thành dòng đời · the line becomes his life story">
        <p>
          <b>What it tries.</b> D&apos;s first screen as it is, then a hand-over: as the reader scrolls, the
          photographs leave the line one after another and travel down, each to its own station in the life story
          below (Moritzburg, Magdeburg, Thanh Xuân, Germany), while the line through the hero fades and the
          timeline&apos;s vertical line draws. The hero&apos;s row of years literally becomes the timeline, so the
          page reads as one continuous story rather than a header and sections. His portrait stays behind at the
          top.
        </p>
        <p>
          <b>Trade-offs.</b> The most ambitious hand-over and the most technical; it only shows its idea while
          scrolling, so the first screen alone looks like D. It moves the life story up to directly under the hero
          (before the films). The station lines here are short drafts from the brief&apos;s facts, and the young
          portrait is placed at Magdeburg until the family confirms where it was taken. With reduced motion the
          photographs simply stand in both places.
        </p>
        <p>
          <b>Recommendation.</b> The most impressive hand-over, but the most build and testing work before 27.11; choose it only if the life story should follow the hero directly.
        </p>
      </LabNote>
    </Shell>
  );
}

"use client";

// Option B: Đèn hoa đăng (lanterns on the river). In Vietnam the living set paper lotus lanterns
// on the water to remember the dead. Each memory is one lantern, carrying the writer's name, on
// a dusk river below the tribute. A lantern opens its letter in place: the river gives way to a
// paper page lit from above, then returns. Writing one sets a new lantern on the water, lit as
// it arrives. The lanterns breathe and flicker, but their buttons never move.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, PenLine } from "lucide-react";
import { classes } from "../cls";
import { metaLine, t, type Entry } from "./data";
import { MemoryForm } from "./form";
import { EASE, MOVE, bringIntoView, gsap, moving, useMotion } from "./motion";
import { LetterText, MoreButton, PhotoButtons, SentMark, StatusLine, useBook } from "./parts";
import "./b.css";

const s = classes("lbb");
const k = classes("lbk");

const DY = [0, 46, 14, 60, 24, 52, 8, 38];
const TILT = [-3, 2, -1.5, 3, -2, 1.5, -1, 2.5];

function Lantern({ size = 120 }: { size?: number }) {
  // A paper lotus with a candle at its heart, on a lily pad; light and its reflection behind.
  return (
    <svg className={s.lanternSvg} viewBox="0 0 120 150" width={size} height={(size * 150) / 120} aria-hidden>
      <defs>
        <radialGradient id="lbb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f9f8f7" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#d6c0a7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d6c0a7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lbb-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9f8f7" />
          <stop offset="100%" stopColor="#d6c0a7" />
        </linearGradient>
        <linearGradient id="lbb-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e0dc" />
          <stop offset="100%" stopColor="#c6a983" />
        </linearGradient>
        <radialGradient id="lbb-water" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d6c0a7" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d6c0a7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className={s.reflection} cx="60" cy="124" rx="56" ry="11" fill="url(#lbb-water)" />
      <circle className={s.glow} cx="60" cy="66" r="58" fill="url(#lbb-glow)" />
      <ellipse cx="60" cy="110" rx="46" ry="7" fill="#313d36" stroke="#9e714b" strokeWidth="1" />
      <g stroke="#9e714b" strokeWidth="1.1" strokeLinejoin="round" fill="url(#lbb-back)">
        <path d="M60 104 C46 100 30 86 26 62 C42 66 54 80 60 104 Z" />
        <path d="M60 104 C74 100 90 86 94 62 C78 66 66 80 60 104 Z" />
        <path d="M60 102 C50 90 46 70 52 50 C60 60 64 80 60 102 Z" />
        <path d="M60 102 C70 90 74 70 68 50 C60 60 56 80 60 102 Z" />
      </g>
      <rect x="55" y="70" width="10" height="20" rx="2" fill="#f9f8f7" />
      <path className={s.flame} d="M60 48 C55 57 55 64 60 68 C65 64 65 57 60 48 Z" fill="#f9f8f7" />
      <g stroke="#9e714b" strokeWidth="1.1" strokeLinejoin="round" fill="url(#lbb-front)">
        <path d="M60 108 C42 108 22 100 12 84 C32 80 50 88 60 108 Z" />
        <path d="M60 108 C78 108 98 100 108 84 C88 80 70 88 60 108 Z" />
        <path d="M60 108 C46 104 34 90 34 74 C48 80 58 92 60 108 Z" />
        <path d="M60 108 C74 104 86 90 86 74 C72 80 62 92 60 108 Z" />
        <path d="M60 110 C52 100 50 88 54 78 C58 86 62 98 60 110 Z" fill="#f9f8f7" />
        <path d="M60 110 C68 100 70 88 66 78 C62 86 58 98 60 110 Z" fill="#f9f8f7" />
      </g>
    </svg>
  );
}

export function OptionB() {
  const book = useBook();
  const [openId, setOpenId] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const root = useRef<HTMLElement>(null);
  const river = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const writeButton = useRef<HTMLButtonElement>(null);
  const lanterns = useRef(new Map<string, HTMLButtonElement>());
  const after = useRef<{ focus: "heading" | "lantern" | "write"; id?: string; lit?: boolean } | null>(null);

  const visitors = book.visitors;
  const index = openId ? visitors.findIndex((e) => e.id === openId) : -1;
  const entry: Entry | undefined = visitors[index];
  const prev = visitors[index - 1];
  const next = visitors[index + 1];

  // Arrival: the lanterns drift in from upstream and their lights come up one after another.
  useMotion(root, (mm, el) => {
    mm.add(MOVE, () => {
      const q = gsap.utils.selector(el);
      gsap.from(q("[data-b-head] > *"), {
        opacity: 0,
        y: 24,
        duration: 1,
        stagger: 0.09,
        ease: EASE.enter,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      const items = q("[data-lantern]");
      const tl = gsap.timeline({ scrollTrigger: { trigger: river.current, start: "top 70%", once: true } });
      tl.from(items, { x: -160, opacity: 0, duration: 2.4, stagger: 0.18, ease: "power2.out", clearProps: "transform,opacity" });
      tl.from(q("[data-lantern] .lbb-glow"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 1.2, stagger: 0.18, ease: EASE.soft, clearProps: "opacity,transform" }, 0.8);
    });
  });

  useEffect(() => {
    const a = after.current;
    if (!a) return;
    after.current = null;
    if (a.focus === "heading") {
      heading.current?.focus({ preventScroll: true });
      bringIntoView(river.current);
      if (sheet.current && moving()) {
        gsap.fromTo(sheet.current, { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: EASE.enter, clearProps: "transform,opacity" });
      }
    } else if (a.focus === "lantern" && a.id) {
      const btn = lanterns.current.get(a.id);
      btn?.focus({ preventScroll: true });
      bringIntoView(a.lit ? river.current : btn ?? null, a.lit ? "start" : "center");
      if (a.lit && btn && moving()) {
        // A new lantern is set on the water: it rises from below and its light comes up.
        const flame = btn.querySelector(".lbb-flame");
        const glow = btn.querySelector(".lbb-glow");
        const tl = gsap.timeline({ delay: 0.5 });
        tl.from(btn, { y: 120, opacity: 0, duration: 1.8, ease: "power2.out", clearProps: "transform,opacity" });
        if (flame) tl.from(flame, { scale: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "back.out(3)" }, "-=0.5");
        if (glow)
          tl.fromTo(glow, { scale: 0.2, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1.6, opacity: 1, duration: 0.9, ease: "power2.out" }, "<").to(glow, {
            scale: 1,
            duration: 1.4,
            ease: "power2.inOut",
            clearProps: "transform,opacity",
          });
      }
    } else if (a.focus === "write") {
      writeButton.current?.focus();
    }
  }, [openId, writing, book.visitors]);

  const openLetter = (id: string) => {
    after.current = { focus: "heading" };
    setOpenId(id);
  };
  const backToRiver = () => {
    after.current = { focus: "lantern", id: openId ?? undefined };
    setOpenId(null);
  };

  return (
    <section ref={root} id="book" className={s.section} aria-labelledby="book-h">
      <div className={s.paper}>
        <div className={s.head} data-b-head>
          <h2 id="book-h" className={s.title}>
            {t.bookHeading}
          </h2>
          <p className={s.invite}>{t.bookInvite}</p>
          {!writing && (
            <button ref={writeButton} type="button" className={k.primary} onClick={() => setWriting(true)}>
              <PenLine aria-hidden size={22} strokeWidth={2} />
              {t.bookOpen}
            </button>
          )}
        </div>

        <MemoryForm
          open={writing}
          className={s.form}
          intro="Khi bạn gửi, một ngọn đèn mang tên bạn sẽ được thả xuống dòng sông dưới đây."
          onClose={() => {
            after.current = { focus: "write" };
            setWriting(false);
          }}
          onPosted={(e) => {
            book.add(e);
            setWriting(false);
            setOpenId(null);
            after.current = { focus: "lantern", id: e.id, lit: true };
          }}
        />

        <article className={s.tribute} aria-labelledby="b-tribute-h">
          <header className={s.tributeHead}>
            <h3 id="b-tribute-h" className={s.tributeName}>
              {book.tribute.name}
            </h3>
            <p className={s.tributeMeta}>
              {t.bookKicker}
              <br />
              {t.sentOn(book.tribute.date)}
            </p>
          </header>
          <LetterText entry={book.tribute} className={s.tributeText} />
        </article>
      </div>

      <div ref={river} className={s.river} id="b-river">
        <StatusLine posted={book.posted} className={s.status} />
        <div className={s.field} hidden={entry !== undefined}>
          <h3 className={s.riverTitle}>Những ngọn đèn tưởng nhớ</h3>
          <p className={s.riverLine}>Mỗi ngọn đèn là một lời lưu bút. Bấm vào một ngọn đèn để đọc.</p>
          <ul className={s.lanterns}>
            {visitors.map((e, i) => (
              <li
                key={e.id}
                className={s.item}
                style={{ "--dy": `${DY[i % DY.length]}px`, "--tilt": `${TILT[i % TILT.length]}deg`, "--d": `${3.6 + (i % 4) * 0.7}s` } as CSSProperties}
                data-lantern
              >
                <button
                  ref={(el) => {
                    if (el) lanterns.current.set(e.id, el);
                    else lanterns.current.delete(e.id);
                  }}
                  type="button"
                  className={s.lantern}
                  aria-label={`Đọc lưu bút của ${e.name}${e.justSent ? `, ${t.justSent.toLowerCase()}` : ""}`}
                  onClick={() => openLetter(e.id)}
                >
                  <span className={s.float}>
                    <Lantern />
                  </span>
                  <span className={s.tag} aria-hidden>
                    {e.justSent && <SentMark className={s.sent} />}
                    <span className={s.tagName}>{e.name}</span>
                    <span className={s.tagMeta}>{t.relation[e.relation]}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <MoreButton hidden={book.hidden} onMore={book.more} className={s.more} />
        </div>

        {entry && (
          <div className={s.reading}>
            <button type="button" className={`${k.ghost} ${s.back}`} onClick={backToRiver}>
              <ArrowUp aria-hidden size={22} strokeWidth={2} />
              Trở lại dòng sông
            </button>
            <article ref={sheet} className={s.sheet} aria-labelledby="b-letter-h" key={entry.id}>
              <div className={s.sheetLight} aria-hidden>
                <Lantern size={88} />
              </div>
              <header className={s.sheetHead}>
                {entry.justSent && <SentMark />}
                <h3 id="b-letter-h" ref={heading} tabIndex={-1} className={s.sheetName}>
                  {entry.name}
                </h3>
                <p className={s.sheetMeta}>
                  {metaLine(entry)}
                  <br />
                  {t.sentOn(entry.date)}
                </p>
              </header>
              <PhotoButtons
                entry={entry}
                className={s.photos}
                itemClass={s.photo}
                style={(i) => ({ "--ar": `${entry.photos![i].w ?? 4} / ${entry.photos![i].h ?? 3}` }) as CSSProperties}
              />
              <LetterText entry={entry} className={s.text} />
              <nav className={s.turn} aria-label="Đọc tiếp">
                {prev ? (
                  <button type="button" className={s.turnButton} onClick={() => openLetter(prev.id)}>
                    <ArrowLeft aria-hidden size={22} strokeWidth={2} />
                    <span>
                      <span className={s.turnWord}>Ngọn đèn trước</span>
                      <span className={s.turnName}>{prev.name}</span>
                    </span>
                  </button>
                ) : (
                  <span />
                )}
                {next && (
                  <button type="button" className={`${s.turnButton} ${s.turnNext}`} onClick={() => openLetter(next.id)}>
                    <span>
                      <span className={s.turnWord}>Ngọn đèn sau</span>
                      <span className={s.turnName}>{next.name}</span>
                    </span>
                    <ArrowRight aria-hidden size={22} strokeWidth={2} />
                  </button>
                )}
              </nav>
            </article>
            <button type="button" className={`${k.ghost} ${s.back} ${s.backEnd}`} onClick={backToRiver}>
              <ArrowUp aria-hidden size={22} strokeWidth={2} />
              Trở lại dòng sông
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

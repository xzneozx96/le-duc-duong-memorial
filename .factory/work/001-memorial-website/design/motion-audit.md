# Motion audit: memorial demo page (`/lab/memorial/demo`)

18.11.2026. Scope: every animation on the page, top to bottom, measured in headless Chrome
before and after the changes. The owner asked for this because "the animation is currently not
really good, especially the hero section: very boring and not smooth."

References applied: `frontend-craft.md` (one orchestrated moment, not scattered entrances),
`craft-floor.md` (Motion: one authored moment, exponential ease-out, from an already-visible
default, reach past transform/opacity only when it stays smooth), `design-review-passes.md`
Pass 3 (journey and emotional arc) and the motion questions, `web-interface-guidelines.md`
(Animation: compositor-friendly properties, interruptible, loops stop under reduced motion),
`accessibility.md` (reduced motion honoured).

## How it was measured

Scripts: `measure.mjs`, `suite.sh`, `median.py` in the session scratchpad `cdp/` folder
(`/tmp/claude-1000/-home-ross--claude-spares-spare-amwxXi/f37fdf88-16a7-4531-ba63-1c7ae65796ee/scratchpad/cdp/`).

- Headless Chrome 157 over the DevTools protocol against the owner's dev server (port 3100).
- Two set-ups: desktop 1440×900 at full CPU, and phone 375×812 at DPR 2 with mobile
  emulation and 4× CPU throttling.
- **Hero intro:** a warm load first, then the measured load. The trace runs from the first
  contentful paint (FCP) to FCP + 6 s, or FCP + 12 s on the throttled phone.
- **Scroll:** after the intro has settled, a synthetic wheel scroll through the whole page at
  1600 px/s. Runs where the page did not reach the bottom are discarded.
- **Headline number:** Chrome's own frame reporter (`PipelineReporter` events in the trace).
  "Bad frames" are frames marked as dropped or partially presented in a way that affects
  smoothness; "bad %" is their share of all frames that had something to draw.
- **Secondary numbers:** `requestAnimationFrame` frame deltas (p95, max), long tasks, and the
  trace's time per phase (raster, paint, style recalc, layerize).
- **Medians of 3 runs.** The A/B cause tests are medians of 2 runs.

Caveats:
- These are dev-server numbers: React development build and Turbopack. Production will be
  lighter on script.
- CDP throttling slows the main thread only, so raster and compositor costs are understated
  compared with a real mid-range phone.
- The machine was shared with other agents' builds and tests (load average up to about 9 during
  the "before" runs), so single runs vary by ±30 %. Read the medians and the A/B differences,
  not single values.
- The page changed between the two sets of runs, in content as well as motion. The films moved
  from a dark band after the hero into the 1988–2026 station of the timeline, and the timeline
  got new lines. The before/after comparison is page against page, not motion alone. The
  "no reveals" reference row below isolates the cost of the new image reveal on the current page.

AFTER_TABLE

## Section by section

### 1. Hero (`hero/option-e2.tsx`, `e2.css`, `e-shared.tsx`)

**Before.**
- **Opening:** a GSAP timeline set up in a `useEffect` after hydration:
  - a paper-coloured "mist" over everything faded out over 4.2 s;
  - the class photo scaled 1.06 → 1 over 6 s;
  - the portrait faded in from `blur(10px)`, 24 px low, over 2.6 s;
  - then the honorific, the name (by word), the dates, the line and the button each faded and
    rose in turn.
- **Scroll:** a scrubbed timeline (`scrub: true`): the mist returned, the photo moved down 10 %,
  the portrait moved up and faded to 20 %, and the plate rose 40 px.
- **Loop:** the arrow in the button drifted forever.

**What was wrong.**
- **Flash of visible, then hidden, content** (brief rule; craft-floor "from an
  already-visible default"). The server-rendered hero paints complete, then hydration runs
  `gsap.from` and hides everything, then it fades back in. On the throttled phone the frames
  read: complete at 0.6 s, blank paper at 1.5 s and 2.1 s, back by about 3.3 s (see
  `motion/before/intro-375-*`). On desktop the page opens on about a second of blank paper.
  Older readers read either as the page being slow or broken.
- **The intro runs on the main thread during hydration** (web guidelines: compositor-friendly,
  interruptible). On the throttled phone, hydration plus the set-up of about 90 ScrollTriggers
  is one task of 0.9–2.4 s. Every GSAP tick waits behind it, so the intro freezes and then jumps:
  the worst frame was 2.47 s (median of maxima), with 215 bad frames (27.3 %) in the intro
  window. The trace puts 1.1 s of that task in React's scheduler, with 300 ms of forced style
  and 170 ms of forced layout from trigger measurement.
- **`filter: blur()` animated on a large masked image** (craft-floor: reach past transform and
  opacity "only when it stays smooth"). The portrait is a 1024×1535 cut-out with a two-gradient
  `mask-image`. Animating its blur re-rasterizes it every frame. Desktop intro: 103 bad frames
  (16.2 %), rAF p95 50 ms, 3.6 s of raster in 6 s. A/B: with `filter: none` forced, bad frames
  fell to 45 (6.6 %). With the background scale also removed they fell to 33 (4.7 %), so the
  blur was the bulk of it.
- **Full-bleed scale and moves with no layer.** The class photo was scaled and moved by inline
  transforms with no `will-change` anywhere on the page (0 elements). Without a layer, Chrome
  repaints and re-rasterizes the image instead of moving a texture.
- **`scrub: true` with no smoothing.** Each wheel step jumps the hero, which reads as stutter on
  a mouse wheel.
- **Not authored** (frontend-craft: "one orchestrated moment"). Every element got the same
  fade-and-rise in sequence, the "generic default". The only idea, mist clearing, was spent on a
  blank screen. That is the "boring".
- **An infinite decorative loop** (web guidelines: autoplay motion over 5 s alongside content).
  The arrow drift never stops, beside text that older readers are trying to read.

**What changed.**
- **The authored moment is a focus pull.** The page opens on him, already in focus, in front of
  a room that is still soft: the class photograph, blurred once and never re-drawn. Then the
  focus travels past him to the generations of students behind him: a sharp copy of the
  photograph fades in over the blurred one, while the whole room settles from 1.05 to 1. His
  honorific and his name rise into place word by word, each word out of its own mask. The mask
  reaches above the line for the stacked Vietnamese marks and below it for the descenders, and
  words are never split into letters. The dates, the line about his students and the button
  follow quietly. Everything is in place by 3.5 s; his face is there from the first frames.
- **CSS keyframes, not script.**
  - The opening starts with the first paint, so there is no flash: the first frame is the first
    frame of the opening.
  - It runs on the compositor (transform and opacity only), so the hydration task cannot freeze
    it.
  - It finishes complete even if the script never runs.
  - `animation-fill-mode: backwards` holds the first frame during each delay and lets go at the
    end. The finished page is the page as written, and the keyframes never override GSAP's
    scroll styles, which sit on different wrapper elements.
- **The blur is static.** It sits on its own layer and is painted once. The "focus" change is
  an opacity crossfade between two copies, so the effect reaches past transform and opacity
  without paying for it per frame.
- **Layers only where things move.** `will-change` is set on the stage, the settle wrapper, the
  sharp layer, the figure, the plate and the rising mist; nothing else on the page.
- **Hand-over on scroll** (GSAP, `scrub: 0.5`, so wheel steps arrive as one glide):
  - the room goes soft again, as the sharp layer fades;
  - the photograph and his portrait drift down slower than the page (parallax);
  - the name plate rises and fades;
  - a morning mist rises from below and closes over him. It is a paper gradient twice the
    hero's height that moves by transform alone. Its solid part, in the timeline's own
    off-white (`--paper`), covers the hero exactly as the hero leaves, so the light timeline
    follows with no edge and no grey.
  - An earlier draft dimmed the hero to dark for the films band. The films band no longer
    follows the hero, so that draft is gone.
- **The arrow breathes three times after the opening, then stays still.**
- **Reduced motion:** none of the keyframes or the scroll timeline exist; the hero is complete
  and still (see `motion/after/reduced/`).
- **No JavaScript:** the opening still plays from CSS and ends complete (see
  `motion/after/nojs/`).

### 2. Films (`demo/films.tsx`, now inside the 1988–2026 station)

**Before.**
- Each poster opened from `clip-path: inset(18% 12%)` over 1.6 s when it arrived.
- The image inside was scrubbed from −6 % to +6 % at `scale(1.14)` all the way through the
  viewport.
- Hover: a 900 ms `filter` transition from sepia to colour.
- The popup: a native `<dialog>` with a 320 ms rise. It is already honest motion that answers
  an action, and it is off under reduced motion.

**What was wrong.**
- **`clip-path` animated on large images** is not composited here, so it repaints every frame.
- **Two scrubbed scales**, again with no layer.
- **Generic** (frontend-craft): one more "mask opens" entrance, competing with the hero.
- The hover filter transition only runs on a fine pointer, on demand, so it is acceptable.

**What changed.**
- The clip-path entrance and the scrubbed scale are gone. The content session removed them in
  `films.tsx` after these measurements.
- The posters now develop like the timeline photographs (section 3), from the timeline's
  motion code, because the films now sit inside the timeline.
- The popup's motion is kept.

### 3. Timeline (`demo/journey.tsx`)

**Before.**
- **Line:** the line fills by scrub (`scrub: 0.4`) and its markers light as it passes. Good,
  meaningful, kept.
- **Years:** the year numbers roll once like an odometer. Kept.
- **Words:** every station's words and tag faded and rose 34 px on arrival.
- **Photographs:** every photograph opened by an animated `clip-path` (26 frames) and drifted
  inside its frame at `scale(1.12)`, scrubbed through the whole viewport.
- **Triggers:** about 90 ScrollTriggers in total, all created during hydration.

**What was wrong.**
- **`clip-path` reveals are the main scroll cost.** Throttled phone scroll before: 37.6 % bad
  frames, with 2.0 s of layerize, 1.4 s of style recalc and 0.9 s of paint over the scroll.
  A/B on the same page:

  | Throttled phone scroll, forced off | Bad frames | Bad % |
  |---|---|---|
  | Nothing (as built) | 366 | 37.6 % |
  | Scrubbed drift transforms | 136 | 11.3 % |
  | Clip-path reveals | 74 | 5.9 % |
  | Both | 36 | 2.8 % |

- **The drift scaled 26 large images with no layer**, and it also crops every photograph by
  12 %. Those are archival photos; the crop hides people at the edges.
- **The same entrance on every station** is the generic tell (frontend-craft; craft-floor
  "not one identical entrance on every section"). It also holds text back for the readers who
  most need it still.
- **Too many triggers.** About 90 ScrollTriggers measured during hydration add to the phone's
  long task.

**What changed.**
- **Words stay still.** The station text and tags are simply there.
- **The line, the markers and the rolling years stay.** They carry this section's motion, and
  they mean something: the years of his life passing.
- **Photographs develop instead of being clipped open.** The frame is already on the page in
  its mist colour, and the print settles into it: opacity 0 → 1, `scale` 1.06 → 1 and 4 % lower
  → in place, 1.5 s, expo-out, 0.12 s apart.
  - The farewell photograph develops more slowly (2.4 s).
  - Only the image inside the frame's `overflow: hidden` moves, by opacity and transform, so the
    compositor does all of it.
  - The layer exists only during the move: GSAP's `force3D` while tweening, and every style
    cleared at the end.
  - All prints share one `ScrollTrigger.batch`, `once`, never scrubbed.
  - Prints already on screen when the set-up runs are left alone, so nothing visible ever
    disappears.
- **The timeline's set-up is deferred** to `requestIdleCallback` (2.5 s at the latest), so its
  triggers are not measured inside the hydration task while the hero opens. The section starts
  below the fold, and its at-rest look is the page as written.

### 4. Lưu bút, guestbook (`book/a.tsx`, `a.css`)

**Before.**
- The heading rose on arrival.
- The envelopes were dealt in one by one.
- Sending folds the sheet in three and slips it away.
- The new envelope's postmark stamped in with `back.out(2)`: an overshoot of about 10 %, plus an
  18° spin.

**What was wrong.**
- **Bouncy motion,** which the brief bans: the postmark's overshoot.
- The heading's rise is one more generic entrance.

**What changed.** These edits went in before the guestbook moved to another agent and are
committed. `book/**` is no longer mine to edit.
- **The heading is still.**
- **The envelopes are laid in** gently (20 px, 1 s, 0.06 s apart, expo-out), with set-up
  deferred to idle. This short movement shows that the row can be browsed.
- **The postmark settles** from 1.35× with no overshoot and no spin.
- **The fold-and-send moment is kept.** It answers the reader's own action and shows what
  happened.

### 5. Shared helpers (`demo/motion.ts`)

- `useMotion` gains `{ idle: true }`. It sets up a below-the-fold section in
  `requestIdleCallback`, with a fallback timeout. Every effect still lives inside
  `gsap.matchMedia` under `prefers-reduced-motion: no-preference` and is reverted on unmount.
- `window.__st` exposes ScrollTrigger for the measuring scripts. It is lab only and should be
  dropped when the page leaves the lab.
- No new GSAP plugins are needed. The opening is CSS, and `ScrollTrigger.batch` is part of
  ScrollTrigger.

## Not changed, on purpose

- **ScrollSmoother or any smooth-scroll hijack.** It would make the page feel slow and
  unfamiliar to readers in their 60s and 70s, and it fights the browser's own scrolling.
- **The viewer and popup fades (200–360 ms),** and the button hover and press feedback. They
  answer an action, are short, and are off or cut under reduced motion.

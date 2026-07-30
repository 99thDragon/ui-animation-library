# UI Animation Library

Nineteen UI/animation patterns reverse-engineered from **[thelinestudio.com](https://thelinestudio.com)** (design: Isaac Powell, dev: Thomas Aufresne), **[dennissnellenberg.com](https://dennissnellenberg.com)**, and the client sites he builds (osmo.supply, thanks.co, kravt.eu) — rebuilt in vanilla HTML/CSS/JS.

## Quick start

Open `index.html` in your browser — it links to every demo. No build step, no install. (Internet needed: GSAP/Lenis load from CDN, placeholder images from picsum.photos.)

## What's inside

```
ui-animation-library/
├── index.html                  hub page linking every demo
├── lib/                        ← the reusable library
│   ├── tokens.css              design tokens: palette, easing, type, motifs
│   ├── preloader.js            FpsPreloader — "00/24 fps" loading counter
│   ├── cursor.js + cursor.css  StickyCursor — trailing cursor w/ label + thumb
│   ├── split-lines.js          splitLines()/revealLines() — masked line reveals
│   ├── lazy-video.js           initHoverVideos() — hover-to-play, lazy src
│   ├── flip-layout.js          LayoutToggle — grid ⇄ list FLIP morph
│   ├── smooth-scroll.js        initSmoothScroll() — Lenis + custom scrollbar
│   ├── acetate.css             the red mix-blend-mode:multiply "cel sheet"
│   ├── carousel-cursor.js      CursorCarousel — click-to-cycle image stack
│   ├── clock.js                StudioClock — live OPEN/CLOSED office hours
│   ├── equalizer.js            SoundEqualizer — dancing scaleY audio bars
│   ├── nav-overlay.js          FullscreenNav — panel wipe + staggered items
│   ├── magnetic.js             Magnetic — two-layer cursor pull (Snellenberg)
│   ├── button-fill.js          initButtonFill() — cursor-origin fill (Snellenberg)
│   ├── page-transition.js+css  initPageTransition() — wipe across page changes (Snellenberg)
│   ├── theme-switch.js         initThemeSwitch() — nav recolors per section (Osmo/Thanks/KRAVT)
│   ├── text-roll.js            initTextRoll() — label rolls out, duplicate rolls in (Osmo)
│   ├── stacked-cards.js        initStackedCards() — sticky deck (FlowFest/KRAVT)
│   └── accordion.js            initAccordion() — 0fr→1fr panels (Thanks/FlowFest)
└── demos/                      ← one runnable page per pattern
    ├── 01-preloader.html
    ├── 02-cursor.html
    ├── 03-grid-list-flip.html
    ├── 04-hover-video.html
    ├── 05-split-text.html
    ├── 06-loading-blocks.html
    ├── 07-smooth-scroll.html
    ├── 08-acetate-hero.html
    ├── 09-cursor-carousel.html
    ├── 10-studio-clock.html
    ├── 11-equalizer.html
    ├── 12-fullscreen-nav.html
    ├── 13-magnetic-buttons.html
    ├── 14-page-transition.html (+ -b) — two linked pages
    ├── 15-theme-switch.html
    ├── 16-text-roll.html
    ├── 17-stacked-cards.html
    └── 18-accordion.html

```

## Why the original site feels so good — the analysis

**Their stack** (extracted from the live bundle): Nuxt 3 (Vue) + DatoCMS, **GSAP** with ScrollTrigger / SplitText / Flip / CustomEase, and **Lenis** smooth scroll. Easings found in the code: `power4.out`, `power2.out`, `power1.inOut`.

The quality comes from five principles, not from any single trick:

1. **One motion language.** The same 2–3 easing curves and durations everywhere. `power4.out` = fast start, long silky landing — the "luxury" curve. When every element obeys the same physics, the site feels like one object.
2. **Smooth scroll is the foundation.** Lenis lerps the scroll position, so every scroll-linked animation interpolates instead of stepping. Half the perceived quality of every scroll effect comes from this alone.
3. **Loading states are designed moments.** The preloader is a 24fps film joke. Unloaded images are solid brand-red plates (`#FF391E`), not grey skeletons. Nothing ever looks broken.
4. **Restraint in the palette, extravagance in the motion.** Three colors (grey `#DDDEE2`, ink `#0B0B0B`, red `#FF391E`), one typeface (Denim variable font), UPPERCASE + `/` slash motifs. Because the canvas is so strict, the animation reads as craft instead of noise.
5. **Performance discipline enables the flash.** 31 videos on one page, but none has a `src` until needed (`preload="metadata"` + lazy attach). Transforms and opacity only — nothing that triggers layout. Silky comes from cheap.

### Pattern-by-pattern notes

| # | Pattern | The key detail |
|---|---------|----------------|
| 01 | FPS preloader | Counter tween AND `window.load` must both finish; exit is a full-screen `power4.inOut` wipe |
| 02 | Custom cursor | `gsap.quickTo` with 0.5s duration = the trailing lag; thumb enters with `translateY(10%) rotate(2deg)` (their literal CSS) |
| 03 | Grid ⇄ List | GSAP Flip: snapshot → toggle a CSS class → animate the diff. `absolute: true` + 0.02s stagger |
| 04 | Hover video | `muted loop playsinline preload="metadata"`, src attached on first approach/hover, poster crossfade + 1s scale(1.04) breathe |
| 05 | Split text | Mask (`overflow:hidden`) per line; line starts at `yPercent: 110`, rises with `power4.out`, 0.08s stagger |
| 06 | Loading blocks | `::before` red plate, `transition: opacity 0.2s 0.3s` — the 0.3s delay makes even instant loads flash the brand color |
| 07 | Smooth scroll | Lenis duration 1.1 + expo-out easing; custom scrollbar handle synced to `progress`; parallax = `scrub: true` inside an overflow-hidden frame |
| 08 | Acetate hero | Their literal CSS: `.acetate { background: red; mix-blend-mode: multiply; inset: 0 }` — a digital animation-cel sheet. Hero = 300vh scroller + `position: sticky` child; scrubbed ScrollTrigger peels the plate with `transform-origin: 0% 100%` |
| 09 | Cursor carousel | Whole image is the button; click advances via `clip-path: inset()` wipe; upcoming slides trail the cursor as thumbnails (`gsap.quickTo`) |
| 10 | Studio clock | Header shows live "OPEN/CLOSED (10—6PM)" via `Intl.DateTimeFormat` in Europe/London; the red dot blinks with their actual keyframe name: `@keyframes blink182 { 50% { visibility: hidden } }` |
| 11 | Sound equalizer | Podcast page: thin bars animated with `transform: scaleY()` origin-bottom (never `height` — no layout thrash), randomized every ~120ms, smoothed by a CSS transition |
| 12 | Fullscreen nav | Ink panel slides down `power4.inOut`, then ● dot + LABEL + red `/` items cascade with 0.06s stagger — one overlapped timeline so it reads as a single gesture |
| 13 | Magnetic buttons | *(dennissnellenberg.com)* Shell follows the cursor by `data-strength`; the label leads it by `data-strength-text` — two layers read as depth; `elastic.out` snaps it home on leave |
| 14 | Button fill | *(dennissnellenberg.com)* A circle scaled from 0 grows past the button bounds from the cursor's entry point; the label flips to the bg color as it's engulfed |
| 15 | Page transition | *(dennissnellenberg.com)* An ink panel slides up to cover, the browser navigates *behind* it, then it keeps sliding up to reveal the next page — one wipe across a real page change. A `<head>` `pt-cover` snippet holds the destination covered before paint so there's no flash |
| 16 | Scroll theme switch | *(osmo.supply, thanks.co, kravt.eu — on **every** Snellenberg build)* Sections declare `data-theme-section="light\|dark"`; the fixed nav tests which section sits under **its own centre line** and sets `data-theme-nav` to match. Beats `mix-blend-mode` (which distorts brand color) and beats a two-state "scrolled" class |
| 17 | Text roll | *(osmo.supply `data-button-rotate-hover`)* Two identical copies of the label in one `overflow:hidden` mask: on hover the first rolls up and out while the second rolls up into place, with a per-character `transition-delay` so it cascades rather than sliding as a slab |
| 18 | Stacked cards | *(flowfest.co.uk `data-stacked-cards`, kravt.eu)* Each card is `position: sticky` at `top + i*offset`, so scrolling deals them into a deck with every earlier top edge still showing. A pinned card's own top **equals** its stick point, so burial progress must be measured from the **next** card climbing over it — that's the non-obvious part. Scroll-linked scale/opacity carry **no** transition, or they smear behind the scroll |
| 19 | Accordion | *(thanks.co, flowfest.co.uk `data-accordion-css-init`)* Panels animate `grid-template-rows: 0fr → 1fr`, so any content height eases correctly with zero JS measurement. Needs `min-height: 0` on the child or `0fr` never fully collapses — and vertical padding on that child sets a floor it can't shrink past |

## Using a module in your own project

Every `lib/` file is a plain script (no build tools). Example — split-text:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="lib/split-lines.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);
  revealLines(document.querySelector('h1'));
</script>
```

## Credits & license note

These are educational reconstructions of publicly visible techniques, written from scratch — no code was copied from the site. The design language (colors, motifs) is used here for study; swap in your own tokens for production work. GSAP and Lenis are free to use (GSAP became 100% free in 2025, including SplitText/Flip).

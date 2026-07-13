/* ============================================================
   LENIS SMOOTH SCROLL + CUSTOM SCROLLBAR
   ------------------------------------------------------------
   Lenis is the single biggest ingredient in the "expensive"
   feel of thelinestudio.com. It replaces the browser's stepped
   wheel scrolling with an inertia-smoothed lerp, so every
   scroll-linked animation glides instead of jumping.

   The site also hides the native scrollbar and renders its own
   thin handle (.scrollbar__handle) synced to scroll progress.

   Usage:
     const lenis = initSmoothScroll();   // returns Lenis instance

   Requires: lenis (CDN). Plays nicely with GSAP ScrollTrigger —
   if ScrollTrigger exists we wire them together automatically.
   ============================================================ */
function initSmoothScroll({ scrollbar = true } = {}) {
  const lenis = new Lenis({
    duration: 1.1,                                   // glide length
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // expo-out
  });

  // Drive Lenis from one rAF loop (or GSAP's ticker if present)
  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  if (scrollbar) buildScrollbar(lenis);
  return lenis;
}

/* Thin custom scrollbar, same DOM as the original:
   .scrollbar > .scrollbar__wrapper > .scrollbar__handle */
function buildScrollbar(lenis) {
  const bar = document.createElement('div');
  bar.className = 'scrollbar';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = `<div class="scrollbar__wrapper"><div class="scrollbar__handle"></div></div>`;
  document.body.appendChild(bar);

  const handle = bar.querySelector('.scrollbar__handle');

  lenis.on('scroll', ({ progress }) => {
    // translate the handle down the track by scroll progress
    const track = bar.querySelector('.scrollbar__wrapper').clientHeight;
    const travel = track - handle.clientHeight;
    handle.style.transform = `translateY(${progress * travel}px)`;
  });

  // click the track to jump
  bar.addEventListener('click', e => {
    const rect = bar.getBoundingClientRect();
    const p = (e.clientY - rect.top) / rect.height;
    lenis.scrollTo(p * (document.body.scrollHeight - innerHeight));
  });

  // inject minimal styles once
  const css = `
    html.lenis { height: auto; }
    .lenis.lenis-smooth { scroll-behavior: auto; }
    body::-webkit-scrollbar { display: none; }
    body { scrollbar-width: none; }
    .scrollbar {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 14px; z-index: 9998; cursor: pointer;
    }
    .scrollbar__wrapper { position: absolute; inset: 4px 5px; }
    .scrollbar__handle {
      width: 4px; height: 72px; margin-left: auto;
      background: var(--ink, #0B0B0B);
      border-radius: 2px;
      transition: background 0.2s;
    }
    .scrollbar:hover .scrollbar__handle { background: var(--red, #FF391E); }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
}

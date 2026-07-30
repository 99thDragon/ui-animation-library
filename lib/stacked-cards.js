/* ============================================================
   STACKED CARDS — a deck that stacks as you scroll
   ------------------------------------------------------------
   From flowfest.co.uk (`data-stacked-cards`) and kravt.eu (10
   sticky sections). Each card sticks a little lower than the one
   before it, so scrolling deals them into a deck with every
   previous card's top edge still peeking out. Covered cards
   scale down and dim slightly, which reads as depth.

   The stack itself is pure CSS `position: sticky` — no JS needed
   for the layout. JS only adds the index-based offsets and the
   optional scale/dim of buried cards.

   Markup:
     <div data-stacked-cards>
       <div data-stacked-card>…</div>
       <div data-stacked-card>…</div>
     </div>

   Usage:
     initStackedCards();
     initStackedCards({ top: 96, offset: 18, scale: 0.05 });

   No dependencies (rAF-throttled scroll).
   ============================================================ */
function initStackedCards({
  container = '[data-stacked-cards]',
  card = '[data-stacked-card]',
  top = 88,          // px from viewport top where the first card sticks
  offset = 18,       // px each successive card sits lower
  scale = 0.05,      // how much a fully-buried card shrinks (0 = off)
  dim = 0.35,        // how much a fully-buried card dims (0 = off)
} = {}) {
  const roots = [...document.querySelectorAll(container)];
  if (!roots.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const decks = roots.map(root => {
    const cards = [...root.querySelectorAll(card)];
    cards.forEach((c, i) => {
      c.style.setProperty('--i', i);
      c.style.position = 'sticky';
      c.style.top = (top + i * offset) + 'px';
      // later cards must paint above earlier ones
      c.style.zIndex = i + 1;
    });
    return { root, cards };
  });

  // stacking alone is enough — no per-scroll work needed
  if (reduced || (!scale && !dim)) return { decks, update() {} };

  let ticking = false;
  function apply() {
    ticking = false;
    for (const { cards } of decks) {
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        // A pinned sticky card's own top EQUALS its stick point, so it can never
        // measure its own progress. Burial is driven by the NEXT card climbing
        // over it: 0 when that card's top edge is at this card's bottom,
        // 1 once it has climbed a full card height (fully covering).
        let p = 0;
        if (next) {
          const r = c.getBoundingClientRect();
          const travel = Math.max(1, r.height);
          p = Math.min(1, Math.max(0, (r.bottom - next.getBoundingClientRect().top) / travel));
        }
        c.style.transform = `scale(${(1 - p * scale).toFixed(4)})`;
        c.style.opacity = (1 - p * dim).toFixed(3);
      });
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  apply();
  return { decks, update: apply };   // update() for tests / dynamic content
}

/* companion styles, injected once */
(function () {
  const css = `
    [data-stacked-cards] { display: flex; flex-direction: column; }
    [data-stacked-card] {
      transform-origin: center top;   /* shrink toward the visible top edge */
      will-change: transform, opacity;
      /* NO transition: these values are scroll-linked, so easing them would
         smear behind the scroll instead of tracking it. */
    }
    /* the parent must NOT clip or sticky dies — a common gotcha */
    [data-stacked-cards], [data-stacked-cards] * { overflow: visible; }

    @media (prefers-reduced-motion: reduce) {
      [data-stacked-card] { transform: none !important; opacity: 1 !important; }
    }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

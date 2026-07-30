/* ============================================================
   SCROLL THEME SWITCH — the nav inverts per section
   ------------------------------------------------------------
   Found on EVERY Dennis Snellenberg build (osmo.supply,
   thanks.co, kravt.eu): sections declare their own theme, and a
   fixed nav reads whichever section is currently under it and
   recolors itself to match:

     <section data-theme-section="light"> … </section>
     <section data-theme-section="dark">  … </section>
     <header data-theme-nav="light">      … </header>

   Why it beats the usual hacks: `mix-blend-mode: difference`
   distorts brand color and can't be themed per-section, and a
   simple "scrolled" class only knows two states. Here each
   section owns its palette, so the nav is always legible and
   always on-brand.

   The switch fires on the line where the nav actually sits (its
   vertical center), not the viewport top — that's what makes it
   feel exact rather than early/late.

   Usage:
     initThemeSwitch();                       // <header> + [data-theme-section]
     initThemeSwitch({ nav: '.site-header' });

   No dependencies (rAF-throttled scroll + a resize hook).
   ============================================================ */
function initThemeSwitch({ nav = '[data-theme-nav]', sections = '[data-theme-section]' } = {}) {
  const navEl = document.querySelector(nav);
  const sectionEls = [...document.querySelectorAll(sections)];
  if (!navEl || !sectionEls.length) return;

  let ticking = false;

  function apply() {
    ticking = false;
    // the line we test against: the nav's own vertical center
    const navRect = navEl.getBoundingClientRect();
    const line = navRect.top + navRect.height / 2;

    // last section whose box straddles the line wins (later = on top)
    let theme = null;
    for (const s of sectionEls) {
      const r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom >= line) theme = s.dataset.themeSection;
    }
    if (theme && navEl.dataset.themeNav !== theme) navEl.dataset.themeNav = theme;
  }

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // A scroll that happens while the tab is hidden queues a frame that never
  // runs (rAF is throttled), so re-sync on the way back or the nav shows the
  // previous section's theme.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) apply(); });
  apply();                       // set the correct theme on first paint
  return { update: apply };      // call after dynamic layout changes
}

/* companion styles, injected once.
   Consumers override the two custom properties per theme. */
(function () {
  const css = `
    [data-theme-nav] {
      /* the transition IS the effect — without it the nav snaps */
      transition: color 0.4s cubic-bezier(0.19, 1, 0.22, 1),
                  background-color 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    }
    [data-theme-nav="light"] { color: var(--theme-on-light, #0B0B0B); }
    [data-theme-nav="dark"]  { color: var(--theme-on-dark,  #DDDEE2); }

    @media (prefers-reduced-motion: reduce) {
      [data-theme-nav] { transition: none; }
    }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

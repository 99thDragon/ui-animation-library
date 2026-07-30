/* ============================================================
   ACCORDION — height animated with grid-template-rows
   ------------------------------------------------------------
   From thanks.co and flowfest.co.uk (`data-accordion-css-init`,
   `data-accordion-close-siblings`, `data-accordion-status`).

   The interesting part is the height animation: instead of
   measuring scrollHeight in JS (which breaks on resize and when
   content changes), the panel is a CSS grid row animated from
   `0fr` to `1fr`. The browser interpolates the fractional row,
   so any content height animates correctly with no JS math.

   Markup:
     <div data-accordion>
       <div data-accordion-item>
         <button data-accordion-toggle>Question</button>
         <div data-accordion-content><div>Answer…</div></div>
       </div>
       …
     </div>

   Usage:
     initAccordion();                              // one open at a time
     initAccordion({ closeSiblings: false });      // allow many open

   No dependencies. State lives in `data-accordion-status`
   ("active" / "not-active") so CSS drives everything.
   ============================================================ */
function initAccordion({
  container = '[data-accordion]',
  item = '[data-accordion-item]',
  toggle = '[data-accordion-toggle]',
  closeSiblings = true,
  openFirst = false,
} = {}) {
  document.querySelectorAll(container).forEach(root => {
    const items = [...root.querySelectorAll(item)];

    items.forEach((it, idx) => {
      const btn = it.querySelector(toggle);
      const panel = it.querySelector('[data-accordion-content]');
      if (!btn || !panel) return;

      // wire up accessibility so it works for keyboard + screen readers
      if (!panel.id) panel.id = 'acc-panel-' + Math.random().toString(36).slice(2, 8);
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', panel.id);
      if (btn.tagName !== 'BUTTON') btn.setAttribute('role', 'button'), btn.setAttribute('tabindex', '0');
      panel.setAttribute('role', 'region');

      const setOpen = (open) => {
        it.dataset.accordionStatus = open ? 'active' : 'not-active';
        btn.setAttribute('aria-expanded', String(open));
        // inert content shouldn't be focusable while collapsed
        panel.hidden = false;
      };
      setOpen(openFirst && idx === 0);

      const onActivate = () => {
        const isOpen = it.dataset.accordionStatus === 'active';
        if (closeSiblings) items.forEach(other => {
          if (other !== it) {
            other.dataset.accordionStatus = 'not-active';
            other.querySelector(toggle)?.setAttribute('aria-expanded', 'false');
          }
        });
        setOpen(!isOpen);
      };

      btn.addEventListener('click', e => { e.preventDefault(); onActivate(); });
      // Enter/Space for non-<button> toggles
      if (btn.tagName !== 'BUTTON') btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(); }
      });
    });
  });
}

/* companion styles, injected once */
(function () {
  const css = `
    [data-accordion-item] { border-top: 1px solid rgba(11,11,11,0.2); }
    [data-accordion-item]:last-child { border-bottom: 1px solid rgba(11,11,11,0.2); }

    [data-accordion-toggle] {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      width: 100%; padding: 22px 4px; background: none; border: 0;
      font: inherit; color: inherit; text-align: left; cursor: pointer;
      text-transform: uppercase;
    }
    /* the +/- indicator rotates on open */
    [data-accordion-toggle]::after {
      content: ""; flex: none;
      width: 12px; height: 12px;
      background:
        linear-gradient(currentColor, currentColor) center/100% 1.5px no-repeat,
        linear-gradient(currentColor, currentColor) center/1.5px 100% no-repeat;
      transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    }
    [data-accordion-status="active"] [data-accordion-toggle]::after { transform: rotate(135deg); }

    /* THE TRICK: animate a grid row from 0fr to 1fr — no height math */
    [data-accordion-content] {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    }
    [data-accordion-status="active"] [data-accordion-content] { grid-template-rows: 1fr; }
    /* min-height:0 is REQUIRED — without it the row's automatic minimum size
       keeps a sliver of content visible and 0fr never fully collapses.
       NOTE: vertical padding/border on this direct child also sets a floor the
       panel can't shrink past (overflow only clamps *content*). Put vertical
       spacing on an element inside it, or use a spacer pseudo-element. */
    [data-accordion-content] > * { overflow: hidden; min-height: 0; }

    @media (prefers-reduced-motion: reduce) {
      [data-accordion-content] { transition: none; }
      [data-accordion-toggle]::after { transition: none; }
    }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

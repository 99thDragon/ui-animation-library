/* ============================================================
   TEXT ROLL — label rolls out, a duplicate rolls in
   ------------------------------------------------------------
   From osmo.supply (`data-button-rotate-hover`, `data-underline-link`).
   On hover the label's characters roll UP and out of a masked
   box while an identical second copy rolls up into their place —
   so the text appears to spin on a drum. A per-character delay
   makes it cascade left-to-right instead of moving as one slab.

   Two copies + one mask is the whole trick; the stagger is what
   sells it.

   Usage:
     <a class="text-roll">Get in touch</a>
     initTextRoll();              // or initTextRoll('.my-links')

   No dependencies (CSS transitions). Accessible: the real text
   stays in aria-label, the visual layers are aria-hidden.
   ============================================================ */
function initTextRoll(selector = '.text-roll', { stagger = 18 } = {}) {
  document.querySelectorAll(selector).forEach(el => {
    if (el.dataset.textRollReady) return;          // idempotent
    const text = el.textContent.trim();
    if (!text) return;

    const chars = [...text];
    const layer = cls => `<span class="text-roll__layer ${cls}" aria-hidden="true">` +
      chars.map((c, i) =>
        `<span class="text-roll__char" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`
      ).join('') + '</span>';

    el.setAttribute('aria-label', text);           // keep it readable for AT
    el.dataset.textRollReady = '1';
    el.style.setProperty('--roll-stagger', stagger + 'ms');
    el.innerHTML = `<span class="text-roll__mask">${layer('is--out')}${layer('is--in')}</span>`;
  });
}

/* companion styles, injected once */
(function () {
  const css = `
    .text-roll { display: inline-block; text-decoration: none; }
    .text-roll__mask {
      display: inline-block; position: relative;
      overflow: hidden;                 /* the mask — text rolls behind it */
      vertical-align: top;
      /* room for descenders so g/p/y aren't clipped by the mask */
      padding-bottom: 0.12em; margin-bottom: -0.12em;
    }
    .text-roll__layer { display: flex; white-space: pre; }
    /* the incoming copy is stacked exactly over the outgoing one */
    .text-roll__layer.is--in { position: absolute; inset: 0; }
    .text-roll__char {
      display: inline-block;
      transform: translateY(0);
      transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      transition-delay: calc(var(--i) * var(--roll-stagger, 18ms));
      will-change: transform;
    }
    .text-roll__layer.is--in .text-roll__char { transform: translateY(105%); }

    .text-roll:hover .text-roll__layer.is--out .text-roll__char,
    .text-roll:focus-visible .text-roll__layer.is--out .text-roll__char { transform: translateY(-105%); }
    .text-roll:hover .text-roll__layer.is--in .text-roll__char,
    .text-roll:focus-visible .text-roll__layer.is--in .text-roll__char { transform: translateY(0); }

    @media (prefers-reduced-motion: reduce) {
      .text-roll__char { transition: none; }
      .text-roll__layer.is--in { display: none; }   /* one static copy only */
    }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

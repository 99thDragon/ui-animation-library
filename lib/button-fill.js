/* ============================================================
   BUTTON FILL — a circle that grows from the cursor to fill
   ------------------------------------------------------------
   From dennissnellenberg.com (.btn-fill). A button carries a
   circle scaled to 0; on hover it scales past the button bounds
   and the label flips to the background color as it's engulfed.
   The circle grows FROM the point where the cursor entered (and
   retracts toward where it leaves), so the fill feels directional.

   Pairs naturally with .magnetic — one is movement, one is fill.

   Markup (the .btn__fill layer is injected if you omit it):
     <a class="btn"><span>Get in touch</span></a>

   Usage:
     initButtonFill();          // binds every .btn
     initButtonFill('.cta');    // custom selector

   No dependency — pure CSS transition, JS only sets the origin.
   ============================================================ */
function initButtonFill(selector = '.btn') {
  document.querySelectorAll(selector).forEach(btn => {
    if (!btn.querySelector('.btn__fill')) {
      const fill = document.createElement('span');
      fill.className = 'btn__fill';
      btn.prepend(fill);                 // sits behind the label (z-index in CSS)
    }
    // grow from where the cursor enters, retract toward where it leaves
    const setOrigin = e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--fill-x', ((e.clientX - r.left) / r.width * 100) + '%');
      btn.style.setProperty('--fill-y', ((e.clientY - r.top) / r.height * 100) + '%');
    };
    btn.addEventListener('mouseenter', setOrigin);
    btn.addEventListener('mouseleave', setOrigin);
  });
}

/* companion styles, injected once (same pattern as clock/equalizer/nav) */
(function () {
  const css = `
    .btn {
      position: relative;
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 30px;
      border: 1px solid var(--ink, #0B0B0B);
      border-radius: 100px;
      text-transform: uppercase; text-decoration: none;
      color: var(--ink, #0B0B0B);
      overflow: hidden; isolation: isolate; cursor: pointer;
    }
    /* the circle: sized to swallow the button from any origin */
    .btn__fill {
      position: absolute;
      left: var(--fill-x, 50%); top: var(--fill-y, 50%);
      width: 200%; aspect-ratio: 1;
      border-radius: 50%;
      background: var(--ink, #0B0B0B);
      transform: translate(-50%, -50%) scale(0);
      transform-origin: center;
      transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      pointer-events: none; z-index: 0;
    }
    .btn > *:not(.btn__fill) { position: relative; z-index: 1; transition: color 0.3s; }
    .btn:hover .btn__fill { transform: translate(-50%, -50%) scale(1); }
    .btn:hover > *:not(.btn__fill) { color: var(--bg, #DDDEE2); }

    @media (prefers-reduced-motion: reduce) {
      .btn__fill { transition: none; }
    }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

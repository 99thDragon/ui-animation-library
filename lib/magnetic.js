/* ============================================================
   MAGNETIC BUTTONS — cursor attraction, two-layer
   ------------------------------------------------------------
   From dennissnellenberg.com. While you hover a button it pulls
   toward the cursor, and the LABEL inside pulls *further* than
   the button shell — a tiny parallax that gives the control
   depth and makes it feel alive under the pointer. Their markup:

     <a class="magnetic" data-strength="40" data-strength-text="60">
       <span>Get in touch</span>
     </a>

   `data-strength`      = how far the whole button follows (0–100)
   `data-strength-text` = how far the label travels total (leads)

   On mouseleave everything springs home with an elastic overshoot.

   Usage:
     new Magnetic();            // binds every .magnetic
     new Magnetic('.btn');      // custom selector

   Requires: gsap (CDN). Skip on touch (no hover) — see guard below.
   ============================================================ */
class Magnetic {
  constructor(selector = '.magnetic') {
    // Pointer-fine only: a magnetic button that can't be hovered is dead weight.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll(selector).forEach(el => this.bind(el));
  }

  bind(el) {
    const strength = (+el.dataset.strength || 40) / 100;         // shell travel
    const strengthText = (+el.dataset.strengthText || 60) / 100; // label travel (total)
    const inner = el.querySelector('[data-strength-text], span, .magnetic__label') || el;

    // quickTo = pre-compiled tween; re-aiming it every mousemove is nearly free.
    // 0.6s + power4.out is the same "silky landing" curve the rest of the kit uses.
    const xEl = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power4.out' });
    const yEl = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power4.out' });
    // the label is offset RELATIVE to the shell, so give it only the extra travel
    const extra = Math.max(0, strengthText - strength);
    const xIn = inner === el ? null : gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power4.out' });
    const yIn = inner === el ? null : gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power4.out' });

    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);   // cursor offset from center
      const my = e.clientY - (r.top + r.height / 2);
      xEl(mx * strength); yEl(my * strength);
      if (xIn) { xIn(mx * extra); yIn(my * extra); }
    });

    el.addEventListener('mouseleave', () => {
      // elastic.out gives the satisfying rubber-band snap back to rest
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
      if (inner !== el) gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    });
  }
}

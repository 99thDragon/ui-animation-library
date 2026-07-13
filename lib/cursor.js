/* ============================================================
   CUSTOM CURSOR with label + media payload
   ------------------------------------------------------------
   The Line Studio's cursor is a fixed <div> that trails the
   mouse with a little lag (gsap.quickTo). Hovering a project
   makes it grow a "VIEW CASE STUDY" label; in list view it
   also carries a thumbnail that enters with translateY + a
   2° rotation (their exact CSS: cursor-image-enter-from
   { opacity:0; transform: translateY(10%) rotate(2deg); }).

   Usage:
     new StickyCursor();
     <a data-cursor-label="View case study"
        data-cursor-media="thumb.jpg">…</a>

   Requires: gsap (CDN).
   ============================================================ */
class StickyCursor {
  constructor() {
    // Build the cursor DOM once
    this.el = document.createElement('div');
    this.el.className = 'cursor';
    this.el.setAttribute('aria-hidden', 'true');
    this.el.innerHTML = `
      <span class="cursor__dot"></span>
      <span class="cursor__label"></span>
      <figure class="cursor__media"><img alt=""></figure>
    `;
    document.body.appendChild(this.el);

    this.labelEl = this.el.querySelector('.cursor__label');
    this.mediaEl = this.el.querySelector('.cursor__media');
    this.imgEl   = this.el.querySelector('.cursor__media img');

    // quickTo = pre-compiled tween. Re-targeting it every
    // mousemove is nearly free, and the 0.5s duration is what
    // produces the elastic "trailing" lag.
    this.xTo = gsap.quickTo(this.el, 'x', { duration: 0.5, ease: 'power3.out' });
    this.yTo = gsap.quickTo(this.el, 'y', { duration: 0.5, ease: 'power3.out' });

    window.addEventListener('mousemove', e => {
      this.xTo(e.clientX);
      this.yTo(e.clientY);
    });

    // Delegate: any element with data-cursor-label opts in
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor-label]');
      if (t) this.enter(t);
    });
    document.addEventListener('mouseout', e => {
      const t = e.target.closest('[data-cursor-label]');
      if (t && !t.contains(e.relatedTarget)) this.leave();
    });
  }

  enter(target) {
    this.labelEl.textContent = target.dataset.cursorLabel;
    this.el.classList.add('cursor--active');

    const media = target.dataset.cursorMedia;
    if (media) {
      this.imgEl.src = media;
      this.el.classList.add('cursor--media');
      // Their signature entrance: rise + un-rotate
      gsap.fromTo(this.mediaEl,
        { opacity: 0, yPercent: 10, rotate: 2 },
        { opacity: 1, yPercent: 0, rotate: 0, duration: 0.5, ease: 'power2.out' });
    }
  }

  leave() {
    this.el.classList.remove('cursor--active', 'cursor--media');
  }
}

/* Companion CSS lives in cursor.css */

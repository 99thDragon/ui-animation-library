/* ============================================================
   FULLSCREEN NAV OVERLAY — staggered menu items
   ------------------------------------------------------------
   The Line's nav: full-screen ink panel; each item is
   ● DOT + LABEL + trailing / slash, and they cascade in with
   opacity + translate (each nav-item carries a --translated
   state class in their markup).

   Usage:
     new FullscreenNav({
       links: [ {label:'Home', href:'/'}, ... ],
       toggle: '#menu-btn',
     });

   Requires: gsap (CDN).
   ============================================================ */
class FullscreenNav {
  constructor({ links, toggle }) {
    this.open = false;

    this.el = document.createElement('nav');
    this.el.className = 'fnav';
    this.el.innerHTML = `
      <ul class="fnav__list">
        ${links.map(l => `
          <li class="fnav__item">
            <a class="fnav__link" href="${l.href}">
              <span class="fnav__dot"></span>
              <span class="fnav__label">${l.label}</span>
            </a><i class="fnav__slash">/</i>
          </li>`).join('')}
      </ul>`;
    document.body.appendChild(this.el);

    this.items = this.el.querySelectorAll('.fnav__item');
    this.btn = document.querySelector(toggle);
    this.btn.addEventListener('click', () => this.toggle());

    gsap.set(this.el, { yPercent: -100 });
    gsap.set(this.items, { opacity: 0, yPercent: 60 });
  }

  toggle() {
    this.open = !this.open;
    this.btn.classList.toggle('is-open', this.open);

    if (this.open) {
      // panel slides down, then items cascade — one timeline,
      // overlapping ("-=0.4") so it reads as a single gesture
      gsap.timeline()
        .to(this.el, { yPercent: 0, duration: 0.8, ease: 'power4.inOut' })
        .to(this.items, {
          opacity: 1, yPercent: 0,
          duration: 0.7, stagger: 0.06, ease: 'power4.out',
        }, '-=0.35');
    } else {
      gsap.timeline()
        .to(this.items, { opacity: 0, yPercent: -40, duration: 0.3, stagger: 0.03, ease: 'power2.in' })
        .to(this.el, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '-=0.1');
    }
  }
}

/* companion styles, injected once */
(function () {
  const css = `
    .fnav {
      position: fixed; inset: 0; z-index: 900;
      background: var(--ink, #0B0B0B);
      color: var(--bg, #DDDEE2);
      display: flex; align-items: center; justify-content: center;
    }
    .fnav__list { list-style: none; margin: 0; padding: 0; }
    .fnav__item { display: flex; align-items: center; overflow: hidden; }
    .fnav__link {
      display: flex; align-items: center; gap: 14px;
      text-decoration: none; text-transform: uppercase;
      font-size: clamp(28px, 6vw, 64px); font-weight: 700; line-height: 1.3;
      transition: color 0.3s;
    }
    .fnav__link:hover { color: var(--red, #FF391E); }
    .fnav__dot {
      width: 0.35em; height: 0.35em; border-radius: 50%;
      background: var(--red, #FF391E); flex: none;
    }
    .fnav__slash { color: var(--red, #FF391E); font-style: normal;
      font-size: clamp(28px, 6vw, 64px); margin-left: 18px; }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

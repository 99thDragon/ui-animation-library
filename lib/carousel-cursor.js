/* ============================================================
   CURSOR CAROUSEL — click-to-cycle image stack (About page)
   ------------------------------------------------------------
   Their about-page carousel: a stack of <figure>s where only
   one is visible. The WHOLE carousel is the button — clicking
   anywhere advances it, and the custom cursor shows a strip of
   upcoming thumbnails trailing your mouse.

   The advance animation: next image wipes in with a clip-path
   inset while the old one scales down slightly underneath.

   Usage:
     new CursorCarousel(document.querySelector('.cc'), {
       images: ['a.jpg', 'b.jpg', 'c.jpg'],
     });

   Requires: gsap (CDN).
   ============================================================ */
class CursorCarousel {
  constructor(el, { images, thumbCount = 3 } = {}) {
    this.el = el;
    this.images = images;
    this.index = 0;

    el.classList.add('cc');
    el.innerHTML = `
      <div class="cc__stack">
        ${images.map((src, i) => `
          <figure class="cc__fig ${i === 0 ? 'is-current' : ''}">
            <img src="${src}" alt="">
          </figure>`).join('')}
      </div>
      <div class="cc__thumbs">
        ${Array.from({ length: thumbCount }, () => `<img class="cc__thumb" alt="">`).join('')}
      </div>
      <span class="cc__counter"></span>`;

    this.figs = [...el.querySelectorAll('.cc__fig')];
    this.thumbs = [...el.querySelectorAll('.cc__thumb')];
    this.counter = el.querySelector('.cc__counter');
    this.thumbsEl = el.querySelector('.cc__thumbs');

    // thumbnails trail the cursor inside the carousel
    this.xTo = gsap.quickTo(this.thumbsEl, 'x', { duration: 0.6, ease: 'power3.out' });
    this.yTo = gsap.quickTo(this.thumbsEl, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      this.xTo(e.clientX - r.left);
      this.yTo(e.clientY - r.top);
    });

    el.addEventListener('click', () => this.next());
    this.sync();
  }

  next() {
    const prev = this.figs[this.index];
    this.index = (this.index + 1) % this.figs.length;
    const cur = this.figs[this.index];

    cur.classList.add('is-current');
    // wipe the new image in from the bottom; settle the old one
    gsap.fromTo(cur,
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power4.inOut' });
    gsap.fromTo(cur.querySelector('img'),
      { scale: 1.15 }, { scale: 1, duration: 0.8, ease: 'power4.out' });
    gsap.to(prev, { scale: 0.96, duration: 0.8, ease: 'power4.inOut',
      onComplete: () => { prev.classList.remove('is-current'); gsap.set(prev, { scale: 1 }); } });

    this.sync();
  }

  sync() {
    // upcoming images preview in the cursor thumbnails
    this.thumbs.forEach((t, i) =>
      t.src = this.images[(this.index + 1 + i) % this.images.length]);
    this.counter.textContent =
      String(this.index + 1).padStart(2, '0') + ' / ' + String(this.images.length).padStart(2, '0');
  }
}

/* companion styles, injected once */
(function () {
  const css = `
    .cc { position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 16/10; }
    .cc__stack, .cc__fig { position: absolute; inset: 0; margin: 0; }
    .cc__fig { visibility: hidden; }
    .cc__fig.is-current { visibility: visible; }
    .cc__fig img { width: 100%; height: 100%; object-fit: cover; }
    .cc__thumbs {
      position: absolute; top: 0; left: 0; z-index: 5;
      display: flex; gap: 4px; pointer-events: none;
      transform: translate(-9999px, 0);
    }
    .cc__thumb { width: 64px; aspect-ratio: 16/10; object-fit: cover; }
    .cc__counter {
      position: absolute; right: 12px; bottom: 10px; z-index: 5;
      color: #fff; font-size: 11px; letter-spacing: 0.05em;
      mix-blend-mode: difference; pointer-events: none;
    }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

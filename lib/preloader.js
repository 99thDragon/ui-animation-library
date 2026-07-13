/* ============================================================
   FPS PRELOADER — the "00 / 24 fps" counter
   ------------------------------------------------------------
   The Line Studio counts 0 → 24 like frames of film (cinema
   runs at 24fps) while the page loads. Loading = brand story.

   Usage:
     <div class="preloader">
       <span class="preloader__count">00</span>
       <span class="preloader__total">/ 24 fps</span>
     </div>
     new FpsPreloader(document.querySelector('.preloader'), {
       onComplete: () => startPage()
     });

   Requires: gsap (CDN). No plugins needed.
   ============================================================ */
class FpsPreloader {
  constructor(el, { total = 24, minDuration = 1.6, onComplete } = {}) {
    this.el = el;
    this.countEl = el.querySelector('.preloader__count');
    this.total = total;
    this.onComplete = onComplete;

    // Lock scrolling while the preloader is up (Lenis adds
    // `lenis-stopped` for this — we mimic it with overflow).
    document.documentElement.style.overflow = 'hidden';

    const counter = { value: 0 };

    // Two things must finish before we exit:
    //  1. the counter tween (so it never "skips" frames)
    //  2. the real window load event
    const tweenDone = new Promise(resolve => {
      gsap.to(counter, {
        value: total,
        duration: minDuration,
        ease: 'power1.inOut',           // steady, mechanical — like a projector
        onUpdate: () => {
          this.countEl.textContent = String(Math.floor(counter.value)).padStart(2, '0');
        },
        onComplete: resolve,
      });
    });

    const loaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise(resolve => window.addEventListener('load', resolve, { once: true }));

    Promise.all([tweenDone, loaded]).then(() => this.exit());
  }

  exit() {
    // The exit is the money shot: the whole panel wipes up
    // with a long power4 ease — fast start, silky landing.
    gsap.to(this.el, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      onComplete: () => {
        this.el.style.display = 'none';
        document.documentElement.style.overflow = '';
        this.onComplete && this.onComplete();
      },
    });
  }
}

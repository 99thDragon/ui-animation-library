/* ============================================================
   SOUND EQUALIZER — dancing audio bars (podcast page)
   ------------------------------------------------------------
   Their markup: a flex row of thin bars, each animated with
   transform: scaleY() from origin bottom. Bars sit at scaleY(0)
   until the row is active, then dance with randomized heights.

   scaleY (not height!) so the animation never triggers layout.

   Usage:
     const eq = new SoundEqualizer(container, { bars: 12 });
     eq.start(); eq.stop();
     // or: hover the container toggles it automatically

   No dependencies.
   ============================================================ */
class SoundEqualizer {
  constructor(el, { bars = 12, hoverToggle = true } = {}) {
    this.el = el;
    el.classList.add('sound-eq');
    el.innerHTML = Array.from({ length: bars }, () =>
      `<span class="sound-eq__bar"></span>`).join('');
    this.bars = [...el.querySelectorAll('.sound-eq__bar')];
    this.running = false;

    if (hoverToggle) {
      el.addEventListener('mouseenter', () => this.start());
      el.addEventListener('mouseleave', () => this.stop());
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    const dance = () => {
      if (!this.running) return;
      for (const bar of this.bars) {
        // random target height, eased by the CSS transition
        bar.style.transform = `scaleY(${(0.15 + Math.random() * 0.85).toFixed(2)})`;
      }
      this.timer = setTimeout(dance, 120);   // ~8 "beats" per second
    };
    dance();
  }

  stop() {
    this.running = false;
    clearTimeout(this.timer);
    this.bars.forEach(b => b.style.transform = 'scaleY(0.05)');
  }
}

/* companion styles, injected once */
(function () {
  const css = `
    .sound-eq {
      display: flex; align-items: flex-end; gap: 3px;
      height: 22px; cursor: pointer;
    }
    .sound-eq__bar {
      width: 3px; height: 100%;
      background: currentColor;
      transform: scaleY(0.05);
      transform-origin: center bottom;
      transition: transform 0.12s ease-out;   /* smooths the random jumps */
    }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

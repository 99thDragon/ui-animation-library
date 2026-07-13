/* ============================================================
   STUDIO CLOCK — "OPEN / CLOSED (10—6PM)" header status
   ------------------------------------------------------------
   The Line's header shows their London studio's live status:
   "CLOSED (10—6PM)" outside office hours, OPEN during them —
   with a blinking red dot (their keyframe is literally named
   `blink182`: 50% { visibility: hidden }).

   A tiny detail that makes a website feel like a real place.

   Usage:
     <span class="studio-clock"></span>
     new StudioClock(document.querySelector('.studio-clock'), {
       timeZone: 'Europe/London', open: 10, close: 18,
     });

   No dependencies.
   ============================================================ */
class StudioClock {
  constructor(el, { timeZone = 'Europe/London', open = 10, close = 18, city = '' } = {}) {
    this.el = el;
    this.timeZone = timeZone;
    this.open = open;
    this.close = close;
    this.city = city;

    this.el.innerHTML = `
      <span class="studio-clock__dot"></span>
      <span class="studio-clock__label"></span>
      <span class="studio-clock__time"></span>
    `;
    this.dotEl = el.querySelector('.studio-clock__dot');
    this.labelEl = el.querySelector('.studio-clock__label');
    this.timeEl = el.querySelector('.studio-clock__time');

    this.tick();
    // minute precision is plenty; align to the next minute
    setInterval(() => this.tick(), 30_000);
  }

  tick() {
    const now = new Date();
    // read hour + time string in the studio's timezone
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.timeZone, hour: 'numeric', minute: '2-digit', hour12: false,
    }).formatToParts(now);
    const hour = +parts.find(p => p.type === 'hour').value;
    const hhmm = parts.map(p => p.value).join('');

    const isOpen = hour >= this.open && hour < this.close;
    const fmt = h => (h % 12 || 12) + (h < 12 ? '' : 'PM');

    this.labelEl.textContent = isOpen ? 'OPEN' : 'CLOSED';
    this.timeEl.textContent = ` (${fmt(this.open)}—${fmt(this.close)}) ${this.city} ${hhmm}`;
    this.el.classList.toggle('is-open', isOpen);
  }
}

/* companion styles, injected once */
(function () {
  const css = `
    .studio-clock {
      display: inline-flex; align-items: center; gap: 6px;
      text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;
    }
    .studio-clock__dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--red, #FF391E);
      animation: blink182 1.2s steps(1) infinite;  /* their keyframe name! */
    }
    .studio-clock.is-open .studio-clock__dot { animation: none; }
    @keyframes blink182 { 50% { visibility: hidden; } }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

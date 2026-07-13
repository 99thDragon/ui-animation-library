/* ============================================================
   SPLIT-TEXT LINE REVEAL
   ------------------------------------------------------------
   The Line Studio wraps copy in `.text-splitter` spans and
   masks each LINE, then slides lines up 100% → 0% with a
   stagger as they scroll into view (GSAP SplitText + ScrollTrigger).

   This is a dependency-light version: we split into lines by
   measuring word positions ourselves — same visual result.

   Usage:
     revealLines(document.querySelector('.my-paragraph'));

   Requires: gsap + ScrollTrigger (CDN).
   ============================================================ */

/** Split an element's text into masked line wrappers.
 *  Returns the array of inner line elements to animate. */
function splitLines(el) {
  const text = el.textContent.trim();
  const words = text.split(/\s+/);

  // Pass 1: wrap every word so we can measure line breaks
  el.innerHTML = words.map(w => `<span class="sl-word">${w}</span>`).join(' ');
  const wordEls = [...el.querySelectorAll('.sl-word')];

  // Group words that share the same offsetTop → one visual line
  const lines = [];
  let currentTop = null;
  for (const w of wordEls) {
    if (w.offsetTop !== currentTop) {
      currentTop = w.offsetTop;
      lines.push([]);
    }
    lines[lines.length - 1].push(w.textContent);
  }

  // Pass 2: rebuild as mask > line pairs.
  // The MASK (overflow:hidden) is what sells the effect —
  // text appears to rise out of an invisible slot.
  el.innerHTML = lines.map(lineWords =>
    `<span class="sl-mask"><span class="sl-line">${lineWords.join(' ')}</span></span>`
  ).join('');

  return [...el.querySelectorAll('.sl-line')];
}

/** Split + animate on scroll. */
function revealLines(el, { stagger = 0.08, duration = 0.9, start = 'top 85%' } = {}) {
  const lineEls = splitLines(el);

  gsap.set(lineEls, { yPercent: 110 });

  gsap.to(lineEls, {
    yPercent: 0,
    duration,
    stagger,                    // the cascade is everything
    ease: 'power4.out',         // their signature curve
    scrollTrigger: { trigger: el, start },
  });
}

/* Companion CSS — inject once so callers don't need a file */
(function () {
  const css = `
    .sl-mask { display: block; overflow: hidden; }
    .sl-line { display: block; will-change: transform; }
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
})();

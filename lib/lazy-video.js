/* ============================================================
   HOVER-TO-PLAY LAZY VIDEO CARDS
   ------------------------------------------------------------
   The Line Studio's work grid has 31 videos on one page and
   still scrolls smoothly. The trick:

   1. <video muted loop playsinline preload="metadata"> and
      NO src attribute at first — zero bytes downloaded.
   2. The real URL sits in data-src. It is attached the first
      time you hover (or when the card nears the viewport).
   3. Poster image shows by default; video fades in over it.

   Usage:
     <figure class="video-card">
       <img class="video-card__poster" src="poster.jpg" alt="">
       <video class="video-card__video" data-src="clip.mp4"
              muted loop playsinline preload="metadata"></video>
     </figure>
     initHoverVideos('.video-card');

   No dependencies.
   ============================================================ */
function initHoverVideos(selector, { warmupMargin = '200px' } = {}) {
  const cards = document.querySelectorAll(selector);

  // Optional warm-up: attach src (metadata only) as a card
  // approaches the viewport, so first hover starts instantly.
  const warmup = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const video = entry.target.querySelector('video[data-src]');
      if (video) attach(video);
      warmup.unobserve(entry.target);
    }
  }, { rootMargin: warmupMargin });

  function attach(video) {
    video.src = video.dataset.src;
    video.removeAttribute('data-src');
  }

  for (const card of cards) {
    const video = card.querySelector('video');
    if (!video) continue;

    warmup.observe(card);

    card.addEventListener('mouseenter', () => {
      if (video.dataset.src) attach(video);
      // play() returns a promise; ignore the abort that fires
      // if the user leaves before playback starts.
      video.play().catch(() => {});
      card.classList.add('is-playing');
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      card.classList.remove('is-playing');
    });
  }
}

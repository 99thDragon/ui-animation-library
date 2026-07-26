/* ============================================================
   PAGE TRANSITION — an ink panel wipes across page changes
   ------------------------------------------------------------
   From dennissnellenberg.com. Click an internal link: the overlay
   slides UP to cover the screen, the browser navigates *while
   covered* (no flash), and the destination reveals by continuing
   the SAME upward slide off the top — so it reads as one gesture
   across the page break.

   The trick that makes real (multi-page) navigation seamless:
   cover BEFORE navigating, and let the destination start covered
   (via the <head> snippet) then reveal on load.

   Setup — per page:
     <head>
       <link rel="stylesheet" href="lib/page-transition.css">
       <script>
         if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
           document.documentElement.classList.add('pt-cover');
       </script>
     </head>
     <body>
       <div class="page-transition" aria-hidden="true"></div>
       ...
       <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
       <script src="lib/page-transition.js"></script>
       <script> initPageTransition(); </script>

   Requires: gsap (CDN).
   ============================================================ */
function initPageTransition({ selector = '.page-transition', duration = 0.8 } = {}) {
  // Reduced motion: strip the cover and let links behave normally.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('pt-cover');
    return;
  }

  let el = document.querySelector(selector);
  if (!el) {                                   // graceful fallback if markup is missing
    el = document.createElement('div');
    el.className = 'page-transition';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }

  // ---- REVEAL on load: the panel is covering (pt-cover) → slide off the top.
  const covering = document.documentElement.classList.contains('pt-cover');
  gsap.set(el, { yPercent: covering ? 0 : 100 });
  const revealed = () => document.documentElement.classList.remove('pt-cover');
  gsap.to(el, { yPercent: -100, duration, ease: 'power4.inOut', onComplete: revealed });
  // Failsafe: if requestAnimationFrame is throttled (backgrounded/low-power tab)
  // the tween never advances — a full-screen panel must NEVER get stuck covering
  // the page. gsap.set is synchronous, so this guarantees the reveal.
  setTimeout(() => { gsap.set(el, { yPercent: -100 }); revealed(); }, duration * 1000 + 400);

  // ---- COVER on internal-link click, then navigate once fully covered.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const skip =
      a.target === '_blank' ||
      a.hasAttribute('download') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      (/^https?:\/\//.test(href) && a.host !== location.host) ||  // external
      e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;      // open-in-new-tab intents
    if (skip) return;

    e.preventDefault();
    gsap.set(el, { yPercent: 100 });           // park below, then rise to cover
    let done = false;
    const go = () => { if (done) return; done = true; window.location.href = href; };
    gsap.to(el, { yPercent: 0, duration: duration * 0.85, ease: 'power4.inOut', onComplete: go });
    // Backstop: navigate even if the cover tween is throttled, so the link
    // never feels dead.
    setTimeout(go, duration * 900);
  });
}

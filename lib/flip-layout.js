/* ============================================================
   GRID ⇄ LIST LAYOUT MORPH (GSAP Flip)
   ------------------------------------------------------------
   The Line Studio's GRID / LIST toggle re-lays-out all 77
   projects and every card ANIMATES from its old position to
   its new one. That's the FLIP technique:

     F irst   — record where everything is (Flip.getState)
     L ast    — change the layout instantly (toggle a class)
     I nvert  — GSAP transforms items back to their old spots
     P lay    — release them to their new spots with easing

   Usage:
     new LayoutToggle({
       container: '.work',           // gets .work--list toggled
       items:     '.work-item',
       buttons:   '[data-layout]',   // data-layout="grid|list"
     });

   Requires: gsap + Flip plugin (CDN).
   ============================================================ */
class LayoutToggle {
  constructor({ container, items, buttons, duration = 0.8 }) {
    this.container = document.querySelector(container);
    this.itemsSel = items;
    this.duration = duration;
    this.busy = false;

    document.querySelectorAll(buttons).forEach(btn => {
      btn.addEventListener('click', () => this.set(btn.dataset.layout, btn));
    });
  }

  set(layout, btn) {
    if (this.busy) return;
    const wantList = layout === 'list';
    if (this.container.classList.contains('is-list') === wantList) return;
    this.busy = true;

    // reflect active button
    document.querySelectorAll('[data-layout]').forEach(b =>
      b.classList.toggle('is-active', b === btn));

    const items = this.container.querySelectorAll(this.itemsSel);

    // FIRST: snapshot current positions/sizes
    const state = Flip.getState(items);

    // LAST: flip the class — CSS does the actual re-layout
    this.container.classList.toggle('is-list', wantList);

    // INVERT + PLAY: animate from snapshot to new layout
    Flip.from(state, {
      duration: this.duration,
      ease: 'power4.inOut',
      stagger: 0.02,            // tiny cascade — feels orchestrated
      absolute: true,           // take items out of flow mid-flight
      onComplete: () => { this.busy = false; },
    });
  }
}

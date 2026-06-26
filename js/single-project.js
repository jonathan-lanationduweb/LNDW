/* ============================================================
   La Nation du Web — single-project.js
   Scroll HORIZONTAL NATIF : la section est un conteneur overflow-x:auto
   (barre de défilement horizontale réelle). La molette verticale est
   mappée sur le défilement horizontal. Aucune animation/snap.
   La barre .sp-progress reflète l'avancement. Pas de footer.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Menu mobile ---- */
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle) navToggle.addEventListener('click', function () {
    document.body.classList.toggle('nav-open');
  });

  var header  = document.querySelector('.site-header');
  var section = document.getElementById('spSection');
  var fill    = document.getElementById('spProgressFill');
  if (!section) return;

  /* Sous 900px : la page s'empile en vertical (CSS), pas de logique horizontale. */
  if (window.matchMedia('(max-width:900px)').matches) return;

  function update() {
    var max = section.scrollWidth - section.clientWidth;
    var p = max > 0 ? section.scrollLeft / max : 0;
    p = Math.max(0, Math.min(1, p));
    if (fill) fill.style.width = (4 + p * 96) + '%';
    if (header) header.style.background = section.scrollLeft > 40 ? 'rgba(31,30,36,.9)' : 'rgba(40,39,46,.72)';
  }

  /* molette verticale → défilement horizontal (sans inertie/animation) */
  section.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
      section.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  section.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();

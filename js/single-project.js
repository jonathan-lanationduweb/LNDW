/* ============================================================
   La Nation du Web — single-project.js
   Scroll HORIZONTAL (storyboard de mission). Le scroll vertical pilote
   un déplacement horizontal du track : la section est ÉPINGLÉE (pin) et
   le track se translate en X via GSAP ScrollTrigger (scrub). La barre
   .sp-progress reflète l'avancement. Fallback vanilla si GSAP absent.
   Pas de footer : la page finit sur la slide CTA.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Header : fond au scroll + menu mobile ---- */
  var header = document.querySelector('.site-header');
  if (header) window.addEventListener('scroll', function () {
    header.style.background = window.scrollY > 40 ? 'rgba(31,30,36,.9)' : 'rgba(40,39,46,.72)';
  }, { passive: true });
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle) navToggle.addEventListener('click', function () {
    document.body.classList.toggle('nav-open');
  });

  var section = document.getElementById('spSection');
  var track   = document.getElementById('spTrack');
  var fill     = document.getElementById('spProgressFill');
  if (!section || !track) return;

  /* Sous 900px : empilement vertical (CSS), aucun script horizontal. */
  var isMobile = window.matchMedia('(max-width:900px)').matches;
  function setProgress(p){ if (fill) fill.style.width = (4 + Math.max(0, Math.min(1, p)) * 96) + '%'; }

  function distance(){ return Math.max(0, track.scrollWidth - window.innerWidth); }

  /* ---- Voie GSAP (préférée) : section pinnée + translateX scrubé ---- */
  if (!isMobile && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(track, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: function () { return '+=' + distance(); },
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) { setProgress(self.progress); }
      }
    });
    /* recalcule quand images/vidéos changent la largeur du track */
    Array.prototype.forEach.call(track.querySelectorAll('img,video'), function (m) {
      m.addEventListener('load', function () { ScrollTrigger.refresh(); });
      m.addEventListener('loadedmetadata', function () { ScrollTrigger.refresh(); });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    return;
  }

  /* ---- Fallback vanilla (si GSAP indisponible et écran large) ---- */
  if (!isMobile) {
    var wrap = document.createElement('div');           /* on épingle via sticky */
    section.style.position = 'relative';
    var sticky = section;                               /* la section reste, on gère la hauteur sur un parent virtuel */
    /* on enveloppe la section dans un conteneur haut = course du scroll */
    var outer = document.createElement('div');
    outer.style.position = 'relative';
    section.parentNode.insertBefore(outer, section);
    outer.appendChild(section);
    section.style.position = 'sticky';
    section.style.top = '0';
    section.style.height = '100vh';

    function setSize(){
      var d = distance();
      outer.style.height = (d + window.innerHeight) + 'px';
      render();
    }
    function render(){
      var d = distance();
      var x = window.scrollY - outer.offsetTop;
      if (x < 0) x = 0; else if (x > d) x = d;
      track.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
      setProgress(d > 0 ? x / d : 0);
    }
    window.addEventListener('scroll', render, { passive: true });
    window.addEventListener('resize', setSize);
    window.addEventListener('load', setSize);
    Array.prototype.forEach.call(track.querySelectorAll('img,video'), function (m) {
      m.addEventListener('load', setSize); m.addEventListener('loadedmetadata', setSize);
    });
    setSize();
  }
})();

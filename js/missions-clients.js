/* ============================================================
   La Nation du Web — missions-clients.js
   JS SPÉCIFIQUE à missions-clients.html (déplacé depuis le <script> inline).
   ============================================================ */
(function () {
  var header    = document.querySelector('.site-header');
  var isMcPage  = document.body.classList.contains('mc-page');
  var navToggle = document.querySelector('.nav-toggle');

  /* ── header transparent sur le hero, opaque au scroll ── */
  function setHeader(y) {
    if (isMcPage) {
      var opaque = y > 60;
      header.style.background       = opaque ? 'rgba(14,12,20,.92)'          : 'transparent';
      header.style.backdropFilter   = opaque ? 'blur(14px)'                  : 'none';
      header.style.webkitBackdropFilter = opaque ? 'blur(14px)'              : 'none';
      header.style.borderBottomColor = opaque ? 'rgba(250,248,255,.06)'      : 'transparent';
    } else {
      header.style.background = y > 40 ? 'rgba(31,30,36,.9)' : 'rgba(40,39,46,.72)';
    }
  }

  /* état initial (avant tout scroll) */
  setHeader(window.scrollY || 0);
  window.addEventListener('scroll', function () { setHeader(window.scrollY); }, { passive: true });

  /* menu mobile */
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  /* ── Carrousel Splide ── */
  if (typeof Splide !== 'undefined') {
    var el = document.getElementById('mcSplide');
    var sp = new Splide(el, {
      type        : 'loop',
      perPage     : 2,
      padding     : { right: '16%' }, /* partiel de la 3e carte visible */
      gap         : '20px',
      arrows      : false,
      pagination  : false,
      drag        : true,
      autoplay    : false,
      updateOnMove: true,
      breakpoints : {
        980 : { perPage: 1, padding: { right: '28%' } },
        600 : { perPage: 1, padding: { right: '14%' } }
      }
    });

    var fill = document.getElementById('mcProgress');

    /* met à jour la barre de progression */
    function updProgress() {
      if (!fill) return;
      var len = sp.length;
      var i   = sp.index;
      /* segment glissant : largeur = 1/N, translateX = i × 100% */
      fill.style.width     = (100 / len) + '%';
      fill.style.transform = 'translateX(' + (i * 100) + '%)';
    }

    sp.on('mounted move moved', updProgress);
    /* clic sur une carte → naviguer vers ce slide */
    sp.on('click', function (s) { sp.go(s.index); });
    sp.mount();
    updProgress();
  }
})();

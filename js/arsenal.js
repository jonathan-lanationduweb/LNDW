/* ============================================================
   Arsenal — orbite interactive + carte de service
   ============================================================ */

(function () {

  /* --- Header scroll --- */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.background = window.scrollY > 40
        ? 'rgba(31,30,36,.94)'
        : 'rgba(40,39,46,.72)';
    }, { passive: true });
  }

  /* --- Nav mobile --- */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  /* -----------------------------------------------------------------
     Chemins des images (junction image/ → LNDW SITE/image/)
  ----------------------------------------------------------------- */
  var L = 'assets/sections/arsenal/cropped/arsenal-image-left-crop.png';
  var C = 'assets/sections/arsenal/cropped/arsenal-image-center-crop.png';
  var R = 'assets/sections/arsenal/cropped/arsenal-image-right-crop.png';

  /* -----------------------------------------------------------------
     8 services — data-i correspond à l'index dans ce tableau
     0 META ADS  1 WEB  2 SOCIAL MEDIA  3 MARKETING DIGITAL
     4 IA  5 GRAPHISME  6 SEO  7 GOOGLE ADS
  ----------------------------------------------------------------- */
  var SERVICES = [
    {
      n: 'META ADS',
      t: "Touchez les bonnes audiences avec des campagnes publicitaires précises et rentables. Nous structurons vos tunnels, vos créas et vos ciblages pour transformer chaque euro investi en levier de croissance.",
      imgs: [L, C, R]
    },
    {
      n: 'WEB',
      t: "Votre site devient votre base de lancement digitale. Nous créons des expériences web rapides, claires et pensées pour convertir vos visiteurs en prospects, clients ou partenaires.",
      imgs: [C, R, L]
    },
    {
      n: 'SOCIAL MEDIA',
      t: "Transformez vos réseaux sociaux en véritables canaux d'influence. Nous concevons des contenus, formats et campagnes capables de renforcer votre image, engager votre audience et générer des opportunités concrètes.",
      imgs: [R, L, C]
    },
    {
      n: 'MARKETING DIGITAL',
      t: "Pilotez une stratégie de croissance digitale globale et cohérente. Nous synchronisons tous vos leviers d'acquisition pour maximiser votre retour sur investissement et alimenter la puissance de votre moteur de croissance.",
      imgs: [L, C, R]
    },
    {
      n: 'IA',
      t: "Gagnez en vitesse, en précision et en efficacité grâce à l'intelligence artificielle. Nous intégrons des outils et automatisations utiles pour fluidifier vos process et amplifier votre production.",
      imgs: [C, L, R]
    },
    {
      n: 'GRAPHISME',
      t: "Donnez à votre marque une identité forte et mémorable. Nous créons des visuels cohérents, impactants et adaptés à vos supports pour renforcer votre perception et votre crédibilité.",
      imgs: [R, C, L]
    },
    {
      n: 'SEO',
      t: "Construisez une visibilité durable sur les moteurs de recherche. Nous travaillons votre structure, vos contenus et votre autorité pour attirer un trafic qualifié sur le long terme.",
      imgs: [L, R, C]
    },
    {
      n: 'GOOGLE ADS',
      t: "Captez l'intention au moment où elle est la plus forte. Nous construisons des campagnes Google Ads lisibles, suivies et optimisées pour générer des résultats mesurables.",
      imgs: [C, R, L]
    }
  ];

  /* -----------------------------------------------------------------
     Orbite elliptique — slot 3 = centre actif (angle 90°, horizontal)
     Angles en degrés géométriques (0°=droite, 90°=haut, sens trigo)
     Rotation CSS : suit la tangente de la courbe (0° = horizontal)
  ----------------------------------------------------------------- */
  var SLOTS = [
    { a: 155, r: -52 },   // slot 0 — extrême gauche
    { a: 138, r: -35 },   // slot 1
    { a: 118, r: -15 },   // slot 2
    { a:  90, r:   0 },   // slot 3 — centre ACTIF
    { a:  68, r:  12 },   // slot 4
    { a:  48, r:  25 },   // slot 5
    { a:  34, r:  38 },   // slot 6
    { a:  22, r:  48 }    // slot 7 — extrême droite
  ];

  /* Calcule les paramètres d'ellipse depuis les dimensions réelles.
     Centre = centre visuel de la lune (bottom:-775px, largeur min(1280,W)) */
  function getOrbit(container) {
    var W = container.offsetWidth  || 1280;
    var H = container.offsetHeight || 700;
    /* centre lune Y = H + 140 — cohérent avec CSS bottom:calc(-140px - moonR) */
    var cx = W / 2;
    var cy = H + 140;
    var ry = cy - H * 0.08;         // label actif à 8 % du haut de la section
    var rx = W * 0.39;
    return { W: W, H: H, cx: cx, cy: cy, rx: rx, ry: ry };
  }

  /* --- Références DOM --- */
  var svc       = document.getElementById('arsServices');
  var txt       = document.getElementById('arsText');
  var moon      = document.getElementById('arsMoon');
  var imgLeft   = document.getElementById('arsImgLeft');
  var imgCenter = document.getElementById('arsImgCenter');
  var imgRight  = document.getElementById('arsImgRight');
  var moonRot   = 0;
  var activeIdx = 3; /* MARKETING DIGITAL actif par défaut */

  /* -----------------------------------------------------------------
     applyArc(k) — redistribue les 8 labels sur l'ellipse.
     Le label data-i === k prend le slot 3 (90°, centre haut).
     Formule : slot = (j - k + 3 + 8) % 8
  ----------------------------------------------------------------- */
  function applyArc(k) {
    if (!svc) return;
    var orb = getOrbit(svc);
    svc.querySelectorAll('.ars-service').forEach(function (el) {
      var j    = Number(el.dataset.i);
      var slot = (j - k + 3 + 8) % 8;
      var s    = SLOTS[slot];
      var rad  = s.a * Math.PI / 180;
      var x    = orb.cx + orb.rx * Math.cos(rad);
      var y    = orb.cy - orb.ry * Math.sin(rad);
      el.style.left = (x / orb.W * 100).toFixed(2) + '%';
      el.style.top  = (y / orb.H * 100).toFixed(2) + '%';
      el.style.setProperty('--a', s.r + 'deg');
      el.classList.toggle('active', j === k);
    });
  }

  /* -----------------------------------------------------------------
     activate(k) — change le service actif + anime tout
  ----------------------------------------------------------------- */
  function activate(k) {
    var srv = SERVICES[k];

    /* Texte : fade-out → swap → fade-in */
    if (txt) {
      txt.style.opacity = '0';
      setTimeout(function () {
        txt.textContent = srv.t;
        txt.style.opacity = '';
      }, 260);
    }

    /* Images : fade-out → swap → fade-in */
    if (imgLeft && imgCenter && imgRight) {
      imgLeft.style.opacity = imgCenter.style.opacity = imgRight.style.opacity = '0';
      setTimeout(function () {
        imgLeft.src   = srv.imgs[0];
        imgCenter.src = srv.imgs[1];
        imgRight.src  = srv.imgs[2];
        imgLeft.style.opacity = imgCenter.style.opacity = imgRight.style.opacity = '';
      }, 290);
    }

    /* Lune : rotation +22° à chaque activation */
    moonRot += 22;
    if (moon) moon.style.setProperty('--moon-deg', moonRot + 'deg');

    /* Redistribution arc (transition CSS left/top animée) */
    applyArc(k);
    activeIdx = k;
  }

  /* --- Init : positionne les labels et active MARKETING DIGITAL --- */
  applyArc(activeIdx);

  /* --- Clic sur l'orbite --- */
  if (svc) {
    svc.addEventListener('click', function (e) {
      var el = e.target.closest('.ars-service');
      if (!el) return;
      var k = Number(el.dataset.i);
      if (k === activeIdx) return;
      activate(k);
    });
  }

  /* Badge cerveau : masque luminance via CSS — aucun JS requis. */

})();

/* ============================================================
   La Nation du Web — missions-clients.js
   Showcase « 1 écran » : le projet actif change à la MOLETTE sur la
   zone du showcase (vers le bas = suivant, vers le haut = précédent)
   ou au CLIC sur une carte. Le titre, le texte, les tags, le bouton
   et l'image de fond se mettent à jour. Aucune dépendance externe.
   ============================================================ */
(function () {
  "use strict";

  // Assets servis depuis lndw-code/assets (chemins relatifs à missions-clients.html)
  var MC = "assets/sections/missions-clients/";

  /* ───────── Base de données des projets ─────────
     cardImage      = image affichée DANS la carte du carousel
     backgroundImage = grande image affichée EN FOND quand le projet est actif
     (les deux sont volontairement distinctes et ne doivent pas être inversées) */
  var CLIENT_PROJECTS = [
    {
      slug: "premibel-parquet",
      title: "PREMIBEL\nPARQUET",
      cardTitle: "PREMIBEL\nPARQUET",
      description: "Passer de simple site vitrine à leader du secteur sur Google. On a combiné technique web et stratégie publicitaire pour que Premibel devienne le premier réflexe de quiconque cherche du parquet.",
      tags: ["WEB", "SEO", "SOCIAL MEDIA", "MARKETING DIGITAL", "ADS"],
      cardImage:       MC + "premibel/premibel-card.png",
      backgroundImage: MC + "premibel/premibel-hero.png",
      link: "single-project.html?project=premibel-parquet"
    },
    {
      slug: "maison-quivernay",
      title: "MAISON\nQUIVERNAY",
      cardTitle: "MAISON\nQUIVERNAY",
      description: "Déployer une présence digitale premium, cohérente et mémorable pour une marque à forte identité visuelle.",
      tags: ["WEB", "BRANDING", "SOCIAL MEDIA"],
      cardImage:       MC + "maison-quivernay/maison-quivernay-card.png",
      backgroundImage: MC + "maison-quivernay/maison-quivernay-hero.png",
      link: "single-project.html?project=maison-quivernay"
    },
    {
      slug: "ashoka",
      title: "ASHOKA",
      cardTitle: "ASHOKA",
      description: "Structurer une expérience digitale claire, humaine et impactante autour d'une mission engagée.",
      tags: ["WEB", "UX/UI", "STRATÉGIE"],
      cardImage:       MC + "ashoka/ashoka-card.png",
      backgroundImage: MC + "ashoka/ashoka-hero.png",
      link: "single-project.html?project=ashoka"
    },
    {
      slug: "annuaire-francais",
      title: "ANNUAIRE\nFRANCE\nGRATUIT",
      cardTitle: "ANNUAIRE\nFRANCE GRATUIT",
      description: "Moderniser une plateforme de visibilité locale pour renforcer l'accès à l'information et aux professionnels.",
      tags: ["WEB", "SEO", "DATA"],
      cardImage:       MC + "annuaire-francais/annuaire-francais-card.png", // carte : la photo de rue
      backgroundImage: MC + "annuaire-francais/annuaire-francais-hero.png", // fond : le visuel bleu Annuaire
      link: "single-project.html?project=annuaire-francais"
    }
  ];
  var N = CLIENT_PROJECTS.length;

  /* ───────── Éléments ───────── */
  var titleEl = document.getElementById('missionTitle');
  var descEl  = document.getElementById('missionDescription');
  var tagsEl  = document.getElementById('missionTags');
  var btnEl   = document.getElementById('missionButton');
  var bgEl    = document.getElementById('missionBg');
  var cardsEl = document.getElementById('missionCards');
  var fill    = document.getElementById('mcProgress');
  var showcase = document.getElementById('mcShowcase');
  if (!titleEl || !bgEl || !cardsEl) return;

  function nl2br(s) { return s.replace(/\n/g, '<br>'); }

  /* ───────── Couches de fond (une par projet, fondu doux) ───────── */
  var bgLayers = CLIENT_PROJECTS.map(function (p) {
    var img = document.createElement('img');
    img.className = 'mbg';
    img.src = p.backgroundImage;
    img.alt = '';
    img.setAttribute('data-project', p.slug);
    bgEl.appendChild(img);
    return img;
  });

  /* ───────── Cartes persistantes (une par projet) ───────── */
  var cards = CLIENT_PROJECTS.map(function (p, i) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'mission-card';
    card.setAttribute('data-index', i);
    card.setAttribute('data-project', p.slug);
    card.innerHTML =
      '<img src="' + p.cardImage + '" alt="' + p.cardTitle.replace(/\n/g, ' ') + '">' +
      '<span class="mission-card-title">' + nl2br(p.cardTitle) + '</span>';
    card.addEventListener('click', function () { setActiveProject(i); });
    cardsEl.appendChild(card);
    return card;
  });

  /* ───────── Réorganisation des cartes selon le projet actif ─────────
     rôle 0 = projet ACTIF (sorti du paquet, masqué à droite car déjà
     affiché à gauche) ; rôles 1/2/3 = projets suivants, du plus grand
     au plus petit. Les cartes glissent grâce aux transitions CSS. */
  function renderCards() {
    cards.forEach(function (card, i) {
      var rel = (i - activeIndex + N) % N;           // 0..N-1
      card.classList.remove('role-active', 'role-1', 'role-2', 'role-3');
      card.classList.add(rel === 0 ? 'role-active' : 'role-' + rel);
      card.setAttribute('aria-hidden', rel === 0 ? 'true' : 'false');
      card.tabIndex = rel === 0 ? -1 : 0;
    });
  }

  /* ───────── Application d'un projet actif ───────── */
  var activeIndex = 0;
  function setActiveProject(index) {
    activeIndex = (index + N) % N;                   // boucle
    var p = CLIENT_PROJECTS[activeIndex];

    titleEl.innerHTML = nl2br(p.title);
    descEl.textContent = p.description;
    btnEl.href = p.link;

    tagsEl.innerHTML = '';
    p.tags.forEach(function (t) {
      var s = document.createElement('span');
      s.className = 'chip';
      s.textContent = t;
      tagsEl.appendChild(s);
    });

    bgLayers.forEach(function (img, i) { img.classList.toggle('active', i === activeIndex); });
    if (showcase) showcase.setAttribute('data-active-project', p.slug);
    renderCards();
    if (fill) fill.style.width = ((activeIndex + 1) / N * 100) + '%';
  }

  /* ───────── Molette sur le showcase → projet suivant / précédent ─────────
     Tant qu'on est en haut (showcase plein écran), la molette pilote UNIQUEMENT
     le carousel et ne fait JAMAIS défiler la page : arriver sur le dernier
     projet (Annuaire) ne descend pas vers le footer. Le footer se rejoint à la
     main (barre de défilement / clavier). Une fois la page descendue
     (scrollY > 4), la molette redevient un défilement normal.
     isAnimating : petit verrou anti-emballement (450 ms). */
  var isAnimating = false;
  function wheelHandler(e) {
    if (window.scrollY > 4) return;                 // déjà descendu → défilement normal
    e.preventDefault();                             // en haut : la molette ne scrolle jamais vers le footer
    if (isAnimating) return;
    isAnimating = true;
    setActiveProject(activeIndex + (e.deltaY > 0 ? 1 : -1)); // boucle infinie (modulo dans setActiveProject)
    setTimeout(function () { isAnimating = false; }, 450);
  }
  (showcase || cardsEl).addEventListener('wheel', wheelHandler, { passive: false });

  /* ───────── Clavier (accessibilité) : flèches gauche/droite ───────── */
  (showcase || cardsEl).addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setActiveProject(activeIndex + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setActiveProject(activeIndex - 1); }
  });

  /* ───────── Menu mobile ───────── */
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle) navToggle.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });

  setActiveProject(0);
})();

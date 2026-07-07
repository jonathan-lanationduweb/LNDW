/* ============================================================
   La Nation du Web — la-nation.js  (VERSION STATIQUE)
   Animations désactivées temporairement : la maquette statique est prioritaire.
   Ne reste que les interactions de base : fond du header au scroll,
   menu mobile, accordéon FAQ. Aucun GSAP / ScrollTrigger / MotionPath.
   ============================================================ */
(function () {
  "use strict";

  // Mode "flat" (captures de vérification) : neutralise les hauteurs en vh
  if (location.search.indexOf("flat") >= 0) document.documentElement.classList.add("flat");

  /* Header : fond plus opaque au scroll */
  var header = document.querySelector(".site-header");
  if (header) window.addEventListener("scroll", function () {
    header.style.background = window.scrollY > 40 ? "rgba(31,30,36,.92)" : "rgba(40,39,46,.72)";
  }, { passive: true });

  /* Menu mobile */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) toggle.addEventListener("click", function () {
    document.body.classList.toggle("nav-open");
  });

  /* FAQ : accordéon (interaction de base, pas une animation décorative) */
  var faq = document.getElementById("faqList");
  if (faq) faq.addEventListener("click", function (e) {
    var q = e.target.closest(".faq-q"); if (!q) return;
    var item = q.parentElement, isOpen = item.classList.contains("open");
    faq.querySelectorAll(".faq-item").forEach(function (x) { x.classList.remove("open"); });
    if (!isOpen) item.classList.add("open");
  });

  /* ============================================================
     Slide 4 — « Nos missions » : textes pilotés au scroll.
     La section reste FIXE (pin) pendant que 4 grands mots se succèdent.
     Chaque mot apparaît, grossit légèrement, puis disparaît ; le suivant
     prend sa place. Un seul mot dominant à la fois. GSAP + ScrollTrigger.
     Fallback (sans JS / reduced-motion / flat) : liste verticale lisible.
     ============================================================ */
  (function initMissions() {
    var flat   = document.documentElement.classList.contains("flat");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (flat || reduce) return;                       // on garde le fallback statique
    if (!window.gsap || !window.ScrollTrigger) return;

    var section = document.getElementById("lnMissions");
    var sticky  = document.getElementById("lnMissionsSticky");
    var list    = document.getElementById("lnMissionsList");
    if (!section || !sticky || !list) return;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("gsap-ready");
    list.classList.add("js");

    var items = gsap.utils.toArray(".ln-mission-item", list);
    if (!items.length) return;

    // état initial : tout caché sauf le 1er mot (visible dès l'arrivée sur la section)
    gsap.set(items, { opacity: 0, scale: 0.82 });
    gsap.set(items[0], { opacity: 1, scale: 1 });

    var per = 1; // durée relative d'un mot dans la timeline

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: function () { return "+=" + (items.length * window.innerHeight * 0.9); },
        pin: sticky,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    items.forEach(function (el, i) {
      var at = i * per;
      var isFirst = i === 0;
      var isLast  = i === items.length - 1;

      // apparition (le 1er est déjà visible)
      if (!isFirst) {
        tl.fromTo(el, { opacity: 0, scale: 0.82 },
                      { opacity: 1, scale: 1, duration: per * 0.30, ease: "power2.out" }, at);
      }
      // grossit légèrement (dominant)
      tl.to(el, { scale: 1.09, duration: per * (isFirst ? 0.60 : 0.44), ease: "none" },
            at + (isFirst ? 0 : per * 0.30));
      // disparaît (sauf le dernier, qui reste affiché en fin de section)
      if (!isLast) {
        tl.to(el, { opacity: 0, scale: 1.18, duration: per * 0.26, ease: "power2.in" },
              at + per * 0.74);
      }
    });

    // recalage après chargement (polices, images) pour un pin sans saut
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  })();

  /* ============================================================
     Slide 5 — « Pourquoi nous choisir ? » : cartes qui viennent se poser
     DEVANT le grand texte de fond (inspiration Agence Foudre).
     Section pinnée ; au scroll, le grand texte apparaît puis les 4 cartes
     montent du bas (léger stagger + rotation) et restent posées devant.
     Fallback (sans JS / reduced-motion / flat) : cartes visibles, inclinées.
     ============================================================ */
  (function initWhy() {
    var flat   = document.documentElement.classList.contains("flat");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (flat || reduce) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    var section = document.getElementById("lnWhy");
    var bg      = document.querySelector(".ln-why-bg");
    if (!section) return;
    var cards = gsap.utils.toArray(".ln-why-card", section);
    if (!cards.length) return;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("gsap-ready");

    // état initial : cartes en bas, transparentes, un peu réduites, sans rotation
    gsap.set(cards, { y: 190, opacity: 0, scale: 0.86, rotate: 0 });
    if (bg) gsap.set(bg, { opacity: 0.35, scale: 0.96 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=1400",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // 1) le grand texte de fond monte doucement à pleine présence
    if (bg) tl.to(bg, { opacity: 1, scale: 1, duration: 0.25, ease: "none" }, 0);

    // 2) les cartes arrivent du bas, une par une (stagger), devant le texte
    tl.to(cards, {
      y: 0, opacity: 1, scale: 1,
      stagger: 0.12, duration: 0.7, ease: "power2.out"
    }, 0.15);

    // 3) elles se "posent" avec leur inclinaison + léger décalage vertical
    tl.to(".why-card-1", { rotate: -7, duration: 0.3 }, 0.42);
    tl.to(".why-card-2", { rotate: 1,  y: -18, duration: 0.3 }, 0.47);
    tl.to(".why-card-3", { rotate: -1, y: -14, duration: 0.3 }, 0.52);
    tl.to(".why-card-4", { rotate: 7,  duration: 0.3 }, 0.57);

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  })();
})();

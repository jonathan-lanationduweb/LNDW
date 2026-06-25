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
})();

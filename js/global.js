/* ============================================================
   La Nation du Web — global.js
   Comportement commun à toutes les pages (header + menu mobile).
   Code identique qui était dupliqué en <script> inline dans
   plusieurs pages — regroupé ici (global = global).
   ============================================================ */
(function () {
  "use strict";
  var header = document.querySelector(".site-header");
  if (header) window.addEventListener("scroll", function () {
    header.style.background = window.scrollY > 40 ? "rgba(31,30,36,.9)" : "rgba(40,39,46,.72)";
  }, { passive: true });

  var toggle = document.querySelector(".nav-toggle");
  if (toggle) toggle.addEventListener("click", function () {
    document.body.classList.toggle("nav-open");
  });
})();

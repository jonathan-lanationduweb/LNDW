/* ============================================================
   La Nation du Web — contact.js
   Page Contact : formulaire (front-end) + réservation de créneau
   (calendrier Juin 2026 statique → panneau horaires → confirmation).
   Aucun backend / fetch / API. Tout est côté navigateur.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- HEADER (fond au scroll) + menu mobile ---------- */
  var header = document.querySelector(".site-header");
  if (header) window.addEventListener("scroll", function () {
    header.style.background = window.scrollY > 40 ? "rgba(31,30,36,.9)" : "rgba(40,39,46,.72)";
  }, { passive: true });
  var navToggle = document.querySelector(".nav-toggle");
  if (navToggle) navToggle.addEventListener("click", function () {
    document.body.classList.toggle("nav-open");
  });

  /* ---------- État de la réservation ---------- */
  var booking = { day: null, dateLabel: "", time: "" };

  var cal       = document.getElementById("cal");
  var widget    = document.getElementById("bookingWidget");   // carte extensible
  var tpDate    = document.getElementById("selDate");
  var timeGrid  = document.getElementById("timeSlots");
  var tpRecap   = document.getElementById("slotRecap");
  var tpConfirm = document.getElementById("confirmSlot");
  var tpResult  = document.getElementById("slotResult");
  var summary     = document.getElementById("bookingSummary");
  var summaryText = document.getElementById("bookingSummaryText");

  function formatDate(day) {
    // Juin 2026 (index de mois = 5)
    try {
      return new Date(2026, 5, day).toLocaleDateString("fr-FR",
        { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } catch (e) { return day + " juin 2026"; }
  }

  /* ---------- fermeture (re-clic sur la date active) ---------- */
  function closeBooking() {
    booking.day = null; booking.time = "";
    if (cal) cal.querySelectorAll("button.on").forEach(function (b) { b.classList.remove("on"); });
    if (timeGrid) timeGrid.querySelectorAll("button.on").forEach(function (s) { s.classList.remove("on"); });
    if (tpRecap) tpRecap.classList.remove("is-show");
    if (tpConfirm) tpConfirm.classList.remove("is-show");
    if (tpResult) tpResult.classList.remove("is-show");
    if (widget) { widget.classList.remove("is-expanded"); widget.setAttribute("data-expanded", "false"); }
  }

  /* ---------- selectDate (toggle) ---------- */
  function selectDate(btn) {
    if (!cal) return;
    var day = btn.getAttribute("data-day");
    // re-clic sur la date déjà active → on referme l'extension
    if (booking.day === day) { closeBooking(); return; }

    cal.querySelectorAll("button.on").forEach(function (b) { b.classList.remove("on"); });
    btn.classList.add("on");
    booking.day = day;
    booking.dateLabel = formatDate(parseInt(day, 10));
    booking.time = "";

    if (tpDate) tpDate.textContent = "Pour le " + booking.dateLabel;
    if (timeGrid) timeGrid.querySelectorAll("button.on").forEach(function (s) { s.classList.remove("on"); });
    if (tpRecap) tpRecap.classList.remove("is-show");
    if (tpConfirm) tpConfirm.classList.remove("is-show");
    if (tpResult) tpResult.classList.remove("is-show");
    if (widget) { widget.classList.add("is-expanded"); widget.setAttribute("data-expanded", "true"); }
  }

  /* ---------- selectTime ---------- */
  function selectTime(btn) {
    timeGrid.querySelectorAll("button.on").forEach(function (s) { s.classList.remove("on"); });
    btn.classList.add("on");
    booking.time = btn.textContent.trim();
    if (tpRecap) {
      tpRecap.innerHTML = "Rendez-vous sélectionné : <b>" + booking.dateLabel + " à " + booking.time + "</b>";
      tpRecap.classList.add("is-show");
    }
    if (tpConfirm) tpConfirm.classList.add("is-show");
    if (tpResult) tpResult.classList.remove("is-show");
  }

  /* ---------- confirmBooking ---------- */
  function confirmBooking() {
    if (!booking.day || !booking.time) return;
    if (tpResult) {
      tpResult.textContent = "Votre créneau a été sélectionné. Nous vous confirmerons le rendez-vous par e-mail.";
      tpResult.classList.add("is-show");
    }
    // Reporte le créneau dans le formulaire de contact
    if (summary && summaryText) {
      summaryText.textContent = booking.dateLabel + " à " + booking.time;
      summary.classList.add("is-set");
    }
  }

  /* ---------- initBookingCalendar ---------- */
  function initBookingCalendar() {
    if (cal) cal.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-day]");
      if (b && !b.disabled) selectDate(b);
    });
    if (timeGrid) timeGrid.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) selectTime(b);
    });
    if (tpConfirm) tpConfirm.addEventListener("click", confirmBooking);
  }

  /* ---------- initContactForm ---------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    var msg  = document.getElementById("formMsg");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // pas de backend pour le moment
      if (msg) {
        msg.textContent = "Votre demande est prête à être envoyée. Nous vous recontacterons rapidement.";
        msg.classList.add("is-show");
      }
    });
  }

  initBookingCalendar();
  initContactForm();
})();

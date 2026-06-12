/* ============================================================
   La Nation du Web -- la-nation.js v3
   1. Shuriken  -- arc courbe CSS keyframe
   2. Timeline  -- carrousel + swipe + auto-avance
   3. Missions  -- scroll sticky + carre expansif
   4. Why cards -- stagger scroll un par un
   5. Reactor   -- fusee getPointAtLength + progress path + bulles
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     1. SHURIKEN + TEXT REVEAL
     Le shuriken arrive en arc puis déclenche l'apparition lettre par
     lettre du titre via clip-path wipe, puis fade-in du sous-titre.
     ============================================================ */
  var shuriken = document.getElementById("lnShuriken");
  var lnTitle  = document.querySelector(".ln-title");
  var lnHText  = document.querySelector(".ln-hero-text");

  /* éclate le titre en <span class="ln-letter"> par caractère */
  function splitIntoLetters(el) {
    var nodes = Array.from(el.childNodes);
    el.innerHTML = "";
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split("").forEach(function (ch) {
          var s = document.createElement("span");
          s.className = "ln-letter";
          s.textContent = ch;
          s.style.clipPath = "inset(0 108% 0 0)";
          el.appendChild(s);
        });
      } else {
        el.appendChild(n.cloneNode(true));
      }
    });
  }

  var titleRevealed = false;
  function revealTitle() {
    if (titleRevealed) return;
    titleRevealed = true;
    var letters = lnTitle ? Array.from(lnTitle.querySelectorAll(".ln-letter")) : [];
    letters.forEach(function (l, i) {
      setTimeout(function () {
        l.style.transition = "clip-path .55s cubic-bezier(.16,.84,.44,1)";
        l.style.clipPath    = "inset(0 0% 0 0)";
      }, i * 58);
    });
    var totalMs = letters.length * 58 + 360;
    setTimeout(function () {
      if (lnHText) lnHText.classList.add("lh-in");
    }, totalMs);
  }

  if (shuriken) {
    if (reduce) {
      shuriken.style.transform = "none";
      shuriken.style.opacity   = "1";
      if (lnTitle) { /* pas de split — texte déjà visible */ }
      if (lnHText) { lnHText.style.transition = "none"; lnHText.classList.add("lh-in"); }
    } else {
      if (lnTitle) splitIntoLetters(lnTitle);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          shuriken.classList.add("fly-in");
        });
      });
      shuriken.addEventListener("animationend", revealTitle, { once: true });
      /* fallback si animationend ne tire pas */
      setTimeout(revealTitle, 2200);
    }
  }

  /* ============================================================
     2. TIMELINE CARROUSEL
     ============================================================ */
  var tlSlides = Array.from(document.querySelectorAll(".ln-tl-slide"));
  var tlDots   = Array.from(document.querySelectorAll(".ln-tl-dots button"));
  var tlPrev   = document.getElementById("lnTlPrev");
  var tlNext   = document.getElementById("lnTlNext");
  var tlCur    = 0;
  var tlTimer  = null;

  function tlGo(n) {
    n = ((n % tlSlides.length) + tlSlides.length) % tlSlides.length;
    tlSlides[tlCur].classList.remove("active");
    tlDots[tlCur].classList.remove("active");
    tlCur = n;
    tlSlides[tlCur].classList.add("active");
    tlDots[tlCur].classList.add("active");
    tlResetAuto();
  }

  function tlResetAuto() {
    clearInterval(tlTimer);
    if (!reduce) {
      tlTimer = setInterval(function () { tlGo(tlCur + 1); }, 6000);
    }
  }

  if (tlSlides.length) {
    tlDots.forEach(function (btn, i) {
      btn.addEventListener("click", function () { tlGo(i); });
    });
    if (tlPrev) tlPrev.addEventListener("click", function () { tlGo(tlCur - 1); });
    if (tlNext) tlNext.addEventListener("click", function () { tlGo(tlCur + 1); });

    var tlInner = document.querySelector(".ln-tl-wrap");
    if (tlInner) {
      var tx = 0;
      tlInner.addEventListener("touchstart", function (e) {
        tx = e.changedTouches[0].clientX;
      }, { passive: true });
      tlInner.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 44) tlGo(dx < 0 ? tlCur + 1 : tlCur - 1);
      }, { passive: true });
    }

    tlResetAuto();
  }

  /* ============================================================
     3. MISSIONS STICKY -- scroll-driven + carre expansif
     ============================================================ */
  var missionSection = document.querySelector(".ln-missions-section");
  var missionItems   = Array.from(document.querySelectorAll(".ln-mission-item"));
  var missionText    = document.getElementById("lnMissionText");
  var missionSquare  = document.getElementById("lnMissionsSquare");
  var lastMIdx       = -1;

  var MISSION_TEXTS = [
    "Vous rendre totalement maitre de votre univers digital : vos acces, vos donnees, vos outils. Pas de boite noire, pas de dependance — vous gardez la souverainete complete sur votre croissance.",
    "Transformer la complexite en vitesse. Grace a une maitrise technique poussee et a l'IA, nous accelerons votre time-to-market et demultiplions votre capacite d'execution.",
    "Voir l'ensemble du terrain en permanence. Chaque levier (Web, SEO, Social, Ads) est interconnecte et pilote depuis un poste de commandement unique pour un impact immediat sur vos KPIs.",
    "Conquerir de nouveaux territoires. Nous deployons votre marque la ou vos concurrents voient des obstacles, pour etendre durablement votre part de marche."
  ];

  var SQUARE_SCALES = [0.8, 2.4, 5, 10];

  function setMission(idx) {
    if (idx === lastMIdx) return;
    lastMIdx = idx;
    missionItems.forEach(function (el, i) {
      el.classList.toggle("active", i === idx);
    });
    if (missionText) {
      missionText.classList.add("fade-out");
      var newTxt = MISSION_TEXTS[idx] || "";
      setTimeout(function () {
        missionText.textContent = newTxt;
        missionText.classList.remove("fade-out");
      }, 170);
    }
    if (missionSquare) {
      var sc = SQUARE_SCALES[idx] !== undefined ? SQUARE_SCALES[idx] : 0.8;
      missionSquare.style.transform = "translate(-50%,-50%) scale(" + sc + ")";
    }
  }

  function onScrollMissions() {
    if (!missionSection) return;
    var rect      = missionSection.getBoundingClientRect();
    var sectH     = missionSection.offsetHeight;
    var vh        = window.innerHeight;
    var scrollable = sectH - vh;
    var progress  = Math.min(1, Math.max(0, -rect.top / scrollable));
    var idx = Math.min(missionItems.length - 1, Math.floor(progress * missionItems.length));
    setMission(idx);
  }

  if (missionSection) {
    setMission(0);
    window.addEventListener("scroll", onScrollMissions, { passive: true });
    onScrollMissions();
  }

  /* ============================================================
     4. WHY CARDS -- stagger scroll : une carte a la fois
     ============================================================ */
  var whySection = document.querySelector(".ln-why-section");
  var whyCards   = Array.from(document.querySelectorAll(".ln-why-card"));
  var CARD_ROTS  = [-4, 3.5, -2.5, 4.5];
  var N          = whyCards.length;

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function onScrollWhy() {
    if (!whySection) return;
    var rect      = whySection.getBoundingClientRect();
    var sectH     = whySection.offsetHeight;
    var vh        = window.innerHeight;
    var scrollable = sectH - vh;
    var progress  = Math.min(1, Math.max(0, -rect.top / scrollable));

    whyCards.forEach(function (card, i) {
      var rot = CARD_ROTS[i] !== undefined ? CARD_ROTS[i] : 0;
      if (reduce) {
        card.style.transform = "rotate(" + rot + "deg) translateY(0)";
        return;
      }
      var start   = (i / N) * 0.80;
      var winSize = 0.24;
      var end     = start + winSize;
      var y;
      if (progress <= start) {
        y = 150;
      } else if (progress >= end) {
        y = 0;
      } else {
        var p = (progress - start) / winSize;
        y = 150 * (1 - easeInOut(p));
      }
      card.style.transform = "rotate(" + rot + "deg) translateY(" + y + "vh)";
    });
  }

  if (whySection) {
    window.addEventListener("scroll", onScrollWhy, { passive: true });
    onScrollWhy();
  }

  /* ============================================================
     5. REACTOR -- fusee sur chemin SVG + progress + bulles
     ============================================================ */
  var reactorSection = document.querySelector(".ln-reactor");
  var pathBase       = document.getElementById("rktPathBase");
  var pathProgress   = document.getElementById("rktPathProgress");
  var rocket         = document.getElementById("lnRocket");
  var profiles       = Array.from(document.querySelectorAll(".ln-profile"));

  if (pathBase && rocket && reactorSection) {
    var stage    = document.getElementById("lnReactorStage");
    var totalLen = 0;

    function refreshLen() {
      totalLen = pathBase.getTotalLength();
      if (pathProgress) {
        pathProgress.style.strokeDasharray  = String(totalLen);
        pathProgress.style.strokeDashoffset = String(totalLen);
      }
    }

    if (document.readyState === "complete") {
      refreshLen();
    } else {
      window.addEventListener("load", refreshLen);
    }
    window.addEventListener("resize", function () {
      refreshLen();
      onScrollReactor();
    });

    function onScrollReactor() {
      if (!stage) return;
      var rect     = reactorSection.getBoundingClientRect();
      var sectH    = reactorSection.offsetHeight;
      var vh       = window.innerHeight;
      var progress = Math.min(1, Math.max(0,
        (vh * 0.85 - rect.top) / (sectH * 0.78)
      ));

      if (totalLen === 0) { refreshLen(); return; }

      rocket.style.opacity = progress > 0.005 ? "1" : "0";

      var dist  = progress * totalLen;
      var pt    = pathBase.getPointAtLength(dist);
      var ptN   = pathBase.getPointAtLength(Math.min(dist + 8, totalLen));
      var angle = Math.atan2(ptN.y - pt.y, ptN.x - pt.x) * 180 / Math.PI;

      var svg       = pathBase.closest("svg");
      var svgRect   = svg.getBoundingClientRect();
      var stageRect = stage.getBoundingClientRect();
      var VBW = 1200, VBH = 480;
      var sx  = svgRect.width  / VBW;
      var sy  = svgRect.height / VBH;

      var px = (svgRect.left - stageRect.left) + pt.x * sx;
      var py = (svgRect.top  - stageRect.top)  + pt.y * sy;

      rocket.style.left      = px + "px";
      rocket.style.top       = py + "px";
      rocket.style.transform = "translate(-50%,-50%) rotate(" + angle + "deg)";

      if (pathProgress) {
        pathProgress.style.strokeDashoffset = String(Math.max(0, totalLen - dist));
      }

      profiles.forEach(function (p) {
        var leftPct = parseFloat(p.style.left) / 100;
        if (progress >= leftPct * 0.92) {
          p.classList.add("visible");
        }
      });
    }

    if (reduce) {
      profiles.forEach(function (p) { p.classList.add("visible"); });
      rocket.style.opacity = "0";
    } else {
      window.addEventListener("scroll", onScrollReactor, { passive: true });
      onScrollReactor();
    }

    profiles.forEach(function (p) {
      p.addEventListener("click", function (e) {
        var isOpen = p.classList.contains("bubble-open");
        profiles.forEach(function (x) { x.classList.remove("bubble-open"); });
        if (!isOpen) p.classList.add("bubble-open");
        e.stopPropagation();
      });
    });
    document.addEventListener("click", function () {
      profiles.forEach(function (p) { p.classList.remove("bubble-open"); });
    });
  }

})();

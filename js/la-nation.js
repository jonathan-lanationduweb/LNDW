/* ============================================================
   La Nation du Web — la-nation.js
   Animations spécifiques à la page La Nation :
   1. Shuriken (hero, entrée courbe)
   2. Timeline carrousel (dots, swipe, auto)
   3. Missions sticky (scroll progress)
   4. Why cards (scroll stagger)
   5. Reactor rocket (scroll sur chemin SVG)
   ============================================================ */
(function () {
  'use strict';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==================================================================
     1. SHURIKEN — entrée au load via keyframe CSS + classe JS
     ================================================================== */
  const shuriken = document.getElementById('lnShuriken');
  if (shuriken) {
    if (reduce) {
      shuriken.style.transform = 'none';
      shuriken.style.opacity = '1';
    } else {
      requestAnimationFrame(() => {
        shuriken.classList.add('shuriken-in');
      });
    }
  }

  /* ==================================================================
     2. TIMELINE CARROUSEL
     ================================================================== */
  const tlSlides = Array.from(document.querySelectorAll('.ln2-tl-slide'));
  const tlDots   = Array.from(document.querySelectorAll('.ln2-tl-dots button'));

  if (tlSlides.length && tlDots.length) {
    let current = 0;
    let autoTimer = null;

    function goToSlide(n) {
      n = ((n % tlSlides.length) + tlSlides.length) % tlSlides.length;
      tlSlides[current].classList.remove('active');
      tlDots[current].classList.remove('active');
      current = n;
      tlSlides[current].classList.add('active');
      tlDots[current].classList.add('active');
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      if (!reduce) {
        autoTimer = setInterval(() => goToSlide(current + 1), 6000);
      }
    }

    // Dots — clic
    tlDots.forEach((btn, i) => {
      btn.addEventListener('click', () => goToSlide(i));
    });

    // Swipe touch
    const tlInner = document.querySelector('.ln2-tl-inner');
    if (tlInner) {
      let touchStartX = 0;
      tlInner.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      tlInner.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          goToSlide(dx < 0 ? current + 1 : current - 1);
        }
      }, { passive: true });
    }

    resetAuto();
  }

  /* ==================================================================
     3. MISSIONS STICKY — scroll progress → item actif + bulle BG
     ================================================================== */
  const missionSection = document.querySelector('.ln2-missions-section');
  const missionItems   = Array.from(document.querySelectorAll('.ln2-mission-item'));
  const missionText    = document.getElementById('lnMissionText');
  const missionsBg     = document.getElementById('lnMissionsBg');

  const MISSION_TEXTS = [
    "Vous rendre totalement maître de votre univers digital : vos accès, vos données, vos outils. Pas de boîte noire, pas de dépendance — vous gardez la souveraineté complète sur votre croissance.",
    "Transformer la complexité en vitesse. Grâce à une maîtrise technique poussée et à l'IA, nous accélérons votre time-to-market et démultiplions votre capacité d'exécution.",
    "Voir l'ensemble du terrain en permanence. Chaque levier (Web, SEO, Social, Ads) est interconnecté et piloté depuis un poste de commandement unique pour un impact immédiat sur vos KPIs.",
    "Conquérir de nouveaux territoires. Nous déployons votre marque là où vos concurrents voient des obstacles, pour étendre durablement votre part de marché."
  ];

  let lastMissionIdx = -1;

  function setMissionActive(idx) {
    if (idx === lastMissionIdx) return;
    lastMissionIdx = idx;
    missionItems.forEach((el, i) => el.classList.toggle('active', i === idx));
    if (missionText) {
      missionText.classList.add('fade-out');
      setTimeout(() => {
        missionText.textContent = MISSION_TEXTS[idx];
        missionText.classList.remove('fade-out');
      }, 150);
    }
    // Scale bulle de fond selon index
    const scales = [0, 0.5, 1, 1.6];
    if (missionsBg) {
      missionsBg.style.transform = `scale(${scales[idx] || 0})`;
    }
  }

  function onScrollMissions() {
    if (!missionSection) return;
    const rect = missionSection.getBoundingClientRect();
    const sectionH = missionSection.offsetHeight;
    const stickyH  = window.innerHeight;
    // progress 0→1 à travers les 300vh (en excluant la dernière "page" sticky)
    const scrollable = sectionH - stickyH;
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

    const idx = Math.min(
      missionItems.length - 1,
      Math.floor(progress * missionItems.length)
    );
    setMissionActive(idx);
  }

  if (missionSection) {
    setMissionActive(0);
    window.addEventListener('scroll', onScrollMissions, { passive: true });
    onScrollMissions();
  }

  /* ==================================================================
     4. WHY CARDS — scroll stagger (cartes arrivent du bas une par une)
     ================================================================== */
  const whySection = document.querySelector('.ln2-why-section');
  const whyCards   = Array.from(document.querySelectorAll('.ln2-why-card'));

  function onScrollWhy() {
    if (!whySection) return;
    const rect = whySection.getBoundingClientRect();
    const sectionH = whySection.offsetHeight;
    const stickyH  = window.innerHeight;
    const scrollable = sectionH - stickyH;
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

    whyCards.forEach((card, i) => {
      // La carte i arrive quand progress atteint i/(n-1)*0.85
      const threshold = (i / (whyCards.length)) * 0.90;
      if (reduce) {
        card.style.transform = `rotate(var(--rot)) translateY(0)`;
      } else if (progress >= threshold) {
        const cardProg = Math.min(1, (progress - threshold) / (0.25));
        const yVal = 130 - 130 * cardProg;
        card.style.transform = `rotate(var(--rot)) translateY(${yVal}vh)`;
      } else {
        card.style.transform = `rotate(var(--rot)) translateY(130vh)`;
      }
    });
  }

  if (whySection) {
    window.addEventListener('scroll', onScrollWhy, { passive: true });
    onScrollWhy();
  }

  /* ==================================================================
     5. REACTOR — fusée suit le chemin SVG au scroll
     ================================================================== */
  const reactorSection  = document.querySelector('.ln2-reactor');
  const pathEl          = document.getElementById('reactorPathBase');
  const progressPath    = document.getElementById('reactorPathProgress');
  const rocket          = document.getElementById('reactorRocket');
  const profiles        = Array.from(document.querySelectorAll('.ln2-rp'));

  if (pathEl && rocket && reactorSection) {
    let totalLen = 0;

    function refreshLen() {
      totalLen = pathEl.getTotalLength();
      if (progressPath) {
        progressPath.style.strokeDasharray = totalLen;
        progressPath.style.strokeDashoffset = totalLen;
      }
    }
    refreshLen();

    function onScrollReactor() {
      const rect     = reactorSection.getBoundingClientRect();
      const sectionH = reactorSection.offsetHeight;
      const vh       = window.innerHeight;
      // progress 0→1 : commence quand la section entre dans la moitié basse du viewport,
      // finit quand la section quitte la partie haute
      const progress = Math.min(1, Math.max(0,
        (vh * 0.8 - rect.top) / (sectionH * 0.7)
      ));

      if (totalLen === 0) return;
      const dist = progress * totalLen;
      const pt   = pathEl.getPointAtLength(dist);
      const ptN  = pathEl.getPointAtLength(Math.min(dist + 4, totalLen));
      const angle = Math.atan2(ptN.y - pt.y, ptN.x - pt.x) * 180 / Math.PI;

      // Convertir coordonnées SVG → pixels relatifs au .ln2-reactor-stage
      const svg       = pathEl.closest('svg');
      const svgRect   = svg.getBoundingClientRect();
      const stage     = reactorSection.querySelector('.ln2-reactor-stage');
      const stageRect = stage.getBoundingClientRect();
      const vbW = 1200, vbH = 600;
      const scaleX = svgRect.width  / vbW;
      const scaleY = svgRect.height / vbH;

      const x = (svgRect.left - stageRect.left) + pt.x * scaleX;
      const y = (svgRect.top  - stageRect.top)  + pt.y * scaleY;

      rocket.style.left      = x + 'px';
      rocket.style.top       = y + 'px';
      rocket.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;

      // Mise à jour du tracé lumineux
      if (progressPath) {
        progressPath.style.strokeDashoffset = totalLen - dist;
      }

      // Révéler les profils progressivement au passage de la fusée
      profiles.forEach(p => {
        const leftPct = parseFloat(p.style.left) / 100; // 0→1
        if (progress >= leftPct - 0.08) {
          p.classList.add('visible');
        }
      });
    }

    if (reduce) {
      // Sans animation : tout visible d'emblée
      profiles.forEach(p => p.classList.add('visible'));
      rocket.style.opacity = '0';
    } else {
      window.addEventListener('scroll', onScrollReactor, { passive: true });
      window.addEventListener('resize', () => { refreshLen(); onScrollReactor(); });
      onScrollReactor();
    }
  }

})();

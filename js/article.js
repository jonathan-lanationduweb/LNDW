/* ============================================================
   La Nation du Web — article.js
   Article de blog dynamique (front-end only) : lit ?post=<slug>
   dans l'URL et injecte le contenu correspondant. Aucun backend.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Header (fond au scroll) + menu mobile ---------- */
  var header = document.querySelector(".site-header");
  if (header) addEventListener("scroll", function () {
    header.style.background = scrollY > 40 ? "rgba(31,30,36,.9)" : "rgba(40,39,46,.72)";
  }, { passive: true });
  var navToggle = document.querySelector(".nav-toggle");
  if (navToggle) navToggle.addEventListener("click", function () {
    document.body.classList.toggle("nav-open");
  });

  /* ---------- Base d'images des cartes blog ---------- */
  var IMG = "../LNDW%20SITE/image/assets/sections/blog/cards/";

  /* ---------- Base de données front-end des articles ---------- */
  var BLOG_POSTS = {
    "scroller-ou-swiper": {
      title: "Scroller ou swiper ?",
      tags: ["WEB", "SOCIAL MEDIA"],
      meta: "Par la Rédaction LNDW · 1ᵉʳ juin 2026 · Web",
      hero: IMG + "blog-featured-mobile-ui.png",
      body: IMG + "blog-card-vertical-format.png",
      introTitle: "L'architecture de l'attention à l'ère de l'hyper-vitesse.",
      intro: "Le scroll vertical et le swipe horizontal ne sont pas de simples gestes : ce sont deux philosophies d'attention. L'un déroule un flux continu, l'autre impose un rythme par cartes.",
      quote: "Le geste n'est pas neutre : il façonne la manière dont votre message est perçu, mémorisé et partagé.",
      excerpt: "Scroll vertical ou swipe horizontal : quel format domine vraiment l'engagement aujourd'hui ?",
      sections: [
        { h2: "Le scroll : le vecteur de la souveraineté", p: "Le scroll laisse l'utilisateur maître de son rythme. Il favorise l'immersion, le storytelling long et la fidélisation. C'est le format de la profondeur." },
        { h2: "Le swipe : le propulseur d'efficacité", p: "Le swipe segmente l'information en unités digestes. Il accélère la consommation et booste l'interaction, au prix d'une attention plus volatile." },
        { h2: "Verdict : la stratégie hybride", p: "La vraie performance ne consiste pas à choisir un camp, mais à orchestrer les deux : du swipe pour capter, du scroll pour convertir et fidéliser." }
      ]
    },
    "seo-est-il-mort": {
      title: "Le SEO est-il mort ?",
      tags: ["WEB", "SEO"],
      meta: "Par la Rédaction LNDW · 1ᵉʳ juin 2026 · SEO",
      hero: IMG + "blog-card-seo-team.png",
      body: IMG + "blog-card-seo-team.png",
      introTitle: "Le SEO n'est pas mort, il change de territoire.",
      intro: "On enterre le référencement naturel à chaque nouvelle vague technologique. Pourtant, il ne disparaît pas : il se déplace là où se porte l'attention.",
      quote: "Le SEO ne meurt pas, il migre vers de nouveaux moteurs : IA générative, réponses directes, recherche conversationnelle.",
      excerpt: "Entre IA générative et SGE, le référencement naturel se réinvente. Ce qui change vraiment pour votre visibilité.",
      sections: [
        { h2: "Pourquoi le SEO reste stratégique", p: "Le trafic organique reste la source la plus rentable et la plus durable. Une bonne base SEO continue de soutenir toute la chaîne d'acquisition." },
        { h2: "L'IA change la façon de chercher", p: "Les moteurs répondent désormais directement. Il faut structurer son contenu pour être cité par les IA, pas seulement classé dans les liens bleus." },
        { h2: "Comment rester visible en 2026", p: "Autorité thématique, données structurées, expérience de page et contenu réellement utile : les fondamentaux deviennent décisifs." }
      ]
    },
    "shopify-vs-wordpress": {
      title: "Shopify vs WordPress",
      tags: ["WEB", "DESIGN"],
      meta: "Par la Rédaction LNDW · 1ᵉʳ juin 2026 · Web",
      hero: IMG + "blog-card-shopify-cart.png",
      body: IMG + "blog-card-shopify-cart.png",
      introTitle: "Choisir la bonne plateforme pour vendre et convertir.",
      intro: "Shopify et WordPress ne s'opposent pas frontalement : ils répondent à deux logiques de croissance différentes. Le bon choix dépend de votre modèle.",
      quote: "La plateforme n'est pas une religion : c'est un levier au service de votre stratégie de conversion.",
      excerpt: "Quelle plateforme pour votre e-commerce ? Comparatif honnête selon vos objectifs et votre budget.",
      sections: [
        { h2: "Deux logiques, deux stratégies", p: "Shopify privilégie la simplicité et la vente clé en main. WordPress (WooCommerce) mise sur la liberté, le contenu et la personnalisation totale." },
        { h2: "La question du contrôle", p: "Avec WordPress vous possédez tout, au prix de la maintenance. Avec Shopify vous louez un écosystème fiable, au prix de certaines limites." },
        { h2: "Notre verdict", p: "Pour un pure player e-commerce qui veut aller vite : Shopify. Pour une marque éditoriale et SEO-driven : WordPress. Souvent, l'hybride gagne." }
      ]
    },
    "format-vertical": {
      title: "Le format vertical",
      tags: ["SOCIAL MEDIA", "ADS"],
      meta: "Par la Rédaction LNDW · 1ᵉʳ juin 2026 · Social Media",
      hero: IMG + "blog-card-vertical-format.png",
      body: IMG + "blog-card-vertical-format.png",
      introTitle: "Le format vertical est devenu le langage natif de l'attention.",
      intro: "Le 9:16 n'est plus une option mobile : c'est le standard de consommation. Penser horizontal aujourd'hui, c'est parler une langue que l'audience ne lit plus.",
      quote: "Le vertical n'est pas un format, c'est une posture : plein écran, immersif, sans distraction.",
      excerpt: "Pourquoi le 9:16 a conquis le web et comment l'exploiter dans votre stratégie de contenu.",
      sections: [
        { h2: "Pourquoi le vertical domine", p: "Le pouce, l'écran tenu d'une main, le plein cadre : tout pousse au vertical. Les plateformes ont aligné leurs algorithmes sur cet usage." },
        { h2: "Concevoir pour le pouce", p: "Accroche dès la première seconde, texte lisible sans son, rythme rapide : le vertical impose une grammaire visuelle propre." },
        { h2: "L'intégrer à votre stratégie", p: "Déclinez un même message en vertical pour le social et en horizontal pour le site. Une production, plusieurs surfaces." }
      ]
    },
    "automatisations-travail": {
      title: "5 automatisations pour le travail",
      tags: ["IA", "MARKETING DIGITAL"],
      meta: "Par la Rédaction LNDW · 1ᵉʳ juin 2026 · IA",
      hero: IMG + "blog-card-automation-laptop.png",
      body: IMG + "blog-card-automation-laptop.png",
      introTitle: "Automatiser sans déshumaniser votre organisation.",
      intro: "L'automatisation ne remplace pas l'humain : elle le libère des tâches sans valeur. Bien dosée, elle redonne du temps à ce qui compte vraiment.",
      quote: "Automatiser, ce n'est pas faire faire à la machine : c'est arrêter de faire ce qui n'aurait jamais dû vous prendre du temps.",
      excerpt: "Gagnez des heures chaque semaine grâce à des workflows automatisés simples et puissants.",
      sections: [
        { h2: "Les tâches à automatiser en priorité", p: "Relances, reporting, tri d'e-mails, publication sociale, qualification de leads : commencez par le répétitif et le mesurable." },
        { h2: "Connecter vos outils", p: "Le vrai gain vient de l'orchestration entre vos outils. Un déclencheur, une action, et la donnée circule sans copier-coller." },
        { h2: "Garder l'humain dans la boucle", p: "Automatisez l'exécution, pas la décision. Un point de validation au bon endroit évite les dérives et préserve la qualité." }
      ]
    },
    "landing-page-2": {
      title: "Landing page 2.0",
      tags: ["WEB", "MARKETING DIGITAL"],
      meta: "Par la Rédaction LNDW · 1ᵉʳ juin 2026 · Conversion",
      hero: IMG + "blog-card-shopify-cart.png",
      body: IMG + "blog-card-shopify-cart.png",
      introTitle: "La landing page n'est plus une page, c'est un système.",
      intro: "Une landing qui convertit en 2026 ne se résume plus à un beau visuel et un bouton. C'est un enchaînement pensé entre promesse, preuve et action.",
      quote: "Une landing page ne se design pas, elle se démontre : chaque section doit lever une objection.",
      excerpt: "Les principes d'une landing page qui convertit : structure, vitesse et preuve sociale.",
      sections: [
        { h2: "Promesse claire en 3 secondes", p: "Le visiteur doit comprendre l'offre, pour qui et pourquoi maintenant, avant même de scroller. La clarté bat la créativité." },
        { h2: "Preuve et réassurance", p: "Témoignages, chiffres, logos, garanties : la preuve sociale transforme l'intérêt en confiance, et la confiance en clic." },
        { h2: "Vitesse et friction zéro", p: "Une page rapide, un formulaire court, un seul objectif par page : chaque milliseconde et chaque champ en trop coûtent des conversions." }
      ]
    },
    "agent-ia": {
      title: "Pourquoi il vous faut un agent IA ?",
      tags: ["IA", "MARKETING DIGITAL"],
      meta: "Par la Rédaction LNDW · 1ᵉʳ juin 2026 · IA",
      hero: IMG + "blog-card-ai-agent.png",
      body: IMG + "blog-card-ai-agent.png",
      introTitle: "L'agent IA devient le copilote opérationnel de votre activité.",
      intro: "Un agent IA ne se contente plus de répondre : il agit. Support, qualification, reporting, relances — il exécute des tâches de bout en bout.",
      quote: "L'agent IA ne remplace pas votre équipe : il devient son copilote, disponible 24/7 et infatigable.",
      excerpt: "Support, qualification de leads, reporting : l'agent IA devient le copilote indispensable de votre activité.",
      sections: [
        { h2: "L'agent IA comme copilote", p: "Connecté à vos outils, il comprend le contexte et agit en votre nom sur des périmètres définis, sous votre supervision." },
        { h2: "Automatiser les tâches répétitives", p: "Réponses de premier niveau, qualification, mises à jour de CRM, synthèses : autant d'heures rendues à votre équipe." },
        { h2: "Gagner en vitesse sans perdre en qualité", p: "Bien cadré, l'agent accélère sans dégrader : règles claires, garde-fous et validation humaine sur les moments clés." }
      ]
    }
  };

  var ORDER = ["scroller-ou-swiper","seo-est-il-mort","shopify-vs-wordpress","format-vertical","automatisations-travail","landing-page-2","agent-ia"];

  /* ---------- Lecture du paramètre ?post= ---------- */
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("post");
  if (!BLOG_POSTS[slug]) slug = "scroller-ou-swiper";
  var post = BLOG_POSTS[slug];

  function set(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }
  function setSrc(id, src) { var el = document.getElementById(id); if (el) el.setAttribute("src", src); }

  /* ---------- Injection du contenu ---------- */
  document.title = post.title + " | La Nation du Web";
  set("articleTitle", post.title);
  set("articleTags", post.tags.map(function (t) { return '<span class="chip">' + t + "</span>"; }).join(""));
  set("articleMeta", post.meta);
  setSrc("articleHeroImage", post.hero);
  setSrc("articleBodyImage", post.body);
  set("articleIntroTitle", post.introTitle);
  set("articleIntro", post.intro);
  set("articleQuote", post.quote);
  set("articleBody", post.sections.map(function (s) {
    return "<h2>" + s.h2 + "</h2><p>" + s.p + "</p>";
  }).join(""));

  /* ---------- À lire aussi (3 autres articles, exclut le courant) ---------- */
  var related = ORDER.filter(function (s) { return s !== slug; }).slice(0, 3);
  set("relatedPosts", related.map(function (s) {
    var p = BLOG_POSTS[s];
    return '<a class="post-card" href="article.html?post=' + s + '">' +
             '<img src="' + p.hero + '" alt="">' +
             '<div class="pc-body"><h3>' + p.title + "</h3><p>" + p.excerpt + "</p></div></a>";
  }).join(""));
})();

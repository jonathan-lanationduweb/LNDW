/* ============================================================
   La Nation du Web — interactions
   ============================================================ */
(function(){
  'use strict';
  const $  = (s,c)=> (c||document).querySelector(s);
  const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- generic reveal on scroll ---------- */
  const revObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); revObs.unobserve(e.target); }
    });
  },{threshold:.18, rootMargin:'0px 0px -8% 0px'});
  const revList = $$('.reveal,.reveal-pop').filter(el=> !(el.classList.contains('final-card')||el.classList.contains('final-cta')))
                    .concat($$('.dotted-path'));
  revList.forEach((el)=>{
    if(el.parentElement && el.parentElement.classList.contains('vision-text')){
      el.style.transitionDelay = (Array.prototype.indexOf.call(el.parentElement.children,el)*0.12)+'s';
    }
    revObs.observe(el);
  });

  /* ---------- header: subtle solid on scroll ---------- */
  const header = $('.site-header');
  addEventListener('scroll',()=>{
    header.style.background = scrollY>40 ? 'rgba(31,30,36,.9)' : 'rgba(40,39,46,.72)';
  },{passive:true});

  /* ---------- mobile nav ---------- */
  const toggle = $('.nav-toggle');
  if(toggle) toggle.addEventListener('click',()=>document.body.classList.toggle('nav-open'));
  $$('.main-nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('nav-open')));

  /* ============================================================
     NOS PILIERS — 3-planet carousel
     ============================================================ */
  const PILLARS = [
    {title:"L'OMNISCIENCE DU 360°", text:"Fini le travail en silos. Nous adoptons une Vision Galactique où chaque levier (Web, SEO, Social) est interconnecté pour nourrir la puissance de l'autre. Notre mission est d'éliminer l'inertie : chaque euro et chaque action sont pilotés par un seul architecte pour garantir un impact immédiat sur vos KPIs."},
    {title:"PERF' TECHNOLOGIQUE", text:"L'expertise technique est notre réacteur. Grâce à une culture du « No-Limit » et une maîtrise profonde de l'IA, nous transformons des concepts complexes en solutions de croissance ultra-rapides. Nous maîtrisons l'ensemble de la chaîne de valeur pour propulser votre marque là où vos concurrents voient des obstacles."},
    {title:"TRANSPARENCE TOTALE", text:"La confiance est le carburant de votre propulsion, c'est pourquoi nous bannissons la « boîte noire » marketing. Vous disposez d'un accès permanent à vos dashboards en temps réel pour suivre votre trajectoire. Notre but ? Vous transmettre l'arsenal nécessaire pour que vous restiez le seul maître souverain de votre univers."}
  ];
  const stage  = $('#pillarsStage');
  const planets= $$('.planet', stage);
  const arcText= $('#arcText');
  const pBody  = $('#pillarBody');
  const pText  = $('#pillarText');
  const dotsBox= $('#pillarsDots');
  // ring of slots: [left, center, right] holding planet indices
  let ring = [2,0,1];

  PILLARS.forEach((_,i)=>{
    const b=document.createElement('button');
    b.addEventListener('click',()=>{ const c=ring[1]; if(i!==c){ rotateTo(i); } });
    dotsBox.appendChild(b);
  });

  function layout(animate){
    if(!stage) return;
    const W = stage.clientWidth, H = stage.clientHeight;
    const sphere = c => c/0.562;            // PNG sphere occupies 56.2% of width
    const cW = sphere(Math.min(H*0.92, W*0.42));
    const sW = sphere(Math.min(H*0.5, W*0.24));
    planets.forEach(p=>{ p.style.transition = animate?'':'none'; });
    const place = (idx, leftPct, topPct, w, cls) =>{
      const p = planets[idx];
      p.className = 'planet '+cls;
      p.style.width = w+'px';
      p.style.left = leftPct+'%';
      p.style.top  = topPct+'%';
      p.style.transform = 'translate(-50%,-50%)';
      p.style.zIndex = cls==='center'?5:3;
    };
    place(ring[0], 17, 46, sW, 'left');
    place(ring[2], 83, 46, sW, 'right');
    place(ring[1], 50, 50, cW, 'center');
    if(!animate){ /* force reflow then re-enable */ void stage.offsetWidth;
      planets.forEach(p=>p.style.transition=''); }
  }
  function syncText(){
    const c = ring[1];
    arcText.textContent = PILLARS[c].title;
    pBody.classList.add('swap');
    setTimeout(()=>{ pText.textContent = PILLARS[c].text; pBody.classList.remove('swap'); }, 280);
    $$('#pillarsDots button').forEach((d,i)=>d.classList.toggle('active', i===c));
  }
  function rotateTo(target){
    // bring `target` planet to center, rotate the ring accordingly
    if(target===ring[0]){          // left clicked -> center
      ring = [ring[2], ring[0], ring[1]];
    }else if(target===ring[2]){    // right clicked -> center
      ring = [ring[1], ring[2], ring[0]];
    }else return;
    layout(true); syncText();
  }
  planets.forEach((p,i)=> p.addEventListener('click',()=>{ if(i!==ring[1]) rotateTo(i); }));
  if(stage){
    layout(false); syncText();
    requestAnimationFrame(()=>layout(true));
    let rt; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>layout(false),120); });
  }

  /* ============================================================
     CRÉDIBILITÉ — client logos fade in (stagger)
     ============================================================ */
  const credSec = $('.credibility');
  if(credSec){
    const logos = $$('.cred-logo', credSec);
    const cObs = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{
        if(e.isIntersecting){
          logos.forEach((l,i)=> setTimeout(()=>l.classList.add('shown'), reduce?0:120+i*90));
          cObs.disconnect();
        }
      });
    },{threshold:.2});
    cObs.observe(credSec);
  }

  /* ============================================================
     NOTRE ARSENAL — tags fall in on view
     ============================================================ */
  const aCard = $('#arsenalCard');
  if(aCard){
    const tags = $$('.tag', aCard);
    const aObs = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{
        if(e.isIntersecting){
          tags.forEach((t,i)=> setTimeout(()=>t.classList.add('drop'), reduce?0:i*130));
          aObs.disconnect();
        }
      });
    },{threshold:.3});
    aObs.observe(aCard);
  }

  /* ============================================================
     MISSIONS — Splide carousel
     ============================================================ */
  function initSplide(){
    if(typeof Splide==='undefined'){ return; }
    const el = $('#missionsSplide');
    if(!el) return;
    const sp = new Splide(el,{
      type:'loop', focus:'center', perPage:3, gap:'1.4rem',
      padding:{left:'5%',right:'5%'}, arrows:false, pagination:false,
      drag:true, autoplay:false, updateOnMove:true, speed:600, flickMaxPages:1,
      breakpoints:{ 980:{perPage:1, padding:'18%', gap:'1rem'},
                    560:{perPage:1, padding:'12%'} }
    });
    sp.on('click', (Slide)=> sp.go(Slide.index));
    try{ sp.mount(); }catch(err){ console.warn('Splide mount failed', err); }
  }
  initSplide();

  /* ============================================================
     AVIS — orbits, avatars, review card
     ============================================================ */
  const REVIEWS = [
    {name:"MALLORIE T.", role:"Entrepreneur en finance", stars:5,
     text:"Nous avons sollicité l'agence pour une stratégie SEO complexe et une campagne Google Ads à gros budget. Le suivi est irréprochable avec des rapports mensuels clairs qui ne se contentent pas des chiffres, mais proposent de vrais axes d'amélioration. Leur maîtrise technique est impressionnante, notamment sur l'aspect technique du SEO qui nous bloquait depuis des années. Une équipe réactive et très pédagogue."},
    {name:"KARIM B.", role:"Gérant de restaurant", stars:5,
     text:"En quelques mois, notre visibilité locale a totalement changé de dimension. Les réservations en ligne ont décollé et l'équipe reste disponible à chaque étape. On se sent vraiment accompagnés."},
    {name:"LÉA M.", role:"Fondatrice e-commerce", stars:5,
     text:"Refonte du site, automatisation IA et publicité Meta : tout est connecté et piloté au même endroit. Le ROI a parlé dès le premier trimestre. Un vrai partenaire de croissance."},
    {name:"THOMAS R.", role:"Artisan menuisier", stars:5,
     text:"Je partais de zéro côté digital. Aujourd'hui j'apparais en tête sur Google sur mes mots-clés et je reçois des demandes de devis chaque semaine. Pédagogie et résultats au rendez-vous."},
    {name:"SOPHIE D.", role:"Directrice marketing", stars:5,
     text:"Une approche 360° qui nous a permis d'aligner enfin SEO, social et acquisition. Les dashboards en temps réel nous redonnent le contrôle total sur la stratégie."},
    {name:"NICOLAS P.", role:"CEO start-up SaaS", stars:5,
     text:"Performance technologique impressionnante et transparence absolue. Ils transforment des sujets complexes en leviers de croissance concrets. On recommande sans hésiter."}
  ];
  const orbits = $('#orbits');
  if(orbits){
    const card  = $('#reviewCard');
    const rings = [
      {rx:150, ry:150, items:[{a:-90},{a:35}]},
      {rx:215, ry:200, items:[{a:165},{a:-25}]},
      {rx:268, ry:248, items:[{a:115},{a:-50}]}
    ];
    const VB=560, cx=280, cy=280, nodes=[];
    let r=0;
    rings.forEach(ring=>{
      ring.items.forEach(it=>{
        if(r>=REVIEWS.length) return;
        const idx=r++;
        const rad = it.a*Math.PI/180;
        const x = cx + ring.rx*Math.cos(rad);
        const y = cy + ring.ry*Math.sin(rad);
        const node=document.createElement('button');
        node.className='avatar-node';
        const size = idx===0?86:64;
        node.style.width=size+'px'; node.style.height=size+'px';
        node.style.left=(x/VB*100)+'%';
        node.style.top =(y/VB*100)+'%';
        node.dataset.i=idx; node.dataset.x=x; node.dataset.y=y;
        node.innerHTML='<img src="assets/avatars/avatar-review.png" alt="'+REVIEWS[idx].name+'">';
        node.addEventListener('click',()=>select(idx));
        orbits.appendChild(node);
        nodes.push(node);
      });
    });
    function place(idx){
      const n=nodes[idx]; if(!n) return;
      const x=+n.dataset.x, y=+n.dataset.y;
      // position card near the active avatar but kept inside
      const px = Math.min(58, Math.max(8, x/VB*100 - 6));
      const py = Math.min(54, Math.max(10, y/VB*100));
      card.style.left=px+'%'; card.style.top=py+'%';
    }
    function select(idx){
      const r=REVIEWS[idx];
      nodes.forEach((n,i)=>n.classList.toggle('active', i===idx));
      card.classList.add('hide');
      setTimeout(()=>{
        $('#rvName').textContent=r.name;
        $('#rvRole').textContent=r.role;
        $('#rvText').textContent=r.text;
        $('#rvStars').textContent='★★★★★'.slice(0,r.stars);
        place(idx);
        card.classList.remove('hide');
      },200);
    }
    // reveal sequence — orbits draw + avatars pop. Card stays hidden until a click.
    const oObs=new IntersectionObserver((ents)=>{
      ents.forEach(e=>{
        if(!e.isIntersecting) return;
        $$('.orbit-ring',orbits).forEach(rg=>rg.classList.add('draw'));
        nodes.forEach((n,i)=> setTimeout(()=>{ n.classList.add('shown'); }, reduce?0:300+i*140));
        oObs.disconnect();
      });
    },{threshold:.25});
    oObs.observe(orbits);
  }

  /* ---------- Avis: rocket follows the trajectory on SCROLL, then CTA appears ---------- */
  const avisPath   = $('#avisPath');
  const avisRocket = $('#avisRocket');
  const avisSec    = $('.avis');
  const finalRocket= $('.final-rocket');
  const finalCard  = $('#avisFinal .final-card');
  const finalCta   = $('#avisFinal .final-cta');
  if(avisPath && avisRocket && avisSec){
    const svg = avisPath.ownerSVGElement;
    const VW=1280, VH=1500;
    let finished=false, len=0;
    function refreshLen(){ len = avisPath.getTotalLength(); }
    refreshLen();
    function placeAt(t){
      t = Math.max(0, Math.min(1, t));
      const r  = svg.getBoundingClientRect();
      const pt = avisPath.getPointAtLength(t*len);
      const pt2= avisPath.getPointAtLength(Math.min(1,t+0.01)*len);
      // direction of travel -> rocket nose angle (art points up-right ~ -45deg baseline)
      const ang = Math.atan2((pt2.y-pt.y)/VH*r.height, (pt2.x-pt.x)/VW*r.width)*180/Math.PI;
      avisRocket.style.left = (pt.x/VW*r.width)+'px';
      avisRocket.style.top  = (pt.y/VH*r.height)+'px';
      avisRocket.style.transform = 'translate(-50%,-50%) rotate('+(ang+45).toFixed(1)+'deg)';
    }
    function finishSequence(){
      avisRocket.style.opacity = '0';
      if(finalRocket){ finalRocket.classList.add('bounce'); }
      setTimeout(()=>{ if(finalCard) finalCard.classList.add('in'); }, 220);
      setTimeout(()=>{ if(finalCta)  finalCta.classList.add('in');  }, 480);
    }
    function progress(){
      const rect = avisSec.getBoundingClientRect();
      const vh = innerHeight;
      // p=0 when the section top is ~70% down the viewport; p=1 partway through the section
      const span = Math.max(1, rect.height*0.52);
      return Math.max(0, Math.min(1, (vh*0.72 - rect.top)/span));
    }
    let ticking=false;
    function onScroll(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(()=>{
        ticking=false;
        if(!finished){ placeAt(progress()); }
      });
    }
    avisRocket.classList.add('travelling');   // stop the autonomous float; scroll drives it
    placeAt(0);
    addEventListener('scroll', onScroll, {passive:true});
    addEventListener('resize',()=>{ refreshLen(); if(!finished) placeAt(progress()); });
    onScroll();
    // when the landing badge scrolls into view, run the bounce -> CTA finale once
    if(finalRocket){
      const eObs=new IntersectionObserver((ents)=>{
        ents.forEach(e=>{ if(e.isIntersecting && !finished){ finished=true; placeAt(1);
          setTimeout(finishSequence, reduce?0:260); eObs.disconnect(); } });
      },{threshold:.6});
      eObs.observe(finalRocket);
    }
  }
})();

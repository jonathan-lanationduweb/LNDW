/* ============================================================
   La Nation du Web — blog.js
   JS SPÉCIFIQUE à blog.html : header au scroll, menu mobile,
   filtres de tags (visuel), pagination (visuel), newsletter front-end.
   Aucun backend / fetch / API.
   ============================================================ */
(function(){
  "use strict";

  /* ---- Header (fond au scroll) + menu mobile ---- */
  var header = document.querySelector('.site-header');
  if(header) addEventListener('scroll', function(){
    header.style.background = scrollY > 40 ? 'rgba(31,30,36,.9)' : 'rgba(40,39,46,.72)';
  }, {passive:true});
  var navToggle = document.querySelector('.nav-toggle');
  if(navToggle) navToggle.addEventListener('click', function(){
    document.body.classList.toggle('nav-open');
  });

  /* ---- Tags : activation visuelle au clic (ne masque pas les articles) ---- */
  var tags = document.getElementById('blogTags');
  if(tags) tags.addEventListener('click', function(e){
    var b = e.target.closest('.blog-tag');
    if(!b) return;
    tags.querySelectorAll('.blog-tag').forEach(function(x){ x.classList.remove('active'); });
    b.classList.add('active');
  });

  /* ---- Pagination : activation visuelle (statique) ---- */
  var pg = document.getElementById('blogPagination');
  if(pg) pg.addEventListener('click', function(e){
    var b = e.target.closest('button');
    if(!b) return;
    pg.querySelectorAll('button').forEach(function(x){ x.classList.remove('active'); });
    b.classList.add('active');
  });

  /* ---- Newsletter : front-end uniquement ---- */
  var form = document.getElementById('newsletterForm');
  var msg  = document.getElementById('newsletterMsg');
  if(form) form.addEventListener('submit', function(e){
    e.preventDefault();
    if(msg) msg.classList.add('show');
    var input = document.getElementById('newsletterEmail');
    if(input) input.value = '';
  });
})();

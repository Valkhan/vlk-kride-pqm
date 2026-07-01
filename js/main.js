(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  if (reduce) return;

  /* ---------- Parallax (rAF, ligado ao scroll) ---------- */
  var layers = Array.from(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.pageYOffset;
      layers.forEach(function (l) {
        var speed = parseFloat(l.getAttribute('data-parallax')) || 0;
        var rect = l.getBoundingClientRect();
        var center = rect.top + window.pageYOffset + rect.height / 2;
        var off = (y + window.innerHeight / 2 - center) * speed;
        l.style.transform = 'translate3d(0,' + (-off).toFixed(1) + 'px,0)';
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Recortes tipográficos aleatórios no herói ---------- */
  var hero = document.getElementById('topo');
  if (!hero) return;

  var bits   = ['§', '?', '♪', '1937', '2026', 'RECORTE', 'MENTIRA', 'NOEL', 'VADICO', 'LAVANDERIA'];
  var stamps = ['FAKE NEWS', 'URGENTE', 'RESGATE', 'PEDRADA'];
  var made   = [];

  function place(text, isStamp) {
    var s = document.createElement('span');
    s.className = 'scrap' + (isStamp ? ' stamp' : '');
    s.textContent = text;
    s.style.top       = (14 + Math.random() * 72) + '%';
    s.style.left      = (Math.random() * 88) + '%';
    s.style.transform = 'rotate(' + (Math.random() * 16 - 8).toFixed(1) + 'deg)';
    s.style.fontSize  = (isStamp ? 13 + Math.random() * 6 : 10 + Math.random() * 4).toFixed(0) + 'px';
    hero.appendChild(s);
    made.push(s);
    return s;
  }

  for (var i = 0; i < 9; i++) { place(bits[Math.floor(Math.random() * bits.length)], false); }
  for (var j = 0; j < 3; j++) { place(stamps[Math.floor(Math.random() * stamps.length)], true); }

  made.forEach(function (s, idx) {
    setTimeout(function () { s.classList.add('show'); }, 600 + idx * 140);
    var t0  = Math.random() * 1000;
    var amp = 4 + Math.random() * 6;
    var per = 6000 + Math.random() * 5000;
    (function drift() {
      var dy = Math.sin((performance.now() + t0) / per * Math.PI * 2) * amp;
      s.style.marginTop = dy.toFixed(1) + 'px';
      requestAnimationFrame(drift);
    })();
  });
})();

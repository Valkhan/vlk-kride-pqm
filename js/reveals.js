/* ════════════════════════════════════════════════════════
   REVEALS — scroll reveal via IntersectionObserver
   Adiciona a classe .in aos elementos .reveal quando
   eles entram na viewport.
════════════════════════════════════════════════════════ */
(function () {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ════════════════════════════════════════════════════════
   MANIFESTO NAV — scroll-spy da navegação lateral
   Atualiza a classe .active dos itens da .manifesto-nav
   conforme o usuário rola o conteúdo.
════════════════════════════════════════════════════════ */
(function () {
  const navItems = document.querySelectorAll('.manifesto-nav-item');
  const sections = document.querySelectorAll('.manifesto-section');
  if (!navItems.length || !sections.length) return;

  function spy() {
    let cur = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 200) cur = s.id;
    });
    navItems.forEach(function (i) {
      i.classList.toggle('active', i.getAttribute('href') === '#' + cur);
    });
  }

  window.addEventListener('scroll', spy, { passive: true });
  spy(); // run on load

  // Click: highlight clicked item immediately
  navItems.forEach(function (i) {
    i.addEventListener('click', function () {
      navItems.forEach(function (x) { x.classList.remove('active'); });
      this.classList.add('active');
    });
  });
})();

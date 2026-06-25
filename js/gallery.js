/* ════════════════════════════════════════════════════════
   GALLERY — filtros da galeria de obras
   Alterna a classe .active nos botões .filter-btn.
   (Futuramente: filtragem real das cards por categoria.)
════════════════════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
})();

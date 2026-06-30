// ════════════════════════════════════════════════════════
//  STRIPS — drag-to-scroll nas faixas horizontais
// ════════════════════════════════════════════════════════
(function () {
  'use strict';

  function initStrip(el) {
    let isDown = false;
    let startX;
    let scrollLeft;

    el.addEventListener('mousedown', function (e) {
      isDown = true;
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', function () {
      isDown = false;
      el.style.cursor = 'grab';
    });

    el.addEventListener('mouseup', function () {
      isDown = false;
      el.style.cursor = 'grab';
    });

    el.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - el.offsetLeft;
      var walk = (x - startX) * 1.4;
      el.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    var touchStartX = 0;
    var touchScrollLeft = 0;

    el.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = el.scrollLeft;
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      var x = e.touches[0].pageX;
      var walk = (touchStartX - x) * 1.2;
      el.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });
  }

  document.querySelectorAll('.story-strip').forEach(initStrip);
})();

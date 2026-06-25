/* ════════════════════════════════════════════════════════
   AMBIENT — gerador de notas musicais flutuantes
   Cria notas aleatórias que flutuam pelo fundo da página.
════════════════════════════════════════════════════════ */
(function () {
  const glyphs = ['♪','♫','♬','♩','𝄞','♭','♯'];
  const tints  = ['#E8505B','#F4A261','#7D3C98','#C0392B'];
  const ambient = document.getElementById('ambient');
  if (!ambient) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  function spawnNote() {
    const n = document.createElement('div');
    n.className = 'float-note';
    n.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const size = 16 + Math.random() * 30;
    n.style.left = '0';
    n.style.top  = Math.random() * 100 + 'vh';
    n.style.fontSize = size + 'px';
    n.style.animationDuration = (10 + Math.random() * 12) + 's';
    n.style.color = tints[Math.floor(Math.random() * tints.length)];
    ambient.appendChild(n);
    setTimeout(() => n.remove(), 24000);
  }

  for (let i = 0; i < 6; i++) setTimeout(spawnNote, i * 1400);
  setInterval(spawnNote, 2200);
})();

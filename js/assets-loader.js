/**
 * assets-loader.js — Pra que Mentir
 * Motor de inserção dinâmica de assets visuais a partir do manifesto declarativo.
 * Respeita o campo `placement` de cada asset para evitar upscale ou uso indevido.
 * Nunca quebra o layout: todos os erros são silenciosos e os fallbacks CSS/SVG
 * são mantidos intactos.
 */
(async function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Carregar manifesto ─────────────────────────────────────────────── */
  let manifest;
  try {
    const resp = await fetch('./assets/assets-manifest.json');
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    manifest = await resp.json();
  } catch (e) {
    console.warn('[assets-loader] manifesto indisponível — usando fallbacks CSS/SVG', e);
    return;
  }

  const basePath = manifest.basePath;

  /* Índices */
  const byId  = Object.fromEntries(manifest.assets.map(a => [a.id, a]));
  const byCat = {};
  manifest.assets.forEach(a => (byCat[a.category] ??= []).push(a));

  const url = a => basePath + a.file;

  /* Helper: verifica se asset é elegível para um placement específico */
  const fits = (a, placement) => Array.isArray(a.placement) && a.placement.includes(placement);

  /* ── 2. Aplicar transform / blend via estilos inline ──────────────────── */
  function applyTransform(el, a) {
    if (!a.transform) return;
    const t = a.transform;
    if (t.rotate)  el.style.transform = (el.style.transform || '') + ` rotate(${t.rotate}deg)`;
    if (t.blend && t.blend !== 'normal') el.style.mixBlendMode = t.blend;
    if (t.sepia)   el.style.filter = `sepia(${t.sepia}%) contrast(95%) brightness(90%)`;
    if (a.parallax) el.setAttribute('data-parallax', a.parallax);
  }

  /* ── 3. Resolver [data-asset] ──────────────────────────────────────────── */
  document.querySelectorAll('[data-asset]').forEach(el => {
    const a = byId[el.dataset.asset];
    if (!a) { console.warn('[assets-loader] id não encontrado:', el.dataset.asset); return; }

    const loading = a.priority === 'high' ? 'eager' : 'lazy';

    if (el.tagName === 'IMG') {
      el.src      = url(a);
      el.alt      = a.alt;
      el.loading  = loading;
      el.decoding = 'async';
      /* nunca exibir maior que o natural para não pixelar */
      if (a.maxDisplayPx) el.style.maxWidth = a.maxDisplayPx + 'px';
      el.onerror = () => el.style.display = 'none';
    } else {
      el.style.backgroundImage = `url('${url(a)}')`;
    }
    applyTransform(el, a);
    el.setAttribute('aria-hidden', 'true');
  });

  /* ── 4. Backgrounds de seção [data-bg-pool] ─────────────────────────────
     Só usa assets com placement "section-bg".
     Escolhe um compatível com data-bg-tone (filtra por tags).
     Injeta <div class="section-bg"> como primeiro filho.                   */
  document.querySelectorAll('[data-bg-pool]').forEach(section => {
    const pools = section.dataset.bgPool.split(',').map(s => s.trim());
    const tone  = section.dataset.bgTone || '';

    let candidates = pools.flatMap(p => byCat[p] || [])
      .filter(a => fits(a, 'section-bg'));

    if (tone) {
      const filtered = candidates.filter(a => a.tags.some(t => t.includes(tone)));
      if (filtered.length) candidates = filtered;
    }
    if (!candidates.length) return;

    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    const div = document.createElement('div');
    div.className = 'section-bg';
    div.setAttribute('aria-hidden', 'true');
    div.style.backgroundImage = `url('${url(pick)}')`;
    div.style.mixBlendMode = (pick.transform?.blend && pick.transform.blend !== 'normal')
      ? pick.transform.blend
      : 'multiply';

    const pos = getComputedStyle(section).position;
    if (pos === 'static') section.style.position = 'relative';
    section.insertBefore(div, section.firstChild);

    div.style.opacity    = '0';
    div.style.transition = 'opacity .6s';
    const bgObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.opacity = '0.3'; bgObs.unobserve(e.target); }
      });
    }, { threshold: 0.05 });
    bgObs.observe(div);
  });

  /* ── 5. Strips [data-strip-pool] ────────────────────────────────────────
     Só usa assets com placement "strip".
     Insere imagens recortadas intercaladas no .strip-run.                 */
  document.querySelectorAll('[data-strip-pool]').forEach(divider => {
    const pools = divider.dataset.stripPool.split(',').map(s => s.trim());
    const run   = divider.querySelector('.strip-run');
    if (!run) return;

    const candidates = pools.flatMap(p => byCat[p] || [])
      .filter(a => fits(a, 'strip') && a.priority !== 'low');
    if (!candidates.length) return;

    const picks = [];
    const used  = new Set();
    while (picks.length < 4 && picks.length < candidates.length) {
      const idx = Math.floor(Math.random() * candidates.length);
      if (!used.has(idx)) { used.add(idx); picks.push(candidates[idx]); }
    }

    const words = Array.from(run.children);
    picks.forEach((a, i) => {
      const img = document.createElement('img');
      img.className   = 'strip-cut';
      img.src         = url(a);
      img.alt         = '';
      img.loading     = 'lazy';
      img.decoding    = 'async';
      img.setAttribute('aria-hidden', 'true');
      img.onerror     = () => img.remove();

      const insertAfter = words[Math.min(i * 2 + 1, words.length - 1)];
      if (insertAfter) run.insertBefore(img, insertAfter.nextSibling);
      else             run.appendChild(img);
    });
  });

  /* ── 6. Collage [data-collage-pool] ─────────────────────────────────────
     Preenche <img data-collage-slot> dentro de .foto com assets do pool
     que tenham placement "collage". Respeita maxDisplayPx.               */
  document.querySelectorAll('[data-collage-slot]').forEach(img => {
    const pool = img.dataset.collagePool || img.closest('[data-collage-pool]')?.dataset.collagePool;
    if (!pool) return;
    const cats = pool.split(',').map(s => s.trim());
    const candidates = cats.flatMap(p => byCat[p] || []).filter(a => fits(a, 'collage'));
    if (!candidates.length) return;
    const a = candidates[Math.floor(Math.random() * candidates.length)];
    img.src     = url(a);
    img.alt     = a.alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    if (a.maxDisplayPx) img.style.maxWidth = a.maxDisplayPx + 'px';
    img.onerror = () => img.closest('.foto')?.style.setProperty('display', 'none');
  });

  /* ── 7. Scatter [data-scatter-pool] ─────────────────────────────────────
     Só usa assets com placement "scatter" (≤ 90px display).
     Posiciona com drift senoidal e fade-in escalonado.                    */
  document.querySelectorAll('[data-scatter-pool]').forEach(container => {
    const pools    = container.dataset.scatterPool.split(',').map(s => s.trim());
    const count    = parseInt(container.dataset.scatterCount || '8', 10);
    const priority = container.dataset.scatterPriority || 'any';

    let candidates = pools.flatMap(p => byCat[p] || [])
      .filter(a => fits(a, 'scatter'));

    /* filtro de prioridade opcional */
    if (priority !== 'any') {
      const pf = candidates.filter(a => a.priority === priority);
      if (pf.length) candidates = pf;
    }
    if (!candidates.length) return;

    candidates = candidates.slice().sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(count, candidates.length); i++) {
      const a   = candidates[i];
      const img = document.createElement('img');
      img.className = 'scatter-img';
      img.src       = url(a);
      img.alt       = '';
      img.loading   = 'lazy';
      img.decoding  = 'async';
      img.setAttribute('aria-hidden', 'true');
      img.onerror   = () => img.remove();

      /* tamanho: nunca excede o natural nem 80px */
      const cap  = Math.min(a.maxDisplayPx || 80, 80);
      const disp = Math.round(52 + Math.random() * (cap - 52));

      img.style.cssText = [
        `top:${(8 + Math.random() * 76).toFixed(1)}%`,
        `left:${(Math.random() * 85).toFixed(1)}%`,
        `transform:rotate(${(Math.random() * 18 - 9).toFixed(1)}deg)`,
        `max-width:${disp}px`,
        `width:auto`,
        `height:auto`,
        `opacity:0`,
        `transition:opacity 1.2s`,
      ].join(';');

      container.style.position = 'relative';
      container.appendChild(img);

      setTimeout(() => { img.style.opacity = '0.5'; }, 800 + i * 150);

      if (!reduce) {
        const t0  = Math.random() * 1000;
        const amp = 4 + Math.random() * 8;
        const per = 5000 + Math.random() * 6000;
        (function drift() {
          img.style.marginTop = (Math.sin((performance.now() + t0) / per * Math.PI * 2) * amp).toFixed(1) + 'px';
          requestAnimationFrame(drift);
        })();
      }
    }
  });

  /* ── 8. Parallax: loader roda com defer, antes do main.js com defer.
     O main.js coleta [data-parallax] após o DOM estar pronto — os elementos
     inseridos aqui já estarão presentes nesse momento. Nada a fazer.       */

})();

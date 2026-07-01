/**
 * assets-loader.js — Pra que Mentir
 * Motor de inserção dinâmica de assets visuais a partir do manifesto declarativo.
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
      el.src     = url(a);
      el.alt     = a.alt;
      el.loading = loading;
      el.decoding = 'async';
      el.onerror = () => el.style.display = 'none'; // fallback silencioso
    } else {
      el.style.backgroundImage = `url('${url(a)}')`;
    }
    applyTransform(el, a);
    el.setAttribute('aria-hidden', 'true');
  });

  /* ── 4. Backgrounds de seção [data-bg-pool] ─────────────────────────────
     Escolhe um asset do pool compatível com data-bg-tone (filtra por tags).
     Injeta <div class="section-bg"> como primeiro filho.                   */
  document.querySelectorAll('[data-bg-pool]').forEach(section => {
    const pools = section.dataset.bgPool.split(',').map(s => s.trim());
    const tone  = section.dataset.bgTone || '';

    /* Candidatos: assets dos pools, filtrados por tag */
    let candidates = pools.flatMap(p => byCat[p] || []);
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
    if (pick.transform?.blend && pick.transform.blend !== 'normal') {
      div.style.mixBlendMode = pick.transform.blend;
    } else {
      div.style.mixBlendMode = 'multiply';
    }
    /* garantir que a seção seja position:relative para o absolute funcionar */
    const pos = getComputedStyle(section).position;
    if (pos === 'static') section.style.position = 'relative';

    section.insertBefore(div, section.firstChild);

    /* Lazy: trocar opacidade só quando a seção entrar na viewport */
    div.style.opacity = '0';
    div.style.transition = 'opacity .6s';
    const bgObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '0.3';
          bgObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    bgObs.observe(div);
  });

  /* ── 5. Strips [data-strip-pool] ────────────────────────────────────────
     Insere imagens recortadas intercaladas no .strip-run sem apagar texto. */
  document.querySelectorAll('[data-strip-pool]').forEach(divider => {
    const pools = divider.dataset.stripPool.split(',').map(s => s.trim());
    const run   = divider.querySelector('.strip-run');
    if (!run) return;

    let candidates = pools.flatMap(p => [
      ...(byCat[p] || []),
    ]).filter(a => a.priority !== 'low');
    if (!candidates.length) return;

    /* pegar até 4 assets aleatórios */
    const picks = [];
    const used  = new Set();
    while (picks.length < 4 && picks.length < candidates.length) {
      const idx = Math.floor(Math.random() * candidates.length);
      if (!used.has(idx)) { used.add(idx); picks.push(candidates[idx]); }
    }

    /* duplicar o run-content (para loop infinito) mantendo os spans */
    const words = Array.from(run.children);
    const half  = Math.floor(words.length / 2); // .strip-run já tem 2× o conteúdo

    picks.forEach((a, i) => {
      const img = document.createElement('img');
      img.className = 'strip-cut';
      img.src     = url(a);
      img.alt     = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.setAttribute('aria-hidden', 'true');
      img.onerror = () => img.remove();

      /* inserir em posição intercalada no primeiro "half" */
      const insertAfter = words[Math.min(i * 2 + 1, words.length - 1)];
      if (insertAfter) {
        run.insertBefore(img, insertAfter.nextSibling);
      } else {
        run.appendChild(img);
      }
    });
  });

  /* ── 6. Scatter híbrido [data-scatter-pool] ─────────────────────────────
     Posiciona imagens aleatórias do pool com posição/rotação/tamanho
     aleatórios + drift senoidal (reutiliza lógica do script inline).      */
  document.querySelectorAll('[data-scatter-pool]').forEach(container => {
    const pools  = container.dataset.scatterPool.split(',').map(s => s.trim());
    const count  = parseInt(container.dataset.scatterCount || '8', 10);
    const priority = container.dataset.scatterPriority || 'low';

    let candidates = pools.flatMap(p => byCat[p] || [])
      .filter(a => a.priority === priority || priority === 'any');
    if (!candidates.length) candidates = pools.flatMap(p => byCat[p] || []);
    if (!candidates.length) return;

    /* Shuffle */
    candidates = candidates.slice().sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(count, candidates.length); i++) {
      const a   = candidates[i];
      const img = document.createElement('img');
      img.className = 'scatter-img';
      img.src     = url(a);
      img.alt     = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.setAttribute('aria-hidden', 'true');
      img.onerror = () => img.remove();

      const top  = 8 + Math.random() * 76;
      const left = Math.random() * 85;
      const rot  = (Math.random() * 18 - 9).toFixed(1);
      /* tamanho respeitando proporção natural — máx 80px */
      const maxPx = 52 + Math.random() * 28;

      img.style.cssText = `top:${top}%;left:${left}%;transform:rotate(${rot}deg);max-width:${maxPx.toFixed(0)}px;width:auto;height:auto;opacity:0;transition:opacity 1.2s`;

      container.style.position = 'relative';
      container.appendChild(img);

      /* fade-in escalonado */
      setTimeout(() => { img.style.opacity = '0.5'; }, 800 + i * 150);

      /* drift senoidal — só se não houver prefers-reduced-motion */
      if (!reduce) {
        const t0  = Math.random() * 1000;
        const amp = 4 + Math.random() * 8;
        const per = 5000 + Math.random() * 6000;
        (function drift() {
          const dy = Math.sin((performance.now() + t0) / per * Math.PI * 2) * amp;
          img.style.marginTop = dy.toFixed(1) + 'px';
          requestAnimationFrame(drift);
        })();
      }
    }
  });

  /* ── 8. Registrar novos [data-parallax] no loop existente ───────────────
     O script inline já lê querySelectorAll('[data-parallax]') no onScroll.
     Como o loader roda antes do script inline, os elementos já estarão
     presentes quando o IntersectionObserver e o parallax forem iniciados.
     Nada a fazer aqui — o script inline coleta os layers no momento da
     sua execução, APÓS o loader ter inserido os data-parallax.             */

})();

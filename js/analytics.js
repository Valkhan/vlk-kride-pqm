/**
 * VLK Analytics — Pra que Mentir
 *
 * Tracking dinâmico via atributos nos elementos HTML:
 *   data-vlk-click="nome_evento"      (obrigatório — nome único do evento GA4)
 *   data-vlk-label="Descrição"        (opcional — label legível; padrão: texto do elemento)
 *   data-vlk-category="categoria"     (opcional; padrão: "engagement")
 *
 * CONFIGURAÇÃO: substitua GA_ID abaixo pelo Measurement ID real do projeto.
 * Google Analytics → Admin → Data Streams → Web → Measurement ID (G-XXXXXXXXXX)
 */

(function () {
  var GA_ID = 'G-XXXXXXXXXX'; // ← substitua pelo ID real

  // Garante dataLayer e gtag disponíveis mesmo antes do script externo carregar
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, {
    anonymize_ip:  true,
    page_title:    document.title,
    page_location: window.location.href
  });

  // ── Tracking dinâmico por event delegation ───────────────────────────────
  // Qualquer elemento com [data-vlk-click] dispara um evento GA4 ao ser clicado.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-vlk-click]');
    if (!el) return;

    var eventName     = el.dataset.vlkClick;
    var eventLabel    = el.dataset.vlkLabel
                        || (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 100);
    var eventCategory = el.dataset.vlkCategory || 'engagement';

    gtag('event', eventName, {
      event_category: eventCategory,
      event_label:    eventLabel,
      page_location:  window.location.href,
      page_title:     document.title
    });
  });
})();

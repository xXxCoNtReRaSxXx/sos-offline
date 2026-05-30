/* SOS Offline V2 — lógica de la aplicación. Vanilla JS, sin dependencias. */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const STORAGE = {
    region: 'sos.region',
    contacts: 'sos.contacts',
    fontScale: 'sos.fontScale',
    theme: 'sos.theme',
    contrast: 'sos.contrast',
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Estado de conexión ---------- */
  const netStatus = $('#net-status');
  function updateNetStatus() {
    const online = navigator.onLine;
    netStatus.textContent = online ? '● En línea' : '● Sin conexión';
    netStatus.classList.toggle('is-offline', !online);
  }
  window.addEventListener('online', updateNetStatus);
  window.addEventListener('offline', updateNetStatus);
  updateNetStatus();

  /* ---------- Número de emergencias por país ---------- */
  const regionSelect = $('#region-select');
  const callBtn = $('#call-emergency');
  const callNumber = $('#call-number');
  const serviceChips = $('#service-chips');

  function populateRegions() {
    EMERGENCY_NUMBERS.forEach((c, i) => {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `${c.flag} ${c.country}`;
      regionSelect.appendChild(opt);
    });
    const saved = localStorage.getItem(STORAGE.region);
    regionSelect.value = saved !== null && EMERGENCY_NUMBERS[saved] ? saved : '0';
    applyRegion();
  }
  function applyRegion() {
    const c = EMERGENCY_NUMBERS[regionSelect.value] || EMERGENCY_NUMBERS[0];
    const main = c.services[0];
    callNumber.textContent = main.number;
    callBtn.href = 'tel:' + main.number;
    // Mostrar el resto de servicios como chips de marcado rápido
    serviceChips.innerHTML = '';
    if (c.services.length > 1) {
      c.services.forEach((s) => {
        const a = document.createElement('a');
        a.className = 'service-chip';
        a.href = 'tel:' + s.number;
        a.innerHTML = `${escapeHtml(s.label)} <strong>${escapeHtml(s.number)}</strong>`;
        serviceChips.appendChild(a);
      });
    }
    localStorage.setItem(STORAGE.region, regionSelect.value);
  }
  regionSelect.addEventListener('change', applyRegion);

  /* ---------- Tarjetas de guías ---------- */
  function iconMarkup(item) {
    const svg = typeof illustrationSvg === 'function' ? illustrationSvg(item.id) : null;
    return svg || `<span aria-hidden="true">${item.icon || '📄'}</span>`;
  }
  function makeCard(item) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card' + (item.danger ? ' is-danger' : '');
    btn.dataset.search = (item.title + ' ' + (item.summary || '')).toLowerCase();
    btn.innerHTML =
      `<span class="card__icon">${iconMarkup(item)}</span>` +
      `<span class="card__text">` +
      `<span class="card__title">${escapeHtml(item.title)}</span>` +
      (item.summary ? `<span class="card__summary">${escapeHtml(item.summary)}</span>` : '') +
      `</span>`;
    btn.addEventListener('click', () => openGuide(item));
    return btn;
  }
  function renderList(container, items) {
    container.innerHTML = '';
    items.forEach((item) => container.appendChild(makeCard(item)));
  }
  renderList($('#first-aid-list'), FIRST_AID);
  renderList($('#crisis-list'), CRISIS);
  renderList($('#disasters-list'), DISASTERS);

  /* ---------- Diálogo de detalle ---------- */
  const dialog = $('#guide-dialog');
  const guideTitle = $('#guide-title');
  const guideBody = $('#guide-body');
  const guideIll = $('#guide-ill');

  function listHtml(items, cls) {
    if (!items || !items.length) return '';
    return `<ul${cls ? ' class="' + cls + '"' : ''}>` +
      items.map((s) => `<li>${escapeHtml(s)}</li>`).join('') + '</ul>';
  }
  function orderedHtml(items) {
    if (!items || !items.length) return '';
    return '<ol>' + items.map((s) => `<li>${escapeHtml(s)}</li>`).join('') + '</ol>';
  }

  function buildGuideHtml(item) {
    let html = '';
    if (item.note) html += `<p class="note">${escapeHtml(item.note)}</p>`;
    if (item.steps) {
      html += '<h3>Qué hacer</h3>' + orderedHtml(item.steps);
      if (item.donts && item.donts.length) html += '<h3>Evita</h3>' + listHtml(item.donts, 'donts');
    } else {
      if (item.before && item.before.length) html += '<h3><span class="phase-label">Antes</span> · Prepárate</h3>' + listHtml(item.before);
      if (item.during && item.during.length) html += '<h3><span class="phase-label">Durante</span> · Actúa</h3>' + orderedHtml(item.during);
      if (item.after && item.after.length) html += '<h3><span class="phase-label">Después</span> · Recupérate</h3>' + listHtml(item.after);
    }
    return html;
  }

  // Texto plano para la lectura en voz alta
  function buildGuideSpeech(item) {
    const parts = [item.title + '.'];
    if (item.note) parts.push(item.note);
    if (item.steps) {
      parts.push('Qué hacer.');
      item.steps.forEach((s, i) => parts.push((i + 1) + '. ' + s));
      if (item.donts) { parts.push('Evita lo siguiente.'); item.donts.forEach((d) => parts.push(d)); }
    } else {
      if (item.before && item.before.length) { parts.push('Antes.'); item.before.forEach((s) => parts.push(s)); }
      if (item.during && item.during.length) { parts.push('Durante.'); item.during.forEach((s) => parts.push(s)); }
      if (item.after && item.after.length) { parts.push('Después.'); item.after.forEach((s) => parts.push(s)); }
    }
    return parts.join(' ');
  }

  let currentSpeech = '';
  function openGuide(item) {
    guideTitle.textContent = item.title;
    const svg = typeof illustrationSvg === 'function' ? illustrationSvg(item.id) : null;
    guideIll.innerHTML = svg || `<span style="font-size:1.8rem">${item.icon || '📄'}</span>`;
    guideBody.innerHTML = buildGuideHtml(item);
    currentSpeech = buildGuideSpeech(item);
    stopSpeech();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    $('#guide-close').focus();
  }
  function closeDialog() { stopSpeech(); dialog.close(); }
  $('#guide-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });
  dialog.addEventListener('cancel', stopSpeech); // tecla Esc

  /* ---------- Lectura en voz alta (Web Speech API) ---------- */
  const speakBtn = $('#guide-speak');
  const synth = window.speechSynthesis;
  function pickSpanishVoice() {
    if (!synth) return null;
    const voices = synth.getVoices();
    return voices.find((v) => /^es/i.test(v.lang)) || null;
  }
  function setSpeaking(on) {
    speakBtn.setAttribute('aria-pressed', String(on));
    speakBtn.classList.toggle('speaking-pulse', on);
    // El último nodo del botón es el texto (« Leer» / « Detener»); el emoji queda intacto.
    if (speakBtn.lastChild) speakBtn.lastChild.textContent = on ? ' Detener' : ' Leer';
  }
  function stopSpeech() { if (synth) synth.cancel(); setSpeaking(false); }
  if (!synth) {
    speakBtn.hidden = true;
  } else {
    speakBtn.addEventListener('click', () => {
      if (synth.speaking) { stopSpeech(); return; }
      const u = new SpeechSynthesisUtterance(currentSpeech);
      u.lang = 'es-ES';
      const v = pickSpanishVoice();
      if (v) u.voice = v;
      u.rate = 1; u.pitch = 1;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      synth.speak(u);
      setSpeaking(true);
    });
    // Algunas plataformas cargan las voces de forma asíncrona
    synth.addEventListener && synth.addEventListener('voiceschanged', () => {});
  }

  /* ---------- Pestañas ---------- */
  const tabs = $$('.tab');
  const searchWrap = $('#search-wrap');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); }
    });
  });
  function activateTab(tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      $('#' + t.getAttribute('aria-controls')).hidden = !selected;
    });
    searchWrap.hidden = tab.id === 'tab-contacts';
    $('#search').value = '';
    filterCards('');
  }

  /* ---------- Buscador ---------- */
  $('#search').addEventListener('input', (e) => filterCards(e.target.value));
  function filterCards(query) {
    const q = query.trim().toLowerCase();
    $$('.panel:not([hidden]) .card').forEach((card) => {
      card.style.display = !q || card.dataset.search.includes(q) ? '' : 'none';
    });
  }

  /* ---------- Contactos personales (localStorage) ---------- */
  const contactsList = $('#contacts-list');
  const contactForm = $('#contact-form');
  function getContacts() {
    try { return JSON.parse(localStorage.getItem(STORAGE.contacts)) || []; } catch { return []; }
  }
  function saveContacts(list) { localStorage.setItem(STORAGE.contacts, JSON.stringify(list)); }
  function renderContacts() {
    const list = getContacts();
    contactsList.innerHTML = '';
    if (!list.length) { contactsList.innerHTML = '<li class="empty">Aún no has añadido contactos.</li>'; return; }
    list.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'contact-item';
      li.innerHTML =
        `<span class="contact-item__info">` +
        `<span class="contact-item__name">${escapeHtml(c.name)}</span>` +
        `<span class="contact-item__phone">${escapeHtml(c.phone)}</span>` +
        `</span>` +
        `<span class="contact-item__actions">` +
        `<a class="call" href="tel:${encodeURIComponent(c.phone)}">Llamar</a>` +
        `<button class="del" type="button" data-i="${i}" aria-label="Eliminar ${escapeHtml(c.name)}">Borrar</button>` +
        `</span>`;
      contactsList.appendChild(li);
    });
  }
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#contact-name').value.trim();
    const phone = $('#contact-phone').value.trim();
    if (!name || !phone) return;
    const list = getContacts();
    list.push({ name, phone });
    saveContacts(list);
    contactForm.reset();
    renderContacts();
    $('#contact-name').focus();
  });
  contactsList.addEventListener('click', (e) => {
    const del = e.target.closest('.del');
    if (!del) return;
    const list = getContacts();
    list.splice(Number(del.dataset.i), 1);
    saveContacts(list);
    renderContacts();
  });
  renderContacts();

  /* ---------- Accesibilidad: menú flotante ---------- */
  const fab = $('#a11y-fab');
  const a11yToggle = $('#a11y-toggle');
  const a11yMenu = $('#a11y-menu');
  function setMenu(open) {
    a11yMenu.hidden = !open;
    a11yToggle.setAttribute('aria-expanded', String(open));
  }
  a11yToggle.addEventListener('click', () => setMenu(a11yMenu.hidden));
  document.addEventListener('click', (e) => { if (!fab.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* Tamaño de texto */
  const SCALES = [1, 1.15, 1.3, 1.5];
  let scaleIdx = Math.max(0, SCALES.indexOf(parseFloat(localStorage.getItem(STORAGE.fontScale)) || 1));
  function applyScale() {
    document.documentElement.style.setProperty('--font-scale', SCALES[scaleIdx]);
    localStorage.setItem(STORAGE.fontScale, String(SCALES[scaleIdx]));
  }
  $('#font-inc').addEventListener('click', () => { scaleIdx = Math.min(SCALES.length - 1, scaleIdx + 1); applyScale(); });
  $('#font-dec').addEventListener('click', () => { scaleIdx = Math.max(0, scaleIdx - 1); applyScale(); });
  applyScale();

  /* Tema claro/oscuro */
  const themeToggle = $('#theme-toggle');
  const themeLabel = $('#theme-label');
  function effectiveTheme() {
    const stored = localStorage.getItem(STORAGE.theme);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme() {
    const stored = localStorage.getItem(STORAGE.theme);
    if (stored === 'dark' || stored === 'light') document.documentElement.setAttribute('data-theme', stored);
    else document.documentElement.removeAttribute('data-theme');
    const isDark = effectiveTheme() === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeLabel.textContent = isDark ? 'Claro' : 'Oscuro';
  }
  themeToggle.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE.theme, next);
    applyTheme();
  });
  applyTheme();

  /* Alto contraste */
  const contrastToggle = $('#contrast-toggle');
  const contrastLabel = $('#contrast-label');
  function applyContrast() {
    const on = localStorage.getItem(STORAGE.contrast) === '1';
    if (on) document.documentElement.setAttribute('data-contrast', 'high');
    else document.documentElement.removeAttribute('data-contrast');
    contrastToggle.setAttribute('aria-pressed', String(on));
    contrastLabel.textContent = on ? 'Desactivar' : 'Activar';
  }
  contrastToggle.addEventListener('click', () => {
    const on = localStorage.getItem(STORAGE.contrast) === '1';
    localStorage.setItem(STORAGE.contrast, on ? '0' : '1');
    applyContrast();
  });
  applyContrast();

  /* ---------- Inicialización ---------- */
  populateRegions();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => {
        console.warn('No se pudo registrar el Service Worker:', err);
      });
    });
  }
})();

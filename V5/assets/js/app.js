/* SOS Offline V4 — lógica de la aplicación. Vanilla JS, sin dependencias.
   Multi-idioma (7 idiomas), iconos SVG, selector de país con autodetección,
   descarga de fichas y animaciones. */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const STORAGE = {
    region: 'sos.region', contacts: 'sos.contacts', fontScale: 'sos.fontScale',
    theme: 'sos.theme', contrast: 'sos.contrast', locale: 'sos.locale',
  };
  const SVC_ICON = { svc_general: 'general', svc_medical: 'medical', svc_fire: 'fire', svc_police: 'police', svc_redcross: 'redcross', svc_alt: 'general' };
  const EU_CODES = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','SE','CH','NO'];

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Idioma ---------- */
  function detectLocale() {
    const saved = localStorage.getItem(STORAGE.locale);
    if (saved && LOCALES.indexOf(saved) >= 0) return saved;
    const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
    return LOCALES.indexOf(nav) >= 0 ? nav : 'es';
  }
  let LOCALE = detectLocale();
  const t = (key) => (I18N[LOCALE] && I18N[LOCALE][key]) || key;
  const content = () => CONTENT[LOCALE] || CONTENT.es;
  const countryName = (c) => c.name[LOCALE] || c.name.en || c.name.es;

  /* ---------- Iconos ---------- */
  function injectIcons(root) {
    $$('[data-icon]', root || document).forEach((el) => {
      if (el.dataset.done) return;
      el.innerHTML = uiIcon(el.getAttribute('data-icon'));
      el.dataset.done = '1';
    });
  }

  /* ---------- Estado de conexión ----------
     El indicador solo aparece SIN conexión, para tranquilizar al usuario de que
     la app sigue funcionando; cuando hay conexión se oculta (no aporta nada). */
  const netStatus = $('#net-status');
  function updateNetStatus() {
    const online = navigator.onLine;
    netStatus.hidden = online;
    netStatus.textContent = online ? '' : t('offline');
    netStatus.classList.toggle('is-offline', !online);
  }
  window.addEventListener('online', updateNetStatus);
  window.addEventListener('offline', updateNetStatus);

  /* ---------- Región / números de emergencia ---------- */
  let REGION = 0;
  function findByCode(cc) {
    for (let i = 0; i < EMERGENCY_NUMBERS.length; i++) if (EMERGENCY_NUMBERS[i].code === cc) return i;
    return -1;
  }
  const INT_INDEX = findByCode('INT');
  // Detección de respaldo por idioma/zona horaria (sin permisos).
  function detectByLocale() {
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (const l of langs) {
      const m = /[-_]([A-Za-z]{2})\b/.exec(l || '');
      if (m) {
        const cc = m[1].toUpperCase();
        const idx = findByCode(cc);
        if (idx >= 0) return idx;
        if (cc === 'CA') return findByCode('US');
        if (EU_CODES.indexOf(cc) >= 0) return findByCode('EU');
      }
    }
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TIMEZONE_COUNTRY[tz]) return findByCode(TIMEZONE_COUNTRY[tz]);
      if (tz && tz.indexOf('Europe/') === 0) return findByCode('EU');
    } catch (e) { /* ignore */ }
    return -1;
  }
  // País más cercano a unas coordenadas (offline). Si el más cercano queda muy
  // lejos (> ~22°), no hay país adecuado → opción Global.
  function nearestRegion(lat, lon) {
    let best = -1, bestD = Infinity;
    EMERGENCY_NUMBERS.forEach((c, i) => {
      if (!c.loc) return;
      const dLat = lat - c.loc[0];
      const dLon = (lon - c.loc[1]) * Math.cos(lat * Math.PI / 180);
      const d = dLat * dLat + dLon * dLon;
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best < 0 || bestD > 22 * 22) return INT_INDEX;
    return best;
  }
  // Detección preferente por UBICACIÓN del dispositivo (GPS, más preciso);
  // si se deniega o falla, por idioma/zona horaria; y si no hay país, Global.
  function detectRegionAsync(cb) {
    const fallback = () => { const i = detectByLocale(); cb(i >= 0 ? i : INT_INDEX); };
    if (!navigator.geolocation) { fallback(); return; }
    let settled = false;
    const done = (i) => { if (!settled) { settled = true; cb(i); } };
    navigator.geolocation.getCurrentPosition(
      (pos) => done(nearestRegion(pos.coords.latitude, pos.coords.longitude)),
      () => { if (!settled) { settled = true; fallback(); } },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
    setTimeout(() => { if (!settled) { settled = true; fallback(); } }, 9000);
  }
  function setRegion(idx, persist) {
    if (idx < 0 || idx >= EMERGENCY_NUMBERS.length) return;
    REGION = idx;
    if (persist) localStorage.setItem(STORAGE.region, String(idx));
    renderEmergency();
  }
  function renderEmergency() {
    const c = EMERGENCY_NUMBERS[REGION];
    $('#country-badge').textContent = c.code;
    $('#country-name').textContent = countryName(c);
    const grid = $('#num-grid');
    grid.innerHTML = '';
    c.services.forEach((s, i) => {
      const a = document.createElement('a');
      a.className = 'num-tile' + (i === 0 ? ' num-tile--primary' : '');
      a.href = 'tel:' + s.number;
      a.innerHTML =
        `<span class="num-tile__ic">${uiIcon(SVC_ICON[s.key] || 'general')}</span>` +
        `<span class="num-tile__txt"><span class="num-tile__label">${escapeHtml(t(s.key))}</span>` +
        `<span class="num-tile__num">${escapeHtml(s.number)}</span></span>`;
      grid.appendChild(a);
    });
  }

  /* ---------- Selector de país (diálogo animado) ---------- */
  const countryDialog = $('#country-dialog');
  function renderCountryList(filter) {
    const ul = $('#country-list');
    const q = (filter || '').trim().toLowerCase();
    ul.innerHTML = '';
    EMERGENCY_NUMBERS.forEach((c, i) => {
      const label = (countryName(c) + ' ' + c.code).toLowerCase();
      if (q && label.indexOf(q) < 0) return;
      const li = document.createElement('li');
      li.innerHTML =
        `<button class="country-opt${i === REGION ? ' is-current' : ''}" type="button" data-i="${i}">` +
        `<span class="cc-badge">${escapeHtml(c.code)}</span>` +
        `<span class="country-opt__name">${escapeHtml(countryName(c))}</span>` +
        (i === REGION ? `<span class="country-opt__check">${uiIcon('check')}</span>` : '') +
        `</button>`;
      ul.appendChild(li);
    });
  }
  function openCountryDialog() {
    renderCountryList('');
    $('#country-search-input').value = '';
    if (typeof countryDialog.showModal === 'function') countryDialog.showModal();
    else countryDialog.setAttribute('open', '');
    $('#country-search-input').focus();
  }
  $('#country-btn').addEventListener('click', openCountryDialog);
  $('#country-close').addEventListener('click', () => closeAnimated(countryDialog));
  countryDialog.addEventListener('click', (e) => { if (e.target === countryDialog) closeAnimated(countryDialog); });
  countryDialog.addEventListener('cancel', (e) => { e.preventDefault(); closeAnimated(countryDialog); });
  $('#country-search-input').addEventListener('input', (e) => renderCountryList(e.target.value));
  $('#country-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.country-opt');
    if (!btn) return;
    setRegion(Number(btn.dataset.i), true);
    closeAnimated(countryDialog);
  });
  let detecting = false;
  function runDetect(fromDialog) {
    if (detecting) return;
    detecting = true;
    const btn = fromDialog ? $('#country-detect') : $('#detect-btn');
    btn.classList.add('is-loading');
    detectRegionAsync((idx) => {
      detecting = false;
      btn.classList.remove('is-loading');
      setRegion(idx >= 0 ? idx : INT_INDEX, true);
      if (fromDialog) closeAnimated(countryDialog);
    });
  }
  $('#detect-btn').addEventListener('click', () => runDetect(false));
  $('#country-detect').addEventListener('click', () => runDetect(true));

  /* ---------- Tarjetas de guías ---------- */
  function iconMarkup(item) {
    const svg = typeof illustrationSvg === 'function' ? illustrationSvg(item.id) : null;
    return svg || `<span aria-hidden="true">${item.icon || ''}</span>`;
  }
  function makeCard(item) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card' + (item.danger ? ' is-danger' : '');
    btn.dataset.search = (item.title + ' ' + (item.summary || '')).toLowerCase();
    btn.innerHTML =
      `<span class="card__icon">${iconMarkup(item)}</span>` +
      `<span class="card__text"><span class="card__title">${escapeHtml(item.title)}</span>` +
      (item.summary ? `<span class="card__summary">${escapeHtml(item.summary)}</span>` : '') + `</span>`;
    btn.addEventListener('click', () => openGuide(item));
    return btn;
  }
  function renderList(container, items) {
    container.innerHTML = '';
    items.forEach((item) => container.appendChild(makeCard(item)));
  }
  function renderAllGuides() {
    const c = content();
    renderList($('#first-aid-list'), c.firstAid);
    renderList($('#crisis-list'), c.crisis);
    renderList($('#disasters-list'), c.disasters);
    buildSearchIndex();
  }
  // Índice para la BÚSQUEDA GLOBAL (todas las categorías a la vez).
  let searchCards = [];
  function buildSearchIndex() {
    const c = content();
    const all = c.firstAid.concat(c.crisis, c.disasters);
    const cont = $('#search-results');
    cont.innerHTML = '';
    searchCards = all.map((item) => { const el = makeCard(item); cont.appendChild(el); return el; });
  }

  /* ---------- Diálogo de detalle ---------- */
  const dialog = $('#guide-dialog');
  const guideTitle = $('#guide-title');
  const guideBody = $('#guide-body');
  const guideIll = $('#guide-ill');
  let currentItem = null;

  function listHtml(items, cls) {
    if (!items || !items.length) return '';
    return `<ul${cls ? ' class="' + cls + '"' : ''}>` + items.map((s) => `<li>${escapeHtml(s)}</li>`).join('') + '</ul>';
  }
  function orderedHtml(items) {
    if (!items || !items.length) return '';
    return '<ol class="steps">' + items.map((s) => `<li><span class="steps__txt">${escapeHtml(s)}</span></li>`).join('') + '</ol>';
  }
  function buildGuideHtml(item) {
    let html = '';
    if (item.note) html += `<p class="note">${escapeHtml(item.note)}</p>`;
    if (item.steps) {
      html += `<h3>${escapeHtml(t('whatToDo'))}</h3>` + orderedHtml(item.steps);
      if (item.donts && item.donts.length) html += `<h3>${escapeHtml(t('avoid'))}</h3>` + listHtml(item.donts, 'donts');
    } else {
      if (item.before && item.before.length) html += `<h3><span class="phase-label">${escapeHtml(t('before'))}</span> · ${escapeHtml(t('beforeSub'))}</h3>` + listHtml(item.before);
      if (item.during && item.during.length) html += `<h3><span class="phase-label">${escapeHtml(t('during'))}</span> · ${escapeHtml(t('duringSub'))}</h3>` + orderedHtml(item.during);
      if (item.after && item.after.length) html += `<h3><span class="phase-label">${escapeHtml(t('after'))}</span> · ${escapeHtml(t('afterSub'))}</h3>` + listHtml(item.after);
    }
    return html;
  }
  function buildGuideSpeech(item) {
    const parts = [item.title + '.'];
    if (item.note) parts.push(item.note);
    if (item.steps) {
      parts.push(t('whatToDo') + '.');
      item.steps.forEach((s, i) => parts.push((i + 1) + '. ' + s));
      if (item.donts) { parts.push(t('avoid') + '.'); item.donts.forEach((d) => parts.push(d)); }
    } else {
      ['before', 'during', 'after'].forEach((ph) => {
        if (item[ph] && item[ph].length) { parts.push(t(ph) + '.'); item[ph].forEach((s) => parts.push(s)); }
      });
    }
    return parts.join(' ');
  }
  let currentSpeech = '';
  function openGuide(item) {
    currentItem = item;
    guideTitle.textContent = item.title;
    const svg = typeof illustrationSvg === 'function' ? illustrationSvg(item.id) : null;
    guideIll.innerHTML = svg || `<span style="font-size:1.6rem">${item.icon || ''}</span>`;
    guideBody.innerHTML = buildGuideHtml(item);
    currentSpeech = buildGuideSpeech(item);
    stopSpeech();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    $('#guide-close').focus();
  }
  function closeGuide() { stopSpeech(); closeAnimated(dialog); }
  $('#guide-close').addEventListener('click', closeGuide);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeGuide(); });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeGuide(); });

  /* ---------- Cierre con animación (diálogos) ---------- */
  function closeAnimated(dlg, after) {
    if (!dlg.open) { if (after) after(); return; }
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      dlg.classList.remove('closing');
      dlg.removeEventListener('animationend', onEnd);
      if (dlg.open) dlg.close();
      if (after) after();
    };
    const onEnd = (e) => { if (e.target === dlg) finish(); };
    dlg.classList.add('closing');
    dlg.addEventListener('animationend', onEnd);
    setTimeout(finish, 320);
  }

  /* ---------- Descargar ficha como IMAGEN (PNG) ---------- */
  // Ajuste de línea por palabra; si una palabra/CJK no cabe, corta por caracteres.
  function wrapText(ctx, text, maxW) {
    const out = []; let line = '';
    function pushWord(w) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width <= maxW) { line = test; return; }
      if (line) { out.push(line); line = ''; }
      if (ctx.measureText(w).width <= maxW) { line = w; return; }
      let cur = '';
      for (const ch of w) {
        if (cur && ctx.measureText(cur + ch).width > maxW) { out.push(cur); cur = ch; }
        else cur += ch;
      }
      line = cur;
    }
    String(text).split(/\s+/).forEach((w) => { if (w) pushWord(w); });
    if (line) out.push(line);
    return out.length ? out : [''];
  }
  // Dibuja la ficha; en pasada de medición (draw=false) solo calcula el alto.
  function renderGuideCanvas(ctx, item, W, draw) {
    const pad = 36, cw = W - pad * 2;
    let y = pad;
    ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    const RED = '#cf2630', TEXT = '#1a1a1a', GRAY = '#6b6a66', BORDER = '#e7e3d8', FONT = ' system-ui, "Segoe UI", Roboto, sans-serif';
    function block(text, font, color, lh, indent) {
      ctx.font = font;
      const x = pad + (indent || 0);
      wrapText(ctx, text, cw - (indent || 0)).forEach((ln) => { if (draw) { ctx.fillStyle = color; ctx.fillText(ln, x, y); } y += lh; });
    }
    block('SOS OFFLINE', 'bold 14px' + FONT, RED, 20); y += 2;
    block(item.title, 'bold 26px' + FONT, TEXT, 32); y += 4;
    if (item.summary) { block(item.summary, 'italic 17px' + FONT, GRAY, 24); y += 4; }
    if (item.note) {
      ctx.font = '16px' + FONT;
      const lines = wrapText(ctx, item.note, cw - 24);
      const boxH = lines.length * 22 + 18;
      if (draw) { ctx.fillStyle = '#fdf3e3'; ctx.fillRect(pad, y, cw, boxH); ctx.fillStyle = RED; ctx.fillRect(pad, y, 4, boxH); ctx.fillStyle = '#7a5a16'; lines.forEach((ln, i) => ctx.fillText(ln, pad + 14, y + 9 + i * 22)); }
      y += boxH + 10;
    }
    function heading(text) { y += 12; block(text, 'bold 19px' + FONT, RED, 26); y += 2; }
    function ordered(arr) {
      arr.forEach((s, i) => {
        const top = y;
        ctx.font = '17px' + FONT;
        const lines = wrapText(ctx, s, cw - 40);
        if (draw) {
          ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(pad + 12, top + 12, 12, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = 'bold 14px' + FONT;
          ctx.fillText(String(i + 1), pad + 12, top + 4); ctx.textAlign = 'left';
          ctx.fillStyle = TEXT; ctx.font = '17px' + FONT;
          lines.forEach((ln, k) => ctx.fillText(ln, pad + 36, top + 2 + k * 23));
        }
        y = top + Math.max(28, lines.length * 23) + 10;
        if (draw) { ctx.strokeStyle = BORDER; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, y - 6); ctx.lineTo(W - pad, y - 6); ctx.stroke(); }
      });
    }
    function bullets(arr, mark) {
      arr.forEach((s) => {
        const top = y;
        ctx.font = '17px' + FONT;
        const lines = wrapText(ctx, s, cw - 24);
        if (draw) {
          ctx.fillStyle = RED; ctx.font = 'bold 17px' + FONT; ctx.fillText(mark, pad, top + 1);
          ctx.fillStyle = TEXT; ctx.font = '17px' + FONT;
          lines.forEach((ln, k) => ctx.fillText(ln, pad + 24, top + k * 23));
        }
        y = top + lines.length * 23 + 8;
      });
    }
    if (item.steps) {
      heading(t('whatToDo')); ordered(item.steps);
      if (item.donts && item.donts.length) { heading(t('avoid')); bullets(item.donts, '×'); }
    } else {
      if (item.before && item.before.length) { heading(t('before')); bullets(item.before, '•'); }
      if (item.during && item.during.length) { heading(t('during')); ordered(item.during); }
      if (item.after && item.after.length) { heading(t('after')); bullets(item.after, '•'); }
    }
    y += 14;
    if (draw) { ctx.strokeStyle = BORDER; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); }
    y += 10;
    block(t('disclaimer'), '13px' + FONT, GRAY, 18); y += 4;
    block('github.com/xXxCoNtReRaSxXx/sos-offline', '12px' + FONT, GRAY, 16);
    return y + pad;
  }
  function downloadGuide() {
    if (!currentItem) return;
    const W = 760, ratio = Math.min(2, (window.devicePixelRatio || 1) + 1);
    const measure = document.createElement('canvas').getContext('2d');
    const H = Math.ceil(renderGuideCanvas(measure, currentItem, W, false));
    const canvas = document.createElement('canvas');
    canvas.width = W * ratio; canvas.height = H * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    renderGuideCanvas(ctx, currentItem, W, true);
    const id = currentItem.id, lc = LOCALE;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `SOS-${id}-${lc}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }
  $('#guide-download').addEventListener('click', downloadGuide);

  /* ---------- Lectura en voz alta ---------- */
  const speakBtn = $('#guide-speak');
  const speakText = $('#speak-text');
  const synth = window.speechSynthesis;
  function pickVoice() {
    if (!synth) return null;
    const want = (SPEECH_LANG[LOCALE] || 'es').slice(0, 2);
    return synth.getVoices().find((v) => v.lang.slice(0, 2).toLowerCase() === want) || null;
  }
  function setSpeaking(on) {
    speakBtn.setAttribute('aria-pressed', String(on));
    speakBtn.classList.toggle('speaking-pulse', on);
    if (speakText) speakText.textContent = on ? t('stop') : t('read');
  }
  function stopSpeech() { if (synth) synth.cancel(); setSpeaking(false); }
  if (!synth) { speakBtn.hidden = true; }
  else {
    speakBtn.addEventListener('click', () => {
      if (synth.speaking) { stopSpeech(); return; }
      const u = new SpeechSynthesisUtterance(currentSpeech);
      u.lang = SPEECH_LANG[LOCALE] || 'es-ES';
      const v = pickVoice(); if (v) u.voice = v;
      u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
      synth.speak(u); setSpeaking(true);
    });
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
  function showTab(tab) {
    tabs.forEach((tb) => {
      const selected = tb === tab;
      tb.setAttribute('aria-selected', String(selected));
      $('#' + tb.getAttribute('aria-controls')).hidden = !selected;
    });
    searchWrap.hidden = tab.id === 'tab-contacts';
  }
  function activateTab(tab) {
    searchActive = false;
    $('#panel-search').hidden = true;
    $('#search').value = '';
    showTab(tab);
  }

  /* ---------- Buscador GLOBAL (todas las categorías a la vez) ---------- */
  const searchPanel = $('#panel-search');
  const searchEmpty = $('#search-empty');
  let searchActive = false;
  let prevTabId = 'tab-first-aid';
  $('#search').addEventListener('input', (e) => doSearch(e.target.value));
  function doSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Salir del modo búsqueda y volver a la pestaña previa.
      searchActive = false;
      searchPanel.hidden = true;
      showTab($('#' + prevTabId));
      return;
    }
    if (!searchActive) {
      const cur = tabs.find((tb) => tb.getAttribute('aria-selected') === 'true');
      prevTabId = cur ? cur.id : 'tab-first-aid';
      searchActive = true;
      $$('.panel').forEach((p) => { if (p !== searchPanel) p.hidden = true; });
      searchPanel.hidden = false;
    }
    let visible = 0;
    searchCards.forEach((card) => {
      const show = card.dataset.search.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    searchEmpty.hidden = visible > 0;
    if (!visible) searchEmpty.textContent = t('noResults');
  }

  /* ---------- Contactos ---------- */
  const contactsList = $('#contacts-list');
  const contactForm = $('#contact-form');
  function getContacts() { try { return JSON.parse(localStorage.getItem(STORAGE.contacts)) || []; } catch { return []; } }
  function saveContacts(list) { localStorage.setItem(STORAGE.contacts, JSON.stringify(list)); }
  function renderContacts() {
    const list = getContacts();
    contactsList.innerHTML = '';
    if (!list.length) { contactsList.innerHTML = `<li class="empty">${escapeHtml(t('noContacts'))}</li>`; return; }
    list.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'contact-item';
      li.innerHTML =
        `<span class="contact-item__info"><span class="contact-item__name">${escapeHtml(c.name)}</span>` +
        `<span class="contact-item__phone">${escapeHtml(c.phone)}</span></span>` +
        `<span class="contact-item__actions">` +
        `<a class="call" href="tel:${encodeURIComponent(c.phone)}">${escapeHtml(t('call'))}</a>` +
        `<button class="del" type="button" data-i="${i}" aria-label="${escapeHtml(t('deleteAria'))} ${escapeHtml(c.name)}">${uiIcon('trash')}</button>` +
        `</span>`;
      contactsList.appendChild(li);
    });
  }
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#contact-name').value.trim(), phone = $('#contact-phone').value.trim();
    if (!name || !phone) return;
    const list = getContacts(); list.push({ name, phone }); saveContacts(list);
    contactForm.reset(); renderContacts(); $('#contact-name').focus();
  });
  contactsList.addEventListener('click', (e) => {
    const del = e.target.closest('.del'); if (!del) return;
    const list = getContacts(); list.splice(Number(del.dataset.i), 1); saveContacts(list); renderContacts();
  });

  /* ---------- Accesibilidad: menú flotante ---------- */
  const fab = $('#a11y-fab');
  const a11yToggle = $('#a11y-toggle');
  const a11yMenu = $('#a11y-menu');
  let menuOpen = false;
  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    a11yToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      a11yMenu.hidden = false;
      a11yMenu.classList.remove('closing');
      a11yMenu.classList.add('opening');
    } else {
      a11yMenu.classList.remove('opening');
      a11yMenu.classList.add('closing');
      const hide = () => { a11yMenu.classList.remove('closing'); a11yMenu.hidden = true; a11yMenu.removeEventListener('animationend', hide); };
      a11yMenu.addEventListener('animationend', hide);
      setTimeout(hide, 220);
    }
  }
  a11yToggle.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('click', (e) => { if (!fab.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* Tamaño de texto (con animación de zoom) */
  const SCALES = [1, 1.15, 1.3, 1.5];
  let scaleIdx = Math.max(0, SCALES.indexOf(parseFloat(localStorage.getItem(STORAGE.fontScale)) || 1));
  function applyScale(animate) {
    document.documentElement.style.setProperty('--font-scale', SCALES[scaleIdx]);
    localStorage.setItem(STORAGE.fontScale, String(SCALES[scaleIdx]));
    if (animate) {
      const m = $('#main');
      m.classList.remove('zoom-pulse'); void m.offsetWidth; m.classList.add('zoom-pulse');
    }
  }
  $('#font-inc').addEventListener('click', () => { scaleIdx = Math.min(SCALES.length - 1, scaleIdx + 1); applyScale(true); });
  $('#font-dec').addEventListener('click', () => { scaleIdx = Math.max(0, scaleIdx - 1); applyScale(true); });

  /* Tema claro/oscuro */
  const themeToggle = $('#theme-toggle');
  const themeLabel = $('#theme-label');
  const themeIcon = $('#theme-icon');
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
    themeLabel.textContent = isDark ? t('themeToLight') : t('themeToDark');
    if (themeIcon) { themeIcon.innerHTML = uiIcon(isDark ? 'sun' : 'moon'); themeIcon.dataset.done = '1'; }
  }
  themeToggle.addEventListener('click', () => {
    localStorage.setItem(STORAGE.theme, effectiveTheme() === 'dark' ? 'light' : 'dark'); applyTheme();
  });

  /* Alto contraste */
  const contrastToggle = $('#contrast-toggle');
  const contrastLabel = $('#contrast-label');
  function applyContrast() {
    const on = localStorage.getItem(STORAGE.contrast) === '1';
    if (on) document.documentElement.setAttribute('data-contrast', 'high');
    else document.documentElement.removeAttribute('data-contrast');
    contrastToggle.setAttribute('aria-pressed', String(on));
    contrastLabel.textContent = on ? t('contrastOff') : t('contrastOn');
  }
  contrastToggle.addEventListener('click', () => {
    const on = localStorage.getItem(STORAGE.contrast) === '1';
    localStorage.setItem(STORAGE.contrast, on ? '0' : '1'); applyContrast();
  });

  /* Selector de idioma */
  const langSelect = $('#lang-select');
  function populateLangSelect() {
    langSelect.innerHTML = '';
    LOCALES.forEach((lc) => { const o = document.createElement('option'); o.value = lc; o.textContent = LOCALE_NAMES[lc]; langSelect.appendChild(o); });
    langSelect.value = LOCALE;
  }
  langSelect.addEventListener('change', () => setLocale(langSelect.value));
  function setLocale(lc) {
    if (LOCALES.indexOf(lc) < 0) return;
    LOCALE = lc; localStorage.setItem(STORAGE.locale, lc);
    closeAnimated(dialog); closeAnimated(countryDialog);
    applyI18n(); renderAllGuides(); renderContacts(); renderEmergency();
  }

  /* ---------- Aplicar cadenas de interfaz ---------- */
  function setText(sel, v) { const el = $(sel); if (el) el.textContent = v; }
  function setHtml(sel, v) { const el = $(sel); if (el) el.innerHTML = v; }
  function setPh(sel, v) { const el = $(sel); if (el) el.placeholder = v; }
  function setAria(sel, v) { const el = $(sel); if (el) el.setAttribute('aria-label', v); }
  function applyI18n() {
    document.documentElement.lang = (I18N[LOCALE] && I18N[LOCALE].htmlLang) || 'es';
    setText('#skip-link', t('skip'));
    setText('#hero-tagline', t('tagline'));
    setText('#emergency-title-txt', t('emergencyTitle'));
    setText('#detect-txt', t('detect'));
    setAria('#detect-btn', t('detectAria'));
    setAria('#country-btn', t('selectCountry'));
    setText('#country-dialog-title', t('countryTitle'));
    setText('#country-detect-txt', t('detect'));
    setPh('#country-search-input', t('searchCountry'));
    setText('#disclaimer', t('disclaimer'));
    setText('#txt-firstaid', t('tabFirstAid'));
    setText('#txt-crisis', t('tabCrisis'));
    setText('#txt-disasters', t('tabDisasters'));
    setText('#txt-contacts', t('tabContacts'));
    setPh('#search', t('search'));
    setText('#crisis-intro', t('crisisIntro'));
    setHtml('#contacts-intro', t('contactsIntro'));
    setText('#lbl-name', t('name'));
    setText('#lbl-phone', t('phone'));
    setPh('#contact-name', t('namePlaceholder'));
    setPh('#contact-phone', t('phonePlaceholder'));
    setText('#add-contact', t('addContact'));
    setAria('#guide-close', t('close'));
    setAria('#country-close', t('close'));
    setAria('#guide-speak', t('readAria'));
    setText('#download-text', t('download'));
    setAria('#guide-download', t('downloadAria'));
    setText('#lbl-textsize', t('textSize'));
    setAria('#font-inc', t('incFont'));
    setAria('#font-dec', t('decFont'));
    setText('#lbl-theme', t('theme'));
    setText('#lbl-contrast', t('contrast'));
    setText('#lbl-language', t('language'));
    setAria('#a11y-toggle', t('a11yTitle'));
    setAria('#a11y-menu', t('a11yTitle'));
    setText('#foot-os', t('openSource'));
    setText('#foot-github', t('viewGithub'));
    setText('#foot-offline', t('worksOffline'));
    updateNetStatus(); applyTheme(); applyContrast();
    if (speakText) speakText.textContent = t('read');
  }

  /* ---------- Inicialización ---------- */
  $('#hero-logo').innerHTML = sosLogo();
  injectIcons();
  populateLangSelect();
  applyScale(false);
  applyI18n();
  renderAllGuides();
  renderContacts();

  // Región: usar la guardada o autodetectar (por idioma/zona horaria) la primera
  // vez; sin coincidencia → Global. La detección por GPS es manual (botón).
  const savedRegion = localStorage.getItem(STORAGE.region);
  if (savedRegion !== null && EMERGENCY_NUMBERS[savedRegion]) {
    REGION = Number(savedRegion);
  } else {
    const d = detectByLocale();
    REGION = d >= 0 ? d : INT_INDEX;
    if (d >= 0) localStorage.setItem(STORAGE.region, String(d));
  }
  renderEmergency();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW:', err));
    });
  }
})();

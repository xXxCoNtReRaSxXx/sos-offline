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

  /* ---------- Estado de conexión ---------- */
  const netStatus = $('#net-status');
  function updateNetStatus() {
    const online = navigator.onLine;
    netStatus.textContent = online ? t('online') : t('offline');
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
  function detectRegion() {
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
  function runDetect() {
    const idx = detectRegion();
    if (idx >= 0) { setRegion(idx, true); return true; }
    return false;
  }
  $('#detect-btn').addEventListener('click', () => { if (!runDetect()) openCountryDialog(); });
  $('#country-detect').addEventListener('click', () => { if (runDetect()) closeAnimated(countryDialog); else renderCountryList(''); });

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

  /* ---------- Descargar ficha ---------- */
  function guideToHtml(item) {
    const rows = (arr, ordered) => arr && arr.length
      ? (ordered ? '<ol>' : '<ul>') + arr.map((s) => `<li>${escapeHtml(s)}</li>`).join('') + (ordered ? '</ol>' : '</ul>') : '';
    let body = '';
    if (item.note) body += `<p class="note">${escapeHtml(item.note)}</p>`;
    if (item.steps) {
      body += `<h2>${escapeHtml(t('whatToDo'))}</h2>` + rows(item.steps, true);
      if (item.donts) body += `<h2>${escapeHtml(t('avoid'))}</h2>` + rows(item.donts, false);
    } else {
      if (item.before && item.before.length) body += `<h2>${escapeHtml(t('before'))}</h2>` + rows(item.before, false);
      if (item.during && item.during.length) body += `<h2>${escapeHtml(t('during'))}</h2>` + rows(item.during, true);
      if (item.after && item.after.length) body += `<h2>${escapeHtml(t('after'))}</h2>` + rows(item.after, false);
    }
    return `<!DOCTYPE html><html lang="${I18N[LOCALE].htmlLang}"><head><meta charset="UTF-8">` +
      `<meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>SOS Offline — ${escapeHtml(item.title)}</title><style>` +
      `body{font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:720px;margin:24px auto;padding:0 18px;color:#1a1a1a;line-height:1.6}` +
      `h1{color:#cf2630} h2{margin-top:22px;border-bottom:2px solid #eee;padding-bottom:4px}` +
      `li{margin-bottom:8px} ol li,ul li{padding-left:4px} .note{background:#fdf3e3;border-left:4px solid #e8b974;padding:10px 14px;border-radius:8px}` +
      `.foot{margin-top:28px;font-size:.85rem;color:#777;border-top:1px solid #eee;padding-top:12px}` +
      `@media print{body{margin:0}}</style></head><body>` +
      `<h1>SOS Offline — ${escapeHtml(item.title)}</h1>` +
      (item.summary ? `<p><em>${escapeHtml(item.summary)}</em></p>` : '') + body +
      `<p class="foot">${escapeHtml(t('disclaimer'))}<br>SOS Offline · github.com/xXxCoNtReRaSxXx/sos-offline</p>` +
      `</body></html>`;
  }
  function downloadGuide() {
    if (!currentItem) return;
    const blob = new Blob([guideToHtml(currentItem)], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOS-${currentItem.id}-${LOCALE}.html`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
  function activateTab(tab) {
    tabs.forEach((tb) => {
      const selected = tb === tab;
      tb.setAttribute('aria-selected', String(selected));
      $('#' + tb.getAttribute('aria-controls')).hidden = !selected;
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

  // Región: usar la guardada o autodetectar la primera vez.
  const savedRegion = localStorage.getItem(STORAGE.region);
  if (savedRegion !== null && EMERGENCY_NUMBERS[savedRegion]) {
    REGION = Number(savedRegion);
  } else {
    const d = detectRegion();
    REGION = d >= 0 ? d : 0;
    if (d >= 0) localStorage.setItem(STORAGE.region, String(d));
  }
  renderEmergency();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW:', err));
    });
  }
})();

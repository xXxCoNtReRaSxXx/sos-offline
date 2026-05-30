/* SOS Offline — lógica de la aplicación. Vanilla JS, sin dependencias. */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const STORAGE = {
    region: 'sos.region',
    contacts: 'sos.contacts',
    fontScale: 'sos.fontScale',
  };

  /* ---------- Estado de conexión ---------- */
  const netStatus = $('#net-status');
  function updateNetStatus() {
    const online = navigator.onLine;
    netStatus.textContent = online ? '● En línea' : '● Sin conexión (todo disponible)';
    netStatus.classList.toggle('is-offline', !online);
  }
  window.addEventListener('online', updateNetStatus);
  window.addEventListener('offline', updateNetStatus);
  updateNetStatus();

  /* ---------- Número de emergencias por región ---------- */
  const regionSelect = $('#region-select');
  const callBtn = $('#call-emergency');
  const callNumber = $('#call-number');

  function populateRegions() {
    EMERGENCY_NUMBERS.forEach((r, i) => {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `${r.region} — ${r.number}`;
      regionSelect.appendChild(opt);
    });
    const saved = localStorage.getItem(STORAGE.region);
    regionSelect.value = saved !== null && EMERGENCY_NUMBERS[saved] ? saved : '0';
    applyRegion();
  }
  function applyRegion() {
    const r = EMERGENCY_NUMBERS[regionSelect.value] || EMERGENCY_NUMBERS[0];
    callNumber.textContent = r.number;
    callBtn.href = 'tel:' + r.number;
    localStorage.setItem(STORAGE.region, regionSelect.value);
  }
  regionSelect.addEventListener('change', applyRegion);

  /* ---------- Tarjetas de guías ---------- */
  function makeCard(item) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card' + (item.danger ? ' is-danger' : '');
    btn.dataset.search = (item.title + ' ' + (item.summary || '')).toLowerCase();
    btn.innerHTML =
      `<span class="card__icon" aria-hidden="true">${item.icon}</span>` +
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
  renderList($('#disasters-list'), DISASTERS);

  /* ---------- Diálogo de detalle ---------- */
  const dialog = $('#guide-dialog');
  const guideTitle = $('#guide-title');
  const guideBody = $('#guide-body');

  function listHtml(items, cls) {
    if (!items || !items.length) return '';
    return `<ul${cls ? ' class="' + cls + '"' : ''}>` +
      items.map((s) => `<li>${escapeHtml(s)}</li>`).join('') + '</ul>';
  }
  function orderedHtml(items) {
    if (!items || !items.length) return '';
    return '<ol>' + items.map((s) => `<li>${escapeHtml(s)}</li>`).join('') + '</ol>';
  }

  function openGuide(item) {
    guideTitle.textContent = `${item.icon} ${item.title}`;
    let html = '';
    if (item.steps) {
      // Guía de primeros auxilios
      html += '<h3>Qué hacer</h3>' + orderedHtml(item.steps);
      if (item.donts && item.donts.length) {
        html += '<h3>Evita</h3>' + listHtml(item.donts, 'donts');
      }
    } else {
      // Guía de desastre (antes / durante / después)
      if (item.before && item.before.length) {
        html += '<h3><span class="phase-label">Antes</span> · Prepárate</h3>' + listHtml(item.before);
      }
      if (item.during && item.during.length) {
        html += '<h3><span class="phase-label">Durante</span> · Actúa</h3>' + orderedHtml(item.during);
      }
      if (item.after && item.after.length) {
        html += '<h3><span class="phase-label">Después</span> · Recupérate</h3>' + listHtml(item.after);
      }
    }
    guideBody.innerHTML = html;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    $('#guide-close').focus();
  }

  $('#guide-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    // Cerrar al pulsar fuera del contenido
    if (e.target === dialog) dialog.close();
  });

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
      const panel = $('#' + t.getAttribute('aria-controls'));
      panel.hidden = !selected;
    });
    // El buscador solo aplica a las guías, no a los contactos
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
    try { return JSON.parse(localStorage.getItem(STORAGE.contacts)) || []; }
    catch { return []; }
  }
  function saveContacts(list) {
    localStorage.setItem(STORAGE.contacts, JSON.stringify(list));
  }
  function renderContacts() {
    const list = getContacts();
    contactsList.innerHTML = '';
    if (!list.length) {
      contactsList.innerHTML = '<li class="empty">Aún no has añadido contactos.</li>';
      return;
    }
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

  /* ---------- Tamaño de texto accesible ---------- */
  const textBtn = $('#text-size');
  const SCALES = [1, 1.15, 1.3];
  let scaleIdx = Math.max(0, SCALES.indexOf(parseFloat(localStorage.getItem(STORAGE.fontScale)) || 1));
  function applyScale() {
    document.documentElement.style.setProperty('--font-scale', SCALES[scaleIdx]);
    localStorage.setItem(STORAGE.fontScale, String(SCALES[scaleIdx]));
    textBtn.setAttribute('aria-pressed', String(scaleIdx > 0));
  }
  textBtn.addEventListener('click', () => {
    scaleIdx = (scaleIdx + 1) % SCALES.length;
    applyScale();
  });
  applyScale();

  /* ---------- Utilidades ---------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Inicialización ---------- */
  populateRegions();

  // Registrar el Service Worker (modo offline).
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => {
        console.warn('No se pudo registrar el Service Worker:', err);
      });
    });
  }
})();

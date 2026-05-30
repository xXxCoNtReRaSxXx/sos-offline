/**
 * SOS Offline V4 — Iconos de interfaz (SVG en línea).
 *
 * Reemplazan a los emojis para garantizar que se vean en cualquier navegador
 * (en Windows de escritorio muchos emojis, sobre todo las banderas, no se
 * renderizan). Usan `currentColor`, así que se adaptan al tema y al contraste.
 */
const UI_ICONS = {
  phone: '<path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  warn: '<path d="M12 4 2.5 20h19L12 4z"/><path d="M12 10v5"/><circle cx="12" cy="18" r=".6" fill="currentColor" stroke="none"/>',
  firstaid: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
  crisis: '<path d="M12 3 5 6v6c0 5 3 7 7 9 4-2 7-4 7-9V6z"/><path d="M12 9v4"/><circle cx="12" cy="16" r=".6" fill="currentColor" stroke="none"/>',
  disasters: '<path d="M4 6h13a3 3 0 1 0-3-3"/><path d="M4 11h16a3 3 0 1 1-3 3"/><path d="M4 16h10a3 3 0 1 1-3 3"/>',
  contacts: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3 3 0 0 1 0 5M21 20c0-2.5-1.5-4.7-3.7-5.6"/>',
  general: '<path d="M12 3a6 6 0 0 0-6 6v3l-1.5 3h15L18 12V9a6 6 0 0 0-6-6z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  medical: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
  fire: '<path d="M12 3c3 4-1 5 0 7 2-1 1-3 3-3 1 3 3 4 3 7a6 6 0 0 1-12 0c0-4 4-5 6-11z"/>',
  police: '<path d="M12 3 5 6v6c0 5 3 7 7 9 4-2 7-4 7-9V6z"/><path d="m12 8 1.2 2.4 2.6.4-1.9 1.8.5 2.6L12 14l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" fill="currentColor" stroke="none"/>',
  redcross: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  location: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  detect: '<circle cx="12" cy="12" r="7"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>',
  download: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>',
  read: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  accessibility: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="7.3" r="1.3" fill="currentColor" stroke="none"/><path d="M6.5 9.5c3.5 1.3 7.5 1.3 11 0M12 9.5V14m0 0-2.5 4.5M12 14l2.5 4.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 5 5L20 6"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/>',
};

/** SVG de icono de interfaz. */
function uiIcon(name, cls) {
  const inner = UI_ICONS[name];
  if (!inner) return '';
  return (
    '<svg viewBox="0 0 24 24" class="ic ' + (cls || '') + '" aria-hidden="true" ' +
    'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    inner + '</svg>'
  );
}

/** Logo SOS (insignia con cruz, colores fijos para que siempre se vea). */
function sosLogo() {
  return (
    '<svg viewBox="0 0 64 64" class="sos-logo" aria-hidden="true">' +
    '<rect width="64" height="64" rx="16" fill="#cf2630"/>' +
    '<rect x="27" y="14" width="10" height="36" rx="3" fill="#fff"/>' +
    '<rect x="14" y="27" width="36" height="10" rx="3" fill="#fff"/>' +
    '</svg>'
  );
}

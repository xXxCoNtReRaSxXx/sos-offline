/**
 * SOS Offline V2 — Pictogramas (ilustraciones detalladas).
 *
 * Cada entrada es el contenido interno de un SVG (viewBox 0 0 64 64). Se dibujan
 * con `currentColor`, de modo que se adaptan automáticamente al modo claro/oscuro
 * y al modo de alto contraste. El estilo se inspira en la señalética oficial
 * (ISO 7010 para seguridad y GHS para sustancias peligrosas), simplificada para
 * leerse con claridad en una pantalla pequeña y bajo estrés.
 *
 * Las contribuciones que mejoren la fidelidad de estos pictogramas a las normas
 * oficiales son bienvenidas.
 */
const ILLUSTRATIONS = {
  /* ---- Primeros auxilios ---- */
  rcp:
    '<path d="M32 18c-2.6-5.5-12-4.8-12 2 0 6 12 13 12 13s12-7 12-13c0-6.8-9.4-7.5-12-2z" fill="currentColor" stroke="none"/>' +
    '<path d="M10 47h9l3-8 5 16 4-11 2.5 3h10.5"/>',
  atragantamiento:
    '<circle cx="32" cy="15" r="8"/>' +
    '<path d="M16 52c0-9 7-15 16-15s16 6 16 15"/>' +
    '<path d="M25 31l7 6 7-6"/>',
  hemorragia:
    '<path d="M32 12c7 10 12 15 12 23a12 12 0 0 1-24 0c0-8 5-13 12-23z"/>' +
    '<path d="M32 29v12M26 35h12"/>',
  quemadura:
    '<path d="M32 8c4 8-2 10 0 15 4-3 2-7 6-7 2 6 4 8 4 13a10 10 0 0 1-20 0c0-8 7-10 10-21z"/>' +
    '<path d="M12 52c4-3 7 3 11 0s7 3 11 0 7 3 9 0"/>',
  fractura:
    '<rect x="22" y="13" width="20" height="38" rx="10"/>' +
    '<path d="M19 24l26 9M19 35l26 9"/>',
  inconsciencia:
    '<circle cx="15" cy="36" r="6"/>' +
    '<path d="M21 39c9-3 16-2 26 3"/>' +
    '<path d="M30 41c2-7 9-7 12-2"/>',
  convulsion:
    '<path d="M34 8 18 36h12l-4 20 22-30H34l6-18z" fill="currentColor" stroke="none"/>',
  'golpe-calor':
    '<path d="M28 16a6 6 0 0 1 12 0v18a10 10 0 1 1-12 0z"/>' +
    '<circle cx="34" cy="44" r="5" fill="currentColor" stroke="none"/>' +
    '<path d="M34 24v16"/>',
  alergia:
    '<rect x="29" y="8" width="10" height="30" rx="3"/>' +
    '<rect x="27" y="38" width="14" height="8" rx="2"/>' +
    '<path d="M34 46v8M30 18h8"/>',
  intoxicacion:
    '<path d="M20 28a12 12 0 0 1 24 0c0 5-3 8-3 11v3H23v-3c0-3-3-6-3-11z"/>' +
    '<circle cx="27" cy="29" r="3" fill="currentColor" stroke="none"/>' +
    '<circle cx="37" cy="29" r="3" fill="currentColor" stroke="none"/>' +
    '<path d="M30 42v4M34 42v4"/>',
  'ataque-panico':
    '<path d="M44 16a15 15 0 1 0-8 28v8h8"/>' +
    '<path d="M20 30h5l2-6 4 14 3-8h7"/>',

  /* ---- Crisis y seguridad ---- */
  'sobredosis-opioides':
    '<rect x="22" y="24" width="24" height="12" rx="2" transform="rotate(-45 34 30)"/>' +
    '<path d="M44 16l6 6"/>' +
    '<path d="M22 42 12 52M16 46l4 4"/>' +
    '<path d="M30 28l8 8"/>',
  'sobredosis-estimulantes':
    '<path d="M34 8 18 36h12l-4 20 22-30H34l6-18z" fill="currentColor" stroke="none"/>',
  'intoxicacion-etilica':
    '<path d="M27 10h10v8l4 8v28a4 4 0 0 1-4 4H27a4 4 0 0 1-4-4V26l4-8z"/>' +
    '<path d="M23 33h18"/>',
  'arma-fuego':
    '<path d="M32 8 14 16v14c0 12 8 20 18 26 10-6 18-14 18-26V16z"/>' +
    '<path d="M32 24v14M25 31h14"/>',
  'arma-blanca':
    '<rect x="14" y="26" width="36" height="12" rx="6" transform="rotate(-30 32 32)"/>' +
    '<circle cx="32" cy="32" r="2.5" fill="currentColor" stroke="none"/>',
  tiroteo:
    '<circle cx="37" cy="12" r="5" fill="currentColor" stroke="none"/>' +
    '<path d="M37 18l-5 11 9 5 2 14"/>' +
    '<path d="M32 29l-10 5"/>' +
    '<path d="M41 24l8-3"/>',
  'conflicto-armado':
    '<path d="M32 8 14 16v14c0 12 8 20 18 26 10-6 18-14 18-26V16z"/>' +
    '<path d="M23 33l9-8 9 8v9H23z"/>',
  explosion:
    '<path d="M32 6l5 11 11-6-5 12 12 5-12 5 5 12-11-6-5 11-5-11-11 6 5-12-12-5 12-5-5-12 11 6z" fill="currentColor" stroke="none"/>',
  'ataque-quimico':
    '<path d="M32 8 56 32 32 56 8 32z"/>' +
    '<circle cx="26" cy="30" r="3" fill="currentColor" stroke="none"/>' +
    '<circle cx="38" cy="30" r="3" fill="currentColor" stroke="none"/>' +
    '<path d="M27 41c2-3 8-3 10 0"/>',

  /* ---- Desastres ---- */
  'kit-72h':
    '<path d="M23 23c0-6 4-11 9-11s9 5 9 11"/>' +
    '<rect x="16" y="23" width="32" height="31" rx="8"/>' +
    '<rect x="26" y="35" width="12" height="11" rx="2"/>',
  terremoto:
    '<rect x="18" y="13" width="28" height="41" rx="2"/>' +
    '<path d="M32 13l-6 15 8 6-6 20" stroke-width="2.4"/>' +
    '<path d="M22 22h4M38 22h4M22 44h4M38 44h4"/>',
  inundacion:
    '<path d="M16 30 32 16l16 14v6H16z"/>' +
    '<path d="M10 44c5-3 8 3 12 0s8 3 12 0 8 3 10 0M10 52c5-3 8 3 12 0s8 3 12 0 8 3 10 0"/>',
  incendio:
    '<path d="M32 8c6 10-3 13 0 19 5-4 3-9 8-9 3 8 6 9 6 16a14 14 0 0 1-28 0c0-9 9-12 14-26z"/>',
  apagon:
    '<path d="M26 41a13 13 0 1 1 12 0c-2 2-2 3-2 6H28c0-3 0-4-2-6z"/>' +
    '<path d="M28 51h8M30 55h4"/>' +
    '<path d="M14 14 50 50"/>',
};

/** Devuelve el SVG completo de un id, o null si no existe ilustración. */
function illustrationSvg(id, extraClass) {
  const inner = ILLUSTRATIONS[id];
  if (!inner) return null;
  return (
    '<svg viewBox="0 0 64 64" class="ill ' + (extraClass || '') + '" aria-hidden="true" ' +
    'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
    inner + '</svg>'
  );
}

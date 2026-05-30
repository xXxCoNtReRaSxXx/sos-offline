# Guía de contribución

¡Gracias por tu interés en mejorar **SOS Offline**! Este proyecto busca poner
información de emergencia útil al alcance de todo el mundo, sin conexión. Toda
ayuda cuenta.

## Formas de contribuir

- 🩹 **Exactitud del contenido**: corregir o mejorar las guías de primeros
  auxilios y desastres. **Aporta una fuente fiable** (Cruz Roja, OMS, consejos
  oficiales de reanimación o sanidad de tu país).
- 🌐 **Traducciones**: ayudar a llevar la app a más idiomas.
- ☎️ **Números de emergencia**: añadir o corregir números por país/región.
- ♿ **Accesibilidad**: mejorar el uso con teclado, lector de pantalla, contraste.
- 🐛 **Errores y mejoras**: reportar *bugs* o proponer funcionalidades.

## Cómo empezar

1. Haz un *fork* del repositorio y clónalo.
2. Trabaja siempre en la **versión vigente** (la carpeta de mayor número, p. ej.
   `V3`). Las versiones anteriores se conservan como referencia y no se modifican.
3. Sirve esa carpeta con un servidor estático (el Service Worker necesita `http`):
   ```bash
   cd V3 && python -m http.server 8000
   ```
   Abre `http://localhost:8000`.
4. Crea una rama: `git checkout -b mejora/mi-cambio`.
5. Haz tus cambios y pruébalos en el navegador (incluido el modo offline:
   carga la página, desconecta la red y recárgala).
6. Abre un *Pull Request* describiendo el cambio.

## Dónde está cada cosa (en la versión vigente, p. ej. `V3/`)

- **Contenido de las guías** → `V3/assets/js/data.js`. Es el archivo más fácil de
  editar y no requiere saber programar: cada guía es un objeto con pasos en
  lenguaje claro, organizado por idioma en `CONTENT` (mismos `id` entre idiomas).
- **Cadenas de interfaz (i18n)** → `V3/assets/js/i18n.js`.
- **Pictogramas** → `V3/assets/js/illustrations.js`.
- **Lógica** → `V3/assets/js/app.js`.
- **Estilos** → `V3/assets/css/styles.css`.
- **Recursos cacheados offline** → la lista `ASSETS` en `V3/sw.js`. Si añades un
  archivo nuevo, inclúyelo ahí y **sube la versión** de `CACHE` (`sos-offline-v3`…).

¿Buscas por dónde empezar? Mira los [good first issues](.github/GOOD_FIRST_ISSUES.md).

## Estilo y principios

- **Sin dependencias de compilación**: mantén el proyecto en HTML/CSS/JS puro.
- **Lenguaje claro**: las guías deben entenderse bajo estrés. Frases cortas y
  accionables.
- **Accesibilidad primero**: objetivos táctiles ≥ 44px, contraste suficiente,
  texto alternativo, navegación por teclado.
- **Privacidad**: nada de rastreo ni peticiones externas. Todo debe funcionar
  sin conexión.

## Exactitud médica

Las guías pueden afectar a la seguridad de las personas. Los cambios de
contenido médico/de emergencia **deben citar una fuente reconocida**. Si no
estás seguro, abre primero un *issue* para debatirlo.

## Código de conducta

Al participar aceptas nuestro [Código de Conducta](CODE_OF_CONDUCT.md).

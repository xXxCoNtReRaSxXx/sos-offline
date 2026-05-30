# 🆘 SOS Offline

> Guía de primeros auxilios, crisis y emergencias que funciona **100 % sin conexión a internet**. Gratuita, privada y de código abierto.

🌐 **Idiomas:** Español · English · Português · Français · Deutsch · Italiano · 中文 — [README in English](README.en.md)

**SOS Offline** es una aplicación web progresiva (PWA) que pone información de
emergencia que puede salvar vidas al alcance de cualquiera, **incluso sin
cobertura ni datos móviles**: durante un desastre natural, en zonas rurales, en
la montaña o cuando la red está caída justo cuando más se necesita.

No requiere instalación desde una tienda de apps, no recoge datos personales y
no necesita servidor. Una vez abierta por primera vez, funciona para siempre sin
internet.

---

## 🗂️ Versiones

Conservamos cada versión en su propia carpeta para poder seguir la evolución del
proyecto. **Las nuevas mejoras se hacen siempre en la versión más reciente; las
anteriores se dejan intactas como referencia.**

| Versión | Carpeta | Estado | Aspectos destacados |
|---------|---------|--------|---------------------|
| **V5** | [`/V5`](V5) | ✅ **Vigente** (se publica en GitHub Pages) | **Buscador global** entre categorías · **descarga de fichas como imagen PNG** · **detección de país por ubicación (GPS)** + opción **Global** mundial · menú de accesibilidad consistente a cualquier zoom · corrección del selector de país · animaciones |
| V4 | [`/V4`](V4) | 📦 Archivada | 7 idiomas (ES/EN/PT/FR/DE/IT/ZH) · iconos SVG · números rediseñados · autodetección · descarga |
| V3 | [`/V3`](V3) | 📦 Archivada | Multi-idioma (ES/EN/PT) · iconos PNG + maskable |
| V2 | [`/V2`](V2) | 📦 Archivada | Estética moderna · animaciones · modo oscuro · accesibilidad flotante · lectura en voz alta · pictogramas · guías de crisis |
| V1 | [`/V1`](V1) | 📦 Archivada | Primera versión: primeros auxilios, desastres, contactos, offline |

## 🌍 ¿Por qué es útil para la sociedad?

- **Acceso universal:** funciona en cualquier teléfono o navegador moderno, sin
  cuentas ni pagos. Tras la primera carga, **no necesita conexión**.
- **Cuando la red falla:** terremotos, inundaciones, apagones, conflictos o
  lugares remotos son precisamente los momentos en que no hay internet y más se
  necesita esta información.
- **Privacidad total:** los contactos personales se guardan **solo en el
  dispositivo** (`localStorage`). No hay servidores, ni analíticas, ni rastreo.
- **Contenido abierto y revisable:** las guías están en archivos de texto plano
  que cualquiera puede auditar y mejorar mediante *pull requests*.

## ✨ Funcionalidades (V5)

- 🌐 **7 idiomas**: Español, English, Português, Français, Deutsch, Italiano y
  中文, con selector en el menú de accesibilidad (interfaz y guías). La voz se adapta.
- 🔎 **Buscador global**: busca una guía en todas las categorías a la vez.
- 📞 **Números de emergencia por país** con título claro y tarjetas por servicio
  (general, médica, bomberos, policía) con iconos. Amplia cobertura de **Latinoamérica**.
- 📍 **Detección de país por ubicación** del dispositivo (GPS) para mayor precisión;
  si no hay permiso, recurre al idioma/zona horaria; y si tu país no está, una
  opción **Global / Internacional** que funciona en todo el mundo (112 / 911).
- ⬇️ **Descarga de fichas como imagen (PNG)**: guarda cualquier guía para verla o
  compartirla sin conexión.
- 🎨 **Iconos SVG** en toda la interfaz: se ven en cualquier navegador (no dependen
  de los emojis del sistema).
- 🩹 **Primeros auxilios**: RCP, atragantamiento, hemorragias, quemaduras,
  fracturas, anafilaxia, convulsiones, golpe de calor, ataque de pánico…
- ⚠️ **Crisis y seguridad**: sobredosis de opioides/fentanilo (naloxona) y
  estimulantes, intoxicación etílica, heridas por arma de fuego o arma blanca,
  tiroteo activo (Correr · Esconderse · Defenderse), conflicto armado/bombardeo,
  explosión/atentado y ataque químico.
- 🌪️ **Desastres**: terremoto, inundación, incendio, apagón y kit de 72 h
  (fases *antes / durante / después*).
- 👥 **Contactos personales** de emergencia, guardados localmente.
- 🔊 **Lectura en voz alta** de cada guía con la síntesis de voz del navegador.
- 🌗 **Modo oscuro** con interruptor (además del automático del sistema).
- ♿ **Accesibilidad** en un **botón flotante** que te sigue: tamaño de texto,
  tema y alto contraste. Navegación por teclado y roles ARIA.
- 🎨 **Pictogramas detallados** inspirados en la señalética oficial (ISO 7010
  para seguridad y GHS para sustancias peligrosas).
- 📴 **Offline-first** mediante Service Worker.
- 🎞️ **Animaciones** suaves (respetando `prefers-reduced-motion`).

## 🚀 Cómo usarla

El Service Worker requiere `http(s)://` (no funciona con `file://`). Sirve la
carpeta de la versión vigente:

```bash
# Con Python
cd V5 && python -m http.server 8000
# Abre http://localhost:8000
```

```bash
# O con Node.js
npx serve V5
```

### Subir a GitHub y publicar
```bash
# desde la carpeta sos-offline/ (ya inicializada con git)
git remote add origin https://github.com/xXxCoNtReRaSxXx/sos-offline.git
git push -u origin main
```
Luego activa **Settings → Pages → GitHub Actions**. El *workflow* en
[`.github/workflows/pages.yml`](.github/workflows/pages.yml) publica
automáticamente la carpeta de la versión vigente (`V5`).

## 📲 Instalar como app

En el navegador del móvil, abre la web y elige **«Añadir a pantalla de inicio»**
(Android/Chrome) o **«Compartir → Añadir a inicio»** (iOS/Safari).

## 🛠️ Tecnología

Sin frameworks ni dependencias de compilación. Solo estándares web:

| Capa | Tecnología |
|------|------------|
| Interfaz | HTML5 + CSS (variables, grid, animaciones, modo oscuro) |
| Lógica | JavaScript (vanilla, sin librerías) |
| Offline | Service Worker + Cache API |
| Voz | Web Speech API (`speechSynthesis`) |
| Instalación | Web App Manifest (PWA) |
| Almacenamiento | `localStorage` (solo en el dispositivo) |

```
sos-offline/
├── README.md / README.en.md   # documentación (ES / EN)
├── LICENSE                    # MIT
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── .github/                   # CI (publica V5), issue templates y good first issues
├── V1/ · V2/ · V3/ · V4/      # versiones archivadas (referencia)
└── V5/                        # versión vigente
    ├── index.html
    ├── manifest.webmanifest
    ├── sw.js
    └── assets/
        ├── css/styles.css
        ├── js/
        │   ├── i18n.js           # cadenas de interfaz (7 idiomas)
        │   ├── data.js           # números de emergencia (+ ubicación) + guías ES/EN/PT
        │   ├── content-extra.js  # guías FR/DE/IT/ZH
        │   ├── illustrations.js  # pictogramas de las guías (SVG)
        │   ├── icons.js          # iconos de interfaz (SVG)
        │   └── app.js            # lógica de la app
        └── icons/                # icon.svg + PNG 192/512 + maskable
```

## 🤝 Contribuir

¡Las contribuciones son muy bienvenidas! Es un proyecto ideal para empezar en el
open source. Lee [CONTRIBUTING.md](CONTRIBUTING.md). Especialmente útiles:

- **Mejorar la exactitud** de las guías (con fuentes oficiales).
- **Traducir** la app a más idiomas.
- **Añadir o corregir números de emergencia** de más países.
- Mejorar los **pictogramas** para acercarlos a las normas oficiales.
- Mejoras de **accesibilidad**.

## ⚠️ Aviso importante

Esta aplicación tiene fines **educativos y de preparación**. **No sustituye** la
formación en primeros auxilios, el consejo médico profesional ni a los servicios
de emergencia. En una emergencia real, **llama siempre a tu número local de
emergencias**.

Los **números de emergencia** son mantenidos por la comunidad y pueden cambiar:
verifica siempre el número oficial vigente de tu país.

### Fuentes de referencia
El contenido se basa en protocolos de primeros auxilios ampliamente aceptados
(p. ej., recomendaciones de la Cruz Roja / Media Luna Roja, la OMS, consejos de
reanimación y protocolos oficiales de seguridad). Las correcciones con fuentes
verificables son bienvenidas.

## 📄 Licencia

[MIT](LICENSE) © 2026 SOS Offline contributors. Úsalo, modifícalo y compártelo
libremente.

# 🆘 SOS Offline

> A first-aid, crisis and emergency guide that works **100% offline**. Free, private and open source.

🌐 **Languages:** Español · English · Português · Français · Deutsch · Italiano · 中文 — [README en español](README.md)

**SOS Offline** is a Progressive Web App (PWA) that puts life-saving emergency
information within everyone’s reach, **even with no signal or mobile data**:
during a natural disaster, in rural areas, in the mountains, or when the network
is down exactly when you need it most.

It requires no app-store install, collects no personal data and needs no server.
Once opened for the first time, it works offline forever.

---

## 🗂️ Versions

We keep each version in its own folder to track the project’s evolution.
**New improvements are always made in the latest version; older ones are left
untouched for reference.**

| Version | Folder | Status | Highlights |
|---------|--------|--------|------------|
| **V5** | [`/V5`](V5) | ✅ **Current** (deployed to GitHub Pages) | **Global search** across categories · **download guides as PNG image** · **location-based (GPS) country detection** + worldwide **Global** option · accessibility menu consistent at any zoom · country-picker fix · animations |
| V4 | [`/V4`](V4) | 📦 Archived | 7 languages (ES/EN/PT/FR/DE/IT/ZH) · SVG icons · redesigned numbers · auto-detect · download |
| V3 | [`/V3`](V3) | 📦 Archived | Multi-language (ES/EN/PT) · PNG icons + maskable |
| V2 | [`/V2`](V2) | 📦 Archived | Modern design · animations · dark mode · floating accessibility button · read-aloud · pictograms · crisis guides |
| V1 | [`/V1`](V1) | 📦 Archived | First version: first aid, disasters, contacts, offline |

## 🌍 Why is it useful for society?

- **Universal access:** works on any modern phone or browser, with no accounts or
  payments. After the first load, **no connection is needed**.
- **When the network fails:** earthquakes, floods, blackouts, conflicts or remote
  places are exactly the moments when there is no internet and this information
  is needed most.
- **Total privacy:** personal contacts are stored **only on the device**
  (`localStorage`). No servers, no analytics, no tracking.
- **Open, reviewable content:** the guides are plain-text files anyone can audit
  and improve via pull requests.

## ✨ Features (V3)

- 🌐 **Multi-language**: Spanish, English and Portuguese, with a selector in the
  accessibility menu (both interface and guide content). The voice adapts too.
- 📞 **Quick call** to the emergency number by country, with direct dialling of
  services (medical, fire, police). Broad **Latin-American** coverage.
- 🩹 **First aid**: CPR, choking, severe bleeding, burns, fractures, anaphylaxis,
  seizures, heat stroke, panic attack…
- ⚠️ **Crisis & safety**: opioid/fentanyl overdose (naloxone) and stimulants,
  alcohol poisoning, gunshot and stab wounds, active shooter (Run · Hide · Fight),
  armed conflict/shelling, explosion/bombing and chemical attack.
- 🌪️ **Disasters**: earthquake, flood, fire, power outage and 72-hour kit
  (*before / during / after* phases).
- 👥 **Personal contacts**, stored locally.
- 🔊 **Read aloud** for every guide using the browser’s speech synthesis.
- 🌗 **Dark mode** with a toggle (plus automatic system mode).
- ♿ **Accessibility** in a **floating button** that follows you: text size, theme
  and high contrast. Keyboard navigation and ARIA roles.
- 🎨 **Detailed pictograms** inspired by official signage (ISO 7010 for safety and
  GHS for hazardous substances).
- 📴 **Offline-first** via Service Worker.
- 🎞️ **Smooth animations** (respecting `prefers-reduced-motion`).

## 🚀 How to use it

The Service Worker requires `http(s)://` (it does not work with `file://`). Serve
the current version’s folder:

```bash
# With Python
cd V5 && python -m http.server 8000
# Open http://localhost:8000
```

```bash
# Or with Node.js
npx serve V5
```

### Deploy free on GitHub Pages
This repo includes a workflow in
[`.github/workflows/pages.yml`](.github/workflows/pages.yml) that automatically
publishes the current version folder (`V5`). Just enable
**Settings → Pages → GitHub Actions**.

## 📲 Install as an app

In your phone’s browser, open the site and choose **“Add to Home screen”**
(Android/Chrome) or **“Share → Add to Home Screen”** (iOS/Safari).

## 🛠️ Technology

No frameworks, no build step. Just web standards:

| Layer | Technology |
|-------|------------|
| UI | HTML5 + CSS (variables, grid, animations, dark mode) |
| Logic | JavaScript (vanilla, no libraries) |
| Offline | Service Worker + Cache API |
| Voice | Web Speech API (`speechSynthesis`) |
| Install | Web App Manifest (PWA) |
| Storage | `localStorage` (device only) |

## 🤝 Contributing

Contributions are very welcome! This is a great project to get started with open
source. Read [CONTRIBUTING.md](CONTRIBUTING.md). Especially useful:

- **Improving the accuracy** of the guides (with official sources).
- **Translating** the app into more languages.
- **Adding or fixing emergency numbers** for more countries.
- Improving the **pictograms** to better match official standards.
- **Accessibility** improvements.

See [good first issues](.github/GOOD_FIRST_ISSUES.md) for beginner-friendly tasks.

## ⚠️ Important notice

This app is for **educational and preparedness** purposes. It **does not replace**
first-aid training, professional medical advice or the emergency services. In a
real emergency, **always call your local emergency number**.

**Emergency numbers** are community-maintained and may change: always verify the
current official number for your country.

### Reference sources
Content is based on widely accepted first-aid protocols (e.g. Red Cross / Red
Crescent recommendations, the WHO, resuscitation councils and official safety
protocols). Corrections with verifiable sources are welcome.

## 📄 License

[MIT](LICENSE) © 2026 SOS Offline contributors. Use it, modify it and share it
freely.

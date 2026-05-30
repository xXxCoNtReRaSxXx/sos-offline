# Good first issues

Beginner-friendly tasks to start contributing to **SOS Offline**. Once the repo
is on GitHub, copy each block below into a new issue and add the `good first issue`
label (and the suggested labels).

> Tip: most content lives in `V5/assets/js/data.js` (guides) and
> `V5/assets/js/i18n.js` (interface strings). No build step is required.

---

## 1. Add another world language (e.g. العربية, Русский, 日本語, हिन्दी)
**Labels:** `good first issue`, `i18n`, `help wanted`

The app already ships 7 languages (ES/EN/PT/FR/DE/IT/ZH). Add a new one:
- In `V5/assets/js/i18n.js`, add a language block to `I18N`, plus its code to
  `LOCALES`, and an entry in `LOCALE_NAMES` and `SPEECH_LANG`.
- In `V5/assets/js/content-extra.js`, add `CONTENT.<code> = { ... }` (keep the
  same guide `id`s).
- For right-to-left languages (Arabic, Hebrew), also set `dir="rtl"` on `<html>`
  when that locale is active and verify the layout.

Acceptance: the language appears in the selector and switches the whole UI + guides.

---

## 2. Add or verify emergency numbers for more countries
**Labels:** `good first issue`, `content`

Add countries missing from `EMERGENCY_NUMBERS` in `V5/assets/js/data.js`, or
verify existing ones against an **official source** (link it in the PR).

Acceptance: numbers are correct and cite a source.

---

## 3. Improve a pictogram to match ISO 7010 / GHS more closely
**Labels:** `good first issue`, `design`

Pick one icon in `V5/assets/js/illustrations.js` and refine its SVG path so it is
clearer and closer to the official standard. Keep the 0–64 viewBox and
`currentColor`.

Acceptance: the icon is more recognisable and still adapts to light/dark mode.

---

## 4. Add a print / PDF-friendly stylesheet
**Labels:** `good first issue`, `enhancement`, `accessibility`

Add a `@media print` block to `V3/assets/css/styles.css` so a guide can be printed
cleanly (hide the FAB, tabs and call bar; show full guide text).

Acceptance: printing a guide produces a clean, readable page.

---

## 5. Add unit-free content tests (lint the data files)
**Labels:** `good first issue`, `tooling`

Add a small Node script that checks every guide `id` exists in all languages and
that no guide is missing `steps`/`donts` (or `before/during/after`).

Acceptance: running the script reports any inconsistency between languages.

---

## 6. Add a “last reviewed” date to each guide
**Labels:** `good first issue`, `content`

Add an optional `reviewed` field to guides and show it discreetly in the guide
dialog footer, so users know how current the information is.

Acceptance: guides with a `reviewed` date display it; others are unaffected.

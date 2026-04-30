# Oisogs

**A statistical reading of your Discogs collection.**

Oisogs connects to any public Discogs profile and turns a record shelf into a living dashboard — genres, decades, artists, formats, fun facts, and a random pick for the indecisive. Everything runs in the browser. No server. No tracking.

→ **[oisogs.app](https://oisogs.app)**

---

## Features

- **Collection overview** — total albums, top genre, top decade, acquisition rate
- **Genre & style breakdown** — donut chart, interactive style cloud
- **Decade distribution** — decade-by-decade bar chart with drill-down
- **Top artists** — filterable list, sorted by album count
- **Fun facts** — stack height, total weight, oldest & newest release (clickable)
- **Latest additions** — last 50 albums added, with dates
- **Format breakdown** — Vinyl, CD, Cassette…
- **Timeline** — additions by year, format evolution over time
- **Word cloud** — most frequent words across album titles
- **Random pick** — free draw, by genre, or by style
- **FR / EN** — auto-detected from browser language, switchable at any time
- **PWA** — installable on iOS and Android, works offline

---

## Stack

|           |                                        |
| --------- | -------------------------------------- |
| Framework | Vue 3 (Composition API)                |
| Build     | Vite                                   |
| State     | Pinia                                  |
| Routing   | Vue Router                             |
| i18n      | vue-i18n v9                            |
| Styles    | SCSS + CSS custom properties           |
| Charts    | Chart.js via vue-chartjs               |
| Data      | Discogs API (public, no auth required) |
| Hosting   | Netlify                                |

---

## Local setup

```sh
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

---

## Privacy

Oisogs runs entirely in your browser. No data is ever sent to a third-party server — not your username, not your collection. Search history is stored in `localStorage` on your device only.

---

## Changelog

### v2.0.0

- Full visual redesign — new typography (Fraunces), editorial layout, dark mode
- Internationalization (FR / EN) with automatic language detection
- Random pick page (free draw, by genre, by style)
- Interactive popups on years, styles, oldest & newest releases
- Word cloud on album titles
- PWA support (installable, offline-ready)
- Bottom tab bar for mobile navigation
- ESLint cleanup, CSS token rename

### v1.0.0

- Initial release — stats dashboard, genres, styles, decades, artists, formats, fun facts

---

_Oisogs is an independent project, unaffiliated with Discogs._
_Designed and maintained by [OiseauPython](https://github.com/OiseauPython)._

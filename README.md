# Egypt Prayer Times

![Build Status](https://github.com/AhmedGamal172000/egypt-prayer-times/actions/workflows/build.yml/badge.svg)
![Version](https://img.shields.io/github/v/release/AhmedGamal172000/egypt-prayer-times)
![License](https://img.shields.io/github/license/AhmedGamal172000/egypt-prayer-times)

A production-ready, open-source Chrome extension for accurate Muslim prayer times in Egypt. Features live API data from [Aladhan.com](https://aladhan.com), robust offline fallback using the Adhan JS library, and a clean, responsive UI with RTL Arabic support.

---

## Features

- **Live Prayer Times** — Fetches real-time data from Aladhan API for all Egyptian cities
- **Offline Fallback** — Automatically calculates prayer times locally when offline using Adhan JS
- **Next Prayer Countdown** — Large countdown timer showing time remaining until the next prayer
- **Extended Countdown View** — Detachable floating window for focused prayer countdown
- **Daily Auto-Sync** — Background refresh at 3:00 AM to keep times accurate
- **Badge Timer** — Toolbar badge shows minutes until next prayer
- **Customizable Settings** — City, calculation method, madhab, time format, language, theme
- **Arabic & English** — Full localization with RTL support
- **Light & Dark Themes** — System-aware theming
- **Notifications** — Desktop alerts when prayer time arrives (extensible for future Adhan audio)

---

## Install

### From Chrome Web Store
> Coming soon — placeholder for Web Store link

### Developer: Load Unpacked
1. Clone this repository:
   ```bash
   git clone https://github.com/AhmedGamal172000/egypt-prayer-times.git
   cd egypt-prayer-times
   ```
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Open Chrome → `chrome://extensions/` → Enable **Developer mode**
4. Click **Load unpacked** → Select the `dist/` folder

---

## Screenshots

| Popup | Extended View | Options |
|-------|--------------|---------|
| ![Popup](docs/screenshots/popup.png) | ![Extended](docs/screenshots/extended.png) | ![Options](docs/screenshots/options.png) |

---

## Architecture

```
src/
├── background/          Service worker (alarms, badge, notifications)
├── popup/               Popup UI + extended countdown view
├── options/             Settings page
├── shared/
│   ├── api/             BasePrayerProvider + AladhanProvider
│   ├── base/            Abstract classes (BaseFeature, BaseView, etc.)
│   ├── config.js        All configuration (no hardcoded values)
│   ├── prayerEngine.js  Observer-pattern engine with offline fallback
│   ├── store.js         chrome.storage wrapper with pub/sub
│   └── utils.js         Shared utilities
├── assets/              Icons and images
└── manifest.json        Manifest V3
```

### Extending the Extension

Thanks to the abstract base classes, adding a new feature (e.g., **Monthly Report** or **Adhan Audio**) requires no changes to core logic:

1. **New API Provider**: Extend `BasePrayerProvider`, register it in config, select it in Options
2. **New Notification Type**: Extend `BaseNotification`, hook into `PrayerEngine` observer
3. **New View**: Extend `BaseView`, render data from engine subscriptions
4. **New Feature**: Extend `BaseFeature`, inject dependencies via constructor

---

## API Integration

**Primary Provider**: [Aladhan.com](https://aladhan.com/prayer-times-api)

- **Daily endpoint**: `GET /v1/timingsByCity/{timestamp}?city={city}&country=Egypt&method=5`
- **Monthly endpoint**: `GET /v1/calendarByCity/{year}/{month}?city={city}&country=Egypt&method=5`
- **Method**: Egyptian General Authority of Survey (ID: 5)
- **Fallback**: If API fails or offline, Adhan JS calculates times locally using stored coordinates

### Fallback Logic
1. Attempt live API fetch
2. If failed → use cached data (24h TTL)
3. If no cache → calculate locally with Adhan JS
4. UI shows green (live), yellow (cached), or red (calculated) indicator

---

## Privacy

- **No personal data is collected**
- Prayer times are fetched anonymously from public APIs
- All data is stored locally in your browser via `chrome.storage`
- No tracking, no analytics without explicit consent

---

## Development

```bash
# Install dependencies
npm install

# Development build with watch
npm run watch

# Production build (outputs dist/ and releases/egypt-prayer-times.zip)
npm run build

# Lint
npm run lint

# Test
npm run test

# Release (lint + test + build + version bump)
npm run release
```

---

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

[MIT](LICENSE)

---

## Data Attribution

Prayer times powered by [Aladhan.com API](https://aladhan.com). Local calculations powered by [Adhan JS](https://github.com/batoulapps/adhan-js).

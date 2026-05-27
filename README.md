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

### Option 1: Developer Mode (Easiest — Run Locally)

This is the fastest way to use the extension right now. No Chrome Web Store needed.

#### Quick Setup (Windows)

1. Download the [latest source code ZIP](https://github.com/AhmedGamal172000/egypt-prayer-times/releases/latest) and extract it
2. Make sure you have [Node.js](https://nodejs.org/) installed
3. Double-click **`setup.bat`** in the extracted folder
4. The script will install dependencies, build the extension, and open the required folders

#### Manual Setup (Any OS)

1. Download or clone the code:
   ```bash
   git clone https://github.com/AhmedGamal172000/egypt-prayer-times.git
   cd egypt-prayer-times
   ```

2. Build the extension:
   ```bash
   npm install
   npm run build
   ```

3. Load it in Chrome:
   - Open **Chrome** → type `chrome://extensions/` → press **Enter**
   - Turn **ON** the **Developer mode** switch (top-right corner)
   - Click **Load unpacked**
   - Select the **`dist/`** folder from this project
   - Done! The extension icon will appear in your toolbar

4. Pin the extension (optional):
   - Click the **puzzle piece** 🧩 in the Chrome toolbar
   - Find **"Egypt Prayer Times"** and click the **pin** 📌

---

### Option 2: Chrome Web Store
> Coming soon — link will be added here once approved

---

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "Manifest file is missing or unreadable" | Make sure you selected the **`dist/`** folder, not the project root or `src/` |
| `setup.bat` says Node.js not found | Install [Node.js](https://nodejs.org/) first, then run `setup.bat` again |
| Build fails with "module not found" | Run `npm install` again, then `npm run build` |
| Extension shows "Errors" button | Click **"Errors"** in `chrome://extensions/` to see details. Rebuild: `npm run build` |
| Prayer times not loading | Check your internet connection. The extension will fall back to calculated times if offline |
| Arabic text looks wrong | Make sure your Chrome supports Arabic fonts. Try switching language in the extension settings |

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

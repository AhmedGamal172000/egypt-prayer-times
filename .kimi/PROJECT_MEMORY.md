# Egypt Prayer Times — Project Memory for Kimi

> **READ THIS FIRST** in every new session before making any changes.
> This file contains everything you need to know about this project.

---

## 1. Project Overview

**Name:** Prayer Times  
**Type:** Chrome Extension (Manifest V3)  
**Purpose:** Accurate Muslim prayer times for any city worldwide using live Aladhan.com API data  
**Author:** Ahmed Mohamed Gamal  
**Email:** ahmedgamal172000@gmail.com  
**LinkedIn:** https://www.linkedin.com/in/ahmed-mohamed-gamal-007aa4192/  
**Repo:** https://github.com/AhmedGamal172000/egypt-prayer-times  
**Version:** 1.0.0

**Extension ID (after Web Store publish):** TBD — add here after first publish

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Bundler | Webpack 5 |
| Tests | Jest 29 + babel-jest |
| Linting | ESLint |
| JS | ES6 modules, no frameworks |
| CSS | Plain CSS with CSS variables |
| API | Aladhan.com (api.aladhan.com/v1) |

**Key Dependencies:**
- `webpack`, `webpack-cli` — bundling
- `babel-jest` — test transpilation
- `eslint` — code quality
- `cross-env` — cross-platform env vars
- `zip-webpack-plugin` — release ZIP generation
- `copy-webpack-plugin` — static asset copying

**No runtime dependencies** — the extension is zero-dependency for users.

---

## 3. Architecture

### Design Patterns
- **ES6 modules** throughout
- **Abstract base classes:** `BaseFeature`, `BaseNotification`, `BaseCalculator`, `BaseAPIProvider`, `BaseView`
- **Dependency injection** — services injected via constructors
- **Observer pattern** — store notifies listeners on changes
- **API-only engine** — no local prayer calculation

### File Structure
```
src/
  background/
    background.js          # Service worker entry (alarms, badge, notifications, messaging)
    NotificationManager.js # Desktop notification scheduling via chrome.alarms + chrome.notifications
  popup/
    popup.js               # Popup UI logic (clock, countdown, prayer list, status, country display)
    popup.html             # Popup markup
    popup.css              # Popup styles
    extendedView.js        # Extended window logic (larger countdown display)
    extendedView.html      # Extended window markup
    extendedView.css       # Extended window styles
  options/
    options.js             # Settings page logic (country + city dropdowns)
    options.html           # Settings page markup
    options.css            # Settings page styles
  shared/
    api/
      AladhanProvider.js   # Fetches from Aladhan API (monthly/daily) for any city/country
      BasePrayerProvider.js # Abstract base
    locales/
      en/messages.json     # Chrome i18n EN strings
      ar/messages.json     # Chrome i18n AR strings
    translations.js        # Runtime translation map (EN+AR) for data-i18n elements
    utils.js               # formatTime, formatHijriFromAPI, getTimeRemaining, formatCountdown, translatePage
    config.js              # COUNTRIES array (40 countries, ~300 cities), DEFAULT_SETTINGS, PRAYER_NAMES, ALARMS
    store.js               # Observable wrapper around chrome.storage.local
    prayerEngine.js        # Core engine: refresh, getToday, getNextPrayer, cache management (uses city+country)
    base/                  # Abstract base classes
  assets/
    icons/                 # icon16.png, icon32.png, icon48.png, icon128.png (blue crescent+star)
  manifest.json            # Manifest V3
```

---

## 4. Key Design Decisions (CRITICAL)

### Global City/Country Support
- **40 countries** with ~300 cities hardcoded in `config.js` `COUNTRIES` array
- Each country has `name`, `nameAr`, and `cities[]` with `name` and `nameAr`
- Default: **Cairo, Egypt**
- Settings store `city` and `country` as strings (not objects)
- Prayer engine passes both to Aladhan API — works for any city in any country

### API-Only (No Local Calculation)
- **Removed** the `adhan` npm package and all local calculation
- Extension only uses **live API data** (green dot = LIVE) or **cache** (yellow dot = CACHED)
- **Why:** Aladhan handles DST and timezones correctly per country. Local JS libraries often fail on government DST changes.
- **Trade-off:** Requires internet. Offline = cached data only.

### Date Handling (Midnight Bug Fix)
- Background service workers persist across days
- Stored `Date` objects have yesterday's calendar date
- **Solution:** Store original `"HH:MM"` strings, re-parse with today's date via `_freshTimesFromStrings()`
- Called every time `getNextPrayer()` runs

### Runtime Translations (Not chrome.i18n)
- `chrome.i18n.getMessage()` uses the **browser's locale**, not the extension's language setting
- **Solution:** `src/shared/translations.js` with a custom `t(key, lang)` function
- `translatePage(lang)` scans all `[data-i18n]` elements and translates them
- Called in `init()` of popup, options, and extended view

### Notification System
- Uses `chrome.alarms` for scheduling + `chrome.notifications` for desktop alerts
- Alarms named `prayer-{Name}` (e.g., `prayer-Asr`)
- Background `onAlarm` listener catches `prayer-*` and calls `NotificationManager.showNotification()`
- Notifications are **localized** based on the extension's language setting

---

## 5. Features

| Feature | Status |
|---------|--------|
| 40 countries, ~300 cities | ✅ |
| Country + City dropdown selection | ✅ |
| Location display in popup (city, country) | ✅ |
| Live Aladhan API data | ✅ |
| Offline cache fallback | ✅ |
| Prayer countdown timer | ✅ |
| Extended view window | ✅ |
| Desktop notifications | ✅ |
| Toolbar badge (hours+minutes) | ✅ |
| Hijri date display | ✅ |
| Arabic & English | ✅ |
| 12h / 24h format | ✅ |
| Calculation method selection | ✅ (Egyptian, MWL, ISNA, Makkah) |
| ~~Madhab selection~~ | ❌ Removed |
| ~~Custom coordinates~~ | ❌ Removed |
| ~~Theme selection~~ | ❌ Removed (follows OS via CSS `prefers-color-scheme`) |

---

## 6. Development Workflow

### Install (first time)
```bash
git clone https://github.com/AhmedGamal172000/egypt-prayer-times.git
cd egypt-prayer-times
npm install
```

### Daily Commands
```bash
npm run lint      # ESLint check
npm run test      # Jest (81 tests, live API skipped in CI)
npm run build     # Production build → dist/ + releases/egypt-prayer-times.zip
npm run build:dev # Development build
npm run watch     # Dev build with file watcher
```

### Test Structure
```
tests/
  setup.js                    # chrome.storage + chrome.runtime mocks
  utils.test.js               # 13 tests
  config.test.js              # 15 tests
  api/AladhanProvider.test.js # 24 tests (mocked)
  engine/PrayerEngine.test.js # 14 tests (mocked)
  integration/live-api.test.js # 15 tests (REAL API calls)
```

**Live API tests:** Make 38 real HTTP calls to `api.aladhan.com`. Skipped in CI (`process.env.CI`).

### Jest Config
- `jest.config.js` — `testEnvironment: 'node'`, `babel-jest` transform, `setupFilesAfterEnv: ['tests/setup.js']`
- `tests/setup.js` — mocks `chrome.storage.local`, `chrome.runtime`, `chrome.action`, etc.

---

## 7. Git Workflow

### Branches
- `main` — primary branch
- Tags `v*` trigger release + publish workflows

### Commit Message Convention
```
feat: new feature
fix: bug fix
ci: CI/CD changes
test: tests
chore: maintenance
docs: documentation
```

### Standard Flow
```bash
# Make changes
npm run lint && npm run test && npm run build

# Commit
git add -A
git commit -m "feat: description"
git push origin main
```

### Release Flow (auto-publishes to Chrome Web Store)
```bash
# Update version in package.json and src/shared/config.js
# Then:
git add -A
git commit -m "chore: bump version to v1.1.0"
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0
```

**After tag push, GitHub Actions:**
1. Runs lint + test + build
2. Creates GitHub Release with `.zip` asset
3. Publishes to Chrome Web Store (if secrets configured)

---

## 8. Publishing Workflow

### Chrome Web Store

**One-time setup (manual):**
1. Pay $5 at https://chrome.google.com/webstore/devconsole
2. Create new item → upload `releases/egypt-prayer-times.zip`
3. Fill description, screenshots, privacy policy URL
4. Submit for review (1-3 days)
5. Note the **Extension ID**

**API credentials (for auto-publish):**
1. Go to https://console.cloud.google.com/
2. Create project → enable **Chrome Web Store API**
3. Create **OAuth client ID** (Desktop app type)
4. Save **Client ID** and **Client Secret**
5. Get **Refresh Token**:
   ```bash
   npm install -g chrome-webstore-upload-cli
   npx chrome-webstore-upload-cli refresh-token --client-id ID --client-secret SECRET
   ```

**GitHub Secrets (add in repo Settings → Secrets → Actions):**
| Secret | Value |
|--------|-------|
| `CHROME_EXTENSION_ID` | Extension ID from dev console |
| `CHROME_CLIENT_ID` | From Google Cloud |
| `CHROME_CLIENT_SECRET` | From Google Cloud |
| `CHROME_REFRESH_TOKEN` | From CLI tool above |

**After setup — fully automatic:**
```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0
```
→ CI builds → GitHub Release → Chrome Web Store publish

### User Installation (No Node.js Needed)

**From Chrome Web Store (after publish):**
- One-click install, auto-updates

**From GitHub (for developers/testers):**
```
1. Download/clone repo
2. chrome://extensions/ → Developer mode ON
3. Load unpacked → select dist/ folder
```

`dist/` is pre-built and committed — users never need Node.js.

---

## 9. Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| Background worker stale data after midnight | `_freshTimesFromStrings()` re-parses dates with today's date |
| Extension reload required after updates | Service worker persistence — normal Chrome behavior |
| Live API dependency (offline = cache only) | By design — removed local calculation for DST accuracy |
| Jest worker force exit warning | Non-critical — live API tests leave open handles. Use `--detectOpenHandles` to debug |
| CI fails with 2 annotations | Live API tests hitting rate limits → skipped in CI via `process.env.CI` |

---

## 10. Recent Change History

| Commit | Date | What Changed |
|--------|------|-------------|
| `06eddfa` | 2026-05-29 | Added chrome load-unpacked screenshot to README Step 2 |
| `6dd549d` | 2026-05-29 | Show selected city and country in popup header (localized) |
| `TBD` | 2026-05-29 | Generalized for global use: 40 countries, ~300 cities, renamed to "Prayer Times" |
| `d52e04f` | 2026-05-29 | Added Chrome Web Store auto-publish workflow + PUBLISHING.md |
| `286bde0` | 2026-05-29 | Removed theme selection from options |
| `fe018be` | 2026-05-29 | Removed custom coordinates feature |
| `ba30012` | 2026-05-29 | Auto-reload options page after save |
| `20d5d76` | 2026-05-29 | Runtime language-aware translations (replaced chrome.i18n) |
| `a5a2e59` | 2026-05-29 | Professional attribution + PRIVACY.md |
| `30b2b86` | 2026-05-29 | Skip live API tests in CI |
| `3df1cb2` | 2026-05-29 | Badge shows hours+minutes together |
| `ddf16ad` | 2026-05-29 | Full test suite (81 tests) |

---

## 11. Attribution Footer Text

Used in popup and extended view:
```
© 2026 Ahmed Mohamed Gamal · v1.0.0 · LinkedIn · Contact
```

LinkedIn: https://www.linkedin.com/in/ahmed-mohamed-gamal-007aa4192/  
Email: ahmedgamal172000@gmail.com

---

## 12. File Checklist for New Sessions

Before making changes, verify these files are up to date:
- [ ] `src/manifest.json` — version matches package.json
- [ ] `src/shared/config.js` — `EXTENSION_VERSION` matches
- [ ] `package.json` — version is correct
- [ ] `PRIVACY.md` — accurate if data collection changes
- [ ] `PUBLISHING.md` — update if publishing process changes

After changes, ALWAYS:
1. `npm run lint`
2. `npm run test`
3. `npm run build`
4. `git add -A && git commit -m "type: description" && git push origin main`

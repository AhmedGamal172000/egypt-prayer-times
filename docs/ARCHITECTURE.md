# Architecture

## Abstract Base Classes

```
BaseFeature         → New capabilities (Monthly Report, Qibla, etc.)
BaseNotification    → Notification types (Adhan Audio, Pre-prayer alert)
BaseCalculator      → Alternative calculation libraries
BaseAPIProvider     → External data sources
BaseView            → UI views (Dashboard, Calendar, Widget)
```

## Dependency Injection Flow

```
Background Service Worker
  ├─ PrayerEngine (singleton)
  │    ├─ AladhanProvider (default)
  │    └─ PrayerTimeObserver
  ├─ NotificationManager (extends BaseNotification)
  └─ Store (chrome.storage wrapper)

Popup / Options / ExtendedView
  └─ chrome.runtime.sendMessage → Background API
```

## Adding a Future Feature: "Monthly Report"

1. Create `src/features/monthlyReport/MonthlyReportFeature.js`
2. Extend `BaseFeature`, inject `store` and `engine`
3. Subscribe to `PrayerEngine` observer for data
4. Register feature in background initialization
5. Core engine remains untouched — open/closed principle satisfied

## Adding a Future Feature: "Adhan Audio"

1. Create `src/features/adhanAudio/AdhanAudioNotification.js`
2. Extend `BaseNotification`
3. Override `schedule()` to play audio instead of/chrome in addition to desktop notification
4. Inject into `Background` alongside `NotificationManager`

# API Integration Documentation

## Primary Provider: Aladhan.com

### Daily Timings
```
GET https://api.aladhan.com/v1/timingsByCity/{timestamp}
  ?city={city}
  &country=Egypt
  &method=5
  &school={0|1}
```

### Monthly Calendar
```
GET https://api.aladhan.com/v1/calendarByCity/{year}/{month}
  ?city={city}
  &country=Egypt
  &method=5
  &school={0|1}
```

### Parameters
- `method=5` — Egyptian General Authority of Survey
- `school=0` — Shafi (default)
- `school=1` — Hanafi

### Response Format
```json
{
  "code": 200,
  "data": {
    "timings": {
      "Fajr": "04:23 (EEST)",
      "Sunrise": "05:58 (EEST)",
      "Dhuhr": "12:30 (EEST)",
      "Asr": "16:05 (EEST)",
      "Maghrib": "19:02 (EEST)",
      "Isha": "20:27 (EEST)"
    },
    "date": {
      "readable": "27 May 2026",
      "hijri": { "date": "10 Dhu al-Qi'dah 1447" }
    }
  }
}
```

## Fallback Logic
1. Try live API fetch
2. On failure → load cached data (24h TTL in chrome.storage.local)
3. On cache miss → calculate locally with Adhan JS using user coordinates
4. UI status dot reflects source: green (live), yellow (cached), red (calculated)

## Adding a New Provider
1. Create `src/shared/api/YourProvider.js`
2. Extend `BasePrayerProvider`
3. Implement `fetchDaily()`, `fetchMonthly()`, `isAvailable()`
4. Register in `src/shared/config.js` under provider options
5. No changes needed in popup, background, or options logic
